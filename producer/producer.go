package main

import (
	"context"
	"encoding/csv"
	"io"
	"log"
	"os"
	"sync"
	"encoding/json"
	"strconv"
	"time"
	amqp "github.com/rabbitmq/amqp091-go"
)

type SensorData struct {
	Device        string `json:"device"`
	Timestamp     string `json:"timestamp"`
	WindSpeed     int `json:"wind_speed"`
	WindDirection string `json:"wind_direction"`
	P1            int `json:"p_1"`
	P25           int `json:"p_25"`
	P10           int `json:"p_10"`
}

var conn *amqp.Connection
var ch   *amqp.Channel
var q  amqp.Queue
/*
*
This emulator spins up n goroutines to mock multiple MKII devices which would be sending real time data to out
RabbitMQ. For demonstration purposes it firsts parses the CSV file and then sends the data to the consumer.
Order is not gaurenteed
*
*/




func main() {

	connection,err := connectToRabbitMQ()
	if err != nil {
		log.Fatal(err)
	}
	conn = connection
	defer conn.Close()

	channel, err := conn.Channel()
	if err != nil {
		log.Fatal(err)
	}
	ch = channel
	defer ch.Close()

	queue, err := ch.QueueDeclare(
		"data_consumer2", // name
		true,            // durable
		false,           // delete when unused
		false,           // exclusive
		false,           // no-wait
		nil,             // arguments
	)
	if err != nil {
		log.Fatal(err)
	}
	q = queue
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	//Parse the csv file
	file, err := os.Open("./dataset/dataset.csv")
	//Here errs are not handled gracefully as this is just for reading the data
	if err != nil {
		log.Fatal(err)
	}

	defer file.Close()

	reader := csv.NewReader(file)

	// Batch process the csv into 10 batches emulating 4 MKII Devices
	batchSize := 20
	batches := make(map[int][][]string)
	for i := 1; i <= batchSize; i++ {
		batches[i] = make([][]string, 0)
	}
	maxBatchSize := 1000
	currentBatchCount := 1
	currentBatch := make([][]string, 0)
	for {

		record, readErr := reader.Read()
		//fmt.Println(record)
		if readErr == io.EOF {
			if len(currentBatch) > 0 {
				currentBatchCount++
				batches[currentBatchCount] = currentBatch
			}
			break
		}
		if len(currentBatch) >= maxBatchSize {
			batches[currentBatchCount] = currentBatch
			currentBatchCount += 1
			currentBatch = make([][]string, 0)
		}
		currentBatch = append(currentBatch, record)
	}

	// Spin up 10 goroutines
	var wg sync.WaitGroup

	for i := 1; i <= batchSize; i++ {
		wg.Add(1)
		go ProcessBatch(batches[i], &wg, ctx, q)

	}
	wg.Wait()
	log.Println("Sent all 1000 batched request")
}

func connectToRabbitMQ () (*amqp.Connection, error)  {
	
	path := os.Getenv("rabbitmq_connect")
	if path == "" {
		path = "localhost"
	}
	connection, err := amqp.Dial("amqp://"+path)
	if err != nil {
		time.Sleep(5 * time.Second)
		log.Println("retrying...")
		return connectToRabbitMQ()
	}
	log.Println("working")
	return connection,err
}

// ProcessBatch - Sends the data to the rabbitMQ
func ProcessBatch(data [][]string, wg *sync.WaitGroup, ctx context.Context,q amqp.Queue) {
	defer wg.Done()
	marshalledArray := make([]SensorData,0)
	response := make(map[string][]SensorData)
	for _, record := range data {
		
			windSpeed,_ := strconv.Atoi(record[2])
			p1,_ := strconv.Atoi(record[4])
			p25,_ := strconv.Atoi(record[5])
			p10,_ := strconv.Atoi(record[6])
			sensorData := SensorData{
				Device : record[0],
				Timestamp : record[1],
				WindSpeed: windSpeed,
				WindDirection : record[3],
				P1 : p1,
				P25: p25,
				P10 : p10,
			}
		
			marshalledArray = append(marshalledArray,sensorData)
			// log.Println("send")
		}
		response["data"] = marshalledArray
		result , err := json.Marshal(&response)
		if err != nil {
			log.Println(err)
		}
		err = ch.PublishWithContext(ctx,
			"",     // exchange
			q.Name, // routing key
			false,  // mandatory
			false,  // immediate
			amqp.Publishing{
				DeliveryMode: amqp.Persistent,
				ContentType:  "text/plain",
				Body:         result,
			})
		if err != nil {
			log.Println(err)
		}

}

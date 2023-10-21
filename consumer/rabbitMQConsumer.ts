import * as amqp from 'amqplib/callback_api'
import { config } from 'dotenv'
import 'dotenv/config'

config({path:"../env"})

const connectToRabbitMQ = () => { 
  return new Promise((resolve,reject)=>{
      console.log("trying to connect")
      let path = process.env.rabbitmq_connect;
      if (path === "" || path === undefined) {
        path = "localhost"
      }
      amqp.connect('amqp://'+path,(err: Error,conn: amqp.Connection)=>{
        if (err) {
          return reject(err)
        }
        return resolve(conn)        
      });
  })

}

const  runServiceCheck  = async() => {
  try {
    const connection = await connectToRabbitMQ();
    clearInterval(intervalId);
    connectToChannel(connection);
  } catch (error) {
    console.log("Witing for rabbit MQ to start")
  }
}

runServiceCheck()


const intervalId = setInterval(runServiceCheck, 5000);

const connectToChannel = (connection: any) => {
  
  console.log("creating connection")
  
  connection.createChannel(function(error1: Error, channel: amqp.Channel ) {
    if (error1) {
      throw error1;
    }
    var queue = 'data_consumer2';

    channel.assertQueue(queue, {
      durable: true
    });
    channel.prefetch(1);
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

    console.log("auth token",process.env.x_authorization_token)
    channel.consume(queue, (msg:amqp.Message | null) => {
   
      let apiPort = process.env.api_port
      let service = process.env.service_name
      if(process.env.api_port === "" || process.env.api_port === undefined) {
        apiPort = "3000"
        service = "localhost"
      }
      const apiPath = `http://${service}:${apiPort}/save-sensor-data`
      if(msg) {
         const messageData = JSON.parse(msg.content.toString())
          fetch(apiPath,{
            body: JSON.stringify({"data":messageData["data"],"x_authorization_token":process.env.x_authorization_token}),
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            } as HeadersInit
          }).then(res=>{
              return res.json()
          }).then(console.log).catch(err=>{
            console.log(err)
          })
      
        channel.ack(msg);
      }
    }, {
      // manual acknowledgment mode,
      // see ../confirms.html for details
      noAck: false
    });
  });
}


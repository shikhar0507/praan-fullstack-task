import React, { useEffect, useState } from "react";
import { useUser } from "../../utils/auth";
import { Navigate, useNavigate } from 'react-router-dom';
import { LineChart } from '../common/lineChart';
import { DateRangePicker } from 'rsuite';
import '../../css/datetime.css';
import { customDateRange } from '../../utils/customDateRange';
import { defailtDateStart, defaultDateValue } from "../../config";
import { Button } from 'flowbite-react';
import { format } from 'date-fns'

function Home() {

    const { state } = useUser();
    const [allData, setAllData] = useState([["date", "p1", "p25", "p10", "wind speed"], [0, 0, 0, 0, 0,]]);
    const [p1, setp1] = useState([["date", "p1"], [0, 0]])
    const [p25, setp25] = useState([["date", "p25"], [0, 0]])
    const [p10, setp10] = useState([["date", "p10"], [0, 0]])

    const [dailyAvg, setDailyAvg] = useState([["date", "p1", "p25", "p10"], [0, 0, 0, 0]])

    const path = process.env.api_base_url || 'http://localhost:80'

    const [dateRange, setDateRange] = useState([defailtDateStart, defaultDateValue])
    const { dispatch } = useUser();
    const {navigate} = useNavigate()
    // Fetch all the data
    useEffect(() => {
        console.log(dateRange)
        // if(!dateRange[1] && !dateRange[0]) return
        fetch(`${path}/device/get-all?start=${Date.parse(dateRange[0])}&end=${Date.parse(dateRange[1])}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then((res) => {
            return res.json()
        }).then(response => {
            const result = response["result"]
            if(response.status === 401) {
                localStorage.removeItem('token');
                dispatch({ type: 'LOGOUT', payload: "" })
                navigate("/login")
                return
            } 
            if (response.status !== 200) return
            if (!result.length) {
                setp1([["date", "p1"], [0, 0]])
                setp25([["date", "p25"], [0, 0]])
                setp10([["date", "p10"], [0, 0]])
                return
            }
            // Split the data into multiple parts required for different graphs
            // The data arrays will be for p1,p25,p10

            const p1Data = []
            const p25Data = []
            const p10Data = []
            const allData = []
            result.forEach(item => {
                const date = new Date(item["timestamp"])
                p1Data.push([date, item["p1"]])
                p25Data.push([date, item["p25"]])
                p10Data.push([date, item["p10"]])
                allData.push([date, item["p1"], item["p25"], item["p10"], item["windSpeed"]])
            })

            setp1([["date", "p1"], ...p1Data])
            setp25([["date", "p25"], ...p25Data])
            setp10([["date", "p10"], ...p10Data])
            setAllData([["date", "p1", "p25", "p10", "wind soeed"], ...allData])

        }).catch(console.error)
    }, [dateRange])


    // Fetch daily averages
    const fetchDailyAverage = () => {
        let start;
        let end;
        console.log(typeof dateRange[0]);
        if (typeof dateRange[0] === "object") {
            start = format(dateRange[0], 'yyyy-MM-dd')
            end = format(dateRange[1], 'yyyy-MM-dd')
        } else {
            start = dateRange[0].split(' ')[0]
            end = dateRange[1].split(' ')[0]
        }
        fetch(`${path}/daily-average?start=${start}&end=${end}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then((res) => {
            return res.json()
        }).then(response => {
            const result = response["result"]
            if(response.status === 401) {
                localStorage.removeItem('token');
                dispatch({ type: 'LOGOUT', payload: "" })
                navigate("/login")
                return
            } 
            if (response.status !== 200) return
            if (!result.length) {
                setDailyAvg([["date", "p1", "p25", "p10"], [0, 0, 0, 0]])
                return
            }

            const dailyAvgData = []
            result.forEach(item => {
                dailyAvgData.push([item["date"], item["p1"], item["p25"], item["p10"]])

            })
            setDailyAvg([["date", "p1", "p25", "p10"], ...dailyAvgData])
            console.log(dailyAvgData)

        }).catch(console.error)
    }


    const dateRangeSelected = (values) => {
        setDateRange(values)
    }


    if (state.isAuthenticated) {
        return (
            <div >

                <div className="text-2xl tracking-tight text-gray-900 dark:text-white">Select date range</div>
                <DateRangePicker
                    format="yyyy-MM-dd HH:mm:ss"
                    defaultCalendarValue={[new Date('2021-05-01 00:00:00'), new Date('2021-05-14 23:59:59')]}
                    ranges={customDateRange}
                    onChange={dateRangeSelected}
                />

                <div className="grid grid-cols-12 gap-4 mt-8">
                    <div className="text-4xl font-bold col-span-12">
                        Daily averages
                        <p className="text-sm text-bold pr-4 mb-4 text-black">Since cron job will take 2 minute to run, click the button below  after 2 minute to show the
                            daily averages
                        </p>
                        <Button color="blue" onClick={fetchDailyAverage}>Calculate Daily Averages</Button>
                    </div>
                    <div className="col-span-12 block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                        <LineChart data={dailyAvg}></LineChart>
                    </div>

                </div>

                <div className="grid grid-cols-12 gap-4 mt-8">
                    <div className="col-span-12">
                        <div className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            All data
                        </div>
                        <LineChart data={allData} label={"values"}></LineChart>
                    </div>
                </div>

                <div className="grid grid-cols-6 gap-4 mt-8">
                    <div className="col-span-2 block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                        <div className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            P1
                        </div>
                        <LineChart data={p1} label={"p1"}></LineChart>

                    </div>
                    <div className="col-span-2 block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                        <div className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            P25
                        </div>
                        <LineChart data={p25}></LineChart>
                    </div>
                    <div className="col-span-2 block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                        <div className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            P10
                        </div>
                        <LineChart data={p10}></LineChart>
                    </div>
                </div>
            </div>

        )
    }
    return <Navigate to="/signup"></Navigate>
}

export default Home
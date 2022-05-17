import React, { useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import Axios from "axios";

export default function GraphsBookingOverX() {

    const [graphData, setGraphData] = React.useState([]);
    const [offset, setOffset] = React.useState(0);
    const [mode, setMode] = React.useState(1);

    const [dayStats, setDayStats] = React.useState([]);
    const [weekStats, setWeekStats] = React.useState([]);
    const [monthStats, setMonthStats] = React.useState([]);
    const [yearStats, setYearStats] = React.useState([]);

    useEffect(() => {
        fetchData();
    }, [offset]);

    useEffect(() => {
        switch (mode) {
            case 1:
                setGraphData(dayStats)
                break;
            case 2:
                setGraphData(weekStats)
                break;
            case 3:
                setGraphData(monthStats)
                break;
            case 4:
                setGraphData(yearStats)
                break;

        }
    }, [mode, graphData, dayStats, weekStats, monthStats, yearStats]);

    const fetchData = () => {
        Axios.get("http://127.0.0.1:8000/api/bookings/stats-overall?offset=" + offset).then(res => {
            setDayStats(res.data.day);
            setWeekStats(res.data.week);
            setMonthStats(res.data.month);
            setYearStats(res.data.year);
            console.log(offset, res.data.year)
        }
        );
    }


    return (
        <div className='Graphs background'>

            <div className='selectGraphRange'>
                <button className="CAxButton" onClick={() => {
                    setMode(1);
                }}>Day</button>
                <button className="CAxButton" onClick={() => {
                    setMode(2);
                }}>Week</button>
                <button className="CAxButton" onClick={() => {
                    setMode(3);
                }}>Month</button>
                <button className="CAxButton" onClick={() => {
                    setMode(4);
                }}>Year</button>

            </div>

            <div className='graph'>
                {graphData && <Line id='line'
                    data={{
                        labels: graphData.labels,
                        datasets: [
                            {
                                label: 'All Bookings',
                                backgroundColor: 'rgba(84,142,241,1)',
                                borderColor: 'rgba(84,142,241,1)',
                                borderWidth: 2,
                                tension: 0.2,
                                data: graphData.allData,
                            },
                            {
                                label: 'Bookings Canceled',
                                backgroundColor: 'rgba(179, 6, 29, 1)',
                                borderColor: 'rgba(179, 6, 29, 1)',
                                borderWidth: 2,
                                tension: 0.5,
                                data: graphData.canceledData,
                            },
                            {
                                label: 'Ongoing Bookings',
                                backgroundColor: 'rgba(122, 231, 84, 1)',
                                borderColor: 'rgba(122, 231, 84, 1)',
                                borderWidth: 2,
                                tension: 0.4,
                                data: graphData.ongoingData,
                            }
                        ]
                    }}
                    options={{
                        scales: {
                            y: {
                                beginAtZero: true,
                            }
                        },
                        plugins: {
                            title: {
                                display: true,
                                text: graphData.title,
                                fontSize: 20
                            },
                            legend: {
                                display: true,
                                position: 'right'
                            }

                        }

                    }
                    }
                />}

            </div>

            <div className='navigate'>
                <button className="CAxButton" onClick={() => { setOffset(offset + 1) }}>+</button>
                <button className="CAxButton" onClick={() => { setOffset(offset - 1) }}>-</button>
            </div>

            <div className='CurrentGraphsStats'>
                <div className='statOfGraph background'>
                    <p>Total bookings</p>
                    <hr />
                    <p style={{ color: "#548EE7" }}>{graphData.nbBookTotal}</p>
                </div>
                <div className='statOfGraph background'>
                    <p>Total cancel</p>
                    <hr />
                    <p style={{ color: "rgb(179, 6, 29, 1)" }}>{graphData.nbCancel}</p>
                </div>
                <div className='statOfGraph background'>
                    <p>Total ongoing</p>
                    <hr />
                    <p style={{ color: "rgb(122, 231, 84, 1)" }}>{graphData.nbOngoing}</p>
                </div>
                <div className='statOfGraph background'>
                    <p>Average booking nb over range</p>
                    <hr />
                    <p>{Math.ceil(graphData.nbAvgOverRange * 100) / 100}</p>
                </div>
                <div className='statOfGraph background'>
                    <p>Average booking time over range</p>
                    <hr />
                    <p>{graphData.avgBookTime}</p>
                </div>
            </div>

        </div>);
}

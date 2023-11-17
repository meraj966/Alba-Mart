import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase-config";
import { Chart, LinearScale, CategoryScale, TimeScale, Title } from 'chart.js';

Chart.register(LinearScale, CategoryScale, TimeScale, Title);

const RevenueChart = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const orderData = await getDocs(collection(db, "Order"));
                const revenueData = orderData.docs.map((doc) => ({
                    date: doc.data().orderDate,
                    totalRate: doc.data().totalRate,
                }));

                if (revenueData.length > 0) {
                    const monthlyRevenue = groupByMonth(revenueData);
                    setChartData({
                        labels: Object.keys(monthlyRevenue),
                        datasets: [
                            {
                                label: "Monthly Revenue",
                                data: Object.values(monthlyRevenue),
                                borderColor: "rgba(75,192,192,1)",
                                borderWidth: 2,
                                fill: false,
                            },
                        ],
                    });
                } else {
                    // Handle the case where no data is available
                    console.error("No revenue data available.");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [db]);

    const groupByMonth = (data) => {
        const groupedData = {};

        data.forEach((item) => {
            const monthYear = new Date(item.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
            });

            if (groupedData[monthYear]) {
                groupedData[monthYear] += item.totalRate;
            } else {
                groupedData[monthYear] = item.totalRate;
            }
        });

        return groupedData;
    };

    return (
        <div>
            <Line
                data={chartData}
                options={{
                    responsive: true,
                    scales: {
                        x: [
                            {
                                type: "time", // Use "time" for a time-based x-axis
                                title: {
                                    display: true,
                                    text: "Date",
                                },
                            },
                        ],
                        y: [
                            {
                                type: "linear",
                                title: {
                                    display: true,
                                    text: "Revenue",
                                },
                            },
                        ],
                    },
                }}
            />
        </div>
    );
};

export default RevenueChart;

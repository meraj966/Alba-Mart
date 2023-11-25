import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { sum, groupBy } from "lodash";

const RevenueGraph = ({ orders }) => {
  const [revenueData, setRevenueData] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState("month");
  const [selectedSpecificDate, setSelectedSpecificDate] = useState("");

  const fetchRevenueData = () => {
    const filteredOrders = orders.filter(
      (order) => order.orderStatus === "delivered"
    );

    let processedData = [];

    if (selectedSpecificDate) {
      // Filter data for the specific date
      const specificDateOrders = filteredOrders.filter(
        (order) => getFormattedDate(order.deliveryDate) === selectedSpecificDate
      );
      processedData = specificDateOrders.map((order) => [
        getFormattedDate(order.deliveryDate),
        order.totalRate
      ]);
    } else {
      // Group data based on selected date range
      const groupedData = groupByDate(filteredOrders, selectedDateRange);

      processedData = Object.entries(groupedData).map(([date, orders]) => {
        const formattedDate = getFormattedDate(date, selectedDateRange);
        return [formattedDate, sum(orders.map((order) => order.totalRate))];
      });
    }

    setRevenueData([["Date", "Revenue"], ...processedData]);
  };

  const groupByDate = (orders, dateRange) => {
    const groupedData = groupBy(
      orders,
      (order) => getFormattedDate(order.deliveryDate, dateRange)
    );

    return groupedData;
  };

  const getFormattedDate = (dateString, dateRange) => {
    const date = new Date(dateString);
  
    if (dateRange === "week") {
      const firstDay = new Date(date);
      firstDay.setDate(date.getDate() - date.getDay());
      return firstDay.toISOString().split("T")[0];
    } else if (dateRange === "month") {
      // Display the last day of the month
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      return lastDay.toISOString().split("T")[0];
    } else {
      // For date range, return the date as it is
      return date.toISOString().split("T")[0];
    }
  };    

  const clearFilters = () => {
    setSelectedDateRange("month");
    setSelectedSpecificDate("");
  };

  useEffect(() => {
    fetchRevenueData();
  }, [selectedDateRange, selectedSpecificDate, orders]);

  return (
    <div>
      <select
        value={selectedDateRange}
        onChange={(e) => setSelectedDateRange(e.target.value)}
      >
        <option value="week">Weekly</option>
        <option value="month">Monthly</option>
      </select>

      <input
        type="date"
        value={selectedSpecificDate}
        onChange={(e) => setSelectedSpecificDate(e.target.value)}
      />

      <button onClick={clearFilters}>Clear Filters</button>

      <Chart
        width={"100%"}
        height={"400px"}
        chartType="ColumnChart"
        loader={<div>Loading Chart</div>}
        data={revenueData}
        options={{
          title: "Revenue Over Time",
          hAxis: { title: "Date" },
          vAxis: { title: "Revenue in Rs" },
          legend: "none",
        }}
      />
    </div>
  );
};

export default RevenueGraph;

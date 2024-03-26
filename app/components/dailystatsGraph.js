"use client";

import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);
const getRandomColors = (numColors) => {
  const colors = [];
  for (let i = 0; i < numColors; i++) {
    const color = "#" + Math.floor(Math.random() * 16777215).toString(16); // Generate random hex color
    colors.push(color);
  }
  return colors;
};
const PieChart = ({ data }) => {

console.log("call");
  const [labels, setLabels] = useState([]);
  const [value, setValue] = useState([]);
  useEffect(() => {
    if (data && data.length > 0) {
      const labels = data.map((person) => person.name);
      const pagesScanned = data.map((person) => person.pagesScanned);
      setLabels(labels);
      setValue(pagesScanned);
    }
    else{
      setLabels([]);
      setValue([]);
    }
  }, [data]);

  const chartData = {
    labels,
    datasets: [
      {
        lable: "# of pages",
        data: value,
        backgroundColor: getRandomColors(value && value.length),
      },
    ],
  };
  const chartOptions = {
    plugins: {
      legend: {
        display:true,
        position:'left' // Hide legend
      },
    },
  };

  return (
    <Pie data={chartData} className="min-w-[400px] min-h-[400px]" options={chartOptions} />
  );
};

export default PieChart;

import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

const LineGraph = ({ data }) => {
  const [chart, setChart] = useState(null);
 
  useEffect(() => {
    if (!data || data.length === 0) return;

    const ctx = document.getElementById('lineChart');

    const years = data.map(entry => entry.year);
   
    const months =  ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const datasets = years.map(year => {
      const scannedPages = data.find(entry => entry.year === year).data;
      
      return {
        label: year.toString(),
        data: scannedPages,
        fill: true,
        borderColor: getRandomColor(),
        borderWidth: 3,
        pointBorderColor: "#cb0c9f",
        pointBorderWidth: 3,
        tension: 0.5
      };
    });

    const chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: months,
        datasets: datasets
      },
      options: {
        responsive: true,
        scales: {
          x: {
            ticks: {
              font: {
                size: 15,
                weight: "bold",
              },
            },
            title: {
              display: true,
              text: 'Month',
              // padding: {
              //   bottom: 10,
              // },
              font: {
                size: 20,
                style: "italic",
                family: "Arial",
              },
            }
          },
          y: {
            ticks: {
              font: {
                size: 15,
                weight: "bold",
              },
              stepSize: 300000,
              callback: (value) => value.toLocaleString(),
            },
            title: {
              display: true,
              text: 'Year',
              // padding: {
              //   bottom: 10,
              // },
              font: {
                size: 20,
                style: "italic",
                family: "Arial",
              },
              min: 200000,
              max: 2000000,
              
            },
            // ticks: {
            //   callback: year => year === Math.floor(year) ? year : null,
            //   stepSize: 100000,
            //   reverse: true
            // }
          }
        }
      }
    });

    setChart(chartInstance);

    return () => {
      chartInstance.destroy();
    };
  }, [data]);

  return (
    <div>
      <canvas id="lineChart" width="400" height="400"></canvas>
    </div>
  );
};

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default LineGraph;

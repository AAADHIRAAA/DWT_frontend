import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

const LineGraph = ({ data }) => {
  const [chart, setChart] = useState(null);
  console.log("called function")
  useEffect(() => {
    if (!data || data.length === 0) return;

    const ctx = document.getElementById('lineChart');

    const years = data.map(entry => entry.year);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const datasets = years.map(year => {
      const scannedPages = data.find(entry => entry.year === year).data.map(month => month.count);
      return {
        label: year.toString(),
        data: scannedPages,
        fill: false,
        borderColor: getRandomColor(),
        tension: 0.4
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
            title: {
              display: true,
              text: 'Month'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Year'
            },
            ticks: {
              callback: year => year === Math.floor(year) ? year : null,
              stepSize: 1,
              reverse: true
            }
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

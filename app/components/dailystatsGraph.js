"use client"

import React, {useState, useEffect, useRef} from 'react';
import Chart from 'chart.js/auto';

const PieChart = ({ data }) => {
    const [chart, setChart] = useState(null);
  
    const chartRef = useRef(null);
  
    useEffect(() => {
      if (data && data.length > 0) {
        const labels = data.map(person => person.name);
        const pagesScanned = data.map(person => person.pagesScanned);
  
        const ctx = chartRef.current;
        if (ctx) {
          if (chart) {
            chart.destroy(); // Destroy the previous chart instance
          }
          const newChart = new Chart(ctx, {
            type: 'pie',
            data: {
              labels,
              datasets: [{
                data: pagesScanned,
                backgroundColor: Chart.helpers.color('#FF5733').alpha(0.6).rgbString(),
              }],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      const label = context.label || '';
                      const value = context.raw || '';
                      return `${label}: ${value} pages scanned`;
                    },
                  },
                },
              },
            },
          });
          setChart(newChart);
        }
      }
    }, [data]);
  
    return <canvas id="pie-chart" width="400" height="400" />;
  };
  
  export default PieChart;
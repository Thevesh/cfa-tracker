'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  BarController,
  LineController,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
  type LegendItem
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { ChartData } from '@/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  BarController,
  LineController,
  Title,
  Tooltip,
  Legend
);

interface DailyChartProps {
  data: ChartData;
}

type ChartType = 'bar' | 'line';

export default function DailyChart({ data }: DailyChartProps) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        type: 'bar' as const,
        label: 'Actual',
        data: data.actual,
        backgroundColor: '#346ff320',
        borderColor: '#346ff3',
        borderWidth: 1,
        borderRadius: 3,
        maxBarThickness: 50,
        order: 2
      },
      {
        type: 'line' as const,
        label: 'Target',
        data: data.target,
        borderColor: '#dc2626',
        borderDash: [4, 4],
        borderWidth: 1.5,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointBackgroundColor: '#dc2626',
        tension: 0,
        spanGaps: true,
        order: 1
      }
    ]
  };

  const options: ChartOptions<ChartType> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 8,
        right: 8,
        left: 8,
        bottom: 8
      }
    },
    plugins: {
      legend: {
        position: 'top',
        align: 'center',
        labels: {
          padding: 16,
          font: {
            size: 13,
            family: "'Inter', sans-serif",
            weight: 400
          },
          boxWidth: 24,
          boxHeight: 6,
          usePointStyle: false,
          generateLabels: (chart) => {
            const defaultLabels = ChartJS.defaults.plugins.legend.labels.generateLabels(chart);
            return defaultLabels.map((label: LegendItem) => {
              if (label.text === 'Target') {
                return {
                  ...label,
                  pointStyle: 'line',
                  lineDash: [4, 4],
                  lineWidth: 1.5,
                  fillStyle: '#ffffff'
                };
              }
              return {
                ...label,
                pointStyle: 'rect',
                fillStyle: '#346ff320',
                strokeStyle: '#346ff3'
              };
            });
          }
        }
      },
      title: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1a1a1a',
        bodyColor: '#1a1a1a',
        bodyFont: {
          size: 13,
          family: "'Inter', sans-serif"
        },
        titleFont: {
          size: 13,
          family: "'Inter', sans-serif",
          weight: 500
        },
        padding: 12,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        displayColors: true,
        boxWidth: 6,
        boxHeight: 6,
        boxPadding: 4,
        usePointStyle: true,
        callbacks: {
          title: (items) => {
            const date = new Date(items[0].label);
            return date.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
          },
          label: (context) => {
            const value = context.raw as number | null;
            if (value === null || value === 0) return '';
            return `${context.dataset.label}: ${value}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          },
          callback: (value, index) => {
            const date = new Date(data.labels[index]);
            return date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            });
          }
        }
      },
      y: {
        min: 0,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          },
          padding: 8
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  return (
    <div className="w-full h-full">
      <Chart type="bar" data={chartData} options={options} />
    </div>
  );
} 
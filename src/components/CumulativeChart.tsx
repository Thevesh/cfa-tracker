'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ChartData } from '@/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface CumulativeChartProps {
  data: ChartData;
}

type ChartType = 'line';

export default function CumulativeChart({ data }: CumulativeChartProps) {
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
          usePointStyle: true,
          boxWidth: 6,
          boxHeight: 6
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

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Actual Progress',
        data: data.actual.map(v => v === 0 ? null : v),
        borderColor: '#346ff3',
        backgroundColor: '#346ff315',
        borderWidth: 1,
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0.4,
        fill: true,
        spanGaps: true,
        order: 2
      },
      {
        label: 'Target',
        data: data.target.map(v => v === 0 ? null : v),
        borderColor: '#ef4444',
        backgroundColor: '#ef444412',
        borderWidth: 0.75,
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0.4,
        fill: true,
        spanGaps: true,
        order: 1
      }
    ]
  };

  return (
    <div className="w-full h-full">
      <Line data={chartData} options={options} />
    </div>
  );
} 
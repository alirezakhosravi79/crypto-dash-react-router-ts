import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
  Filler,
} from "chart.js";

import "chartjs-adapter-date-fns";

const API_URL = import.meta.env.VITE_COIN_API_URL;

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
  Filler,
);

interface CoinChartProps {
  coinId: string;
}

function CoinChart({ coinId }: CoinChartProps) {
  const [chartData, setChartData] = useState<ChartData<"line"> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_URL}/${coinId}/market_chart?vs_currency=usd&days=7`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch chart data");
        }

        const data = await response.json();

        setChartData({
          datasets: [
            {
              label: "Price (USD)",
              data: data.prices.map((price: [number, number]) => ({
                x: price[0],
                y: price[1],
              })),
              borderColor: "#007bff",
              backgroundColor: "rgba(0,123,255,0.15)",
              fill: true,
              tension: 0.4,
              pointRadius: 0,
            },
          ],
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [coinId]);

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        mode: "index",
        intersect: false,

        callbacks: {
          label: (context) => {
            const value = context.parsed.y;

            if (value === null) return "";

            return new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(value);
          },
        },
      },
    },

    scales: {
      x: {
        type: "time",

        time: {
          unit: "day",
          tooltipFormat: "PPP",
        },

        ticks: {
          autoSkip: true,
          maxTicksLimit: 7,
        },

        title: {
          display: true,
          text: "Date",
        },
      },

      y: {
        ticks: {
          callback: (value) => {
            return `$${Number(value).toLocaleString("en-US")}`;
          },
        },

        title: {
          display: true,
          text: "Price (USD)",
        },
      },
    },
  };

  if (loading) {
    return <p>Loading chart...</p>;
  }

  if (!chartData) {
    return <p>No chart data available</p>;
  }

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default CoinChart;
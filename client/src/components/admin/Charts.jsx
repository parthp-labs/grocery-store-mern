import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  BarElement,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { getLastSixMonths } from "../utils/utilityFunctions";

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const lastSixMonths = getLastSixMonths();

const defaultBg1 = "rgb(0, 115, 255)";
const defaultBg2 = "rgba(53, 162, 235, 0.8)";

export const BarChart = ({
  data1 = [],
  data2 = [],
  title1,
  title2,
  horizontal = false,
  labels = lastSixMonths,
  bgColor1 = defaultBg1,
  bgColor2 = defaultBg2,
}) => {
  const options = {
    responsive: true,
    indexAxis: horizontal ? "y" : "x",
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },

    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    maintainAspectRatio: false,
  };

  const data = {
    labels,
    datasets: [
      {
        label: title1,
        data: data1,
        backgroundColor: bgColor1,
        barThickness: "flex",
        barPercentage: 1,
      },
      {
        label: title1,
        data: data2,
        backgroundColor: bgColor2,
        barThickness: "flex",
        barPercentage: 1,
      },
    ],
  };

  return (
    <Bar
      className="dashboard__bar__chart"
      style={{}}
      options={options}
      data={data}
    />
  );
};

export const DoughnutChart = ({ labels, data, bgColor, legends = true }) => {
  const doughnutData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: bgColor,
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: legends,
        position: "bottom",
        labels: {
          padding: 40,
        },
      },
    },
  };

  return (
    <Doughnut
      data={doughnutData}
      className="dashboard__doughnut__chart"
      options={options}
    />
  );
};

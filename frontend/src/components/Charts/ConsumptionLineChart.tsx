import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  dates: string[];
  values: number[];
}

const ConsumptionLineChart = ({ dates, values }: Props) => {
  const data = {
    labels: dates,
    datasets: [
      {
        label: 'Потребление, кВт·ч',
        data: values,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Дата'
        }
      },
      y: {
        title: {
          display: true,
          text: 'кВт·ч'
        }
      }
    }
  };

  return <Line data={data} options={options} />;
};

export default ConsumptionLineChart;
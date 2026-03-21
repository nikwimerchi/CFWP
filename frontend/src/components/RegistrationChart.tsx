import React from 'react';
import ReactApexChart from 'react-apexcharts';

// 1. Define the shape of the props
interface RegistrationChartProps {
  data: {
    month: string;
    advisors: number;
    families: number;
    children: number;
  }[];
  loading: boolean;
}

// 2. Pass the interface to the component
const RegistrationChart: React.FC<RegistrationChartProps> = ({ data, loading }) => {
  const options: any = {
    chart: {
      type: 'area',
      toolbar: { show: false },
    },
    colors: ['#3C50E0', '#80CAEE', '#10B981'],
    xaxis: {
      categories: data.map((d) => d.month),
    },
    stroke: { curve: 'smooth' },
  };

  const series = [
    { name: 'Advisors', data: data.map((d) => d.advisors) },
    { name: 'Families', data: data.map((d) => d.families) },
    { name: 'Children', data: data.map((d) => d.children) },
  ];

  if (loading) {
    return <div className="h-80 w-full animate-pulse bg-gray-200 rounded-sm"></div>;
  }

  return (
    <div className="rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <h3 className="mb-4 text-xl font-bold text-black dark:text-white">Registration Trends</h3>
      <ReactApexChart options={options} series={series} type="area" height={350} />
    </div>
  );
};

export default RegistrationChart;
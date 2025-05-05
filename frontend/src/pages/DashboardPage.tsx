import React, { useState, useEffect } from 'react';
import MapView from '../components/mapsView/MapView';
import ConsumptionLineChart from '../components/Charts/ConsumptionLineChart';
import D3HeatmapCalendar from '../components/Charts/D3HeatmapCalendar';

interface ChartData {
  date: string;
  value: number;
}

interface HeatmapData {
  date: Date;
  value: number;
}

const DashboardPage: React.FC = () => { // Определяем DashboardPage как функциональный компонент
  // Состояния для данных
  const [lineChartData, setLineChartData] = useState<ChartData[]>([]);
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);

  // Загрузка данных для Chart.js
  useEffect(() => {
    fetch('/api/consumption/timeseries/')
      .then(res => res.json())
      .then(data => setLineChartData(data));
  }, []);

  // Загрузка данных для D3.js
  useEffect(() => {
    fetch('/api/consumption/heatmap/')
      .then(res => res.json())
      .then(data =>
        setHeatmapData(data.map((item: any) => ({
          date: new Date(item.date),
          value: item.value
        })))
      );
  }, []);

  return (
    <div className="dashboard">
      <h1>Аналитика энергопотребления</h1>

      {/* Карта */}
      <div className="section">
        <h2>Карта</h2>
        <MapView />
      </div>

      {/* График Chart.js */}
      <div className="section">
        <h2>Тренд потребления</h2>
        <ConsumptionLineChart
          dates={lineChartData.map(d => d.date)}
          values={lineChartData.map(d => d.value)}
        />
      </div>

      {/* График D3.js */}
      <div className="section">
        <h2>Распределение потребления</h2>
        <D3HeatmapCalendar data={heatmapData} />
      </div>
    </div>
  );
};

export default DashboardPage;
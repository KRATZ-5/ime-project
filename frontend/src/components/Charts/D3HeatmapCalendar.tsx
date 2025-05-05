import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface HeatmapData {
  date: Date;
  value: number;
}

interface Props {
  data: HeatmapData[];
}

const D3HeatmapCalendar = ({ data }: Props) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current || data.length === 0) return;

    // Очистка предыдущего SVG
    d3.select(ref.current).selectAll('*').remove();

    // Логика построения графика
    const svg = d3.select(ref.current);
    const width = 800;
    const height = 400;

    svg.attr("viewBox", `0 0 ${width} ${height}`)
       .attr("preserveAspectRatio", "xMidYMid meet");

    // Пример: добавление кругов
    svg.selectAll("circle")
       .data(data)
       .enter()
       .append("circle")
       .attr("cx", (d, i) => (i % 10) * 80 + 50)
       .attr("cy", (d, i) => Math.floor(i / 10) * 80 + 50)
       .attr("r", d => d.value / 1000)
       .attr("fill", "steelblue");

  }, [data]);

  return <svg ref={ref} width="100%" height={400} />;
};

export default D3HeatmapCalendar;
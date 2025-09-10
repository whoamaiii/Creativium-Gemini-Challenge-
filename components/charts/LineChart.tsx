import React from 'react';
import useReducedMotion from '../../hooks/useReducedMotion';

interface DataPoint {
  x: Date;
  y: number;
}

interface LineChartProps {
  data: DataPoint[];
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const prefersReducedMotion = useReducedMotion();
  
  if (!data || data.length < 2) {
    return <div className="flex items-center justify-center h-full text-muted">Not enough data to display chart.</div>;
  }

  const width = 500;
  const height = 200;
  const margin = { top: 10, right: 10, bottom: 20, left: 20 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xMin = data[0].x.getTime();
  const xMax = data[data.length - 1].x.getTime();
  const yMin = 0;
  const yMax = 10; // Assuming a score from 0-10

  const xScale = (x: Date) => ((x.getTime() - xMin) / (xMax - xMin)) * innerWidth;
  const yScale = (y: number) => innerHeight - ((y - yMin) / (yMax - yMin)) * innerHeight;
  
  const path = data.map(p => `${xScale(p.x)},${yScale(p.y)}`).join(' L ');
  const areaPath = `M ${xScale(data[0].x)},${innerHeight} L ${path} L ${xScale(data[data.length - 1].x)},${innerHeight} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-brand)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--color-brand)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        {/* Y-axis labels (simplified) */}
        <text x={-5} y={yScale(yMax) + 4} textAnchor="end" className="text-xs fill-muted">{yMax}</text>
        <text x={-5} y={yScale(yMin) + 4} textAnchor="end" className="text-xs fill-muted">{yMin}</text>
        <line x1={0} y1={0} x2={0} y2={innerHeight} className="stroke-border" />
        
        {/* X-axis line */}
        <line x1={0} y1={innerHeight} x2={innerWidth} y2={innerHeight} className="stroke-border" />

        {/* Gradient Area */}
        <path d={areaPath} fill="url(#areaGradient)" />

        {/* Line */}
        <path d={`M ${path}`} fill="none" className="stroke-brand" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
          {!prefersReducedMotion && (
            <animate attributeName="stroke-dasharray" from="0" to="1000" dur="1.5s" />
          )}
        </path>
        
        {/* Points */}
        {data.map((p, i) => (
          <circle key={i} cx={xScale(p.x)} cy={yScale(p.y)} r="3" className="fill-brand" />
        ))}
      </g>
    </svg>
  );
};

export default LineChart;

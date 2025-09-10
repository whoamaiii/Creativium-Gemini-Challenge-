import React from 'react';
import useReducedMotion from '../../hooks/useReducedMotion';

interface DataPoint {
  label: string;
  value: number;
}

interface BarChartProps {
  data: DataPoint[];
  layout?: 'vertical' | 'horizontal';
}

const BarChart: React.FC<BarChartProps> = ({ data, layout = 'vertical' }) => {
  const prefersReducedMotion = useReducedMotion();
  
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-full text-muted">No data to display.</div>;
  }

  const width = 500;
  const height = 200;
  const margin = { top: 10, right: 10, bottom: (layout === 'vertical' ? 40 : 20), left: (layout === 'horizontal' ? 80 : 20) };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const yMax = Math.max(...data.map(d => d.value), 0);
  
  const getBarProps = (d: DataPoint, i: number) => {
    const val = Math.max(0, d.value); // ensure value is not negative
    if (layout === 'vertical') {
      const barWidth = innerWidth / data.length * 0.8;
      const barHeight = yMax > 0 ? (val / yMax) * innerHeight : 0;
      return {
        x: (innerWidth / data.length) * (i + 0.1),
        y: innerHeight - barHeight,
        width: barWidth,
        height: barHeight,
      };
    } else { // horizontal
      const barHeight = innerHeight / data.length * 0.8;
      const barWidth = yMax > 0 ? (val / yMax) * innerWidth : 0;
      return {
        x: 0,
        y: (innerHeight / data.length) * (i + 0.1),
        width: barWidth,
        height: barHeight,
      }
    }
  };

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet" role="img" aria-label={`Bar chart showing ${layout} data`}>
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        {/* Axes lines */}
        <line x1={0} y1={0} x2={0} y2={innerHeight} className="stroke-border" />
        <line x1={0} y1={innerHeight} x2={innerWidth} y2={innerHeight} className="stroke-border" />

        {/* Bars */}
        {data.map((d, i) => {
          const { x, y, width, height } = getBarProps(d, i);
          return (
            <g key={i} aria-label={`${d.label}: ${d.value.toFixed(1)}`}>
              <rect
                x={x}
                y={y}
                width={width}
                height={height}
                className="fill-brand/70 hover:fill-brand transition-colors"
              >
                {!prefersReducedMotion && (
                  <animate
                    attributeName={layout === 'vertical' ? 'height' : 'width'}
                    from="0"
                    to={layout === 'vertical' ? height : width}
                    dur="0.5s"
                    fill="freeze"
                    begin={`${i * 50}ms`}
                  />
                )}
              </rect>
            </g>
          );
        })}
        
        {/* Labels */}
        {data.map((d, i) => {
            if (layout === 'vertical') {
                return (
                     <text key={i} x={(innerWidth / data.length) * (i + 0.5)} y={innerHeight + 15} textAnchor="middle" className="text-xs fill-muted truncate">
                        {d.label}
                    </text>
                );
            } else { // horizontal
                return (
                    <text key={i} x={-5} y={(innerHeight / data.length) * (i + 0.5)} textAnchor="end" dominantBaseline="middle" className="text-xs fill-muted">
                        {d.label}
                    </text>
                );
            }
        })}
      </g>
    </svg>
  );
};

export default BarChart;

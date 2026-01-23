import React, { useEffect, useRef } from 'react';

interface TimeRecoveryChartProps {
  monthlySavings: number;
}

export const TimeRecoveryChart: React.FC<TimeRecoveryChartProps> = ({ monthlySavings }) => {
  const pathRef = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Generate data points for 12 months
  const data = Array.from({ length: 13 }, (_, i) => ({
    month: i,
    value: i * monthlySavings
  }));

  const maxValue = data[data.length - 1].value;
  const width = 600;
  const height = 200;
  const padding = 20;

  // Scale functions
  const getX = (index: number) => padding + (index / (data.length - 1)) * (width - 2 * padding);
  const getY = (value: number) => height - padding - (value / maxValue) * (height - 2 * padding);

  // Generate Path D
  const pathD = data.map((d, i) => 
    `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.value)}`
  ).join(' ');

  // Generate Area Path (close the loop)
  const areaD = `${pathD} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`;

  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      
      // Reset
      pathRef.current.style.strokeDasharray = `${length}`;
      pathRef.current.style.strokeDashoffset = `${length}`;
      
      // Animate
      pathRef.current.animate([
        { strokeDashoffset: length },
        { strokeDashoffset: 0 }
      ], {
        duration: 2000,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'forwards',
        delay: 300
      });
    }
  }, [pathD]);

  return (
    <div ref={containerRef} className="w-full h-full relative group">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        {/* Grid Lines */}
        <line x1={padding} y1={height-padding} x2={width-padding} y2={height-padding} stroke="#374151" strokeWidth="1" strokeOpacity="0.3" />
        <line x1={padding} y1={padding} x2={padding} y2={height-padding} stroke="#374151" strokeWidth="1" strokeOpacity="0.3" />

        {/* Gradient Definition */}
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3500D3" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3500D3" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Area Fill */}
        <path 
            d={areaD} 
            fill="url(#chartGradient)" 
            className="opacity-0 animate-in fade-in duration-1000 delay-1000 fill-mode-forwards"
        />

        {/* Line Path */}
        <path
          ref={pathRef}
          d={pathD}
          fill="none"
          stroke="#3500D3"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="drop-shadow-[0_0_8px_rgba(53,0,211,0.5)]"
        />

        {/* Data Points (Visible on Hover) */}
        {data.map((d, i) => (
          <circle
            key={i}
            cx={getX(i)}
            cy={getY(d.value)}
            r="4"
            fill="#F8FAFC"
            stroke="#3500D3"
            strokeWidth="2"
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ transitionDelay: `${i * 50}ms` }}
          />
        ))}
      </svg>
      
      {/* Tooltip Hint */}
      <div className="absolute top-0 right-0 text-xs text-light-muted dark:text-dark-muted font-mono opacity-50">
          PROJECTION: 12-MONTH TRAJECTORY
      </div>
    </div>
  );
};
import React from 'react';
import useReducedMotion from '../hooks/useReducedMotion';

const ConfidenceBar: React.FC<{
  value: number;
  label?: string;
}> = ({
  value,
  label,
}) => {
  const reduced = useReducedMotion();
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  const w = 240, h = 14, fill = (pct / 100) * w;
  
  return (
    <div className="flex items-center gap-4">
      {label && <span className="text-sm text-muted w-32 shrink-0 truncate" title={label}>{label}</span>}
      <svg width={w} height={h} role="img" aria-label={`${label ?? 'Confidence'} ${pct}%`}>
        <desc>{`Confidence bar for ${label ?? 'item'} at ${pct}%`}</desc>
        <rect x="0" y="0" width={w} height={h} rx="7" ry="7" className="fill-surface-2" aria-hidden="true"/>
        <rect x="0" y="0" width={fill} height={h} rx="7" ry="7"
          className="fill-brand" style={reduced ? {} : { transition: 'width 300ms ease-in-out' }} />
      </svg>
      <span className="text-xs font-semibold text-muted w-10 text-right">{pct}%</span>
    </div>
  );
};

export default ConfidenceBar;

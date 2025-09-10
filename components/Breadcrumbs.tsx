import React from 'react';

interface Crumb {
  label: string;
  href?: string;
}

const Breadcrumbs: React.FC<{ items: Crumb[] } > = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-2">
            {idx > 0 && <span className="opacity-60">/</span>}
            {item.href ? (
              <a href={item.href} className="text-brand hover:underline">{item.label}</a>
            ) : (
              <span className="text-text">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;


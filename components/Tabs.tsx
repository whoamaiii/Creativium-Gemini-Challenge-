import React, { useState, Children, cloneElement, useRef, useEffect, KeyboardEvent } from 'react';

interface TabsProps {
  children: React.ReactElement<TabPanelProps>[];
  label: string;
}

interface TabPanelProps {
  title: string;
  children: React.ReactNode;
}

export const TabPanel: React.FC<TabPanelProps> = ({ children }) => <>{children}</>;

const Tabs: React.FC<TabsProps> = ({ children, label }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    tabRefs.current = tabRefs.current.slice(0, children.length);
  }, [children.length]);

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let newIndex: number | null = null;
    if (e.key === 'ArrowRight') {
      newIndex = (index + 1) % children.length;
    } else if (e.key === 'ArrowLeft') {
      newIndex = (index - 1 + children.length) % children.length;
    }

    if (newIndex !== null) {
      e.preventDefault();
      const nextTab = tabRefs.current[newIndex];
      nextTab?.focus();
      setActiveIndex(newIndex);
    }
  };

  return (
    <div>
      <div role="tablist" aria-label={label} className="border-b border-border mb-4 flex gap-4">
        {Children.map(children, (child, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={index}
              ref={el => { tabRefs.current[index] = el; }}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${index}`}
              id={`tab-${index}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveIndex(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`py-2 px-1 text-sm font-semibold border-b-2 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-t-sm
                ${isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted hover:border-border hover:text-text'
                }`}
            >
              {child.props.title}
            </button>
          );
        })}
      </div>
      <div
        id={`tabpanel-${activeIndex}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeIndex}`}
        tabIndex={0}
        className="focus:outline-none"
      >
        {children[activeIndex]}
      </div>
    </div>
  );
};

export default Tabs;
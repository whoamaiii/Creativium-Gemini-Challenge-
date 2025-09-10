import React from 'react';

interface StickyBarProps {
  children: React.ReactNode;
}

const StickyBar: React.FC<StickyBarProps> = ({ children }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30">
        <div className="bg-surface/80 backdrop-blur-lg border-t border-border">
            <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8 py-3 flex justify-end items-center gap-4">
                 {children}
            </div>
        </div>
    </div>
  );
};

export default StickyBar;

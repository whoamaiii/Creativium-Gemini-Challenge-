import React, { useEffect, useRef } from 'react';
import { X } from './icons';
import useReducedMotion from '../hooks/useReducedMotion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  variant?: 'modal' | 'sheet';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title, variant = 'modal' }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      panelRef.current?.focus(); // Set initial focus
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const transitionClasses = prefersReducedMotion ? 'transition-opacity duration-300' : 'transition-all duration-300';
  const overlayTransition = prefersReducedMotion ? 'transition-opacity duration-300' : 'transition-opacity duration-300';

  const modalBase = `fixed z-50 focus:outline-none`;
  const modalVariant = variant === 'modal' ? 'inset-0 flex items-center justify-center p-4' : 'fixed inset-0 flex items-end sm:items-center sm:justify-center';
  const overlayBase = `fixed inset-0 bg-black/60 backdrop-blur-sm`;

  const panelBase = `relative w-full bg-card rounded-t-2xl sm:rounded-2xl shadow-xl flex flex-col`;
  const panelVariant = variant === 'modal' ? 'max-w-lg max-h-[90vh]' : 'max-h-[80vh] sm:max-w-lg';
  
  const openClasses = isOpen ? 'opacity-100' : 'opacity-0';
  const openPanelClasses = isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 scale-95';
  const openSheetClasses = isOpen ? 'opacity-100 translate-y-0 sm:scale-100' : 'opacity-0 translate-y-full sm:scale-95';

  if (!isOpen) return null;

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="modal-title" className={`${modalBase}`}>
      <div className={`${overlayBase} ${overlayTransition} ${openClasses}`} onClick={onClose} />
      
      <div className={modalVariant}>
        <div ref={panelRef} tabIndex={-1} className={`${panelBase} ${panelVariant} ${transitionClasses} ${variant === 'modal' ? openPanelClasses : openSheetClasses}`}>
          <header className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
            <h2 id="modal-title" className="text-lg font-semibold">{title}</h2>
            <button onClick={onClose} className="p-1 rounded-full text-muted hover:bg-surface-2 hover:text-text focus-visible:ring-2 focus-visible:ring-primary">
              <X size={20} />
              <span className="sr-only">Close modal</span>
            </button>
          </header>
          <div className="flex-grow p-6 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;

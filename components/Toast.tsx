
import React, { useState, useEffect } from 'react';
import { toastService, ToastMessage } from '../services/toast';
import { CheckCircle, AlertTriangle } from './icons';
import useReducedMotion from '../hooks/useReducedMotion';

const Toast: React.FC<{ message: ToastMessage, onDismiss: () => void }> = ({ message, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setIsVisible(true); // Animate in
    const timer = setTimeout(() => {
      setIsVisible(false); // Animate out
    }, 2000); // Visible for 2s

    const dismissTimer = setTimeout(onDismiss, 2500); // Dismiss after animation

    return () => {
      clearTimeout(timer);
      clearTimeout(dismissTimer);
    };
  }, [message, onDismiss]);

  const transitionClasses = prefersReducedMotion 
    ? 'transition-opacity duration-300' 
    : 'transition-all duration-500 transform';
  
  const visibleClasses = isVisible
    ? 'opacity-100 translate-y-0'
    : 'opacity-0 translate-y-4';

  const isError = message.text.toLowerCase().includes('error') || message.text.toLowerCase().includes('failed');

  return (
    <div
      className={`flex items-center gap-4 w-full max-w-sm p-4 rounded-lg shadow-lg glass-card ${transitionClasses} ${visibleClasses}`}
      role="status"
    >
      {isError ? (
        <AlertTriangle size={24} className="text-error flex-shrink-0" />
      ) : (
        <CheckCircle size={24} className="text-success flex-shrink-0" />
      )}
      <p className="text-sm font-medium text-text">{message.text}</p>
    </div>
  );
};

const ToastContainer: React.FC = () => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const unsubscribe = toastService.subscribe(setMessages);
    return unsubscribe;
  }, []);

  const handleDismiss = (id: number) => {
    // The service handles removal, this is just for the component's state if needed
    // but the service's auto-removal is the source of truth.
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {messages.map(msg => (
        <Toast key={msg.id} message={msg} onDismiss={() => handleDismiss(msg.id)} />
      ))}
    </div>
  );
};

export default ToastContainer;

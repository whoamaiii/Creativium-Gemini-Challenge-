import React, { useState } from 'react';
import { useStore } from '../services/store';
import { storage } from '../services/storage';
import { toastService } from '../services/toast';
import Button from '../components/Button';
import Card from '../components/Card';
import { AlertTriangle } from '../components/icons';

const DebugPanel: React.FC = () => {
  const { sessions, clearAllSessions } = useStore();
  const [showConfirm, setShowConfirm] = useState(false);
  const [rawStorage, setRawStorage] = useState('');

  const handleClearData = () => {
    clearAllSessions();
    toastService.show('All session data has been cleared.');
    setShowConfirm(false);
  };
  
  const handleShowRawData = () => {
      // Fix: Use the correct storage key for the Zustand store.
      const data = storage.get('kreativium:app-store');
      setRawStorage(JSON.stringify(data, null, 2));
  };
  
  const handleCopyRawData = () => {
    navigator.clipboard.writeText(rawStorage).then(() => {
        toastService.show("Raw data copied to clipboard!");
    }, () => {
        toastService.show("Failed to copy raw data.");
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Debug Panel</h1>
        <p className="text-muted mt-2">Internal tools for development and testing.</p>
      </div>

      <Card>
        <h2 className="text-xl font-semibold mb-4">Session Data Management</h2>
        <div className="flex items-center gap-4">
          <p>Current session count: <span className="font-bold text-brand">{sessions.length}</span></p>
          <Button variant="secondary" onClick={handleShowRawData}>View Raw Data</Button>
        </div>
      </Card>
      
      {rawStorage && (
          <Card>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Raw LocalStorage Data</h3>
              <Button variant="ghost" onClick={handleCopyRawData}>Copy JSON</Button>
            </div>
            <pre className="bg-elev p-4 rounded-lg text-sm max-h-96 overflow-auto">
                <code>{rawStorage}</code>
            </pre>
          </Card>
      )}

      <Card className="!bg-error/10 border border-error/20">
        <h2 className="text-xl font-semibold text-error mb-4">Danger Zone</h2>
        {!showConfirm ? (
          <Button variant="secondary" className="!bg-error/20 !text-error hover:!bg-error/30 focus:!ring-error" onClick={() => setShowConfirm(true)}>
            <AlertTriangle />
            Clear All Local Data
          </Button>
        ) : (
          <div>
            <p className="text-error mb-4">Are you sure? This will permanently delete all logged sessions from your browser. This action cannot be undone.</p>
            <div className="flex gap-4">
              <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
              <Button variant="primary" className="!bg-error hover:!opacity-90 focus:!ring-error" onClick={handleClearData}>
                Yes, Delete Everything
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DebugPanel;

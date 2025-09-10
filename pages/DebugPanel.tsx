import React, { useRef, useState } from 'react';
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
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleExportJSON = () => {
    try {
      const { students, sessions, analyses, goals } = useStore.getState();
      const payload = {
        version: 1,
        exportedAtISO: new Date().toISOString(),
        students,
        sessions,
        analyses,
        goals,
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const date = new Date().toISOString().replace(/[:.]/g, '-');
      a.href = url;
      a.download = `kreativium-backup-${date}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toastService.show('Backup downloaded.');
    } catch (e) {
      toastService.show('Failed to export backup.');
    }
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleImportFile: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const stateLike = parsed?.state ? parsed.state : parsed;
      const students = stateLike.students ?? [];
      const sessions = stateLike.sessions ?? [];
      const analyses = stateLike.analyses ?? {};
      const goals = stateLike.goals ?? [];
      const ok = confirm(`Import ${sessions.length} sessions, ${goals.length} goals, ${students.length} students? This will REPLACE existing data.`);
      if (!ok) return;
      useStore.setState({ students, sessions, analyses, goals });
      toastService.show('Import complete.');
      setRawStorage('');
    } catch (err) {
      console.error('Import error', err);
      toastService.show('Failed to import backup.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Debug Panel</h1>
        <p className="text-muted mt-2">Internal tools for development and testing.</p>
      </div>

      <Card>
        <h2 className="text-xl font-semibold mb-4">Session Data Management</h2>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <p>Current session count: <span className="font-bold text-brand">{sessions.length}</span></p>
            <Button variant="secondary" onClick={handleShowRawData}>View Raw Data</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={handleExportJSON}>Export Backup (JSON)</Button>
            <Button variant="secondary" onClick={handleImportClick}>Import Backup (Replace)</Button>
            <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleImportFile} />
          </div>
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

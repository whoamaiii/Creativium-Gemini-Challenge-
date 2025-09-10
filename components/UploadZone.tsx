import React, { useRef, useState, useCallback } from 'react';
import { Plus } from './icons';

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

interface UploadZoneProps {
  onFilesAccepted: (files: File[]) => void;
  maxFiles?: number;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onFilesAccepted, maxFiles = 6 }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateAndAccept = useCallback((files: File[]) => {
    setError(null);

    if (files.length > maxFiles) {
      setError(`You can only upload a maximum of ${maxFiles} images.`);
      return;
    }

    for (const file of files) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError(`Invalid file type: ${file.name}. Only PNG, JPEG, and WEBP are allowed.`);
        return;
      }
      if (file.size > MAX_SIZE_BYTES) {
        setError(`File is too large: ${file.name}. Maximum size is ${MAX_SIZE_MB}MB.`);
        return;
      }
    }

    onFilesAccepted(files);
  }, [onFilesAccepted, maxFiles]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    if (files.length) {
      validateAndAccept(files);
    }
    event.target.value = ''; // Allow re-uploading the same file
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    const files = event.dataTransfer.files ? Array.from(event.dataTransfer.files) : [];
    if (files.length) {
      validateAndAccept(files);
    }
  }, [validateAndAccept]);

  const handleDragEvents = (event: React.DragEvent<HTMLDivElement>, isEntering: boolean) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(isEntering);
  };

  const openFileDialog = () => inputRef.current?.click();

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Upload images"
      className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-200
        ${isDragging ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50 hover:bg-surface-2'}
        ${error ? 'border-error bg-error/10' : ''}`}
      onClick={openFileDialog}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openFileDialog()}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={(e) => handleDragEvents(e, true)}
      onDragLeave={(e) => handleDragEvents(e, false)}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        multiple
        hidden
        onChange={handleFileChange}
      />
      <Plus size={32} className={`mb-2 transition-colors ${isDragging ? 'text-primary' : 'text-muted'}`} />
      <p className={`font-semibold transition-colors ${isDragging ? 'text-primary' : 'text-text'}`}>
        Drag & drop images or click
      </p>
      <p className="text-sm text-muted mt-1">Max {maxFiles} images, up to {MAX_SIZE_MB}MB each</p>
      {error && <p className="mt-2 text-error text-sm font-semibold">{error}</p>}
    </div>
  );
};

export default UploadZone;

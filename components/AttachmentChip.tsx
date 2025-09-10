
import React from 'react';
import { X } from './icons';
import { Attachment } from '../types';

interface AttachmentChipProps {
  attachment: Attachment;
  onRemove: () => void;
}

const AttachmentChip: React.FC<AttachmentChipProps> = ({ attachment, onRemove }) => {
  const isImage = attachment.kind === 'image';
  return (
    <div className="flex items-center gap-2 bg-surface-2 border border-border rounded-full p-1 pr-2 text-sm">
      {isImage && (
        <img
          src={attachment.url}
          alt={attachment.name}
          className="w-6 h-6 rounded-full object-cover"
        />
      )}
      <span className="truncate max-w-[120px]">{attachment.name}</span>
      <button
        type="button"
        onClick={onRemove}
        className="p-0.5 rounded-full text-muted hover:bg-error/20 hover:text-error transition-colors"
        aria-label={`Remove ${attachment.name}`}
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default AttachmentChip;

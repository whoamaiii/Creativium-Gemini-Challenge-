
import React from 'react';
import UploadZone from './UploadZone';
import AttachmentChip from './AttachmentChip';
import { Attachment } from '../types';

interface UploadAreaProps {
  attachments: Attachment[];
  onFilesAccepted: (files: File[]) => void;
  onRemoveAttachment: (index: number) => void;
}

const UploadArea: React.FC<UploadAreaProps> = ({ attachments, onFilesAccepted, onRemoveAttachment }) => {
  return (
    <div className="space-y-4">
      <UploadZone onFilesAccepted={onFilesAccepted} />
      {attachments.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-muted mb-2">Attachments</h4>
          <div className="flex flex-wrap gap-2">
            {attachments.map((att, index) => (
              <AttachmentChip
                key={`${att.name}-${index}`}
                attachment={att}
                onRemove={() => onRemoveAttachment(index)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadArea;

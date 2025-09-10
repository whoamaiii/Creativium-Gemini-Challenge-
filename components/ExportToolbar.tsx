import React from 'react';
import Button from './Button';
import { onCopy, onDownloadPDF, onShare } from '../services/actions';
import { Copy, FileDown, Share2 } from './icons';

interface ExportToolbarProps {
  sessionId: string;
  summaryText: string;
}

const ExportToolbar: React.FC<ExportToolbarProps> = ({ sessionId, summaryText }) => {
  
  const handleShare = () => {
    onShare(window.location.href, `Check out this session insight for ${sessionId}`);
  };

  return (
    <div className="no-print flex flex-wrap items-center gap-2">
      <Button variant="secondary" onClick={() => onCopy(summaryText, "Analysis summary copied!")}><Copy size={16} /> Copy</Button>
      <Button variant="secondary" onClick={() => onDownloadPDF(sessionId)}><FileDown size={16} /> PDF</Button>
      <Button variant="secondary" onClick={handleShare}><Share2 size={16} /> Share</Button>
    </div>
  );
};

export default ExportToolbar;
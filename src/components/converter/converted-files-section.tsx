/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Download, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { ConvertedFile } from '@/types/file';
import { ConvertedFileCard } from './converted-file-card';

interface ConvertedFilesSectionProps {
  files: ConvertedFile[];
  onDownload: (id: string) => void;
  onDownloadAll: () => void;
  className?: string;
}

export const ConvertedFilesSection: React.FC<ConvertedFilesSectionProps> = ({
  files,
  onDownload,
  onDownloadAll,
  className = ''
}) => {
  if (files.length === 0) return null;
  
  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-emerald-900/40 p-2 rounded-lg mr-3">
            <CheckCircle2 size={20} className="text-emerald-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">変換完了</h2>
        </div>
        
        {files.length > 1 && (
          <button
            onClick={onDownloadAll}
            className="neo-button-secondary text-sm"
          >
            <Download size={14} className="mr-1.5 inline-block" />
            すべてダウンロード
          </button>
        )}
      </div>
      
      <div className="preview-grid">
        {files.map((file) => (
          <ConvertedFileCard
            key={file.id}
            file={file}
            onDownload={() => onDownload(file.id)}
          />
        ))}
      </div>
    </div>
  );
};
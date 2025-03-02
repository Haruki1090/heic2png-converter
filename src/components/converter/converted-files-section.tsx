import React from 'react';
import { Download } from 'lucide-react';
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">変換完了 ({files.length}件)</h2>
        {files.length > 1 && (
          <button
            onClick={onDownloadAll}
            className="glass-button flex items-center text-sm"
          >
            <Download size={16} className="mr-1" />
            すべてダウンロード
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
import React from 'react';
import { Download, Image as ImageIcon } from 'lucide-react';
import { ConvertedFile } from '@/types/file';
import Image from 'next/image';

interface ConvertedFileCardProps {
  file: ConvertedFile;
  onDownload: () => void;
}

export const ConvertedFileCard: React.FC<ConvertedFileCardProps> = ({
  file,
  onDownload
}) => {
  // ファイルサイズの表示形式を調整
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  
  return (
    <div className="preview-card">
      <div className="preview-card-image">
        <Image 
          src={file.url} 
          alt={file.name}
          className="w-full h-full object-contain"
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3">
          <button
            onClick={onDownload}
            className="neo-button text-xs py-1.5 w-full"
          >
            <Download size={12} className="inline-block mr-1" />
            ダウンロード
          </button>
        </div>
      </div>
      
      {/* 情報 */}
      <div className="preview-card-content">
        <div className="flex items-center justify-between">
          <div className="flex items-center overflow-hidden mr-2">
            <ImageIcon size={14} className="text-slate-400 mr-2 flex-shrink-0" />
            <h3 className="text-sm font-medium text-white truncate" title={file.name}>
              {file.name.replace('.png', '')}
            </h3>
          </div>
          <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
            {formatFileSize(file.size)}
          </span>
        </div>
      </div>
    </div>
  );
};
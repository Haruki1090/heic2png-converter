/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Download, FileIcon, Image } from 'lucide-react';
import { ConvertedFile } from '@/types/file';

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
    <div className="glass rounded-lg overflow-hidden group">
      {/* プレビュー */}
      <div className="h-32 overflow-hidden relative bg-black/30">
        <img 
          src={file.url} 
          alt={file.name}
          className="w-full h-full object-contain"
        />
      </div>
      
      {/* 情報 */}
      <div className="p-3">
        <div className="flex items-center mb-1">
          <Image size={16} className="text-white/60 mr-2" />
          <h3 className="text-sm font-medium text-white truncate" title={file.name}>
            {file.name}
          </h3>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/60">
            {formatFileSize(file.size)}
          </span>
          
          <button
            onClick={onDownload}
            className="flex items-center text-xs text-white/90 hover:text-white bg-white/10 hover:bg-white/20 
                      rounded px-2 py-1 transition-colors duration-200"
          >
            <Download size={12} className="mr-1" />
            ダウンロード
          </button>
        </div>
      </div>
    </div>
  );
};
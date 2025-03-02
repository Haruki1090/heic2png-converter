/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { FileItem } from '@/types/file';
import { FileIcon, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

interface FileListProps {
  files: FileItem[];
  className?: string;
}

export const FileList: React.FC<FileListProps> = ({ files, className = '' }) => {
  if (files.length === 0) return null;
  
  const getStatusBadge = (status: FileItem['status'], error?: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="flex items-center text-xs text-slate-300 bg-slate-700/50 py-1 px-2 rounded-full">
            <Clock size={12} className="mr-1" />
            待機中
          </span>
        );
      case 'converting':
        return (
          <span className="flex items-center text-xs text-blue-200 bg-blue-800/50 py-1 px-2 rounded-full animate-pulse">
            <span className="mr-1 h-2 w-2 rounded-full bg-blue-300"></span>
            変換中
          </span>
        );
      case 'completed':
        return (
          <span className="flex items-center text-xs text-emerald-200 bg-emerald-800/50 py-1 px-2 rounded-full">
            <CheckCircle size={12} className="mr-1" />
            完了
          </span>
        );
      case 'error':
        return (
          <span 
            className="flex items-center text-xs text-red-200 bg-red-800/50 py-1 px-2 rounded-full" 
            title={error || 'エラーが発生しました'}
          >
            <AlertTriangle size={12} className="mr-1" />
            エラー
          </span>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="glass rounded-lg p-4 backdrop-blur-md">
      <h2 className="text-md font-semibold mb-3 text-white">選択されたファイル ({files.length}件):</h2>
      <div className="max-h-40 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
        <ul className="text-sm text-white divide-y divide-slate-700/50">
          {files.map((file) => (
            <li key={file.id} className="py-2 flex items-center justify-between">
              <div className="flex items-center flex-grow">
                <FileIcon size={16} className="text-slate-400 mr-2" />
                <span className="font-medium truncate">{file.name}</span>
              </div>
              <div className="ml-4">
                {getStatusBadge(file.status, file.error)}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
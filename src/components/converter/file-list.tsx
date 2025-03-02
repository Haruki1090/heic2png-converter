/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { FileItem } from '@/types/file';
import { FileIcon, CheckCircle2, AlertTriangle, Clock, Activity } from 'lucide-react';

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
          <div className="flex items-center gap-1.5 text-xs font-medium rounded-full bg-slate-800 border border-slate-700 py-1 px-2.5">
            <Clock size={12} className="text-slate-400" />
            <span className="text-slate-300">待機中</span>
          </div>
        );
      case 'converting':
        return (
          <div className="flex items-center gap-1.5 text-xs font-medium rounded-full bg-blue-900/30 border border-blue-800/40 py-1 px-2.5">
            <Activity size={12} className="text-blue-400 animate-pulse" />
            <span className="text-blue-300">変換中</span>
          </div>
        );
      case 'completed':
        return (
          <div className="flex items-center gap-1.5 text-xs font-medium rounded-full bg-emerald-900/30 border border-emerald-800/40 py-1 px-2.5">
            <CheckCircle2 size={12} className="text-emerald-400" />
            <span className="text-emerald-300">完了</span>
          </div>
        );
      case 'error':
        return (
          <div 
            className="flex items-center gap-1.5 text-xs font-medium rounded-full bg-red-900/30 border border-red-800/40 py-1 px-2.5" 
            title={error || 'エラーが発生しました'}
          >
            <AlertTriangle size={12} className="text-red-400" />
            <span className="text-red-300">エラー</span>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900/70">
      <div className="border-b border-slate-800 px-4 py-3 bg-slate-800/50">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white flex items-center">
            <FileIcon size={16} className="text-violet-400 mr-2" />
            選択されたファイル
          </h2>
          <div className="bg-slate-800 rounded-full text-xs py-0.5 px-2 text-slate-300">
            {files.length}件
          </div>
        </div>
      </div>

      <div className="max-h-48 overflow-y-auto custom-scrollbar">
        <ul className="divide-y divide-slate-800/70">
          {files.map((file) => (
            <li key={file.id} className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center flex-grow mr-4">
                <div className="bg-slate-800 p-2 rounded mr-3">
                  <FileIcon size={16} className="text-slate-400" />
                </div>
                <div className="overflow-hidden">
                  <p className="font-medium text-sm text-white truncate">{file.name}</p>
                  <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
                </div>
              </div>
              
              <div>
                {getStatusBadge(file.status, file.error)}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// ファイルサイズをフォーマットする関数
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};
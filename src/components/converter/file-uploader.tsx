import React, { useRef, useState } from 'react';
import { Upload, Info } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (files: FileList | null) => boolean | void;
  disabled?: boolean;
  className?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFileSelect,
  disabled = false,
  className = ''
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // ファイル選択イベントの処理
    const result = onFileSelect(e.target.files);
    // 選択がキャンセルされたり、エラーが発生した場合、入力をリセット
    if (result === false && fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (!disabled) {
      onFileSelect(e.dataTransfer.files);
    }
  };
  
  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className={`${className}`}>
      <div className="flex items-center mb-3">
        <Upload className="text-slate-300 mr-2" size={20} />
        <label className="text-white font-bold">
          HEICファイルを選択:
        </label>
      </div>
      
      <div
        className={`glass border-2 border-dashed rounded-lg p-6 text-center 
          ${isDragging ? 'border-slate-400 bg-slate-700/50' : 'border-slate-600/70'}
          ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-700/50'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="flex flex-col items-center justify-center">
          <Upload 
            size={32} 
            className={`mb-2 ${isDragging ? 'text-white' : 'text-slate-300'}`} 
          />
          <p className="mb-2 text-sm text-slate-200">
            ファイルをドラッグ＆ドロップするか<br />
            <span className="font-medium text-white">クリックしてファイルを選択</span>
          </p>
          <p className="text-xs text-slate-400">
            HEICファイル（複数可）
          </p>
        </div>
      </div>
      
      <input 
        ref={fileInputRef}
        type="file" 
        accept=".heic" 
        multiple 
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
      />
      
      <div className="flex items-center mt-2">
        <Info size={14} className="text-slate-400 mr-1" />
        <span className="text-xs text-slate-400">複数ファイルを同時に選択可能</span>
      </div>
    </div>
  );
};
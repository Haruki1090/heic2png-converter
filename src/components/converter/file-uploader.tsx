import React, { useRef, useState } from 'react';
import { Upload, FileImage } from 'lucide-react';

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
    const result = onFileSelect(e.target.files);
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
  
  return (
    <div className={className}>
      <div
        className={`relative overflow-hidden rounded-xl border-2 border-dashed 
          ${isDragging ? 'border-violet-500/70 bg-slate-800/80' : 'border-slate-700/70 bg-slate-800/40'} 
          ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-800/70 hover:border-slate-600'} 
          transition-all duration-200`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
        
        <div className="py-8 px-4 flex flex-col items-center justify-center relative z-10">
          <div className="p-4 rounded-full bg-slate-800/90 border border-slate-700 mb-4">
            <FileImage size={28} className={`${isDragging ? 'text-violet-400' : 'text-slate-400'}`} />
          </div>
          
          <div className="text-center">
            <p className="text-base font-medium text-white mb-1">
              ファイルをドラッグ＆ドロップ
            </p>
            <p className="text-sm text-slate-400 mb-4">
              または<span className="text-violet-400 font-medium ml-1">ファイルを選択</span>
            </p>
            <div className="inline-flex items-center text-xs text-slate-500 bg-slate-800/80 px-2 py-1 rounded-md">
              <Upload size={12} className="mr-1" />
              HEICファイル
            </div>
          </div>
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
    </div>
  );
};
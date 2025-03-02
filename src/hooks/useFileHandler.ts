// src/hooks/useFileHandler.ts

import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FileItem } from '@/types/file';

export const useFileHandler = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return false;
    
    const heicFiles = Array.from(selectedFiles).filter(
      file => file.name.toLowerCase().endsWith('.heic')
    );
    
    if (heicFiles.length === 0) {
      setError('HEICファイルのみアップロードできます。');
      return false;
    }
    
    const fileItems: FileItem[] = heicFiles.map(file => ({
      id: uuidv4(),
      file,
      name: file.name,
      size: file.size,
      type: file.type || 'image/heic',
      status: 'pending'
    }));
    
    setFiles(prev => [...prev, ...fileItems]);
    setError(null);
    return true;
  }, []);
  
  const clearFiles = useCallback(() => {
    setFiles([]);
    setError(null);
  }, []);
  
  const updateFileStatus = useCallback((id: string, status: FileItem['status'], error?: string) => {
    setFiles(prev => 
      prev.map(file => 
        file.id === id ? { ...file, status, error } : file
      )
    );
  }, []);
  
  return {
    files,
    error,
    handleFileSelect,
    clearFiles,
    updateFileStatus,
    setError
  };
};
// src/types/file.ts

export interface FileItem {
    id: string;
    file: File;
    name: string;
    size: number;
    type: string;
    status: 'pending' | 'converting' | 'completed' | 'error';
    error?: string;
  }
  
  export interface ConvertedFile {
    id: string;
    originalId: string;
    name: string;
    size: number;
    blob: Blob;
    url: string;
    originalName: string;
  }
  
  export interface ConverterState {
    isLibraryLoaded: boolean;
    isConverting: boolean;
    progress: number;
    error: string | null;
  }
// src/hooks/useHeicConverter.ts

import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FileItem, ConvertedFile } from '@/types/file';

// Define a type for heic2any function options
interface HeicConversionOptions {
  blob: Blob;
  toType?: string;
  quality?: number;
}

declare global {
  interface Window {
    heic2any: (options: HeicConversionOptions) => Promise<Blob | Blob[]>;
  }
}

export const useHeicConverter = (updateFileStatus: (id: string, status: FileItem['status'], error?: string) => void) => {
  const [isLibraryLoaded, setIsLibraryLoaded] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // ライブラリ読み込み
  useEffect(() => {
    const loadLibrary = async () => {
      try {
        if (!window.heic2any) {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/heic2any/0.0.4/heic2any.min.js';
          script.async = true;
          
          const loadPromise = new Promise<void>((resolve, reject) => {
            script.onload = () => {
              setIsLibraryLoaded(true);
              resolve();
            };
            script.onerror = () => reject(new Error('HEIC変換ライブラリの読み込みに失敗しました。'));
          });
          
          document.body.appendChild(script);
          await loadPromise;
        } else {
          setIsLibraryLoaded(true);
        }
      } catch (err) {
        console.error('ライブラリ読み込みエラー:', err);
        setError('変換ライブラリの読み込みに失敗しました。');
      }
    };
    
    loadLibrary();
    
    // クリーンアップ関数
    return () => {
      // 変換済みファイルのURLをrevoke
      convertedFiles.forEach(file => {
        URL.revokeObjectURL(file.url);
      });
    };
  }, [convertedFiles]);
  
  // 変換処理
  const convertFiles = useCallback(async (files: FileItem[]) => {
    if (files.length === 0 || !isLibraryLoaded) return;
    
    setIsConverting(true);
    setError(null);
    setProgress(0);
    
    try {
      const totalFiles = files.length;
      const newConvertedFiles: ConvertedFile[] = [];
      
      // 並列処理のための配列準備
      const conversionPromises = files.map(async (fileItem, index) => {
        try {
          updateFileStatus(fileItem.id, 'converting');
          
          // 最高品質で変換を実行
          const blobResult = await window.heic2any({
            blob: fileItem.file,
            toType: 'image/png',
            quality: 1.0 // 最高品質設定
          });
          
          // 単一のBlobと配列のどちらの場合も処理
          const singleBlob = Array.isArray(blobResult) ? blobResult[0] : blobResult;
          
          // ファイル名の作成（.heicを.pngに置き換え）
          const fileName = fileItem.name.replace(/\.heic$/i, '.png');
          
          const convertedFile: ConvertedFile = {
            id: uuidv4(),
            originalId: fileItem.id,
            name: fileName,
            size: singleBlob.size,
            blob: singleBlob,
            url: URL.createObjectURL(singleBlob),
            originalName: fileItem.name
          };
          
          // 進捗状況の更新
          setProgress(() => {
            const newProgress = Math.round(((index + 1) / totalFiles) * 100);
            return newProgress;
          });
          
          updateFileStatus(fileItem.id, 'completed');
          return convertedFile;
        } catch (fileError) {
          console.error(`ファイル ${fileItem.name} の変換に失敗しました:`, fileError);
          const errorMessage = fileError instanceof Error ? fileError.message : '不明なエラー';
          updateFileStatus(fileItem.id, 'error', errorMessage);
          return null;
        }
      });
      
      // すべての変換を同時処理
      const results = await Promise.all(conversionPromises);
      
      // エラーがなかったファイルだけを追加
      for (const result of results) {
        if (result) {
          newConvertedFiles.push(result);
        }
      }
      
      setConvertedFiles(prev => [...prev, ...newConvertedFiles]);
      setProgress(100);
    } catch (err) {
      console.error('変換エラー:', err);
      setError('変換処理中にエラーが発生しました。ブラウザが最新版であることを確認してください。');
    } finally {
      setIsConverting(false);
    }
  }, [isLibraryLoaded, updateFileStatus]);
  
  // ファイルダウンロード
  const downloadFile = useCallback((fileId: string) => {
    const file = convertedFiles.find(f => f.id === fileId);
    if (!file) return;
    
    const a = document.createElement('a');
    a.href = file.url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [convertedFiles]);
  
  // すべてのファイルをダウンロード
  const downloadAllFiles = useCallback(() => {
    convertedFiles.forEach(file => {
      const a = document.createElement('a');
      a.href = file.url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }, [convertedFiles]);
  
  // コンバーターの状態をリセット
  const resetConverter = useCallback(() => {
    // 以前のURLをクリーンアップ
    convertedFiles.forEach(file => {
      URL.revokeObjectURL(file.url);
    });
    
    setConvertedFiles([]);
    setProgress(0);
    setError(null);
  }, [convertedFiles]);
  
  return {
    isLibraryLoaded,
    isConverting,
    convertedFiles,
    progress,
    error,
    convertFiles,
    downloadFile,
    downloadAllFiles,
    resetConverter,
    setError
  };
};
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback, useEffect, useRef } from 'react';
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
  
  // Workerの参照を保持するための配列
  const activeWorkers = useRef<Worker[]>([]);
  // タイムアウトの参照を保持する
  const timeoutRefs = useRef<{[key: string]: NodeJS.Timeout}>({});
  
  // ライブラリ読み込み
  useEffect(() => {
    const loadLibrary = async () => {
      try {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/heic2any/0.0.4/heic2any.min.js';
        script.async = true;
        
        const loadPromise = new Promise<void>((resolve, reject) => {
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('HEIC変換ライブラリの読み込みに失敗しました。'));
        });
        
        document.body.appendChild(script);
        await loadPromise;
        
        // ライブラリが読み込まれたことを確認
        setIsLibraryLoaded(true);
      } catch (err) {
        console.error('ライブラリ読み込みエラー:', err);
        setError('変換ライブラリの読み込みに失敗しました。ブラウザがサポートされていることを確認してください。');
      }
    };
    
    loadLibrary();
    
    // クリーンアップ関数
    return () => {
      // すべてのWorkerを終了
      activeWorkers.current.forEach(worker => worker.terminate());
      activeWorkers.current = [];
      
      // すべてのタイムアウトをクリア
      Object.values(timeoutRefs.current).forEach(timeoutRef => clearTimeout(timeoutRef));
      timeoutRefs.current = {};
      
      // 変換済みファイルのURLをrevoke
      convertedFiles.forEach(file => {
        URL.revokeObjectURL(file.url);
      });
    };
  }, [convertedFiles]);
  
  // 処理のタイムアウト設定
  const setupConversionTimeout = useCallback((fileId: string) => {
    // 2分のタイムアウトを設定
    const timeoutRef = setTimeout(() => {
      updateFileStatus(fileId, 'error', '変換処理がタイムアウトしました。ファイルが大きすぎる可能性があります。');
      setError(`ファイルの変換処理がタイムアウトしました。ブラウザの再起動や、ファイルの分割をお試しください。`);
    }, 120000); // 2分 = 120000ms
    
    timeoutRefs.current[fileId] = timeoutRef;
  }, [updateFileStatus]);
  
  // タイムアウトのクリア
  const clearConversionTimeout = useCallback((fileId: string) => {
    if (timeoutRefs.current[fileId]) {
      clearTimeout(timeoutRefs.current[fileId]);
      delete timeoutRefs.current[fileId];
    }
  }, []);
  
  // 変換処理（Web Workerを使用）
  const convertFiles = useCallback(async (files: FileItem[]) => {
    if (files.length === 0) return;
    
    setIsConverting(true);
    setError(null);
    setProgress(0);
    
    const totalFiles = files.length;
    let completedCount = 0;
    const newConvertedFiles: ConvertedFile[] = [];
    
    // 各ファイルに対してWorkerを作成
    files.forEach(fileItem => {
      try {
        updateFileStatus(fileItem.id, 'converting');
        
        // WebWorkerの生成
        const worker = new Worker(new URL('../workers/heicConverter.worker.js', import.meta.url));
        activeWorkers.current.push(worker);
        
        // タイムアウト設定
        setupConversionTimeout(fileItem.id);
        
        // Workerからのメッセージを処理
        worker.onmessage = (e) => {
          const { type, id, result, error: workerError, progress: fileProgress } = e.data;
          
          if (id !== fileItem.id) return;
          
          switch (type) {
            case 'progress':
              // 進捗状況の更新処理
              break;
              
            case 'complete':
              // 変換完了の処理
              clearConversionTimeout(id);
              
              // ファイル名の作成（.heicを.pngに置き換え）
              const fileName = fileItem.name.replace(/\.heic$/i, '.png');
              
              const convertedFile: ConvertedFile = {
                id: uuidv4(),
                originalId: id,
                name: fileName,
                size: result.size,
                blob: result,
                url: URL.createObjectURL(result),
                originalName: fileItem.name
              };
              
              newConvertedFiles.push(convertedFile);
              updateFileStatus(id, 'completed');
              
              // 進捗状況の更新
              completedCount++;
              const newProgress = Math.round((completedCount / totalFiles) * 100);
              setProgress(newProgress);
              
              // すべてのファイルの変換が完了した場合
              if (completedCount === totalFiles) {
                setConvertedFiles(prev => [...prev, ...newConvertedFiles]);
                setIsConverting(false);
                
                // すべてのWorkerを終了
                activeWorkers.current.forEach(w => w.terminate());
                activeWorkers.current = [];
              }
              
              // Workerを終了
              worker.terminate();
              activeWorkers.current = activeWorkers.current.filter(w => w !== worker);
              break;
              
            case 'error':
              // エラー処理
              clearConversionTimeout(id);
              console.error(`ファイル ${fileItem.name} の変換エラー:`, workerError);
              updateFileStatus(id, 'error', workerError);
              
              // 進捗状況の更新
              completedCount++;
              const errorProgress = Math.round((completedCount / totalFiles) * 100);
              setProgress(errorProgress);
              
              if (completedCount === totalFiles) {
                setIsConverting(false);
                if (newConvertedFiles.length > 0) {
                  setConvertedFiles(prev => [...prev, ...newConvertedFiles]);
                }
              }
              
              // Workerを終了
              worker.terminate();
              activeWorkers.current = activeWorkers.current.filter(w => w !== worker);
              break;
          }
        };
        
        // エラー処理
        worker.onerror = (err) => {
          clearConversionTimeout(fileItem.id);
          console.error(`Worker error for ${fileItem.name}:`, err);
          updateFileStatus(fileItem.id, 'error', 'Worker処理エラー: ' + (err.message || '不明なエラー'));
          
          completedCount++;
          setProgress(Math.round((completedCount / totalFiles) * 100));
          
          if (completedCount === totalFiles) {
            setIsConverting(false);
            if (newConvertedFiles.length > 0) {
              setConvertedFiles(prev => [...prev, ...newConvertedFiles]);
            }
          }
          
          worker.terminate();
          activeWorkers.current = activeWorkers.current.filter(w => w !== worker);
        };
        
        // 処理開始
        worker.postMessage({
          file: fileItem.file,
          id: fileItem.id
        });
      } catch (err) {
        console.error(`ファイル ${fileItem.name} の変換準備エラー:`, err);
        const errorMessage = err instanceof Error ? err.message : '不明なエラー';
        updateFileStatus(fileItem.id, 'error', errorMessage);
        
        completedCount++;
        setProgress(Math.round((completedCount / totalFiles) * 100));
        
        if (completedCount === totalFiles) {
          setIsConverting(false);
          if (newConvertedFiles.length > 0) {
            setConvertedFiles(prev => [...prev, ...newConvertedFiles]);
          }
        }
      }
    });
  }, [updateFileStatus, setupConversionTimeout, clearConversionTimeout]);
  
  // 以下のコードは変更なし
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
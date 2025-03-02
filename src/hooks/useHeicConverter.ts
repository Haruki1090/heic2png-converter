/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FileItem, ConvertedFile } from '@/types/file';

interface WorkerMessage {
  type: 'init_complete' | 'init_error' | 'progress' | 'complete' | 'error';
  id?: string;
  success?: boolean;
  error?: string;
  result?: Blob;
}

export const useHeicConverter = (updateFileStatus: (id: string, status: FileItem['status'], error?: string) => void) => {
  const [isLibraryLoaded, setIsLibraryLoaded] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // Worker参照
  const workerRef = useRef<Worker | null>(null);
  // Worker初期化状態
  const [workerInitialized, setWorkerInitialized] = useState(false);
  // タイムアウトの参照を保持する
  const timeoutRefs = useRef<{[key: string]: NodeJS.Timeout}>({});
  // 処理待ちキュー
  const conversionQueue = useRef<{fileItem: FileItem, onComplete: () => void}[]>([]);
  // 変換中のファイルID
  const activeFileId = useRef<string | null>(null);
  
  // Workerの初期化
  useEffect(() => {
    const initializeWorker = () => {
      try {
        // 既存のWorkerを破棄
        if (workerRef.current) {
          workerRef.current.terminate();
        }
        
        // 新しいWorkerを作成
        const worker = new Worker(new URL('../workers/heicConverter.worker.js', import.meta.url));
        workerRef.current = worker;
        
        // Workerからのメッセージ処理
        worker.onmessage = (e) => {
          const { type, success, error: workerError } = e.data;
          
          if (type === 'init_complete' && success) {
            console.log('Worker初期化完了');
            setWorkerInitialized(true);
            setIsLibraryLoaded(true);
            processNextInQueue();
          } else if (type === 'init_error') {
            console.error('Worker初期化エラー:', workerError);
            setError(`変換エンジンの初期化に失敗しました: ${workerError}`);
            setWorkerInitialized(false);
          } else if (activeFileId.current && ['progress', 'complete', 'error'].includes(type)) {
            handleFileConversionMessage(e.data);
          }
        };
        
        // Worker初期化エラー処理
        worker.onerror = (err) => {
          console.error('Worker初期化エラー:', err);
          setError('変換エンジンの初期化に失敗しました。ブラウザの互換性をご確認ください。');
          setWorkerInitialized(false);
        };
        
        // Worker初期化開始
        worker.postMessage({ type: 'init' });
      } catch (err) {
        console.error('Worker初期化例外:', err);
        setError('WebWorkerの作成に失敗しました。ブラウザの互換性をご確認ください。');
      }
    };
    
    // Worker初期化処理を実行
    initializeWorker();
    
    // クリーンアップ
    return () => {
      // Workerを破棄
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
      
      // タイムアウトをクリア
      Object.values(timeoutRefs.current).forEach(clearTimeout);
      timeoutRefs.current = {};
      
      // URLをクリーンアップ
      convertedFiles.forEach(file => {
        URL.revokeObjectURL(file.url);
      });
    };
  }, [convertedFiles]);
  
  // 待ちキューから次の変換処理を実行
  const processNextInQueue = useCallback(() => {
    if (!workerInitialized || !workerRef.current || activeFileId.current || conversionQueue.current.length === 0) {
      return;
    }
    
    const { fileItem, onComplete } = conversionQueue.current.shift()!;
    activeFileId.current = fileItem.id;
    
    // タイムアウト設定
    timeoutRefs.current[fileItem.id] = setTimeout(() => {
      updateFileStatus(fileItem.id, 'error', '変換処理がタイムアウトしました。ファイルが大きすぎる可能性があります。');
      setError('変換処理がタイムアウトしました。ブラウザの再起動やファイルの圧縮をお試しください。');
      activeFileId.current = null;
      processNextInQueue();
    }, 180000); // 3分
    
    // 変換開始
  // Workerからのファイル変換メッセージを処理
  const handleFileConversionMessage = useCallback((data: any) => {
    const { type, id, result, error: conversionError } = data;
    
    // タイムアウトをクリア
    if (timeoutRefs.current[id]) {
      clearTimeout(timeoutRefs.current[id]);
      delete timeoutRefs.current[id];
    }
    
    switch (type) {
      case 'complete':
        {
          // ファイル名の作成（.heicを.pngに置き換え）
          const fileItem = conversionQueue.current.find(item => item.fileItem.id === id)?.fileItem;
          if (!fileItem) break;
          
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
          
          setConvertedFiles(prev => [...prev, convertedFile]);
          updateFileStatus(id, 'completed');
          
          // 進捗更新
          setProgress(prev => {
            const increment = 100 / conversionQueue.current.length;
            return Math.min(100, prev + increment);
          });
        }
        break;
        
      case 'error':
        console.error(`変換エラー (${id}):`, conversionError);
        updateFileStatus(id, 'error', conversionError);
        break;
    }
    
    // アクティブなファイルIDをクリア
    activeFileId.current = null;
    
    // 次の処理を実行
    processNextInQueue();
  }, [updateFileStatus, processNextInQueue]);
  
  // 変換処理
  const convertFiles = useCallback((files: FileItem[]) => {
    if (files.length === 0) return;
    
    if (!workerInitialized || !workerRef.current) {
      setError('変換エンジンが初期化されていません。ページを再読み込みしてください。');
      return;
    }
    
    setIsConverting(true);
    setError(null);
    setProgress(0);
    
    // 変換キューに追加
    conversionQueue.current = files.map(fileItem => ({
      fileItem,
      onComplete: () => {}
    }));
    
    // 変換処理開始
    processNextInQueue();
  }, [workerInitialized, processNextInQueue]);
  
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
}


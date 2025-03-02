// Workerの初期化処理
let isInitialized = false;
let initError = null;

// WebWorkerでHEICの変換処理を実行する
self.onmessage = async function(e) {
  const { type, file, id } = e.data;
  
  // 初期化メッセージの場合
  if (type === 'init') {
    try {
      // ローカルのファイルを読み込む
      self.importScripts('/js/heic2any.min.js');
      isInitialized = true;
      self.postMessage({ type: 'init_complete', success: true });
    } catch (err) {
      console.error('Worker初期化エラー:', err);
      initError = err.message || '初期化に失敗しました';
      self.postMessage({ 
        type: 'init_error', 
        error: initError
      });
    }
    return;
  }
  
  // 変換処理
  if (type === 'convert') {
    // 初期化チェック
    if (!isInitialized) {
      self.postMessage({
        type: 'error',
        id,
        error: initError || 'Workerが初期化されていません'
      });
      return;
    }
    
    try {
      // 処理開始を通知
      self.postMessage({ type: 'progress', id, status: 'start', progress: 0 });
      
      // heic2anyによる変換処理
      const result = await self.heic2any({
        blob: file,
        toType: 'image/png',
        quality: 1.0
      });
      
      // 処理完了を通知
      self.postMessage({ 
        type: 'complete', 
        id, 
        result: Array.isArray(result) ? result[0] : result 
      });
    } catch (error) {
      console.error('変換エラー:', error);
      self.postMessage({ 
        type: 'error', 
        id, 
        error: error.message || '変換処理中にエラーが発生しました'
      });
    }
  }
};
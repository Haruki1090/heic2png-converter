/* eslint-disable @typescript-eslint/no-unused-vars */
// WebWorkerでHEICの変換処理を実行する
self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/heic2any/0.0.4/heic2any.min.js');

self.onmessage = async function(e) {
  const { file, id, chunkSize = 10 * 1024 * 1024 } = e.data;
  
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
    console.error('Worker error:', error);
    self.postMessage({ 
      type: 'error', 
      id, 
      error: error.message || '変換処理中にエラーが発生しました'
    });
  }
};
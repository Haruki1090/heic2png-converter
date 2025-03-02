/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React from 'react';
import { FileIcon, Camera, Zap, Shield, FileCheck } from 'lucide-react';
import { FileUploader } from '@/components/converter/file-uploader';
import { FileList } from '@/components/converter/file-list';
import { ConvertedFilesSection } from '@/components/converter/converted-files-section';
import { useFileHandler } from '@/hooks/useFileHandler';
import { useHeicConverter } from '@/hooks/useHeicConverter';

export default function Home() {
  const { files, error: fileError, handleFileSelect, updateFileStatus } = useFileHandler();
  const { 
    isLibraryLoaded,
    isConverting,
    convertedFiles,
    progress,
    error: converterError,
    convertFiles,
    downloadFile,
    downloadAllFiles
  } = useHeicConverter(updateFileStatus);
  
  const handleConvert = () => {
    const filesToConvert = files.filter(f => f.status === 'pending' || f.status === 'error');
    convertFiles(filesToConvert);
  };
  
  const error = fileError || converterError;
  
  return (
    <main className="min-h-screen py-10 px-4 relative">
      {/* アクセントカラーのヒント - 視覚的効果を追加 */}
      <div className="accent-hint top-20 left-[10%]"></div>
      <div className="accent-hint bottom-20 right-[10%]"></div>
      
      <div className="max-w-4xl mx-auto">
        {/* ヘッダーセクション */}
        <div className="neo-card mb-8">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl mb-4">
              <Camera size={32} className="text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
              HEIC to PNG Converter
            </h1>
            <p className="text-slate-400 mt-2 max-w-md">
              高速・安全にHEIC形式の画像をPNG形式に変換します。すべての処理はブラウザ内で完結します。
            </p>
          </div>
          
          {/* 特徴セクション - カードのレイアウト改善 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
            <div className="neo-glass rounded-lg p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-violet-600/10 to-transparent"></div>
              <Zap className="text-amber-400 mb-3" size={22} />
              <h3 className="text-lg font-semibold">超高速変換</h3>
              <p className="text-sm text-slate-400 mt-1">WebAssemblyによる最適化処理</p>
            </div>
            
            <div className="neo-glass rounded-lg p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-emerald-600/10 to-transparent"></div>
              <Shield className="text-emerald-400 mb-3" size={22} />
              <h3 className="text-lg font-semibold">100%安全</h3>
              <p className="text-sm text-slate-400 mt-1">完全ローカル処理でプライバシーを保護</p>
            </div>
            
            <div className="neo-glass rounded-lg p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-sky-600/10 to-transparent"></div>
              <FileCheck className="text-sky-400 mb-3" size={22} />
              <h3 className="text-lg font-semibold">高品質出力</h3>
              <p className="text-sm text-slate-400 mt-1">画質を維持したまま変換</p>
            </div>
          </div>
        </div>
        
        {/* 変換セクション - 内部コンポーネントの配置改善 */}
        <div className="neo-card mb-8">
          <h2 className="text-xl font-semibold mb-5 flex items-center">
            <FileIcon className="text-violet-400 mr-2" size={18} />
            ファイル変換
          </h2>
          
          {/* ファイルアップローダー */}
          <div className="mb-6">
            <FileUploader 
              onFileSelect={handleFileSelect} 
              disabled={isConverting}
            />
          </div>
          
          {/* エラーメッセージ */}
          {error && (
            <div className="rounded-lg bg-red-900/30 border border-red-800/50 p-4 mb-6">
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}
          
          {/* 選択されたファイルのリスト */}
          {files.length > 0 && (
            <div className="mb-6">
              <FileList files={files} />
            </div>
          )}
          
          {/* 変換ボタン */}
          {files.length > 0 && (
            <div className="flex justify-center">
              <button
                className="neo-button"
                onClick={handleConvert}
                disabled={files.length === 0 || isConverting}
              >
                {isConverting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    変換中 ({progress}%)
                  </div>
                ) : 'PNGに変換'}
              </button>
            </div>
          )}
        </div>
        
        {/* 変換済みファイルセクション - ビジュアル改善 */}
        {convertedFiles.length > 0 && (
          <div className="neo-card">
            <ConvertedFilesSection 
              files={convertedFiles}
              onDownload={downloadFile}
              onDownloadAll={downloadAllFiles}
            />
          </div>
        )}
        
        {/* フッター - 改良 */}
        <footer className="mt-10 text-center">
          <div className="neo-glass rounded-full py-2 px-5 inline-flex items-center">
            <p className="text-sm text-slate-400">
              <span className="text-violet-400">HEIC Converter</span> • 高速で安全な画像変換
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
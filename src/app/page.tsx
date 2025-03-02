/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React from 'react';
import { Camera, Zap, Shield } from 'lucide-react';
import { SecurityBadge } from '@/components/layout/security-badge';
import { FeatureBadge } from '@/components/layout/feature-badge';
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
    // 未変換または変換エラーのファイルのみを処理対象とする
    const filesToConvert = files.filter(f => f.status === 'pending' || f.status === 'error');
    convertFiles(filesToConvert);
  };
  
  // エラーメッセージを統合（ファイル選択エラーまたは変換エラー）
  const error = fileError || converterError;
  
  return (
    <main className="min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー - animate-float クラスを削除 */}
        <div className="glass-card mb-10 group">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Camera size={36} className="text-slate-300" />
            <h1 className="text-4xl font-bold text-white">HEIC to PNG Converter</h1>
          </div>
          
          {/* 特徴バッジ */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="glass p-4 rounded-lg text-center">
              <Zap size={24} className="mx-auto mb-2 text-amber-300" />
              <h3 className="text-lg font-semibold">超高速変換</h3>
              <p className="text-sm text-slate-300">並列処理技術搭載</p>
            </div>
            
            <div className="glass p-4 rounded-lg text-center">
              <Shield size={24} className="mx-auto mb-2 text-emerald-300" />
              <h3 className="text-lg font-semibold">100%安全</h3>
              <p className="text-sm text-slate-300">クラウド不要・完全ローカル処理</p>
            </div>
            
            <div className="glass p-4 rounded-lg text-center">
              <Camera size={24} className="mx-auto mb-2 text-sky-300" />
              <h3 className="text-lg font-semibold">高品質出力</h3>
              <p className="text-sm text-slate-300">ロスレス変換</p>
            </div>
          </div>
          
          {/* ファイルアップローダー */}
          <div className="mb-6">
            <FileUploader 
              onFileSelect={handleFileSelect} 
              disabled={isConverting}
            />
          </div>
          
          {/* 選択されたファイルのリスト */}
          <FileList 
            files={files} 
            className="mb-6"
          />
          
          {/* エラーメッセージ */}
          {error && (
            <div className="bg-red-500/30 backdrop-blur-sm text-white p-4 rounded-lg mb-6">
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          {/* 変換ボタン */}
          {files.length > 0 && (
            <div className="flex justify-center">
              <button
                className={`glass-button glow group ${files.length === 0 || isConverting ? 'opacity-60 cursor-not-allowed' : 'hover:bg-slate-700/80'}`}
                onClick={handleConvert}
                disabled={files.length === 0 || isConverting}
              >
                <span className="relative z-10 flex items-center justify-center text-lg font-medium">
                  {isConverting ? 
                    <span className="flex items-center">
                      <span className="mr-2 h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin"></span>
                      変換中 ({progress}%)
                    </span> 
                    : 'PNGに変換'
                  }
                </span>
              </button>
            </div>
          )}
        </div>
        
        {/* 変換済みファイルセクション */}
        {convertedFiles.length > 0 && (
          <div className="glass-card group">
            <ConvertedFilesSection 
              files={convertedFiles}
              onDownload={downloadFile}
              onDownloadAll={downloadAllFiles}
            />
          </div>
        )}
        
        {/* フッター */}
        <footer className="mt-10 text-center text-slate-400 text-sm">
          <p>高速で安全なHEIC to PNG変換 • ブラウザ内処理でプライバシー保護</p>
          <p className="mt-1">© 2025 HEIC Converter</p>
        </footer>
      </div>
      
      {/* 装飾要素 - ダークテーマに合わせて色調整 */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-[-1]">
        <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-indigo-900 rounded-full mix-blend-multiply filter blur-[80px] opacity-30"></div>
        <div className="absolute top-[40%] right-[15%] w-80 h-80 bg-slate-800 rounded-full mix-blend-multiply filter blur-[80px] opacity-30"></div>
        <div className="absolute bottom-[10%] left-[35%] w-72 h-72 bg-slate-900 rounded-full mix-blend-multiply filter blur-[80px] opacity-30"></div>
      </div>
    </main>
  );
}
'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, Zap, Download, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto max-w-3xl bg-white rounded-xl shadow-lg p-6">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="mr-2" size={16} />
            ホームに戻る
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-6">HEIC to PNG Converter Pro の使い方</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-3 flex items-center">
              <Upload className="mr-2 text-blue-600" size={20} />
              ステップ1: ファイルを選択
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="mb-2">変換したいHEICファイルを選択します。以下の方法があります：</p>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>「ファイルを選択」ボタンをクリックしてファイルを選択</li>
                <li>ファイルをドラッグ＆ドロップエリアに直接ドロップ</li>
              </ul>
              <p className="text-sm text-gray-600">
                <strong>ヒント：</strong> 複数のファイルを一度に選択できます。Ctrlキー（Macの場合はCommandキー）を押しながら、複数のファイルを選択してください。
              </p>
            </div>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-3 flex items-center">
              <Zap className="mr-2 text-green-600" size={20} />
              ステップ2: 変換を実行
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="mb-2">ファイルを選択したら、「最高品質でPNGに変換」ボタンをクリックします。</p>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>変換中は進捗バーで状況を確認できます</li>
                <li>各ファイルの状態は個別に表示されます</li>
                <li>変換処理はすべてブラウザ内で行われます</li>
              </ul>
              <p className="text-sm text-gray-600">
                <strong>注意：</strong> 大きなファイルや多数のファイルを変換する場合は、処理に時間がかかることがあります。ブラウザを閉じたり、ページを更新したりしないでください。
              </p>
            </div>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-3 flex items-center">
              <Download className="mr-2 text-blue-600" size={20} />
              ステップ3: 変換済みファイルのダウンロード
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="mb-2">変換が完了すると、変換済みファイルのリストが表示されます。</p>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>個別ファイルの「ダウンロード」ボタンをクリックして保存</li>
                <li>「すべてダウンロード」ボタンですべてのファイルを保存</li>
                <li>ファイル名は元のファイル名を保持し、拡張子が.pngに変更されます</li>
              </ul>
              <p className="text-sm text-gray-600">
                <strong>ヒント：</strong> 変換済みファイルはブラウザのメモリに一時的に保存されています。ページを更新したり閉じたりすると、ダウンロードしていないファイルは失われますのでご注意ください。
              </p>
            </div>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-3 flex items-center">
              <Shield className="mr-2 text-purple-600" size={20} />
              プライバシーと安全性
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="mb-2">このツールは、ユーザーのプライバシーと安全性を最優先しています。</p>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>すべての処理はユーザーのブラウザ内で完結します</li>
                <li>画像ファイルがサーバーにアップロードされることはありません</li>
                <li>オフライン環境でも動作します（初回読み込み後）</li>
                <li>個人情報は収集していません</li>
              </ul>
              <p className="text-sm text-gray-600">
                詳細については、<Link href="/privacy" className="text-blue-600 hover:underline">プライバシーポリシー</Link>をご確認ください。
              </p>
            </div>
          </section>
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/" passHref>
            <Button variant="primary" size="lg">
              コンバーターに戻る
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
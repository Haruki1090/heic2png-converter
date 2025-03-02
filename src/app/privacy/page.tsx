'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto max-w-3xl bg-white rounded-xl shadow-lg p-6">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="mr-2" size={16} />
            ホームに戻る
          </Link>
        </div>
        
        <div className="flex items-center mb-6">
          <Shield className="text-purple-600 mr-3" size={24} />
          <h1 className="text-3xl font-bold text-gray-800">プライバシーポリシー</h1>
        </div>
        
        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. HEIC to PNG Converter Pro について</h2>
            <p>
              HEIC to PNG Converter Pro（以下「本ツール」）は、HEICフォーマットの画像ファイルをPNGフォーマットに変換するためのオンラインツールです。本ツールの使用にあたり、ユーザーのプライバシーを最大限に尊重し、個人情報の保護に努めています。
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">2. データ処理方法</h2>
            <p className="mb-3">
              本ツールでは、以下の方法でデータを処理しています：
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>クライアントサイド処理：</strong> すべての画像処理はユーザーのブラウザ内（クライアントサイド）で行われます。アップロードされた画像はサーバーに送信されることはなく、すべての処理はユーザーのデバイス上で完結します。
              </li>
              <li>
                <strong>一時的なデータ保存：</strong> 変換された画像は、ダウンロードのためにブラウザのメモリ内に一時的に保存されますが、ブラウザを閉じるか、ページを更新するとすべて消去されます。
              </li>
              <li>
                <strong>自動ダウンロード：</strong> ユーザーが「ダウンロード」ボタンをクリックすると、変換された画像は直接ユーザーのデバイスにダウンロードされます。
              </li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">3. 収集する情報</h2>
            <p className="mb-3">
              本ツールは、以下の情報を収集します：
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>利用統計情報：</strong> ページビュー数、訪問者数、使用されているブラウザや端末の種類など、ウェブサイトの使用状況に関する匿名の統計情報を収集することがあります。これらの情報は、サービスの改善のために使用されます。
              </li>
              <li>
                <strong>エラーログ：</strong> ツールの機能改善のため、発生したエラーに関する技術的な情報を収集することがあります。これらの情報には個人を特定できる情報は含まれません。
              </li>
            </ul>
            <p className="mt-3 font-semibold">
              画像ファイルや画像内のメタデータなど、ユーザーのコンテンツに関する情報は一切収集・保存しません。
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">4. Cookieの使用</h2>
            <p>
              本ツールでは、機能を提供するために必要最小限のCookieを使用する場合があります。これらのCookieには、ユーザーの設定や好みを記憶するための情報が含まれる場合がありますが、個人を特定できる情報は含まれません。
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">5. 第三者へのデータ提供</h2>
            <p>
              本ツールは、ユーザーの個人情報や画像データを第三者に提供することはありません。ただし、法的要請があった場合や、ユーザーの同意がある場合を除きます。
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">6. セキュリティ対策</h2>
            <p>
              本ツールは、ユーザーのプライバシーを保護するために、最新のセキュリティ対策を講じています。ただし、インターネットを通じたデータ送信は常に100%安全であるとは限りません。本ツールは、ユーザーのデータを最大限に保護するよう努めていますが、絶対的な安全性を保証するものではありません。
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">7. プライバシーポリシーの変更</h2>
            <p>
              本プライバシーポリシーは、法令の変更や本ツールの機能追加・変更などに応じて、予告なく変更される場合があります。変更後のプライバシーポリシーは、本ページに掲載された時点で効力を生じるものとします。
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">8. お問い合わせ</h2>
            <p>
              本プライバシーポリシーに関するご質問やご意見がある場合は、以下のメールアドレスまでお問い合わせください。
            </p>
            <p className="mt-2 font-medium">
              メールアドレス: contact@example.com
            </p>
          </section>
          
          <p className="text-sm text-gray-500 mt-6">
            最終更新日: 2023年12月1日
          </p>
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
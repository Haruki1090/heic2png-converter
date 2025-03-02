import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HEIC to PNG Converter Pro - 最高品質の画像変換ツール',
  description: '最高品質・最速・安全なHEIC to PNG変換ツール。すべての処理はブラウザ内で行われるため、プライバシーが保護されます。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        {/* CSPを更新 - script-srcに'self'を追加 */}
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline'; worker-src 'self' blob:; img-src 'self' blob: data:; connect-src 'self' blob:;"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
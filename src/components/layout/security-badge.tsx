// src/components/layout/security-badge.tsx

import React from 'react';
import { Shield } from 'lucide-react';

interface SecurityBadgeProps {
  className?: string;
}

export const SecurityBadge: React.FC<SecurityBadgeProps> = ({ className = '' }) => {
  return (
    <div className={`p-4 bg-purple-50 rounded-lg border border-purple-100 ${className}`}>
      <div className="flex items-start">
        <Shield className="text-purple-600 mr-3 mt-0.5" size={20} />
        <div>
          <h3 className="font-semibold text-purple-800">プライバシーと安全性</h3>
          <p className="text-sm text-gray-700 mt-1">
            • すべての処理は<span className="font-semibold">お使いのブラウザ内</span>で完結します<br />
            • ファイルがサーバーに送信されることは<span className="font-semibold">一切ありません</span><br />
            • インターネット接続がなくても動作します<br />
            • データの安全性が最優先されます
          </p>
        </div>
      </div>
    </div>
  );
};
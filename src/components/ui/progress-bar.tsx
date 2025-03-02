// src/components/ui/progress-bar.tsx

import React from 'react';

interface ProgressBarProps {
  progress: number;
  height?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 'h-2.5',
  className = ''
}) => {
  // 進捗値を0-100の範囲に制限
  const safeProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <div className={`w-full bg-gray-200 rounded-full ${height} ${className}`}>
      <div 
        className={`bg-blue-600 ${height} rounded-full transition-all duration-300 ease-in-out`} 
        style={{ width: `${safeProgress}%` }}
      />
      {progress > 0 && (
        <div className="text-xs text-gray-500 text-right mt-1">
          {Math.round(safeProgress)}%
        </div>
      )}
    </div>
  );
};
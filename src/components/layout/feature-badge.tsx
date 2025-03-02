// src/components/layout/feature-badge.tsx

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureBadgeProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  className?: string;
}

export const FeatureBadge: React.FC<FeatureBadgeProps> = ({
  icon: Icon,
  title,
  description,
  color,
  className = ''
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
  } as Record<string, string>;
  
  return (
    <div className={`flex flex-col items-center p-3 rounded-lg ${colorClasses[color] || colorClasses.blue} ${className}`}>
      <Icon className="mb-2" size={24} />
      <span className="text-sm font-semibold">{title}</span>
      <span className="text-xs text-gray-600">{description}</span>
    </div>
  );
};
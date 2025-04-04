
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  description, 
  trend,
  className 
}) => {
  return (
    <Card className={cn("futuristic-card overflow-hidden", className)}>
      <div className="h-1 bg-gradient-button w-full"></div>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-futuristic-text-muted font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-white">{value}</h3>
            
            {description && (
              <p className="text-xs text-futuristic-text-muted mt-1">{description}</p>
            )}
            
            {trend && (
              <div className="flex items-center mt-2">
                <span className={cn(
                  "text-xs font-medium",
                  trend.isPositive ? "text-green-400" : "text-red-400"
                )}>
                  {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                </span>
                <span className="text-xs text-futuristic-text-muted ml-1">vs. mes anterior</span>
              </div>
            )}
          </div>
          
          <div className="p-3 rounded-full bg-futuristic-accent/10 text-futuristic-accent">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;

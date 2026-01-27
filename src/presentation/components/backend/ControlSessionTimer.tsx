'use client';

import { useControlThemeStore } from '@/src/presentation/stores/useControlThemeStore';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useEffect, useState } from 'react';

dayjs.extend(duration);

interface ControlSessionTimerProps { 
  startTime: string; 
  estimatedEndTime?: string;
}

export function ControlSessionTimer({ 
  startTime, 
  estimatedEndTime,
}: ControlSessionTimerProps) {
  const [now, setNow] = useState(dayjs());
  
  // Theme Store
  const themeStore = useControlThemeStore();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setNow(dayjs());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const theme = mounted && themeStore.isInitialized ? themeStore.getThemeConfig() : null;
  const themeId = theme?.id || 'neutral';
  
  // Theme-specific colors
  const timeColors = {
    neutral: 'text-emerald-400',
    midnight: 'text-emerald-500',
    ocean: 'text-cyan-400',
    sunrise: 'text-emerald-600',
    neon: 'text-fuchsia-400',
  };

  const overtimeColors = {
    neutral: 'text-red-400',
    midnight: 'text-red-500',
    ocean: 'text-rose-400',
    sunrise: 'text-red-600',
    neon: 'text-red-400',
  };

  const remainingColors = {
    neutral: 'text-blue-300',
    midnight: 'text-blue-400',
    ocean: 'text-cyan-300',
    sunrise: 'text-blue-600',
    neon: 'text-fuchsia-300',
  };

  const labelColors = {
    neutral: 'text-white/60',
    midnight: 'text-white/50',
    ocean: 'text-cyan-100/60',
    sunrise: 'text-gray-600',
    neon: 'text-fuchsia-200/60',
  };

  const diffMs = now.diff(dayjs(startTime));
  if (diffMs < 0) return null;

  const dur = dayjs.duration(diffMs);
  const hours = Math.floor(dur.asHours());
  const mins = dur.minutes();
  const secs = dur.seconds();

  const timeStr = hours > 0
    ? `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    : `${mins}:${secs.toString().padStart(2, '0')}`;
  
  // Calculate remaining time
  let remainingStr = null;
  let isOvertime = false;
  
  if (estimatedEndTime) {
    const end = dayjs(estimatedEndTime);
    const remainingMs = end.diff(now);
    isOvertime = remainingMs < 0;
    
    const remainingDur = dayjs.duration(Math.abs(remainingMs));
    const rHours = Math.floor(remainingDur.asHours());
    const rMins = remainingDur.minutes();
    const rSecs = remainingDur.seconds();

    const timeString = rHours > 0
      ? `${rHours}:${rMins.toString().padStart(2, '0')}:${rSecs.toString().padStart(2, '0')}`
      : `${rMins}:${rSecs.toString().padStart(2, '0')}`;
    
    remainingStr = isOvertime 
      ? `+${timeString}`
      : `-${timeString}`;
  }

  // Full View (for Control Card)
  return (
    <div className={`rounded-lg flex flex-col gap-1`}>
      <div className="flex justify-between items-center gap-2">
        <span className={`text-sm ${labelColors[themeId]}`}>⏱️ เวลาที่เล่น</span>
        <span className={`font-mono font-bold text-xl ${timeColors[themeId]} animate-pulse`}>
          {timeStr}
        </span>
      </div>
      
      {remainingStr && (
        <div className={`flex justify-between items-center border-t ${themeId === 'sunrise' ? 'border-gray-300' : 'border-white/10'} pt-1 mt-1`}>
           <span className={`text-xs ${labelColors[themeId]}`}>เหลือเวลา</span>
           <span className={`font-mono text-sm font-bold ${isOvertime ? overtimeColors[themeId] : remainingColors[themeId]}`}>
             {remainingStr}
           </span>
        </div>
      )}
    </div>
  );
}

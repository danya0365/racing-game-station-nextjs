import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeType = 'neutral' | 'midnight' | 'ocean';

export interface ThemeConfig {
  id: ThemeType;
  name: string;
  colors: {
    bg: string; // Main background
    header: string; // Header background
    card: {
      base: string; // Base card style (bg, border, shadow)
      hover: string; // Hover effects
    };
    // We can add specific overrides if needed, but for now we'll mostly rely on tailwind classes in the view
    // that might be sufficient if we just swap the main bg and card bg.
    // However, to be thorough as per the user's request for "tone", let's define the palette.
  };
}

// Definition of our themes
export const THEMES: Record<ThemeType, ThemeConfig> = {
  neutral: {
    id: 'neutral',
    name: '🔘 Neutral',
    colors: {
      bg: 'bg-neutral-900',
      header: 'bg-black/40 border-white/10',
      card: {
        base: 'bg-zinc-900/80 border-white/10 shadow-lg shadow-black/20',
        hover: 'hover:bg-zinc-800 hover:border-white/20',
      }
    }
  },
  midnight: {
    id: 'midnight',
    name: '🌑 Midnight',
    colors: {
      bg: 'bg-[#050505]',
      header: 'bg-black/60 border-white/5',
      card: {
        base: 'bg-black/60 border-white/10 shadow-lg shadow-black/40',
        hover: 'hover:bg-black/80 hover:border-white/20',
      }
    }
  },
  ocean: {
    id: 'ocean',
    name: '🌊 Ocean',
    colors: {
      bg: 'bg-slate-900',
      header: 'bg-slate-950/40 border-cyan-900/10',
      card: {
        base: 'bg-slate-800/60 border-cyan-500/10 shadow-lg shadow-cyan-900/10',
        hover: 'hover:bg-slate-800/80 hover:border-cyan-500/30',
      }
    }
  }
};

interface ControlThemeState {
  currentTheme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  cycleTheme: () => void;
  getThemeConfig: () => ThemeConfig;
}

export const useControlThemeStore = create<ControlThemeState>()(
  persist(
    (set, get) => ({
      currentTheme: 'neutral',
      setTheme: (theme) => set({ currentTheme: theme }),
      cycleTheme: () => {
        const themes: ThemeType[] = ['neutral', 'midnight', 'ocean'];
        const currentIndex = themes.indexOf(get().currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        set({ currentTheme: themes[nextIndex] });
      },
      getThemeConfig: () => THEMES[get().currentTheme],
    }),
    {
      name: 'control-theme-storage',
    }
  )
);

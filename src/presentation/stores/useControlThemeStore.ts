import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeType = 'neutral' | 'midnight' | 'ocean' | 'sunrise' | 'neon';

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
    text: {
      primary: string; // Primary text color
      secondary: string; // Secondary/muted text
      accent: string; // Accent text (like buttons, links)
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
      },
      text: {
        primary: 'text-white',
        secondary: 'text-white/60',
        accent: 'text-purple-400',
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
      },
      text: {
        primary: 'text-white',
        secondary: 'text-white/50',
        accent: 'text-gray-300',
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
      },
      text: {
        primary: 'text-white',
        secondary: 'text-cyan-100/70',
        accent: 'text-cyan-400',
      }
    }
  },
  sunrise: {
    id: 'sunrise',
    name: '🌅 Sunrise',
    colors: {
      bg: 'bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50',
      header: 'bg-white/80 border-orange-200/50 backdrop-blur-xl',
      card: {
        base: 'bg-white/90 border-orange-200/40 shadow-xl shadow-orange-200/30',
        hover: 'hover:bg-white hover:border-orange-300/60 hover:shadow-orange-300/40',
      },
      text: {
        primary: 'text-gray-900',
        secondary: 'text-gray-600',
        accent: 'text-orange-600',
      }
    }
  },
  neon: {
    id: 'neon',
    name: '⚡ Neon',
    colors: {
      bg: 'bg-gradient-to-br from-purple-900 via-fuchsia-900 to-pink-900',
      header: 'bg-purple-950/60 border-fuchsia-500/30 backdrop-blur-xl',
      card: {
        base: 'bg-purple-800/40 border-fuchsia-400/30 shadow-xl shadow-fuchsia-500/20',
        hover: 'hover:bg-purple-800/60 hover:border-fuchsia-400/50 hover:shadow-fuchsia-500/40',
      },
      text: {
        primary: 'text-white',
        secondary: 'text-fuchsia-200/80',
        accent: 'text-fuchsia-300',
      }
    }
  }
};

interface ControlThemeState {
  currentTheme: ThemeType;
  isInitialized: boolean; // Track if persisted data is loaded
  setTheme: (theme: ThemeType) => void;
  cycleTheme: () => void;
  getThemeConfig: () => ThemeConfig;
}

export const useControlThemeStore = create<ControlThemeState>()(
  persist(
    (set, get) => ({
      currentTheme: 'neutral',
      isInitialized: false,
      setTheme: (theme) => set({ currentTheme: theme }),
      cycleTheme: () => {
        const themes: ThemeType[] = ['neutral', 'midnight', 'ocean', 'sunrise', 'neon'];
        const currentIndex = themes.indexOf(get().currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        set({ currentTheme: themes[nextIndex] });
      },
      getThemeConfig: () => THEMES[get().currentTheme],
    }),
    {
      name: 'control-theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isInitialized = true;
        }
      },
    }
  )
);

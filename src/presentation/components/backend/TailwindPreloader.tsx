/**
 * TailwindPreloader Component
 * 
 * This hidden component ensures all dynamic Tailwind classes used in themes
 * are included in the CSS bundle by explicitly referencing them.
 * Without this, Tailwind's JIT compiler might purge these classes
 * since they're defined as strings in the theme config.
 */
export function TailwindPreloader() {
  return (
    <div className="hidden">
      {/* Background Classes */}
      <div className="bg-neutral-900" />
      <div className="bg-[#050505]" />
      <div className="bg-slate-900" />
      <div className="bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50" />
      <div className="bg-gradient-to-br from-purple-900 via-fuchsia-900 to-pink-900" />
      
      {/* Header Classes */}
      <div className="bg-black/40 border-white/10" />
      <div className="bg-black/60 border-white/5" />
      <div className="bg-slate-950/40 border-cyan-900/10" />
      <div className="bg-white/80 border-orange-200/50 backdrop-blur-xl" />
      <div className="bg-purple-950/60 border-fuchsia-500/30 backdrop-blur-xl" />
      
      {/* Card Base Classes */}
      <div className="bg-zinc-900/80 border-white/10 shadow-lg shadow-black/20" />
      <div className="bg-black/60 border-white/10 shadow-lg shadow-black/40" />
      <div className="bg-slate-800/60 border-cyan-500/10 shadow-lg shadow-cyan-900/10" />
      <div className="bg-white/90 border-orange-200/40 shadow-xl shadow-orange-200/30" />
      <div className="bg-purple-800/40 border-fuchsia-400/30 shadow-xl shadow-fuchsia-500/20" />
      
      {/* Card Hover Classes */}
      <div className="hover:bg-zinc-800 hover:border-white/20" />
      <div className="hover:bg-black/80 hover:border-white/20" />
      <div className="hover:bg-slate-800/80 hover:border-cyan-500/30" />
      <div className="hover:bg-white hover:border-orange-300/60 hover:shadow-orange-300/40" />
      <div className="hover:bg-purple-800/60 hover:border-fuchsia-400/50 hover:shadow-fuchsia-500/40" />
      
      {/* Primary Text Classes */}
      <div className="text-white" />
      <div className="text-gray-900" />
      
      {/* Secondary Text Classes */}
      <div className="text-white/60" />
      <div className="text-white/50" />
      <div className="text-cyan-100/70" />
      <div className="text-gray-600" />
      <div className="text-fuchsia-200/80" />
      
      {/* Accent Text Classes */}
      <div className="text-purple-400" />
      <div className="text-gray-300" />
      <div className="text-cyan-400" />
      <div className="text-orange-600" />
      <div className="text-fuchsia-300" />
      
      {/* Additional dynamic classes that might be used */}
      <div className="text-white/40" />
      <div className="text-white/70" />
      <div className="text-gray-500" />
      <div className="text-gray-700" />
      <div className="text-gray-800" />
      <div className="text-gray-700/70" />
      
      {/* MiniStat Classes - Dark Theme */}
      <div className="bg-emerald-900/40 border-emerald-700/50 text-emerald-400" />
      <div className="bg-orange-900/40 border-orange-700/50 text-orange-400" />
      <div className="bg-yellow-900/40 border-yellow-700/50 text-yellow-400" />
      <div className="bg-cyan-900/40 border-cyan-700/50 text-cyan-400" />
      
      {/* MiniStat Classes - Sunrise Theme */}
      <div className="bg-emerald-100 border-emerald-400 text-emerald-700" />
      <div className="bg-orange-100 border-orange-400 text-orange-700" />
      <div className="bg-yellow-100 border-yellow-400 text-yellow-700" />
      <div className="bg-cyan-100 border-cyan-400 text-cyan-700" />
      
      {/* Sunrise Theme Specific */}
      <div className="bg-orange-100/50 border-orange-300/50" />
      <div className="bg-orange-100/70 hover:bg-orange-200" />
      <div className="hover:bg-orange-200/50" />
      <div className="border-orange-300" />
      <div className="border-gray-300" />
      
      {/* Schedule Slots - Sunrise Theme */}
      <div className="bg-gray-200" />
      <div className="bg-gray-100" />
      <div className="bg-red-400" />
      <div className="bg-emerald-400" />

      {/* =================================================================================
          DYNAMIC THEME STYLES (Neutral, Midnight, Ocean, Sunrise, Neon)
          Synchronized with THEME_STYLES in ControlView.tsx
         ================================================================================= */}

      {/* 1. Neutral Theme */}
      <div className="bg-zinc-900/90 shadow-orange-900/20 hover:shadow-orange-900/40" />
      <div className="from-orange-700 to-red-900 text-orange-100" />
      <div className="bg-orange-950/50 border-orange-800 text-orange-400 animate-pulse" />
      <div className="bg-gradient-to-r from-orange-900/30 via-red-900/30 to-orange-900/30" />
      
      {/* 2. Midnight Theme */}
      <div className="border-emerald-800/40 shadow-emerald-900/20 bg-black/80 hover:border-emerald-700/60" />
      <div className="border-orange-800/60 bg-black/90 shadow-orange-900/30 hover:border-orange-600/80" />
      <div className="border-red-800/40 hover:border-red-700/60" />
      <div className="border-yellow-800/40 hover:border-yellow-700/60" />
      
      <div className="from-emerald-900 to-black text-emerald-200 border-emerald-800/30" />
      <div className="from-orange-900 to-black text-orange-200 border-orange-800/30" />
      <div className="from-red-900 to-black text-red-200" />
      <div className="from-yellow-900 to-black text-yellow-200" />

      <div className="bg-emerald-950/80 border-emerald-900 text-emerald-500" />
      <div className="bg-orange-950/80 border-orange-900 text-orange-500 animate-pulse" />
      <div className="bg-red-950/80 border-red-900 text-red-500" />
      <div className="bg-yellow-950/80 border-yellow-900 text-yellow-500" />
      
      <div className="bg-gradient-to-r from-orange-950/50 via-red-950/50 to-orange-950/50" />

      {/* 3. Ocean Theme */}
      <div className="border-cyan-500/30 shadow-cyan-900/20 bg-slate-800/70 hover:border-cyan-400/50" />
      <div className="border-blue-500/50 bg-slate-800/90 shadow-blue-900/30 hover:border-blue-400/70" />
      <div className="border-rose-500/30 hover:border-rose-400/50" />
      <div className="border-amber-500/30 hover:border-amber-400/50" />

      <div className="from-cyan-800 to-slate-900 text-cyan-100" />
      <div className="from-blue-700 to-indigo-900 text-blue-100" />
      <div className="from-rose-800 to-slate-900 text-rose-100" />
      <div className="from-amber-700 to-slate-900 text-amber-100" />

      <div className="bg-cyan-950/50 border-cyan-800 text-cyan-300" />
      <div className="bg-blue-950/50 border-blue-700 text-blue-300 animate-pulse" />
      <div className="bg-rose-950/50 border-rose-800 text-rose-300" />
      <div className="bg-amber-950/50 border-amber-800 text-amber-300" />

      <div className="bg-gradient-to-r from-blue-900/30 via-indigo-900/30 to-blue-900/30" />

      {/* 4. Sunrise Theme (New additions) */}
      <div className="border-emerald-200 bg-emerald-50/50 shadow-emerald-100/50 hover:border-emerald-300" />
      <div className="border-orange-200 bg-orange-50/50 shadow-orange-100/50 hover:border-orange-300 hover:bg-orange-50" />
      <div className="border-red-200 bg-red-50/50 shadow-red-100/50 hover:border-red-300" />
      <div className="border-yellow-200 bg-yellow-50/50 shadow-yellow-100/50 hover:border-yellow-300" />

      <div className="from-emerald-400 to-emerald-500 shadow-emerald-200/50 shadow-md" />
      <div className="from-orange-400 to-orange-500 shadow-orange-200/50 shadow-md" />
      <div className="from-red-400 to-red-500" />
      <div className="from-yellow-400 to-yellow-500" />

      <div className="bg-emerald-100 border-emerald-200" />
      <div className="bg-orange-100 border-orange-200" />
      <div className="bg-red-100 border-red-200" />
      <div className="bg-yellow-100 border-yellow-200" />
      
      <div className="bg-gradient-to-r from-orange-200 via-yellow-100 to-orange-200" />

      {/* 5. Neon Theme */}
      <div className="border-fuchsia-500/40 bg-purple-900/40 shadow-[0_0_15px_rgba(217,70,239,0.1)] hover:border-fuchsia-400/60 hover:shadow-[0_0_20px_rgba(217,70,239,0.2)]" />
      <div className="border-pink-500/60 bg-purple-900/60 shadow-[0_0_20px_rgba(236,72,153,0.2)] hover:border-pink-400/80 hover:shadow-[0_0_30px_rgba(236,72,153,0.3)]" />
      <div className="border-red-500/60 hover:border-red-400/80" />
      <div className="border-yellow-400/60 hover:border-yellow-300/80" />

      <div className="from-fuchsia-600 to-purple-800" />
      <div className="from-pink-600 to-rose-600 animate-pulse-slow" />
      <div className="from-red-600 to-rose-800" />
      <div className="from-yellow-500 to-orange-600" />

      <div className="bg-fuchsia-950/60 border-fuchsia-500 text-fuchsia-300" />
      <div className="bg-pink-950/60 border-pink-500 text-pink-300" />
      <div className="bg-red-950/60 border-red-500 text-red-300" />
      <div className="bg-yellow-950/60 border-yellow-500 text-yellow-300" />
      
      <div className="bg-gradient-to-r from-pink-600/20 via-purple-600/20 to-pink-600/20" />
    </div>
  );
}

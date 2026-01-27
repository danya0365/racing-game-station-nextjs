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
    </div>
  );
}

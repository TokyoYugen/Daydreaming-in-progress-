import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const LanguageSwitch: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      id="language-switch"
      className={`flex items-center p-0.5 rounded-lg border border-slate-800 bg-[#0b101d] shadow-inner ${className}`}
      role="group"
      aria-label="Language selector"
    >
      {/* Italian Flag Button */}
      <button
        id="lang-it-btn"
        onClick={() => setLanguage('it')}
        title="Italiano (IT)"
        aria-pressed={language === 'it'}
        className={`flex items-center gap-1 px-1.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
          language === 'it'
            ? 'bg-gradient-to-r from-emerald-950/70 to-red-950/70 text-emerald-300 border border-emerald-500/40 shadow-sm'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 opacity-70 hover:opacity-100'
        }`}
      >
        {/* SVG Italian Flag */}
        <span className="w-4 h-3 rounded-[2px] overflow-hidden inline-flex border border-slate-600/50 flex-shrink-0 shadow-xs">
          <svg viewBox="0 0 3 2" className="w-full h-full object-cover">
            <rect width="1" height="2" fill="#009246" />
            <rect width="1" height="2" x="1" fill="#ffffff" />
            <rect width="1" height="2" x="2" fill="#ce2b37" />
          </svg>
        </span>
        <span className="font-mono text-[10px] tracking-tight">IT</span>
      </button>

      {/* UK Flag Button */}
      <button
        id="lang-en-btn"
        onClick={() => setLanguage('en')}
        title="English (UK)"
        aria-pressed={language === 'en'}
        className={`flex items-center gap-1 px-1.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
          language === 'en'
            ? 'bg-gradient-to-r from-blue-950/70 to-indigo-950/70 text-blue-300 border border-blue-500/40 shadow-sm'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 opacity-70 hover:opacity-100'
        }`}
      >
        {/* SVG UK Flag (Union Jack) */}
        <span className="w-4 h-3 rounded-[2px] overflow-hidden inline-flex border border-slate-600/50 flex-shrink-0 shadow-xs">
          <svg viewBox="0 0 60 30" className="w-full h-full object-cover">
            <clipPath id="s">
              <path d="M0,0 v30 h60 v-30 z"/>
            </clipPath>
            <clipPath id="t">
              <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/>
            </clipPath>
            <g clipPath="url(#s)">
              <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
              <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
              <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/>
              <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
              <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
            </g>
          </svg>
        </span>
        <span className="font-mono text-[10px] tracking-tight">EN</span>
      </button>
    </div>
  );
};

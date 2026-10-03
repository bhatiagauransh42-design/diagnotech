import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiActivity, 
  FiFileText, 
  FiBarChart2, 
  FiCpu, 
  FiBookOpen, 
  FiGlobe 
} from 'react-icons/fi';

/**
 * Hover.dev SlideTabs Navigation Component
 * Smooth spring-sliding cursor pill across clinical tabs
 */
export const SlideTabs = ({ activeTab, setActiveTab, backendOnline, language, setLanguage }) => {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const TABS = [
    { id: 'screening', label: 'Screening Suite', icon: FiActivity, badge: 'CDC 17-Factor' },
    { id: 'scanner', label: 'AI Report Scanner', icon: FiFileText, badge: 'OCR + NLP' },
    { id: 'analytics', label: 'Epidemiology', icon: FiBarChart2 },
    { id: 'quantum', label: 'Quantum ML', icon: FiCpu, badge: '6-Qubit' },
    { id: 'docs', label: 'CDC Specs', icon: FiBookOpen },
  ];

  const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
  ];

  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 py-4 px-2 sm:px-4 border-b border-slate-200 bg-white/95 backdrop-blur-xl sticky top-[73px] z-40">
      {/* Slide Tabs Navigation List */}
      <ul
        onMouseLeave={() => {
          // Reset cursor position to active tab
          const activeEl = document.getElementById(`tab-pill-${activeTab}`);
          if (activeEl) {
            setPosition({
              left: activeEl.offsetLeft,
              width: activeEl.offsetWidth,
              opacity: 1,
            });
          }
        }}
        className="relative flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 border border-slate-200 shadow-inner"
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <Tab
              key={tab.id}
              id={`tab-pill-${tab.id}`}
              setPosition={setPosition}
              isActive={isActive}
              onClick={() => setActiveTab(tab.id)}
            >
              <div className="flex items-center gap-2">
                <Icon className={`text-sm ${isActive ? 'text-[#0284C7]' : 'text-slate-500 group-hover:text-slate-800'}`} />
                <span className="font-semibold text-xs tracking-wide">{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider hidden lg:inline ${
                    isActive 
                      ? 'bg-sky-100 text-sky-800 border border-sky-300' 
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </div>
            </Tab>
          );
        })}

        <Cursor position={position} />
      </ul>

      {/* Right controls: Backend Status & Language Switcher */}
      <div className="flex items-center gap-3">
        {/* Backend Heartbeat Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              backendOnline ? 'bg-emerald-400' : 'bg-amber-400'
            }`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              backendOnline ? 'bg-emerald-500' : 'bg-amber-500'
            }`}></span>
          </span>
          <span className="text-slate-700 font-medium text-[11px]">
            {backendOnline ? 'QSVC Kernel Online' : 'Client Edge Engine'}
          </span>
        </div>

        {/* Multilingual Selector */}
        <div className="relative">
          <button
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-xs font-semibold text-slate-800 transition-all shadow-sm"
          >
            <FiGlobe className="text-[#0284C7] text-sm" />
            <span className="uppercase">{language}</span>
          </button>

          {langMenuOpen && (
            <div className="absolute right-0 mt-2 w-44 rounded-xl bg-white border border-slate-200 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 text-slate-800">
              <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                Clinical Language
              </div>
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLanguage(l.code);
                    setLangMenuOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                    language === l.code
                      ? 'bg-sky-50 text-[#0284C7] font-bold'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span>{l.label}</span>
                  {language === l.code && <span className="text-[#0284C7] text-xs">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Tab = ({ children, setPosition, onClick, isActive, id }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (isActive && ref.current) {
      setPosition({
        left: ref.current.offsetLeft,
        width: ref.current.offsetWidth,
        opacity: 1,
      });
    }
  }, [isActive, setPosition]);

  return (
    <li
      id={id}
      ref={ref}
      onMouseEnter={() => {
        if (!ref?.current) return;
        const { width } = ref.current.getBoundingClientRect();
        setPosition({
          left: ref.current.offsetLeft,
          width,
          opacity: 1,
        });
      }}
      onClick={onClick}
      className={`group relative z-10 block cursor-pointer px-3.5 py-2 text-xs font-medium transition-colors ${
        isActive ? 'text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
      }`}
    >
      {children}
    </li>
  );
};

const Cursor = ({ position }) => {
  return (
    <motion.li
      animate={{
        ...position,
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
      }}
      className="absolute z-0 h-8 rounded-xl bg-white border border-slate-200/90 shadow-sm"
    />
  );
};

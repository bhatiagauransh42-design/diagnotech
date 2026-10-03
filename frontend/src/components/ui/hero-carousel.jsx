import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Activity, ArrowUpRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { ScrambleLinkButton } from "./scramble-link-button";

export function HeroCarousel({
  items = [],
  index: controlledIndex,
  defaultIndex = 0,
  onIndexChange,
  brand = "DIAGNOTECH",
  onBack,
  onMenu,
  autoplay = true,
  autoplayDelay = 6500,
  className = "",
  onSelectAction,
}) {
  const [internalIndex, setInternalIndex] = useState(defaultIndex);
  const activeIndex = controlledIndex !== undefined ? controlledIndex : internalIndex;
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const filmstripRef = useRef(null);
  const progressTimerRef = useRef(null);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
  }, []);

  const changeSlide = useCallback(
    (newIndex) => {
      const clamped = (newIndex + items.length) % items.length;
      if (controlledIndex === undefined) {
        setInternalIndex(clamped);
      }
      onIndexChange?.(clamped);
      setProgress(0);
    },
    [items.length, controlledIndex, onIndexChange]
  );

  const nextSlide = useCallback(() => {
    changeSlide(activeIndex + 1);
  }, [activeIndex, changeSlide]);

  const prevSlide = useCallback(() => {
    changeSlide(activeIndex - 1);
  }, [activeIndex, changeSlide]);

  // Autoplay and progress timer
  useEffect(() => {
    if (!autoplay || isPaused || isDragging || items.length <= 1) return;

    const intervalMs = 50;
    const step = (intervalMs / autoplayDelay) * 100;

    progressTimerRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + step;
      });
    }, intervalMs);

    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, [autoplay, isPaused, isDragging, autoplayDelay, nextSlide, items.length]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "ArrowRight") {
        nextSlide();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Scroll active thumbnail into view
  useEffect(() => {
    if (!filmstripRef.current) return;
    const activeThumb = filmstripRef.current.children[activeIndex];
    if (activeThumb) {
      activeThumb.scrollIntoView({
        behavior: reducedMotionRef.current ? "auto" : "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeIndex]);

  if (!items || items.length === 0) return null;

  const currentItem = items[activeIndex] || items[0];
  const accentColor = currentItem.accent || "#06b6d4";

  return (
    <div
      className={cn("hero-carousel-root relative overflow-hidden select-none", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      role="region"
      aria-label="Clinical Architecture Showcase"
    >
      {/* Background Transitions */}
      <div className="hero-carousel-backgrounds absolute inset-0 pointer-events-none">
        <AnimatePresence mode="sync">
          <motion.div
            key={currentItem.id || activeIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: reducedMotionRef.current ? 0.2 : 0.85,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${currentItem.image}')`,
              filter: "brightness(0.35) contrast(1.15)",
            }}
          />
        </AnimatePresence>

        {/* Dynamic Accent Color Gradient Grading */}
        <div
          className="absolute inset-0 transition-colors duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 20% 30%, ${accentColor}18 0%, transparent 60%), linear-gradient(180deg, rgba(6, 9, 17, 0.4) 0%, rgba(6, 9, 17, 0.85) 65%, #060911 100%)`,
          }}
        />

        {/* Subtle Film Grain Texture */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      {/* Hero Content Stage */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-32 flex flex-col justify-between min-h-[440px] sm:min-h-[480px]">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Activity className="w-4 h-4 animate-pulse" />
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono tracking-widest text-cyan-400 font-semibold uppercase">
                {brand}
              </span>
              <span className="text-white/30 text-xs">•</span>
              <span className="text-xs text-slate-400 font-mono">
                STAGE {activeIndex + 1}/{items.length}
              </span>
            </div>
          </div>

          {/* Slide Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="p-2 rounded-full bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 backdrop-blur-md transition-all"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-full bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 backdrop-blur-md transition-all"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center Editorial Focus */}
        <div className="mt-8 sm:mt-12 max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem.id || activeIndex}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{
                duration: reducedMotionRef.current ? 0.15 : 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="space-y-4"
            >
              {/* Category & Meta Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium uppercase tracking-wider"
                  style={{
                    backgroundColor: `${accentColor}20`,
                    color: accentColor,
                    border: `1px solid ${accentColor}45`,
                  }}
                >
                  {currentItem.category || "CLINICAL AI"}
                </span>
                {currentItem.meta && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono text-slate-300 bg-slate-800/80 border border-white/10">
                    {currentItem.meta}
                  </span>
                )}
              </div>

              {/* Headline */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.15]">
                {currentItem.title}
              </h1>

              {/* Description / Summary */}
              {currentItem.description && (
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                  {currentItem.description}
                </p>
              )}

              {/* Action Link / Byline */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                {currentItem.actionTab && (
                  <ScrambleLinkButton
                    as="button"
                    btnText={currentItem.actionText || "Launch Module"}
                    onClick={() => onSelectAction?.(currentItem.actionTab, currentItem.disease)}
                    hoverColor={accentColor}
                    size="md"
                    style={{
                      backgroundColor: `${accentColor}18`,
                      borderColor: `${accentColor}60`,
                      color: accentColor,
                      boxShadow: `0 0 20px -5px ${accentColor}50`,
                    }}
                  />
                )}

                {currentItem.credit && (
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                    {currentItem.credit}
                  </span>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress Rail */}
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-6">
          <div
            className="h-full transition-all duration-75"
            style={{
              width: `${progress}%`,
              backgroundColor: accentColor,
              boxShadow: `0 0 8px ${accentColor}`,
            }}
          />
        </div>
      </div>

      {/* Draggable Filmstrip Thumbnails */}
      <div className="absolute bottom-4 left-0 right-0 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={filmstripRef}
          className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2 cursor-grab active:cursor-grabbing"
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
        >
          {items.map((item, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={item.id || idx}
                onClick={() => changeSlide(idx)}
                className={cn(
                  "group relative flex-shrink-0 flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 text-left",
                  isSelected
                    ? "bg-slate-800/90 border-2 shadow-lg scale-105"
                    : "bg-slate-900/60 hover:bg-slate-800/60 border border-white/10 opacity-70 hover:opacity-100"
                )}
                style={{
                  borderColor: isSelected ? item.accent || "#06b6d4" : "rgba(255, 255, 255, 0.08)",
                  minWidth: "210px",
                }}
              >
                <div
                  className="w-12 h-10 rounded-lg bg-cover bg-center flex-shrink-0 border border-white/15"
                  style={{ backgroundImage: `url('${item.image}')` }}
                />
                <div className="overflow-hidden">
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 truncate">
                    {item.category || `Module 0${idx + 1}`}
                  </span>
                  <span className="block text-xs font-semibold text-white truncate group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default HeroCarousel;

import React, { useState, useEffect, useRef, useCallback } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

const GLYPHS = "abcdefghijklmnopqrstuvwxyz0123456789";

/**
 * Universal ScrambleLinkButton / ScrambleButton
 * Powers microinteractions, primary CTAs, presets, and navigation
 * with character scrambling, expanding line, rotating arrow, and luminous glow.
 */
export function ScrambleLinkButton({
  as: ComponentProp,
  btnText,
  children,
  href,
  className = "",
  textClassName = "",
  hoverColor = "#06b6d4",
  showLine = true,
  lineClassName = "",
  showArrow = true,
  icon,
  iconClassName = "",
  scrambleDuration = 450,
  stepMs = 28,
  revealStagger = 1,
  onClick,
  type = "button",
  disabled = false,
  loading = false,
  variant = "default", // "default" | "primary" | "preset" | "nav" | "tab"
  size = "md", // "sm" | "md" | "lg"
  active = false,
  style = {},
  ...restProps
}) {
  const rawText = btnText !== undefined 
    ? String(btnText) 
    : (typeof children === "string" ? children : "Click");

  const [text, setText] = useState(rawText);
  const [hovered, setHovered] = useState(false);
  const reduced = useRef(false);

  // Automatically select <button> or <a> tag based on props
  const Component = ComponentProp || (href && !disabled ? "a" : "button");

  useEffect(() => {
    setText(rawText);
  }, [rawText]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
  }, []);

  const scramble = useCallback(() => {
    if (reduced.current || disabled || loading) {
      setText(rawText);
      return;
    }

    const target = rawText;
    const steps = Math.max(1, Math.ceil(scrambleDuration / stepMs));
    let step = 0;

    const id = window.setInterval(() => {
      step += 1;
      const revealed = Math.min(target.length, step * revealStagger);
      const next = target
        .split("")
        .map((char, i) => {
          if (i < revealed || char === " ") return char;
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join("");

      setText(next);

      if (step >= steps) {
        window.clearInterval(id);
        setText(target);
      }
    }, stepMs);

    return () => window.clearInterval(id);
  }, [rawText, scrambleDuration, stepMs, revealStagger, disabled, loading]);

  useEffect(() => {
    if (hovered && !disabled && !loading) {
      return scramble();
    }
  }, [hovered, scramble, disabled, loading]);

  const buttonProps = Component === "button"
    ? { type, disabled: disabled || loading }
    : { href: disabled ? undefined : href, role: disabled ? "link" : undefined, "aria-disabled": disabled };

  return (
    <Component
      {...buttonProps}
      {...restProps}
      onClick={disabled || loading ? (e) => e.preventDefault() : onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className={cn(
        "scramble-link-button group",
        `scramble-variant-${variant}`,
        `scramble-size-${size}`,
        active && "scramble-active",
        (disabled || loading) && "scramble-disabled",
        className
      )}
      style={{
        "--scramble-hover": hoverColor,
        ...style,
      }}
    >
      {loading ? (
        <Loader2 className="scramble-spinner animate-spin" size={16} />
      ) : icon ? (
        <span className={cn("scramble-icon", iconClassName)}>{icon}</span>
      ) : null}

      <span className={cn("scramble-text", textClassName)}>
        {loading ? (children || text) : text}
      </span>

      {showLine && !loading && (
        <span
          aria-hidden
          className={cn("scramble-line", lineClassName)}
        />
      )}

      {showArrow && !loading && (
        <ArrowRight className="scramble-arrow" />
      )}
    </Component>
  );
}

export default ScrambleLinkButton;

import { useState, useEffect, useRef, useCallback, type RefObject, type CSSProperties } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CursorGlowState {
  /** Cursor X position (viewport-relative, or container-relative if ref given) */
  x: number;
  /** Cursor Y position */
  y: number;
  /** False on touch-only devices — glow is disabled */
  isActive: boolean;
  /** Ready-to-use radial-gradient style for a glow overlay */
  glowStyle: CSSProperties;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const LERP_FACTOR = 0.1;
const GLOW_RADIUS = 600;
const GLOW_COLOR = 'rgba(79,119,45,0.06)';
const EMPTY_STYLE: CSSProperties = {};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return true;
  if ('ontouchstart' in window) return true;
  if (window.matchMedia?.('(pointer: coarse)').matches) return true;
  return false;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Tracks cursor position with lerped smoothing and provides a ready-to-use
 * radial-gradient style object for glow effects.
 *
 * @param containerRef  Optional ref – when provided, coordinates and the glow
 *                      style are relative to that container's bounding box.
 */
export function useCursorGlow(
  containerRef?: RefObject<HTMLElement | null>,
): CursorGlowState {
  const [state, setState] = useState<CursorGlowState>({
    x: 0,
    y: 0,
    isActive: false,
    glowStyle: EMPTY_STYLE,
  });

  // Internal mutable tracking
  const internalRef = useRef({
    rawX: 0,
    rawY: 0,
    smoothX: 0,
    smoothY: 0,
    rafId: 0,
    isTouch: true, // default to true until we confirm otherwise
    hasMoved: false,
  });

  // ── Build the CSS style object ──────────────────────────────────────────
  const buildGlowStyle = useCallback(
    (x: number, y: number): CSSProperties => ({
      background: `radial-gradient(${GLOW_RADIUS}px circle at ${x}px ${y}px, ${GLOW_COLOR}, transparent 70%)`,
    }),
    [],
  );

  useEffect(() => {
    const i = internalRef.current;

    // Touch detection
    i.isTouch = isTouchDevice();

    if (i.isTouch) {
      setState({ x: 0, y: 0, isActive: false, glowStyle: EMPTY_STYLE });
      return;
    }

    // ── Mouse listener ────────────────────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      i.hasMoved = true;

      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        i.rawX = e.clientX - rect.left;
        i.rawY = e.clientY - rect.top;
      } else {
        i.rawX = e.clientX;
        i.rawY = e.clientY;
      }
    };

    const target = containerRef?.current ?? window;
    (target as EventTarget).addEventListener('mousemove', onMouseMove as EventListener, {
      passive: true,
    });

    // ── rAF loop ──────────────────────────────────────────────────────────
    let lastFlush = 0;
    const FLUSH_INTERVAL = 1000 / 30; // 30 fps React state updates

    const tick = (timestamp: number) => {
      i.smoothX = lerp(i.smoothX, i.rawX, LERP_FACTOR);
      i.smoothY = lerp(i.smoothY, i.rawY, LERP_FACTOR);

      // Snap when negligible difference
      if (Math.abs(i.smoothX - i.rawX) < 0.5) i.smoothX = i.rawX;
      if (Math.abs(i.smoothY - i.rawY) < 0.5) i.smoothY = i.rawY;

      if (timestamp - lastFlush >= FLUSH_INTERVAL && i.hasMoved) {
        lastFlush = timestamp;

        const x = Math.round(i.smoothX);
        const y = Math.round(i.smoothY);

        setState({
          x,
          y,
          isActive: true,
          glowStyle: buildGlowStyle(x, y),
        });
      }

      i.rafId = requestAnimationFrame(tick);
    };

    i.rafId = requestAnimationFrame(tick);

    return () => {
      (target as EventTarget).removeEventListener('mousemove', onMouseMove as EventListener);
      cancelAnimationFrame(i.rafId);
    };
  }, [containerRef, buildGlowStyle]);

  return state;
}

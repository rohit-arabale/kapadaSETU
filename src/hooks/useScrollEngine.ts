import { useState, useEffect, useRef, useCallback } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ScrollEngineState {
  /** Raw scroll position in pixels */
  scrollY: number;
  /** Lerped (smoothed) scroll position */
  smoothScrollY: number;
  /** Normalized page progress 0 → 1 */
  scrollProgress: number;
  /** Instantaneous velocity in px/frame (positive = scrolling down) */
  scrollVelocity: number;
  /** Current scroll direction */
  scrollDirection: 'up' | 'down' | 'idle';
  /** Viewport height in pixels */
  viewportHeight: number;
  /** Full document height in pixels */
  documentHeight: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const LERP_FACTOR = 0.08;
const VELOCITY_IDLE_THRESHOLD = 0.5;
const STATE_UPDATE_INTERVAL_MS = 1000 / 30; // ~30 fps state pushes

// ─── Helpers ─────────────────────────────────────────────────────────────────

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function getScrollableHeight(): number {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Provides scroll-linked animation state with smooth interpolation.
 *
 * Internal state is updated every rAF tick, but React state is flushed at
 * ~30 fps to avoid unnecessary re-renders while keeping animations buttery.
 */
export function useScrollEngine(): ScrollEngineState {
  // ── Exposed React state (throttled writes) ──────────────────────────────
  const [state, setState] = useState<ScrollEngineState>(() => ({
    scrollY: 0,
    smoothScrollY: 0,
    scrollProgress: 0,
    scrollVelocity: 0,
    scrollDirection: 'idle',
    viewportHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
    documentHeight: typeof document !== 'undefined' ? getScrollableHeight() : 0,
  }));

  // ── Internal mutable refs (updated every rAF tick) ──────────────────────
  const internalRef = useRef({
    rawScrollY: 0,
    smoothScrollY: 0,
    prevSmoothScrollY: 0,
    velocity: 0,
    viewportHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
    documentHeight: typeof document !== 'undefined' ? getScrollableHeight() : 0,
    lastStateFlush: 0,
    rafId: 0,
  });

  // ── rAF loop ────────────────────────────────────────────────────────────
  const tick = useCallback((timestamp: number) => {
    const i = internalRef.current;

    // Lerp toward raw scroll position
    i.prevSmoothScrollY = i.smoothScrollY;
    i.smoothScrollY = lerp(i.smoothScrollY, i.rawScrollY, LERP_FACTOR);

    // Snap when difference is negligible to avoid infinite micro-updates
    if (Math.abs(i.smoothScrollY - i.rawScrollY) < 0.1) {
      i.smoothScrollY = i.rawScrollY;
    }

    // Velocity: change in smooth position per frame
    i.velocity = i.smoothScrollY - i.prevSmoothScrollY;

    // Throttle React state updates to ~30 fps
    if (timestamp - i.lastStateFlush >= STATE_UPDATE_INTERVAL_MS) {
      i.lastStateFlush = timestamp;

      const maxScroll = Math.max(i.documentHeight - i.viewportHeight, 1);
      const progress = clamp(i.smoothScrollY / maxScroll, 0, 1);

      const direction: ScrollEngineState['scrollDirection'] =
        Math.abs(i.velocity) < VELOCITY_IDLE_THRESHOLD
          ? 'idle'
          : i.velocity > 0
            ? 'down'
            : 'up';

      setState({
        scrollY: i.rawScrollY,
        smoothScrollY: i.smoothScrollY,
        scrollProgress: progress,
        scrollVelocity: i.velocity,
        scrollDirection: direction,
        viewportHeight: i.viewportHeight,
        documentHeight: i.documentHeight,
      });
    }

    i.rafId = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    const i = internalRef.current;

    // Seed initial values
    i.rawScrollY = window.scrollY;
    i.smoothScrollY = window.scrollY;
    i.viewportHeight = window.innerHeight;
    i.documentHeight = getScrollableHeight();

    // ── Scroll listener (passive) ───────────────────────────────────────
    const onScroll = () => {
      internalRef.current.rawScrollY = window.scrollY;
    };

    // ── Resize listener (update dimensions) ─────────────────────────────
    const onResize = () => {
      const ref = internalRef.current;
      ref.viewportHeight = window.innerHeight;
      ref.documentHeight = getScrollableHeight();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    // Start rAF loop
    i.rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(i.rafId);
    };
  }, [tick]);

  return state;
}

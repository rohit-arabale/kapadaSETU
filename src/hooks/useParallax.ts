import { useEffect, useRef, useState, useMemo, type CSSProperties } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ParallaxOptions {
  /** Parallax speed multiplier, -1 to 1. Default 0.5. Negative reverses direction. */
  speed?: number;
  /** Axis of movement. Default 'vertical'. */
  direction?: 'vertical' | 'horizontal';
  /** Force-disable parallax (returns identity transform). */
  disabled?: boolean;
}

export interface ParallaxResult {
  ref: React.RefObject<HTMLDivElement | null>;
  style: CSSProperties;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const LERP_FACTOR = 0.06;
const MOBILE_BREAKPOINT = 768;
const IDENTITY_STYLE: CSSProperties = { transform: 'translate3d(0,0,0)', willChange: 'auto' };

// ─── Helpers ─────────────────────────────────────────────────────────────────

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isMobile(): boolean {
  if (typeof window === 'undefined') return true;
  return window.innerWidth < MOBILE_BREAKPOINT;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Multi-layer parallax hook. Returns a `ref` to attach to the target element
 * and a `style` containing the computed transform.
 *
 * - Uses IntersectionObserver to skip work when the element is off-screen.
 * - Lerps the transform for butter-smooth animation at 60 fps.
 * - Automatically disabled on mobile or when prefers-reduced-motion is set.
 */
export function useParallax(options: ParallaxOptions = {}): ParallaxResult {
  const {
    speed = 0.5,
    direction = 'vertical',
    disabled = false,
  } = options;

  const elRef = useRef<HTMLDivElement | null>(null);
  const [style, setStyle] = useState<CSSProperties>(IDENTITY_STYLE);

  // Determine if parallax should actually run
  const shouldDisable = useMemo(
    () => disabled || prefersReducedMotion() || isMobile(),
    [disabled],
  );

  useEffect(() => {
    if (shouldDisable) {
      setStyle(IDENTITY_STYLE);
      return;
    }

    const el = elRef.current;
    if (!el) return;

    // ── Internal mutable state ──────────────────────────────────────────
    let isVisible = false;
    let currentOffset = 0;
    let targetOffset = 0;
    let rafId = 0;

    // ── Intersection Observer ───────────────────────────────────────────
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { rootMargin: '100px 0px', threshold: 0 },
    );

    observer.observe(el);

    // ── Scroll handler (passive) ────────────────────────────────────────
    const onScroll = () => {
      if (!isVisible) return;
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight;

      // How far through the viewport the element has traveled (-1 → 1)
      const traversal = (viewportH - rect.top) / (viewportH + rect.height);
      // Center around 0 so the element is at rest when centered in viewport
      const centeredTraversal = (traversal - 0.5) * 2;

      targetOffset = centeredTraversal * speed * 120; // 120px max travel
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // Seed initial value
    onScroll();

    // ── rAF loop ────────────────────────────────────────────────────────
    let lastFlush = 0;
    const FLUSH_INTERVAL = 1000 / 30; // 30 fps React state

    const tick = (timestamp: number) => {
      if (isVisible) {
        currentOffset = lerp(currentOffset, targetOffset, LERP_FACTOR);

        // Snap when negligible
        if (Math.abs(currentOffset - targetOffset) < 0.05) {
          currentOffset = targetOffset;
        }

        if (timestamp - lastFlush >= FLUSH_INTERVAL) {
          lastFlush = timestamp;

          const rounded = Math.round(currentOffset * 100) / 100;
          const translate =
            direction === 'vertical'
              ? `translate3d(0, ${rounded}px, 0)`
              : `translate3d(${rounded}px, 0, 0)`;

          setStyle({
            transform: translate,
            willChange: 'transform',
          });
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    // ── Cleanup ─────────────────────────────────────────────────────────
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [speed, direction, shouldDisable]);

  return { ref: elRef, style };
}

import { useRef, useState, useEffect } from "react";

/**
 * useTaskFadeIn
 *
 * Attaches an IntersectionObserver to the returned `ref` and exposes
 * `isVisible` — a boolean that flips true when the element enters the
 * viewport (or its nearest scroll ancestor).
 *
 * Used by TaskRow to drive CSS data-attribute-based fade-in transitions
 * without requiring any JS animation library.
 */
export function useTaskFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible } as const;
}

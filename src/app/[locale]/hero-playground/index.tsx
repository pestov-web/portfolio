"use client";

import { useRef, type PointerEvent } from "react";
import { heroPlaygroundClassNames as styles } from "./hero-playground.styles";
import type { HeroPlaygroundProps } from "./hero-playground.types";

export function HeroPlayground({ label }: HeroPlaygroundProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const boundsRef = useRef<DOMRect | null>(null);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = boundsRef.current;
    if (!bounds) return;

    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    const root = rootRef.current;

    if (root) {
      root.style.cssText = [
        `--playground-rx: ${y * -8}deg`,
        `--playground-ry: ${x * 8}deg`,
        `--playground-x: ${50 + x * 12}%`,
        `--playground-y: ${50 + y * 12}%`,
      ].join(";");
    }
  };

  const resetTilt = () => {
    boundsRef.current = null;
    rootRef.current?.removeAttribute("style");
  };

  return (
    <div
      ref={rootRef}
      className={styles.root}
      aria-hidden="true"
      onPointerEnter={(event) => {
        boundsRef.current = event.currentTarget.getBoundingClientRect();
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
    >
      <div className={styles.stage}>
        <div className={styles.halo} />
        <div className={styles.axis} />
        <div className={styles.orbitOuter}>
          <span className={styles.marker} />
        </div>
        <div className={styles.orbitInner} />
        <div className={styles.orb}>
          <span className={styles.core} />
        </div>
      </div>
      <span className={styles.label}>{label}</span>
    </div>
  );
}

export type { HeroPlaygroundProps } from "./hero-playground.types";

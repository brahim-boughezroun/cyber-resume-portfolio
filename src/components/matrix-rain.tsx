"use client";

import { useEffect, useRef } from "react";

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let columns = 0;
    let drops: number[] = [];
    const fontSize = 15;
    const glyphs = "01アイウエオカキクケコサシスセソABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * ratio;
      canvas.height = window.innerHeight * ratio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      columns = Math.floor(window.innerWidth / fontSize);
      drops = Array.from({ length: columns }, () => Math.random() * -40);
    };

    const draw = () => {
      context.fillStyle = "rgba(2, 8, 5, 0.08)";
      context.fillRect(0, 0, window.innerWidth, window.innerHeight);
      context.font = `${fontSize}px monospace`;

      for (let index = 0; index < drops.length; index += 1) {
        const glyph = glyphs[Math.floor(Math.random() * glyphs.length)];
        const x = index * fontSize;
        const y = drops[index] * fontSize;
        context.fillStyle = index % 11 === 0 ? "rgba(172,255,194,.42)" : "rgba(43,255,116,.22)";
        context.fillText(glyph, x, y);

        if (y > window.innerHeight && Math.random() > 0.975) drops[index] = 0;
        drops[index] += reducedMotion ? 0.12 : 0.42;
      }

      frame = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={canvasRef} className="matrix-canvas" aria-hidden="true" />;
}

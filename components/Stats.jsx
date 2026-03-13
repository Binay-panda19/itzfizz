import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const stats = [
  { value: "280", label: "HP Twin Turbo" },
  { value: "5.3s", label: "0–100 km/h" },
  { value: "50/50", label: "Weight Balance" },
];

export default function Stats() {
  const containerRef = useRef(null);

  return (
    <div
      ref={containerRef}
      className="flex flex-wrap justify-center gap-10 md:gap-16 w-full max-w-4xl mx-auto px-6"
    >
      {stats.map((stat, i) => (
        <div
          key={i}
          className="stat-item flex flex-col items-center text-center opacity-0"
        >
          <span
            className="text-4xl md:text-5xl font-extrabold tracking-tight"
            style={{ color: "var(--accent)" }}
          >
            {stat.value}
          </span>
          <span
            className="mt-2 text-xs md:text-sm font-medium tracking-[0.25em] uppercase"
            style={{ color: "var(--text-muted)" }}
          >
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}

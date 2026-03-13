import { forwardRef } from "react";

const positionClasses = {
  left: "left-[6%] md:left-[8%] top-1/2 -translate-y-1/2",
  right: "right-[6%] md:right-[8%] top-1/2 -translate-y-1/2",
  bottom: "bottom-[10%] md:bottom-[12%] left-1/2 -translate-x-1/2",
};

const FeatureCard = forwardRef(function FeatureCard(
  { title, description, position = "left" },
  ref
) {
  return (
    <div
      ref={ref}
      className={`absolute opacity-0 ${positionClasses[position] || ""}`}
      style={{ zIndex: 5, willChange: "transform, opacity" }}
    >
      <div
        className="group relative overflow-hidden rounded-2xl border px-7 py-6 min-w-[200px] max-w-[240px] text-center backdrop-blur-xl transition-transform duration-500 hover:scale-105 cursor-default"
        style={{
          background: "rgba(255, 255, 255, 0.04)",
          borderColor: "rgba(255, 255, 255, 0.1)",
          boxShadow:
            "0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        {/* Glowing accent line */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-3/4 rounded-full transition-all duration-500 group-hover:w-full"
          style={{
            background: "linear-gradient(90deg, transparent, var(--accent), transparent)",
            boxShadow: "0 0 12px var(--accent-glow)",
          }}
        />
        {/* Hover glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
          style={{
            background: "radial-gradient(circle at center, var(--accent-glow) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10">
          <span className="block text-xl md:text-2xl font-extrabold tracking-tight" style={{ color: "var(--accent)" }}>
            {title}
          </span>
          <span className="block text-xs md:text-sm font-light leading-relaxed mt-2" style={{ color: "var(--text-muted)" }}>
            {description}
          </span>
        </div>
      </div>
    </div>
  );
});

export default FeatureCard;

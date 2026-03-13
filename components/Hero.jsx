import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Stats from "./Stats";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// No SSR for Three.js canvas
const CarScene = dynamic(() => import("./CarScene"), { ssr: false });

export default function Hero() {
  const sectionRef = useRef(null);
  const welcomeRef = useRef(null);
  const headlineRef = useRef(null);
  const statsRowRef = useRef(null);
  const scrollData = useRef(0);
  const [carVisible, setCarVisible] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ══════════════════════════════════════════
         PHASE 1 — INTRO SEQUENCE (page load)
         ══════════════════════════════════════════ */
      const intro = gsap.timeline({
        defaults: { ease: "power3.out" },
        onStart: () => {
          // Trigger car fade-in at timeline start
          setTimeout(() => setCarVisible(true), 300);
        },
      });

      // 1. "WELCOME ITZFIZZ" letters stagger in
      const welcomeLetters = welcomeRef.current.querySelectorAll(".letter");
      intro.fromTo(
        welcomeLetters,
        { y: 40, opacity: 0, rotateX: 60 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.7,
          stagger: 0.04,
          delay: 0.3,
        }
      );

      // 2. Main headline slides up
      intro.fromTo(
        headlineRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        "-=0.3"
      );

      // 3. Stats appear one-by-one
      const statItems = statsRowRef.current.querySelectorAll(".stat-item");
      intro.fromTo(
        statItems,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.2,
        },
        "-=0.4"
      );

      /* ══════════════════════════════════════════
         PHASE 2 — SCROLL-DRIVEN (pinned)
         ══════════════════════════════════════════ */
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=1000",
          scrub: true,
          pin: true,
          onUpdate: (self) => {
            scrollData.current = self.progress;
          },
        },
      });

      // Headline + welcome parallax out
      scrollTl.to(
        [welcomeRef.current, headlineRef.current],
        { y: -80, opacity: 0, ease: "none" },
        0
      );

      // Stats hold then fade
      scrollTl.to(
        statsRowRef.current,
        { y: -50, opacity: 0, ease: "none" },
        0.4
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Split text into individual letter spans
  const splitLetters = (text) =>
    text.split("").map((char, i) => (
      <span
        key={i}
        className="letter inline-block"
        style={{ display: char === " " ? "inline" : "inline-block" }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));

  return (
    <>
      <section
        ref={sectionRef}
        className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-between"
      >
        {/* 3D Canvas background */}
        <CarScene scrollData={scrollData} carVisible={carVisible} />

        {/* ── Top: Headlines + Stats ── */}
        <div className="relative z-10 pt-24 md:pt-32 flex flex-col items-center text-center pointer-events-none select-none px-6">
          {/* Welcome badge */}
          <div
            ref={welcomeRef}
            className="text-xs sm:text-sm font-semibold uppercase mb-5"
            style={{
              letterSpacing: "0.4em",
              color: "var(--accent)",
              perspective: "600px",
            }}
          >
            {splitLetters("WELCOME ITZFIZZ")}
          </div>

          {/* Main headline */}
          <h1
            ref={headlineRef}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold uppercase leading-none opacity-0"
            style={{
              letterSpacing: "0.35em",
              background:
                "linear-gradient(180deg, #ffffff 20%, rgba(255,255,255,0.35) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Drive the Legend
          </h1>

          {/* Stats row */}
          <div ref={statsRowRef} className="mt-10">
            <Stats />
          </div>
        </div>

        {/* ── Bottom: Scroll indicator ── */}
        <div className="relative z-10 pb-10 flex flex-col items-center gap-2 animate-bounce pointer-events-none">
          <span
            className="text-[10px] tracking-[0.3em] uppercase font-medium"
            style={{ color: "var(--text-muted)" }}
          >
            Scroll
          </span>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none" className="opacity-40">
            <rect x="1" y="1" width="14" height="22" rx="7" stroke="white" strokeWidth="1.5" />
            <circle cx="8" cy="8" r="2" fill="white">
              <animate attributeName="cy" values="8;16;8" dur="2s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40 z-[2] pointer-events-none"
          style={{ background: "linear-gradient(transparent, var(--background))" }}
        />
      </section>

      {/* Follow-up section for scroll space */}
      <section className="h-screen flex items-center justify-center">
        <p
          className="text-sm tracking-[0.3em] uppercase font-medium"
          style={{ color: "var(--text-muted)" }}
        >
          The legend continues…
        </p>
      </section>
    </>
  );
}

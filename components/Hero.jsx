import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import FeatureCard from "./FeatureCard";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const CarScene = dynamic(() => import("./CarScene"), { ssr: false });

export default function Hero() {
  const sectionRef = useRef(null);
  const welcomeRef = useRef(null);
  const headlineRef = useRef(null);
  const descRef = useRef(null);
  const bgGlowRef = useRef(null);
  const streaksRef = useRef(null);
  const scrollData = useRef(0);
  const [carVisible, setCarVisible] = useState(false);

  const cardLeftRef = useRef(null);
  const cardRightRef = useRef(null);
  const cardBottomRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      /* ══════════════════════════════════
         PHASE 1 — INTRO (page load)
         ══════════════════════════════════ */
      const intro = gsap.timeline({
        defaults: { ease: "power3.out" },
        onStart: () => setTimeout(() => setCarVisible(true), 300),
      });

      // Welcome heading stagger
      if (welcomeRef.current) {
        const welcomeLetters = welcomeRef.current.querySelectorAll(".letter");
        intro.fromTo(
          welcomeLetters,
          { y: 20, opacity: 0, rotateX: 60 },
          { y: 0, opacity: 1, rotateX: 0, duration: 0.7, stagger: 0.03, delay: 0.2 }
        );
      }

      // Main headline stagger
      if (headlineRef.current) {
        const titleLetters = headlineRef.current.querySelectorAll(".letter");
        intro.fromTo(
          titleLetters,
          { y: 40, opacity: 0, rotateX: 60 },
          { y: 0, opacity: 1, rotateX: 0, duration: 0.7, stagger: 0.04 },
          "-=0.4"
        );
      }

      // Description reveal
      if (descRef.current) {
        intro.fromTo(
          descRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.5"
        );
      }

      /* ══════════════════════════════════
         PHASE 2 — PINNED SCROLL
         ══════════════════════════════════ */
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=1500",
          scrub: true,
          pin: true,
          onUpdate: (self) => {
            scrollData.current = self.progress;
          },
        },
      });

      // Text elements parallax out
      scrollTl.to(
        [welcomeRef.current, headlineRef.current, descRef.current],
        { y: -80, opacity: 0, ease: "none", duration: 0.25 },
        0
      );

      // Background glow shift (parallax at different speed)
      scrollTl.to(
        bgGlowRef.current,
        { y: -50, scale: 1.3, ease: "none", duration: 1 },
        0
      );

      // Light streaks parallax (faster layer)
      scrollTl.to(
        streaksRef.current,
        { y: -120, ease: "none", duration: 1 },
        0
      );

      /* ─── Feature card reveals at 25% / 50% / 75% ─── */

      // 25%: left card slides in from x:-200
      scrollTl.fromTo(
        cardLeftRef.current,
        { x: -200, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.2, ease: "power2.out" },
        0.25
      );

      // 50%: right card slides in from x:200
      scrollTl.fromTo(
        cardRightRef.current,
        { x: 200, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.2, ease: "power2.out" },
        0.50
      );

      // 75%: bottom card slides in from y:150
      scrollTl.fromTo(
        cardBottomRef.current,
        { y: 150, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.2, ease: "power2.out" },
        0.75
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const splitLetters = (text) =>
    text.split("").map((char, i) => (
      <span
        key={i}
        className="letter inline-block"
        style={{
          display: char === " " ? "inline" : "inline-block",
          willChange: "transform, opacity",
        }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));

  return (
    <>
      <section ref={sectionRef} className="relative w-full h-screen overflow-hidden">

        {/* ─── BG Layer 0: Radial gradient ─── */}
        <div
          ref={bgGlowRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 0,
            willChange: "transform",
            background:
              "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(230,57,70,0.08) 0%, transparent 70%)",
          }}
        />

        {/* ─── BG Layer 0.5: Light streaks ─── */}
        <div
          ref={streaksRef}
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{ zIndex: 0, willChange: "transform" }}
        >
          {/* Streak 1 */}
          <div
            className="absolute"
            style={{
              top: "20%",
              left: "-10%",
              width: "120%",
              height: "1px",
              background:
                "linear-gradient(90deg, transparent 0%, rgba(230,57,70,0.15) 30%, rgba(255,255,255,0.08) 50%, rgba(230,57,70,0.15) 70%, transparent 100%)",
              transform: "rotate(-8deg)",
            }}
          />
          {/* Streak 2 */}
          <div
            className="absolute"
            style={{
              top: "55%",
              left: "-10%",
              width: "120%",
              height: "1px",
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 40%, rgba(230,57,70,0.1) 60%, transparent 100%)",
              transform: "rotate(5deg)",
            }}
          />
          {/* Streak 3 */}
          <div
            className="absolute"
            style={{
              top: "75%",
              left: "-10%",
              width: "120%",
              height: "1px",
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)",
              transform: "rotate(-3deg)",
            }}
          />
        </div>

        {/* ─── Layer 1: Feature Cards (z-5, BEHIND car) ─── */}
        <FeatureCard
          ref={cardLeftRef}
          title="280HP Twin Turbo"
          description="Legendary rotary power with lightweight balance"
          position="left"
        />
        <FeatureCard
          ref={cardRightRef}
          title="50/50 Weight Balance"
          description="Perfectly tuned for precision driving"
          position="right"
        />
        <FeatureCard
          ref={cardBottomRef}
          title="Rotary Engine"
          description="Iconic twin-rotor performance engineering"
          position="bottom"
        />

        {/* ─── Layer 2: 3D Car Canvas (z-10, ABOVE cards) ─── */}
        <div className="absolute inset-0" style={{ zIndex: 10 }}>
          <CarScene scrollData={scrollData} carVisible={carVisible} />
        </div>

        {/* ─── Layer 3: Headline (z-20, TOP) ─── */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-start pt-20 md:pt-28 pointer-events-none select-none px-6"
          style={{ zIndex: 20 }}
        >
          {/* Welcome heading */}
          <div
            ref={welcomeRef}
            className="text-2xl md:text-base font-bold uppercase mb-4"
            style={{
              letterSpacing: "0.4em",
              color: "var(--accent)",
              willChange: "transform, opacity",
            }}
          >
            {splitLetters("WELCOME ITZFIZZ")}
          </div>

          <h1
            ref={headlineRef}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold uppercase leading-none text-center"
            style={{
              letterSpacing: "0.35em",
              willChange: "transform, opacity",
              background: "linear-gradient(180deg, #ffffff 20%, rgba(255,255,255,0.35) 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            DRIVE THE LEGEND
          </h1>

          {/* Model Description */}
          <p
            ref={descRef}
            className="mt-6 max-w-lg text-center text-sm md:text-base font-light leading-relaxed"
            style={{ color: "var(--text-muted)", willChange: "transform, opacity" }}
          >
            Experience the rotary icon. Sculpted for lightweight perfection,
            the Mazda RX-7 FD delivers uncompromising performance and pure
            driving spirit.
          </p>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce pointer-events-none"
          style={{ zIndex: 20 }}
        >
          <span className="text-[10px] tracking-[0.3em] uppercase font-medium" style={{ color: "var(--text-muted)" }}>
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
          className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
          style={{ zIndex: 15, background: "linear-gradient(transparent, var(--background))" }}
        />
      </section>

      {/* Follow-up section */}
      <section className="h-screen flex items-center justify-center">
        <p className="text-sm tracking-[0.3em] uppercase font-medium" style={{ color: "var(--text-muted)" }}>
          The legend continues…
        </p>
      </section>
    </>
  );
}

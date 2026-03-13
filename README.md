# Mazda RX-7 FD — Premium 3D Hero Section

A cinematic, scroll-driven automotive landing page showcasing a 3D Mazda RX-7 model. Features a luxurious, dark-themed showroom environment built with cutting-edge web technologies, GSAP scroll animations, and React Three Fiber.

## 🚀 Tech Stack

* **[Next.js](https://nextjs.org/) (Pages Router)** – React framework for production
* **[React](https://react.dev/)** – UI Library
* **[Tailwind CSS](https://tailwindcss.com/)** – Utility-first CSS framework for styling
* **[GSAP & ScrollTrigger](https://gsap.com/)** – Professional-grade animation library for the staggered intro and complex pinned scroll sequencing
* **[Three.js](https://threejs.org/)** – 3D JavaScript library
* **[React Three Fiber (R3F)](https://docs.pmnd.rs/react-three-fiber/)** – React renderer for Three.js
* **[@react-three/drei](https://github.com/pmndrs/drei)** – Useful add-ons for R3F (Environment, Shadows, Cameras, Loaders)

## ✨ Features

- **Cinematic Lighting Rig**: Custom R3F setup including an orbiting sweep spotlight, warm/cool rim point lights, dense atmospheric fog, and ACES Filmic tone mapping.
- **GSAP Intro Sequence**: Orchestrated timeline on page load that staggers the "WELCOME ITZFIZZ" badge, the main "DRIVE THE LEGEND" gradient headline, and a descriptive paragraph before fading in the car.
- **Pinned Scroll-Driven Animations**: 
  - The hero section pins (`scrub: true`) while the user scrolls.
  - The 3D car dynamically scales up, translates upward, and rotates 180°.
  - Feature cards (z-index layered *behind* the car) slide out from left, right, and bottom at precise scroll percentages (25%, 50%, 75%).
- **Interactive Glassmorphism**: `FeatureCard` components utilize `backdrop-blur`, inset shadows, CSS variable gradients, and a glowing hover state.
- **Performance Optimized**: 
  - All intensive DOM animations use `transform` and `opacity` properties with hardware acceleration (`willChange`).
  - R3F canvas configured with `powerPreference: "high-performance"`, lowered shadow maps, and optimized mesh reflectors.

## 📂 Project Structure

```text
itzfizz/
├── components/
│   ├── CarScene.jsx      # 3D R3F Canvas, Lights, Floor, and GLTF Model loading
│   ├── FeatureCard.jsx   # Reusable glassmorphic stat card
│   └── Hero.jsx          # Main section: GSAP timelines, layering, and typography
├── pages/
│   ├── _app.js
│   └── index.js          # Entry point rendering the Hero
├── public/
│   └── models/
│       └── rx7.glb       # 🔴 NOTE: Drop your 3D model here!
└── styles/
    └── globals.css       # Core CSS variables, scrollbars, and dark theme
```

## 🛠️ Setup & Installation

**Prerequisites:** Ensure you have [Bun](https://bun.sh/) or Node/npm installed.

1. **Clone/Download the repository**
2. **Install dependencies:**
   ```bash
   bun install
   # or npm install
   ```
3. **Add the 3D Model:**
   This project expects a `.glb` 3D model. Place your Mazda RX-7 file here: 
   `public/models/rx7.glb`.
   *(If the file is missing, a wireframe placeholder box will render instead).*
4. **Run the development server:**
   ```bash
   bun run dev
   # or npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 License
This project was built for educational/demonstration purposes.

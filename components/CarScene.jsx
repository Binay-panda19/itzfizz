import { useRef, Suspense, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  Environment,
  ContactShadows,
  PerspectiveCamera,
  MeshReflectorMaterial,
} from "@react-three/drei";
import * as THREE from "three";

/* ───────────── Moving Sweep Light ───────────── */
function SweepLight() {
  const lightRef = useRef();

  useFrame((state) => {
    if (!lightRef.current) return;
    const t = state.clock.getElapsedTime();
    // Sweep slowly left ↔ right across the car
    lightRef.current.position.x = Math.sin(t * 0.4) * 6;
    lightRef.current.position.z = Math.cos(t * 0.4) * 3;
  });

  return (
    <spotLight
      ref={lightRef}
      position={[0, 8, 3]}
      angle={0.35}
      penumbra={1}
      intensity={2.5}
      castShadow
      shadow-mapSize={[2048, 2048]}
      color="#ffffff"
      distance={20}
      decay={2}
    />
  );
}

/* ───────────── Car Model ───────────── */
function Car({ scrollData, visible }) {
  const group = useRef();
  const materialOpacity = useRef(0);
  const { scene } = useGLTF("/models/rx7.glb");

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.envMapIntensity = 2;
          child.material.transparent = true;
        }
      }
    });
  }, [scene]);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    const p = scrollData?.current || 0;

    // Smooth fade-in
    const targetOpacity = visible ? 1 : 0;
    materialOpacity.current += (targetOpacity - materialOpacity.current) * 0.05;
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.opacity = materialOpacity.current;
      }
    });

    // Rotation: sideways reveal + idle sway + scroll-driven
    group.current.rotation.y =
      -Math.PI / 6 + Math.sin(t * 0.3) * 0.03 + p * Math.PI * 0.45;

    // Upward movement on scroll
    group.current.position.y = -0.5 + p * 0.6;

    // Scale on scroll
    const s = 1 + p * 0.15;
    group.current.scale.set(s, s, s);
  });

  return (
    <group ref={group} rotation={[0, -Math.PI / 6, 0]} position={[0, -0.5, 0]}>
      <primitive object={scene} />
    </group>
  );
}

/* ───────────── Reflective Floor ───────────── */
function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.51, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <MeshReflectorMaterial
        blur={[400, 200]}
        resolution={1024}
        mixBlur={1}
        mixStrength={60}
        roughness={0.85}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#080808"
        metalness={0.6}
        mirror={0.6}
      />
    </mesh>
  );
}

/* ───────────── Lighting Rig ───────────── */
function Lights() {
  return (
    <>
      {/* Key top light */}
      <spotLight
        position={[0, 12, 0]}
        angle={0.5}
        penumbra={1}
        intensity={1.8}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
        color="#ffffff"
      />

      {/* Warm rim light (right-rear) */}
      <pointLight position={[6, 3, -4]} intensity={2} color="#ff6b35" distance={15} decay={2} />

      {/* Cool rim light (left-front) */}
      <pointLight position={[-6, 3, 4]} intensity={1.5} color="#4a90d9" distance={15} decay={2} />

      {/* Glowing rim accent (low, behind car) */}
      <pointLight position={[0, 0.5, -4]} intensity={1.2} color="#e63946" distance={8} decay={2} />

      {/* Soft ambient fill */}
      <ambientLight intensity={0.1} />

      {/* Moving sweep light */}
      <SweepLight />
    </>
  );
}

/* ───────────── Loading Fallback ───────────── */
function Loader() {
  return (
    <mesh>
      <boxGeometry args={[1, 0.5, 2]} />
      <meshStandardMaterial color="#1a1a1a" wireframe />
    </mesh>
  );
}

/* ───────────── Main Scene Export ───────────── */
export default function CarScene({ scrollData, carVisible }) {
  return (
    <div className="canvas-container">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 2, 6]} fov={40} />

        {/* Dense atmospheric fog */}
        <fog attach="fog" args={["#050505", 6, 22]} />
        <color attach="background" args={["#050505"]} />

        <Lights />

        <Suspense fallback={<Loader />}>
          <Car scrollData={scrollData} visible={carVisible} />
          <Floor />
          <Environment preset="city" environmentIntensity={0.4} />
        </Suspense>

        <ContactShadows
          position={[0, -0.5, 0]}
          opacity={0.7}
          scale={20}
          blur={2.5}
          far={4}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/rx7.glb");

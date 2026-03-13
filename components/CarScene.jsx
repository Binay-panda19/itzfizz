import { useRef, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  Environment,
  ContactShadows,
  PerspectiveCamera,
  MeshReflectorMaterial,
} from "@react-three/drei";
import * as THREE from "three";

/* ───────────── Sweep Light (performance: single moving light) ───────────── */
function SweepLight() {
  const lightRef = useRef();
  useFrame((state) => {
    if (!lightRef.current) return;
    const t = state.clock.getElapsedTime();
    lightRef.current.position.x = Math.sin(t * 0.4) * 6;
    lightRef.current.position.z = Math.cos(t * 0.4) * 3;
  });
  return (
    <spotLight
      ref={lightRef}
      position={[0, 8, 3]}
      angle={0.35}
      penumbra={1}
      intensity={2}
      color="#ffffff"
      distance={18}
      decay={2}
    />
  );
}

/* ───────────── Car Model ───────────── */
function Car({ scrollData, visible }) {
  const group = useRef();
  const opacityVal = useRef(0);
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

  useFrame(() => {
    if (!group.current) return;
    const p = scrollData?.current || 0;

    // Smooth fade-in on load
    const target = visible ? 1 : 0;
    opacityVal.current += (target - opacityVal.current) * 0.05;
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.opacity = opacityVal.current;
      }
    });

    // Rotation: 0 → 180° (π radians) over scroll
    group.current.rotation.y = p * Math.PI;

    // Upward shift
    group.current.position.y = -0.5 + p * 0.5;

    // Scale: 1 → 1.1
    const s = 1 + p * 0.1;
    group.current.scale.set(s, s, s);
  });

  return (
    <group ref={group} position={[0, -0.5, 0]}>
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
        blur={[300, 100]}
        resolution={512}
        mixBlur={1}
        mixStrength={50}
        roughness={0.9}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#060606"
        metalness={0.5}
        mirror={0.5}
      />
    </mesh>
  );
}

/* ───────────── Lighting Rig (optimized: 4 lights + sweep) ───────────── */
function Lights() {
  return (
    <>
      {/* Overhead spotlight — dramatic highlight */}
      <spotLight
        position={[0, 10, 0]}
        angle={0.5}
        penumbra={1}
        intensity={1.8}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
        color="#ffffff"
      />
      {/* Rim light — behind car, outlines shape */}
      <pointLight position={[0, 1, -5]} intensity={1.5} color="#e63946" distance={10} decay={2} />
      {/* Warm accent (right) */}
      <pointLight position={[5, 3, -3]} intensity={1} color="#ff6b35" distance={12} decay={2} />
      {/* Ambient base */}
      <ambientLight intensity={0.12} />
      {/* Sweep light */}
      <SweepLight />
    </>
  );
}

/* ───────────── Fallback ───────────── */
function Loader() {
  return (
    <mesh>
      <boxGeometry args={[1, 0.5, 2]} />
      <meshStandardMaterial color="#1a1a1a" wireframe />
    </mesh>
  );
}

/* ───────────── Main Scene ───────────── */
export default function CarScene({ scrollData, carVisible }) {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
      <Canvas
        shadows
        dpr={[1, 1.5]}
        gl={{
          alpha: true,
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
          powerPreference: "high-performance",
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 2, 6]} fov={40} />
        <fog attach="fog" args={["#050505", 7, 20]} />

        <Lights />

        <Suspense fallback={<Loader />}>
          <Car scrollData={scrollData} visible={carVisible} />
          <Floor />
          <Environment preset="city" environmentIntensity={0.35} />
        </Suspense>

        <ContactShadows position={[0, -0.5, 0]} opacity={0.5} scale={15} blur={2} far={3} />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/rx7.glb");

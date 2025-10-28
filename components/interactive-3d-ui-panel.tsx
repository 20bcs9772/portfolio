"use client";

import type React from "react";
import { useRef, Suspense, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  useGLTF,
  OrbitControls,
} from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

function SpaceEnvironment() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.0} castShadow />
      <directionalLight position={[-5, 3, -3]} intensity={0.5} />
      <pointLight position={[0, 3, 0]} intensity={0.6} color="#6b9eff" />
      <pointLight position={[3, -2, 2]} intensity={0.4} color="#ff8c6b" />
      <Environment preset="night" environmentIntensity={0.5} />
    </>
  );
}

function FloatingAnimation({
  groupRef,
}: {
  groupRef: React.MutableRefObject<THREE.Group | null>;
}) {
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    timeRef.current += delta * 0.3;

    // Subtle floating motion
    const floatY = Math.sin(timeRef.current) * 0.08;
    const floatX = Math.sin(timeRef.current * 0.7) * 0.04;
    const floatZ = Math.cos(timeRef.current * 0.5) * 0.04;

    // Apply floating offset to position
    groupRef.current.position.y = floatY;
    groupRef.current.position.x = floatX;
    groupRef.current.position.z = floatZ;

    // Subtle rotation drift
    groupRef.current.rotation.x += delta * 0.05;
    groupRef.current.rotation.z += delta * 0.03;
  });

  return null;
}

function GLTFModel({
  url,
  hoveredRef,
  baseScale = 1.2,
}: {
  url: string;
  hoveredRef: React.MutableRefObject<boolean>;
  baseScale?: number;
}) {
  const group = useRef<THREE.Group>(null!);
  const { scene } = useGLTF(url);

  useFrame((_, dt) => {
    const targetScale = hoveredRef.current ? baseScale * 1.12 : baseScale;

    if (group.current) {
      const s = group.current.scale;
      s.setScalar(s.x + (targetScale - s.x) * Math.min(1, dt * 8));
    }
  });

  return (
    <group ref={group}>
      <primitive
        object={scene}
        onPointerOver={(e: any) => {
          e.stopPropagation();
          hoveredRef.current = true;
          document.body.style.cursor = "grab";
        }}
        onPointerOut={(e: any) => {
          e.stopPropagation();
          hoveredRef.current = false;
          document.body.style.cursor = "auto";
        }}
        onPointerDown={() => {
          document.body.style.cursor = "grabbing";
        }}
        onPointerUp={() => {
          document.body.style.cursor = hoveredRef.current ? "grab" : "auto";
        }}
        scale={baseScale}
      />
      <FloatingAnimation groupRef={group} />
    </group>
  );
}

function FallbackModel({
  hoveredRef,
}: {
  hoveredRef: React.MutableRefObject<boolean>;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);
  const matRef = useRef<THREE.MeshStandardMaterial>(null!);

  useFrame((_, dt) => {
    if (meshRef.current) {
      const targetScale = hoveredRef.current ? 1.12 : 1.0;
      const s = meshRef.current.scale;
      s.setScalar(s.x + (targetScale - s.x) * Math.min(1, dt * 8));
    }

    if (matRef.current) {
      const targetMetal = hoveredRef.current ? 0.7 : 0.45;
      const targetRough = hoveredRef.current ? 0.12 : 0.2;
      matRef.current.metalness +=
        (targetMetal - matRef.current.metalness) * Math.min(1, dt * 8);
      matRef.current.roughness +=
        (targetRough - matRef.current.roughness) * Math.min(1, dt * 8);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          hoveredRef.current = true;
          document.body.style.cursor = "grab";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          hoveredRef.current = false;
          document.body.style.cursor = "auto";
        }}
        onPointerDown={() => {
          document.body.style.cursor = "grabbing";
        }}
        onPointerUp={() => {
          document.body.style.cursor = hoveredRef.current ? "grab" : "auto";
        }}
      >
        <torusKnotGeometry args={[0.7, 0.24, 220, 36]} />
        <meshStandardMaterial
          ref={matRef}
          color="hsl(210 90% 65%)"
          metalness={0.45}
          roughness={0.2}
          envMapIntensity={1.8}
        />
      </mesh>
      <FloatingAnimation groupRef={groupRef} />
    </group>
  );
}

function Stars() {
  const starsRef = useRef<THREE.Points>(null!);

  const starGeometry = useRef<THREE.BufferGeometry | null>(null);

  useEffect(() => {
    const geometry = new THREE.BufferGeometry();
    const starCount = 2000;
    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      // Create stars in a sphere around the scene
      const radius = 30 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    starGeometry.current = geometry;
  }, []);

  useFrame((_, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.02;
      starsRef.current.rotation.x += delta * 0.01;
    }
  });

  if (!starGeometry.current) return null;

  return (
    <points ref={starsRef}>
      <bufferGeometry attach="geometry" {...starGeometry.current} />
      <pointsMaterial
        attach="material"
        color="#ffffff"
        size={0.15}
        sizeAttenuation={true}
        transparent={true}
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function ScanLines() {
  const linesRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (linesRef.current) {
      linesRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={linesRef}>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} rotation={[0, (Math.PI / 2) * i, 0]} position={[0, 0, 0]}>
          <torusGeometry args={[2.5, 0.002, 8, 100]} />
          <meshBasicMaterial
            color="#4fc3f7"
            transparent
            opacity={0.15}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.5, 0.002, 8, 100]} />
        <meshBasicMaterial
          color="#4fc3f7"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export default function Interactive3DUIPanel({
  modelUrl,
  title = "",
  subtitle = "",
}: {
  modelUrl?: string;
  title?: string;
  subtitle?: string;
}) {
  const hoveredRef = useRef(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [uploadedModelUrl, setUploadedModelUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadZone, setShowUploadZone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      setTimeout(() => setShowInstructions(false), 2000);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".glb") && !file.name.endsWith(".gltf")) {
      alert("Please upload a .glb or .gltf file");
      return;
    }

    setIsUploading(true);
    const url = URL.createObjectURL(file);

    // Simulate loading delay for smooth transition
    setTimeout(() => {
      setUploadedModelUrl(url);
      setIsUploading(false);
      setShowUploadZone(false);
    }, 500);
  };

  const currentModelUrl = uploadedModelUrl || modelUrl;

  useEffect(() => {
    // Disable body scroll
    document.body.style.overflow = "hidden";
    document.body.style.margin = "0";
    document.body.style.padding = "0";

    // Auto-hide instructions after 8 seconds
    const timer = setTimeout(() => {
      setShowInstructions(false);
    }, 8000);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
      // Cleanup object URL
      if (uploadedModelUrl) {
        URL.revokeObjectURL(uploadedModelUrl);
      }
    };
  }, [uploadedModelUrl]);

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-slate-950">
      {/* 3D Canvas - Full screen */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0.8, 5], fov: 45 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x0a0a0f, 1);
          }}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
          }}
          onPointerDown={handleInteraction}
        >
          <SpaceEnvironment />

          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            enableDamping={true}
            dampingFactor={0.05}
            rotateSpeed={0.6}
            zoomSpeed={0.7}
            panSpeed={0.5}
            minDistance={2.5}
            maxDistance={10}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 1.5}
            makeDefault
            onStart={handleInteraction}
          />

          <Suspense fallback={null}>
            {currentModelUrl ? (
              <GLTFModel
                url={currentModelUrl}
                hoveredRef={hoveredRef}
                baseScale={1.3}
              />
            ) : (
              <FallbackModel hoveredRef={hoveredRef} />
            )}
          </Suspense>

          <Stars />
          <ScanLines />

          <ContactShadows
            position={[0, -1.2, 0]}
            opacity={0.25}
            scale={10}
            blur={3}
            far={4}
            resolution={512}
            color="#4fc3f7"
          />

          {/* Grid floor */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
            <planeGeometry args={[20, 20, 20, 20]} />
            <meshBasicMaterial
              color="#1a1a2e"
              wireframe
              transparent
              opacity={0.1}
            />
          </mesh>
        </Canvas>
      </div>

      {/* Header text overlay */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10">
        <div className="mx-auto max-w-4xl px-6 text-center pt-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white via-blue-100 to-blue-300"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-4 text-lg md:text-xl text-blue-200/70"
          >
            {subtitle}
          </motion.p>
        </div>
      </div>

      {/* Instructions overlay */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="pointer-events-none absolute bottom-12 inset-x-0 z-10 flex justify-center"
          >
            <div className="bg-slate-900/80 backdrop-blur-md px-8 py-5 rounded-2xl border border-blue-500/30 shadow-2xl shadow-blue-500/20">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-6 text-sm text-slate-200">
                  <span className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-slate-800 rounded text-xs border border-slate-700">
                      Left Click
                    </kbd>
                    <span>Rotate</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-slate-800 rounded text-xs border border-slate-700">
                      Scroll
                    </kbd>
                    <span>Zoom</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-slate-800 rounded text-xs border border-slate-700">
                      Right Click
                    </kbd>
                    <span>Pan</span>
                  </span>
                </div>
                <p className="text-xs text-center text-blue-300/60">
                  Your view is preserved as you interact
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scanlines overlay effect */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-5">
        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent animate-pulse"
          style={{ animationDuration: "4s" }}
        />
      </div>

      {/* Upload Button - Top Right */}
      <div className="absolute top-8 right-8 z-20 flex gap-3">
        {uploadedModelUrl && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => {
              if (uploadedModelUrl) {
                URL.revokeObjectURL(uploadedModelUrl);
              }
              setUploadedModelUrl(null);
            }}
            className="group relative px-6 py-3 bg-slate-900/80 backdrop-blur-md rounded-xl border border-red-500/30 hover:border-red-500/60 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative text-red-400 font-medium text-sm flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Reset Model
            </span>
          </motion.button>
        )}

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          onClick={() => setShowUploadZone(!showUploadZone)}
          className="group relative px-6 py-3 bg-slate-900/80 backdrop-blur-md rounded-xl border border-blue-500/30 hover:border-blue-500/60 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="relative text-blue-400 font-medium text-sm flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            Upload Model
          </span>
          <div className="absolute inset-0 border-2 border-blue-400/0 group-hover:border-blue-400/20 rounded-xl transition-all duration-300" />
        </motion.button>
      </div>

      {/* Upload Zone Modal */}
      <AnimatePresence>
        {showUploadZone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setShowUploadZone(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full mx-6"
            >
              {/* Glowing border effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 rounded-3xl opacity-30 blur-xl animate-pulse" />

              <div className="relative bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-blue-500/30 p-12 shadow-2xl">
                {/* Close button */}
                <button
                  onClick={() => setShowUploadZone(false)}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".glb,.gltf"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="group cursor-pointer"
                >
                  <div className="relative border-2 border-dashed border-blue-500/40 rounded-xl p-16 text-center hover:border-blue-400/60 transition-all duration-300">
                    {/* Animated corner accents */}
                    <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-cyan-400 rounded-tl-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-cyan-400 rounded-tr-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-cyan-400 rounded-bl-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-cyan-400 rounded-br-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {isUploading ? (
                      <div className="flex flex-col items-center gap-4">
                        <div className="relative w-16 h-16">
                          <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full" />
                          <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin" />
                        </div>
                        <p className="text-blue-300 font-medium">
                          Processing model...
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="mb-6 flex justify-center">
                          <div className="relative">
                            <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
                            <svg
                              className="relative w-20 h-20 text-blue-400 group-hover:scale-110 transition-transform duration-300"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              />
                            </svg>
                          </div>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-3">
                          Upload Your 3D Model
                        </h3>
                        <p className="text-slate-400 mb-6 text-lg">
                          Drop your .GLB or .GLTF file here, or click to browse
                        </p>

                        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg text-white font-medium group-hover:shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                          Choose File
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-700/50">
                          <p className="text-sm text-slate-500">
                            Supported formats:{" "}
                            <span className="text-blue-400 font-mono">
                              .glb
                            </span>
                            ,{" "}
                            <span className="text-blue-400 font-mono">
                              .gltf
                            </span>
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

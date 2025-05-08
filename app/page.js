"use client";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import Image from "next/image";
import { useControls } from "leva";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

// DoorModel component with dynamic material logic
function DoorModel() {
  const gltf = useGLTF("/Door.glb");

  const { textureUrl, variant, rotation } = useControls({
    textureUrl: {
      value: "/lami4.jpg",
      options: ["/lami2.jpg", "/lami3.jpg", "/lami4.jpg"],
    },
    variant: {
      value: "matte",
      options: ["glossy", "matte", "satin", "custom"],
    },
    rotation: {
      value: Math.PI / 2,
      min: 0,
      max: Math.PI * 2,
      step: 0.01,
    },
  });

  // Memoized texture loading
  const texture = useMemo(() => new THREE.TextureLoader().load(textureUrl), [textureUrl]);

  useEffect(() => {
    gltf.scene.traverse((child) => {
      if (child.isMesh && child.name === "Door") {
        child.material.map = texture;
        child.material.roughnessMap = texture;

        // Presets for each wrap finish
        const materialPresets = {
          glossy: {
            metalness: 0.6,
            roughness: 0.3,
            clearcoat: 1.0,
            clearcoatRoughness: 0.05,
            envMapIntensity: 2.5,
          },
          matte: {
            metalness: 0,
            roughness: 2.0,
            clearcoat: 0.0,
            clearcoatRoughness: 0.0,
            envMapIntensity: 0.3,
          },
          satin: {
            metalness: 0.1,
            roughness: 2,
            clearcoat: 0.2,
            clearcoatRoughness: 0.4,
            envMapIntensity: 1.2,
          },
        };

        // Apply the selected preset
        const props = materialPresets[variant];
        child.material.metalness = props.metalness;
        child.material.roughness = props.roughness;
        child.material.clearcoat = props.clearcoat;
        child.material.clearcoatRoughness = props.clearcoatRoughness;
        child.material.envMapIntensity = props.envMapIntensity;
        child.material.needsUpdate = true;
      }
    });
  }, [texture, variant]);

  return (
    <group position={[0, -10, 0]} rotation={[rotation, 0, 0]}>
      <primitive object={gltf.scene} scale={1.5} />
    </group>
  );
}

// Light setup
const Lights = () => {
  const { lightPosition, lightIntensity } = useControls({
    lightPosition: {
      value: [5, 10, 7],
      step: 0.1,
    },
    lightIntensity: {
      value: 0,
      min: 0,
      max: 5,
      step: 0.1,
    },
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={lightPosition} intensity={lightIntensity} castShadow />
    </>
  );
};

// Main component
export default function Home() {
  const { environmentPreset } = useControls({
    environmentPreset: {
      value: "city",
      options: ["sunset", "dawn", "night", "warehouse", "forest", "apartment", "studio", "city", "park", "lobby"],
    },
  });

  return (
    <div className="">
      <main className="">
        <div
          style={{
            width: "100vw",
            height: "100vh",
            background: "#222",
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          <Canvas dpr={[5, 5]} camera={{ position: [-20, 2, 5], fov: 60 }} shadows>
            <Environment preset={environmentPreset} background blur={0} />
            <Lights />
            <DoorModel />
            <OrbitControls enablePan enableZoom enableRotate />
          </Canvas>
        </div>

        <Image src={"/lami4.jpg"} height={500} width={500} alt="image" className="absolute z-50 left-0 top-0" />
      </main>
    </div>
  );
}

// Preload model
useGLTF.preload("/Door.glb");

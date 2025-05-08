"use client";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF, Box } from "@react-three/drei";
import Image from "next/image";
import { MeshStandardMaterial, MeshBasicMaterial, MeshPhongMaterial, MeshLambertMaterial, MeshPhysicalMaterial, MeshToonMaterial } from "three";

import { useControls } from "leva";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

// DoorModel component with dynamic material logic
function DoorModel() {
  const gltf = useGLTF("/door.glb");

  const { textureUrl, rotation, roughness, metalness, color } = useControls({
    textureUrl: {
      value: "/lami4.jpg",
      options: ["/lami2.jpg", "/lami3.jpg", "/lami4.jpg"],
    },
    rotation: {
      value: Math.PI / 2,
      min: 0,
      max: Math.PI * 2,
      step: 0.01,
    },
    roughness: {
      value: 0.9,
      min: 0,
      max: 1,
      step: 0.01,
    },
    metalness: {
      value: 0.1,
      min: 0,
      max: 1,
      step: 0.01,
    },
    color: {
      value: "#ffffff",
    },
  });

  // Memoized texture loading
  const texture = useMemo(() => new THREE.TextureLoader().load(textureUrl), [textureUrl]);

  useEffect(() => {
    gltf.scene.traverse((child) => {
      if (child.isMesh && child.name === "Door") {
        const standardMaterial = new THREE.MeshStandardMaterial();
        standardMaterial.map = texture;
        standardMaterial.color = new THREE.Color(color);
        standardMaterial.roughness = roughness;
        standardMaterial.metalness = metalness;
        child.material = standardMaterial;
      }
    });
  }, [texture, roughness, metalness, color]);

  return (
    <group position={[0, -10, 0]} rotation={[rotation, 0, 0]}>
      <primitive object={gltf.scene} scale={1.5} />
    </group>
  );
}

const MaterialBoxes = () => {
  const handleClick = (materialName) => {
    // alert(`This is a ${materialName} material`);
  };

  return (
    <>
      {/* Standard Material Box with matte finish */}
      <Box position={[-20, 0, 0]} scale={[5, 5, 5]} onClick={() => handleClick("Standard")}>
        <meshStandardMaterial color="#ffffff" roughness={0.9} metalness={0.1} />
      </Box>

      {/* Standard Material Box with different roughness */}
      <Box position={[20, 0, 0]} scale={[5, 5, 5]} onClick={() => handleClick("Standard")}>
        <meshStandardMaterial color="#ffffff" roughness={0.8} metalness={0.1} />
      </Box>
    </>
  );
};

// Light setup
const Lights = () => {
  const { lightPosition, lightIntensity } = useControls({
    lightPosition: {
      value: [5, 10, 7],
      step: 0.1,
    },
    lightIntensity: {
      value: 1,
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
          <Canvas dpr={[2, 4]} camera={{ position: [-20, 2, 5], fov: 60 }} shadows>
            <Environment preset={environmentPreset} background blur={0} />
            <Lights />
            <DoorModel />
            <MaterialBoxes />
            <OrbitControls enablePan enableZoom enableRotate />
          </Canvas>
        </div>
      </main>
    </div>
  );
}

// Preload model
useGLTF.preload("/door.glb");

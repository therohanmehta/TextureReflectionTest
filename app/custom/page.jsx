"use client";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF, Box } from "@react-three/drei";
import Image from "next/image";
import { useControls } from "leva";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

// DoorModel component with dynamic material logic
function DoorModel() {
  const gltf = useGLTF("/Door.glb");

  const { textureUrl, rotation, metalness, roughness, clearcoat, clearcoatRoughness, envMapIntensity } = useControls({
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
    metalness: {
      value: 0.1,
      min: 0,
      max: 1,
      step: 0.01,
    },
    roughness: {
      value: 0.5,
      min: 0,
      max: 2,
      step: 0.01,
    },
    clearcoat: {
      value: 0.5,
      min: 0,
      max: 1,
      step: 0.01,
    },
    clearcoatRoughness: {
      value: 0.2,
      min: 0,
      max: 1,
      step: 0.01,
    },
    envMapIntensity: {
      value: 1,
      min: 0,
      max: 5,
      step: 0.1,
    },
  });

  // Memoized texture loading
  const texture = useMemo(() => new THREE.TextureLoader().load(textureUrl), [textureUrl]);

  useEffect(() => {
    gltf.scene.traverse((child) => {
      if (child.isMesh && child.name === "Door") {
        child.material.map = texture;
        child.material.roughnessMap = texture;
        child.material.metalness = metalness;
        child.material.roughness = roughness;
        child.material.clearcoat = clearcoat;
        child.material.clearcoatRoughness = clearcoatRoughness;
        child.material.envMapIntensity = envMapIntensity;
        child.material.needsUpdate = true;
      }
    });
  }, [texture, metalness, roughness, clearcoat, clearcoatRoughness, envMapIntensity]);

  return (
    <group position={[0, -10, 0]} rotation={[rotation, 0, 0]}>
      <primitive object={gltf.scene} scale={1.5} />
    </group>
  );
}
const MaterialBoxes = () => {
  return (
    <>
      {/* Standard Material Box */}
      <Box position={[-6, 0, 0]}>
        <meshStandardMaterial color="#000000" />
      </Box>

      {/* Basic Material Box */}
      <Box position={[-3, 0, 0]}>
        <meshBasicMaterial color="#000000" />
      </Box>

      {/* Phong Material Box */}
      <Box position={[0, 0, 0]}>
        <meshPhongMaterial color="#000000" shininess={100} />
      </Box>

      {/* Lambert Material Box */}
      <Box position={[3, 0, 0]}>
        <meshLambertMaterial color="#000000" />
      </Box>

      {/* Physical Material Box */}
      <Box position={[6, 0, 0]}>
        <meshPhysicalMaterial color="#000000" roughness={0.5} metalness={0.5} />
      </Box>

      {/* Toon Material Box */}
      <Box position={[9, 0, 0]}>
        <meshToonMaterial color="#000000" />
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
            <MaterialBoxes />
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

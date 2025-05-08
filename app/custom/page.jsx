"use client";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF, Box } from "@react-three/drei";
import Image from "next/image";
import { MeshStandardMaterial, MeshBasicMaterial, MeshPhongMaterial, MeshLambertMaterial, MeshPhysicalMaterial, MeshToonMaterial } from "three";

import { Leva, useControls } from "leva";
import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";

// DoorModel component with dynamic material logic
function DoorModel({ roughnessMetalness, hdrIntensity }) {
  const gltf = useGLTF("/Door.glb");

  const { textureUrl, rotation, roughness, metalness, color, position, textureRepeat } = useControls({
    textureUrl: {
      value: "/lami4.jpg",
      options: ["/lami2.jpg", "/lami3.jpg", "/lami4.jpg", "/lami5.jpg", "/lami6.jpg"],
    },
    textureRepeat: {
      value: [1, 1],
      min: [0.1, 0.1],
      max: [10, 10],
      step: 0.1,
    },
    rotation: {
      value: [0, 0],
      min: [0, 0],
      max: [Math.PI * 2, Math.PI * 2],
      step: 0.01,
    },
    position: {
      value: [0, -10, 0],
      min: [-10, -10, -10],
      max: [10, 10, 10],
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

  // Memoized texture loading with repeat settings
  const texture = useMemo(() => {
    const tex = new THREE.TextureLoader().load(textureUrl);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(textureRepeat[0], textureRepeat[1]);
    return tex;
  }, [textureUrl, textureRepeat]);

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
  }, [texture, roughness, metalness, color, roughnessMetalness, hdrIntensity]);

  return (
    <group position={position} rotation={[rotation[0], rotation[1], 0]}>
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
  const [roughnessMetalness, setRoughnessMetalness] = useState({ r: 0, m: 0 });
  const [textureUrl, setTextureUrl] = useState("/lami4.jpg");
  const [selectedTexture, setSelectedTexture] = useState("stone"); // Track selected texture
  const [selectedFinish, setSelectedFinish] = useState("glossy"); // Track selected finish

  const { hdrPath, hdrRotation, hdrIntensity } = useControls({
    hdrPath: {
      value: "/hdr.hdr",
      options: ["/hdr.hdr", "/hdr2.hdr", "/hdr3.hdr", "/hdr4.hdr"],
    },
    hdrRotation: {
      value: 1.2,
      min: 0,
      max: Math.PI * 2,
      step: 0.01,
    },
    hdrIntensity: {
      value: 1,
      min: 0,
      max: 5,
      step: 0.1,
    },
  });

  const handleMaterialChange = (roughness, metalness, finish) => {
    setRoughnessMetalness({ r: roughness, m: metalness });
    setSelectedFinish(finish);
  };

  const handleTextureChange = (url, texture) => {
    setTextureUrl(url);
    setSelectedTexture(texture);
  };

  return (
    <div className="">
      {/* <div className="absolute bottom-0 left-1/2 -translate-1/2  flex gap-3 z-50 flex-col items-center justify-center">
        <div className="flex gap-4">
          <button
            onClick={() => handleTextureChange("/lami5.jpg", "woodgrain")}
            className={`cursor-crosshair px-4 py-2 rounded-md   transition-colors duration-200 font-medium text-white ${
              selectedTexture === "woodgrain" ? "bg-blue-600" : "bg-black"
            }`}
          >
            Woodgrain Laminate
          </button>
          <button
            onClick={() => handleTextureChange("/lami2.jpg", "grain")}
            className={`cursor-crosshair px-4 py-2 rounded-md   transition-colors duration-200 font-medium text-white ${
              selectedTexture === "grain" ? "bg-blue-600" : "bg-black"
            }`}
          >
            Grain Texture
          </button>
          <button
            onClick={() => handleTextureChange("/lami4.jpg", "stone")}
            className={`px-4 py-2 rounded-md   transition-colors duration-200 font-medium text-white ${
              selectedTexture === "stone" ? "bg-blue-600" : "bg-black"
            }`}
          >
            Stone Laminate
          </button>
          <button
            onClick={() => handleTextureChange("/lami6.jpg", "texmex")}
            className={`px-4 py-2 rounded-md   transition-colors duration-200 font-medium text-white ${
              selectedTexture === "texmex" ? "bg-blue-600" : "bg-black"
            }`}
          >
            Tex Mex Laminate
          </button>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => handleMaterialChange(0.06, 0.5, "glossy")}
            className={`cursor-crosshair px-4 py-2 rounded-md   transition-colors duration-200 font-medium text-white ${
              selectedFinish === "glossy" ? "bg-blue-600" : "bg-black"
            }`}
          >
            Glossy
          </button>
          <button
            onClick={() => handleMaterialChange(0.35, 0.88, "matte")}
            className={`px-4 py-2 rounded-md   transition-colors duration-200 font-medium text-white ${
              selectedFinish === "matte" ? "bg-blue-600" : "bg-black"
            }`}
          >
            Matte
          </button>
          <button
            onClick={() => handleMaterialChange(0.18, 0.55, "satin")}
            className={`px-4 py-2 rounded-md   transition-colors duration-200 font-medium text-white ${
              selectedFinish === "satin" ? "bg-blue-600" : "bg-black"
            }`}
          >
            Satin Metallic
          </button>
        </div>
      </div> */}
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
            <Environment files={hdrPath} background blur={0} rotation={[hdrRotation, hdrRotation, hdrRotation]} intensity={hdrIntensity} />
            <Lights />
            <DoorModel roughnessMetalness={roughnessMetalness} hdrIntensity={hdrIntensity} />
            {/* <MaterialBoxes /> */}
            <OrbitControls enablePan enableZoom enableRotate />
          </Canvas>
        </div>
      </main>
    </div>
  );
}

// Preload model
useGLTF.preload("/Door.glb");

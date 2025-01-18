import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
// Import the GLB files
import maleModel from "./male.glb";  
import femaleModel from "./female.glb"; 
import { auth } from "../firebase";  // Adjust the path to match your file structure


const CharacterModel = ({ gender, height, weight }) => {
  const [scale, setScale] = useState([1.5, 1.5, 1.5]); // Increased base scaling
  const characterRef = useRef();

  // Select the appropriate model based on gender
  const modelPath = gender === "male" ? maleModel : femaleModel;
  const { scene } = useGLTF(modelPath); // Load the GLB file

  useEffect(() => {
    // Height: increase Y-axis scaling to adjust the height
    const heightScaleFactor = 1 + (height - 170) / 170;

    // Weight: increase X and Z axes scaling to adjust the body width
    const weightScaleFactor = 1 + (weight - 60) / 150;

    // Apply proportional scaling
    setScale([
      2.5 * weightScaleFactor, // Apply global increase and weight factor
      2.5 * heightScaleFactor, // Apply global increase and height factor
      2.5 * weightScaleFactor, // Apply global increase and weight factor
    ]);
  }, [height, weight]);

  // Spin the character for effect
  useFrame(() => {
    if (characterRef.current) {
      characterRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={characterRef} scale={scale}>
      <primitive object={scene} />
    </mesh>
  );
};

const Character3D = ({ gender, height, weight }) => {
  return (
    <div className="w-full h-full flex flex-col items-center">
      {/* 3D Character Canvas */}
      <div className="w-full h-3/4">
        <Canvas>
          {/* Add Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          
          {/* Render the Character */}
          <CharacterModel gender={gender} height={height} weight={weight} />
          
          {/* Camera Controls */}
          <OrbitControls />
        </Canvas>
      </div>

      {/* User Name Display */}
      <div className="text-center mt-1 text-4xl font-bold">
        {auth.currentUser ? auth.currentUser.displayName : "Guest"}
      </div>
    </div>
  );
};

export default Character3D;

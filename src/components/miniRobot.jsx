import React, { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

export const MiniRobot = ({ animationName, emotionName, onAnimationFinished }) => {
  const { scene, animations, nodes } = useGLTF("/assets/glb/robot.glb");
  const { ref, actions, mixer } = useAnimations(animations, scene);
  const { camera, gl, viewport } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  // Find the mesh with morph targets (e.g., the robot's face)
  const morphTargetMesh = Object.values(nodes).find(
    (node) => node.isMesh && node.morphTargetInfluences
  );

  // Map emotion names to morph target indices (adjust based on your model)
  const emotionMap = {
    Neutral: 0,
    Smile: 1,
    Frown: 2,
    Surprise: 3,
  };

  // Dynamic position based on device size
  useEffect(() => {
    const updatePosition = () => {
      const isSmallDevice = window.innerWidth < 768; // Mobile threshold
      scene.position.set(
        isSmallDevice ? 0 : 2, // Center on X for small devices
        isSmallDevice ? -1.4 : -1, // Slightly higher on Y for small devices
        isSmallDevice ? 0 : 1 // Closer to camera on small devices
      );
    };

    updatePosition(); // Set initial position
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [scene]);

  // Handle clicks to detect left/right click
  useEffect(() => {
    const handleClick = (event) => {
      mouse.current.x = (event.clientX / gl.domElement.clientWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / gl.domElement.clientHeight) * 2 + 1;
      raycaster.current.setFromCamera(mouse.current, camera);
      const intersects = raycaster.current.intersectObject(scene, true);
      if (intersects.length > 0) {
        gl.domElement.dispatchEvent(
          new CustomEvent("modelClick", {
            detail: event.button === 2 ? "right" : "left",
          })
        );
      }
    };
    gl.domElement.addEventListener("contextmenu", handleClick);
    gl.domElement.addEventListener("click", handleClick);
    return () => {
      gl.domElement.removeEventListener("contextmenu", handleClick);
      gl.domElement.removeEventListener("click", handleClick);
    };
  }, [camera, gl, scene]);

  // Handle skeletal animation (actions)
  useEffect(() => {
    if (animationName && actions[animationName]) {
      Object.values(actions).forEach((action) => action.stop());
      const action = actions[animationName];
      action.reset().fadeIn(0.5).play();
      if (animationName === "Punch") {
        action.setLoop(THREE.LoopRepeat, 2).clampWhenFinished = true;
        mixer.addEventListener("finished", onAnimationFinished);
      } else if (
        animationName === "Jump" ||
        animationName === "Death" ||
        animationName === "Wave"
      ) {
        action.setLoop(THREE.LoopOnce, 1).clampWhenFinished = true;
        mixer.addEventListener("finished", onAnimationFinished);
      }
      return () => {
        if (actions[animationName]) actions[animationName].fadeOut(0.5);
        mixer.removeEventListener("finished", onAnimationFinished);
      };
    }
  }, [animationName, actions, mixer, onAnimationFinished]);

  // Handle morph target animation (facial expressions)
  useEffect(() => {
    if (morphTargetMesh && emotionName && emotionMap[emotionName] !== undefined) {
      const targetIndex = emotionMap[emotionName];
      // Reset all morph influences
      morphTargetMesh.morphTargetInfluences.forEach((_, i) => {
        morphTargetMesh.morphTargetInfluences[i] = 0;
      });
      // Apply the selected emotion
      morphTargetMesh.morphTargetInfluences[targetIndex] = 1;
    } else if (morphTargetMesh) {
      // Default to neutral
      morphTargetMesh.morphTargetInfluences.forEach((_, i) => {
        morphTargetMesh.morphTargetInfluences[i] = i === emotionMap.Neutral ? 1 : 0;
      });
    }
  }, [emotionName, morphTargetMesh, emotionMap]);

  return <primitive object={scene} scale={[0.3, 0.3, 0.3]} />;
};
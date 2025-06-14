import React, { Suspense, useEffect, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { MiniRobot } from "./miniRobot";

const Background = () => {
  const [animation, setAnimation] = useState("Idle");
  const [emotion, setEmotion] = useState("Surprised");
  const clickCountRef = useRef(0);
  const clickTimeoutRef = useRef(null);
  const waveIntervalRef = useRef(null);
  const canvasRef = useRef();

  useEffect(() => {
    const handleModelClick = (e) => {
      if (e.detail === "left") {
        clickCountRef.current++;
        clearTimeout(clickTimeoutRef.current);
        clickTimeoutRef.current = setTimeout(() => {
          const count = clickCountRef.current;
          if (count === 1) {
            setAnimation("Punch");
            setEmotion("Smile"); // Happy expression with Punch
          } else if (count === 2) {
            setAnimation("Jump");
            setEmotion("Surprise"); // Surprised expression with Jump
          } else {
            setAnimation("Death");
            setEmotion("Frown"); // Sad expression with Death
          }
          clickCountRef.current = 0;
        }, 300);
      } else if (e.detail === "right") {
        setAnimation("Idle");
        setEmotion("Smile"); // Smile on right-click
      }
    };
    canvasRef.current?.addEventListener("modelClick", handleModelClick);
    return () =>
      canvasRef.current?.removeEventListener("modelClick", handleModelClick);
  }, []);

  useEffect(() => {
    const handleBlur = () => {
      setAnimation("Wave");
      setEmotion("Neutral");
      waveIntervalRef.current = setInterval(() => {
        setAnimation("Wave");
        setEmotion("Neutral");
      }, 2000);
    };
    const handleFocus = () => {
      clearInterval(waveIntervalRef.current);
      setAnimation("Idle");
      setEmotion("Neutral");
    };
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      clearInterval(waveIntervalRef.current);
    };
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        backgroundImage: "url(/assets/hero.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Suspense fallback={null}>
          <MiniRobot
            animationName={animation}
            emotionName={emotion}
            onAnimationFinished={() => {
              setAnimation("Idle");
              setEmotion("Neutral");
            }}
          />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
};

export default Background;
import React, { Suspense, useEffect, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { MiniRobot } from "./miniRobot";

const Background = () => {
  const [animation, setAnimation] = useState("Idle");
  const [emotion, setEmotion] = useState("Neutral");
  const [isMobile, setIsMobile] = useState(false);
  const robotRef = useRef();
  const canvasRef = useRef();
  const actionIndexRef = useRef(0);
  const intervalRef = useRef(null);

  // Detect mobile devices based on window width
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Cycle through actions every 3 seconds
  useEffect(() => {
    const actions = [
      { animation: "Punch", emotion: "Smile" },
      { animation: "Jump", emotion: "Surprise" },
      { animation: "Dance", emotion: "Smile" },
      { animation: "Idle", emotion: "Smile" },
      { animation: "Death", emotion: "Frown" },
    ];

    const startInterval = () => {
      intervalRef.current = setInterval(() => {
        const currentAction = actions[actionIndexRef.current];
        setAnimation(currentAction.animation);
        setEmotion(currentAction.emotion);

        // Pause interval for all actions to ensure 3-second minimum
        clearInterval(intervalRef.current);
        setTimeout(() => {
          actionIndexRef.current = (actionIndexRef.current + 1) % actions.length;
          startInterval();
        }, 3000);
      }, 3000);
    };

    startInterval();

    return () => clearInterval(intervalRef.current);
  }, []);

  // Handle window blur and focus
  useEffect(() => {
    const handleBlur = () => {
      clearInterval(intervalRef.current);
      setAnimation("Wave");
      setEmotion("Neutral");
    };
    const handleFocus = () => {
      setAnimation("Idle");
      setEmotion("Neutral");
      actionIndexRef.current = 0;
      clearInterval(intervalRef.current);
      startInterval();
    };
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
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
        pointerEvents: "none",
      }}
    >
      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: "transparent", pointerEvents: isMobile ? "none" : "auto" }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Suspense fallback={null}>
          <MiniRobot
            ref={robotRef}
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

import { extend, useFrame, useThree } from "@react-three/fiber";
import { createUseGesture, wheelAction } from "@use-gesture/react";
import CameraControls from "camera-controls";
import { useCallback, useEffect, useRef } from "react";
import * as THREE from "three";
import { useDataStore } from "~/stores/useDataStore";

CameraControls.install({ THREE });

extend({ CameraControls });

const useGesture = createUseGesture([wheelAction]);

export const Controls = () => {
  const selectedNode = useDataStore((s) => s.selectedNode);

  const cameraControlsRef = useRef<CameraControls | null>(null);
  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);

  const doDollyTransition = useCallback((event: WheelEvent) => {
    if (!cameraControlsRef.current) {
      return;
    }

    if (cameraControlsRef.current.dampingFactor < 0.1) {
      cameraControlsRef.current.dampingFactor = 0.1;
    }

    const distance = cameraControlsRef.current?.distance;

    let dollyStep = distance < 3000 ? 80 : 140;

    if (event.deltaY > 0) {
      dollyStep = dollyStep * -1;
    }

    cameraControlsRef.current?.dolly(dollyStep, true);
  }, []);

  useEffect(() => {
    if (cameraControlsRef.current) {
      cameraControlsRef.current.mouseButtons.wheel = 0;
      cameraControlsRef.current.minDistance = 200;
      cameraControlsRef.current.maxDistance = Infinity;
      cameraControlsRef.current.minPolarAngle = -Infinity;
      cameraControlsRef.current.maxPolarAngle = Infinity;
      //cameraControlsRef.current.enableTransition = true;
      cameraControlsRef.current.dollySpeed = 0.2;
      cameraControlsRef.current.dampingFactor = 0.1;
      cameraControlsRef.current.infinityDolly = true;
      //cameraControlsRef.current.enableDamping = true;
      cameraControlsRef.current.dollyToCursor = true;
    }
  }, []);

  useGesture(
    {
      onWheel: ({ event }) => doDollyTransition(event),
    },
    {
      target: document.getElementById("universe-canvas") || undefined,
    }
  );

  useEffect(() => {
    if (selectedNode && cameraControlsRef.current) {
      cameraControlsRef.current.dampingFactor = 0.05;

      // @ts-ignore
      const { x, y, z } = selectedNode;

      cameraControlsRef.current?.setTarget(x, y, z, true);
    }
  }, [selectedNode]);

  useFrame((state, delta) => {
    cameraControlsRef.current?.update(delta);
  });

  return (
    // @ts-ignore
    <cameraControls ref={cameraControlsRef} args={[camera, gl.domElement]} />
  );
};

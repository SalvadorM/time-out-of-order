import React, { forwardRef } from 'react';
import { useFrame, extend} from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

const WaveMaterial = shaderMaterial(
  {
    uTime: 0,
    uIntensity: 0.5,
    uColor: new THREE.Color('cyan'),
  },
  `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  `
  uniform float uTime;
  uniform float uIntensity;
  uniform vec3 uColor;
  varying vec2 vUv;

  void main() {
    float wave = sin((vUv.x + uTime * 0.2) * 20.0) * 0.5 + 0.5;
    wave = pow(wave, 2.0);
    float intensity = wave * uIntensity;
    gl_FragColor = vec4(intensity * uColor, 1.0);
  }
  `
);

extend({ WaveMaterial });

const WavePlane = forwardRef(({ intensity, color }, ref) => {
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.uTime = clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={ref}>
      <planeGeometry args={[2, 2]} />
      <waveMaterial
        ref={ref}
        uIntensity={intensity}
        uColor={new THREE.Color(color)}
      />
    </mesh>
  );
});

export default WavePlane;
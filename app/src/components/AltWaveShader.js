// WavyShader.js
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {  Color } from "three";

const fragmentShader = `
    uniform float u_time;
    uniform vec3 u_bg;
    uniform vec3 u_colorA;
    uniform vec3 u_colorB;
    //uniform vec2 u_mouse;
    uniform float u_intensity;

    varying vec2 vUv;

    // [Simplex noise function omitted for brevity — keep your original here]

    vec3 mod289(vec3 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec2 mod289(vec2 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec3 permute(vec3 x) {
      return mod289(((x*34.0)+1.0)*x);
    }

    float snoise(vec2 v)
      {
      const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                          0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                        -0.577350269189626,  // -1.0 + 2.0 * C.x
                          0.024390243902439); // 1.0 / 41.0
      // First corner
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);

      // Other corners
      vec2 i1;
      //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
      //i1.y = 1.0 - i1.x;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      // x0 = x0 - 0.0 + 0.0 * C.xx ;
      // x1 = x0 - i1 + 1.0 * C.xx ;
      // x2 = x0 - 1.0 + 2.0 * C.xx ;
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;

      // Permutations
      i = mod289(i); // Avoid truncation effects in permutation
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));

      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;

      // Gradients: 41 points uniformly over a line, mapped onto a diamond.
      // The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;

      // Normalise gradients implicitly by scaling m
      // Approximation of: m *= inversesqrt( a0*a0 + h*h );
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

      // Compute final noise value at P
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }
    // End of Simplex Noise Code

    void main() {
      vec3 color = u_bg;

      //float noise1 = snoise(vUv + (u_time * .4) * (sin(u_mouse.x * .0002) + 0.005));
      //float noise2 = snoise(vUv + (u_time * .4) * (sin(u_mouse.y * .0002) + 0.005));
      float noise1 = snoise(vUv + u_time * 0.1);
      float noise2 = snoise(vUv * 2.0 + u_time * 0.2);

      // Use u_intensity to control blend
      color = mix(color, u_colorA, noise1 * u_intensity);
      color = mix(color, u_colorB, noise2 * u_intensity);

      gl_FragColor = vec4(color, 1.0);
  }
`;

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const WavyShader = ({ color = "#ff3300", colorA, colorB, intensity = 0.8 }) => {
  const mesh = useRef();

  const uniforms = useMemo(() => ({
    u_time: { value: 0.0 },
    // u_mouse: { value: new Vector2(0, 0) },
    u_bg: { value: new Color("#F0F0F0") },
    u_colorA: { value: new Color(colorA) },
    u_colorB: { value: new Color(colorB) },
    u_intensity: { value: intensity },
  }), []);


  useFrame(({ clock }) => {
    if (mesh.current) {
      mesh.current.material.uniforms.u_time.value = clock.getElapsedTime();
        uniforms.u_colorA.value.set(colorA);
        uniforms.u_colorB.value.set(colorB);
    }
  });

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[20, 20]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

export default WavyShader;
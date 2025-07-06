import { useRef, useMemo } from 'react'
import { useFrame, extend } from '@react-three/fiber'
import { Text, Box, Sphere, Torus, OrbitControls, shaderMaterial } from '@react-three/drei'
import { Color, ShaderMaterial, Vector2 } from 'three'
import { useControls } from 'leva'

// Custom shader material using drei's shaderMaterial helper
const WaveShaderMaterial = shaderMaterial(
  // Uniforms
  {
    uTime: 0,
    uColor: new Color(0.2, 0.0, 0.1),
    uAmplitude: 0.3,
    uFrequency: 2.0,
  },
  // Vertex shader
  `
    uniform float uTime;
    uniform float uAmplitude;
    uniform float uFrequency;
    
    varying vec2 vUv;
    varying float vZ;
    
    void main() {
      vUv = uv;
      
      vec3 pos = position;
      float wave = sin(pos.x * uFrequency + uTime) * cos(pos.y * uFrequency + uTime) * uAmplitude;
      pos.z += wave;
      
      vZ = wave;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform vec3 uColor;
    uniform float uTime;
    
    varying vec2 vUv;
    varying float vZ;
    
    void main() {
      vec3 color = uColor;
      color.r += sin(uTime + vUv.x * 10.0) * 0.5 + 0.5;
      color.g += cos(uTime + vUv.y * 10.0) * 0.5 + 0.5;
      color.b += sin(vZ * 20.0) * 0.5 + 0.5;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `,
)

// Extend drei's shaderMaterial
extend({ WaveShaderMaterial })

// Wave plane component
function WavePlane() {
  const materialRef = useRef<ShaderMaterial>(null)

  const { amplitude, frequency, speed } = useControls('Wave Shader', {
    amplitude: { value: 0.3, min: 0, max: 1, step: 0.01 },
    frequency: { value: 2, min: 0, max: 10, step: 0.1 },
    speed: { value: 1, min: 0, max: 5, step: 0.1 },
  })

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime * speed
      materialRef.current.uniforms.uAmplitude.value = amplitude
      materialRef.current.uniforms.uFrequency.value = frequency
    }
  })

  return (
    <mesh position={[-4, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[3, 3, 32, 32]} />
      <waveShaderMaterial ref={materialRef} uColor={new Color('#ff6030')} />
    </mesh>
  )
}

// Gradient sphere with custom shader
function GradientSphere() {
  const materialRef = useRef<ShaderMaterial>(null)

  const vertexShader = `
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    void main() {
      vPosition = position;
      vNormal = normal;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    void main() {
      float gradient = vPosition.y * 0.5 + 0.5;
      gradient += sin(uTime * 2.0) * 0.1;
      
      vec3 color = mix(uColorA, uColorB, gradient);
      
      // Add rim lighting
      vec3 viewDirection = normalize(cameraPosition - vPosition);
      float rim = 1.0 - dot(viewDirection, vNormal);
      rim = pow(rim, 2.0);
      
      color += rim * 0.5;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new Color('#ff006e') },
      uColorB: { value: new Color('#0066ff') },
    }),
    [],
  )

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  return (
    <Sphere args={[1.5, 64, 64]} position={[0, 0, 0]} castShadow>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </Sphere>
  )
}

// Noise torus
function NoiseTorus() {
  const materialRef = useRef<ShaderMaterial>(null)

  const { noiseScale, noiseSpeed } = useControls('Noise Shader', {
    noiseScale: { value: 5, min: 1, max: 20, step: 0.1 },
    noiseSpeed: { value: 0.5, min: 0, max: 2, step: 0.1 },
  })

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

  const fragmentShader = `
    uniform float uTime;
    uniform float uNoiseScale;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    
    // Simple noise function
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }
    
    float noise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));
      
      vec2 u = f * f * (3.0 - 2.0 * f);
      
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }
    
    void main() {
      vec2 st = vUv * uNoiseScale;
      st.x += uTime;
      
      float n = noise(st);
      n += noise(st * 2.0) * 0.5;
      n += noise(st * 4.0) * 0.25;
      n += noise(st * 8.0) * 0.125;
      n /= 1.875;
      
      vec3 color = vec3(n);
      color.r *= 1.0 + sin(uTime + vUv.x * 10.0) * 0.5;
      color.g *= 1.0 + cos(uTime + vUv.y * 10.0) * 0.5;
      color.b *= 1.0 + sin(uTime * 2.0) * 0.5;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uNoiseScale: { value: noiseScale },
    }),
    [noiseScale],
  )

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime * noiseSpeed
      materialRef.current.uniforms.uNoiseScale.value = noiseScale
    }
  })

  return (
    <Torus args={[1.5, 0.6, 32, 64]} position={[4, 0, 0]} castShadow>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </Torus>
  )
}

export default function ShadersScene() {
  return (
    <>
      {/* Title */}
      <Text position={[0, 4, 0]} fontSize={0.5} color="#ff6030" anchorX="center" anchorY="middle">
        Custom Shaders
      </Text>

      {/* Wave shader */}
      <group>
        <Text position={[-4, 2, 0]} fontSize={0.25} color="white" anchorX="center">
          Wave Vertex Shader
        </Text>
        <WavePlane />
      </group>

      {/* Gradient sphere */}
      <group>
        <Text position={[0, 2, 0]} fontSize={0.25} color="white" anchorX="center">
          Gradient + Rim Light
        </Text>
        <GradientSphere />
      </group>

      {/* Noise torus */}
      <group>
        <Text position={[4, 2, 0]} fontSize={0.25} color="white" anchorX="center">
          Procedural Noise
        </Text>
        <NoiseTorus />
      </group>

      {/* Info text */}
      <Text position={[0, -3, 0]} fontSize={0.2} color="#aaaaaa" anchorX="center" anchorY="middle" textAlign="center">
        GLSL shaders with uniforms • Vertex displacement • Fragment effects
      </Text>

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>

      {/* Grid */}
      <gridHelper args={[20, 20, '#333', '#222']} position={[0, -1.99, 0]} />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow shadow-mapSize={[2048, 2048]} />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#ff6030" />

      <OrbitControls makeDefault enableDamping dampingFactor={0.05} />
    </>
  )
}

import { useRef, useState } from 'react'
import { useFrame, createPortal, useThree } from '@react-three/fiber'
import {
  Text,
  Box,
  Sphere,
  OrbitControls,
  PerspectiveCamera,
  useFBO,
  ScreenQuad,
  Float,
  RenderTexture,
} from '@react-three/drei'
import { Scene, PerspectiveCamera as ThreePerspectiveCamera, Group, Mesh } from 'three'
import { useControls } from 'leva'

// Portal content - a separate scene
function PortalWorld() {
  const sphereRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x = state.clock.elapsedTime
      sphereRef.current.rotation.y = state.clock.elapsedTime * 0.5
    }
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Sphere ref={sphereRef} args={[1, 32, 32]}>
          <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={0.5} />
        </Sphere>
      </Float>

      <Box position={[-2, 0, 0]} args={[1, 1, 1]}>
        <meshStandardMaterial color="#00ff00" />
      </Box>

      <Box position={[2, 0, 0]} args={[1, 1, 1]}>
        <meshStandardMaterial color="#0000ff" />
      </Box>

      {/* Different background color for portal */}
      <color attach="background" args={['#301030']} />
    </>
  )
}

// Render texture portal
function RenderTexturePortal() {
  const meshRef = useRef<Mesh>(null)

  return (
    <Box args={[3, 3, 0.1]} position={[-4, 0, 0]}>
      <meshBasicMaterial>
        <RenderTexture attach="map" anisotropy={16}>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <PortalWorld />
        </RenderTexture>
      </meshBasicMaterial>
    </Box>
  )
}

// Layer-based rendering
function LayerDemo() {
  const { layer0, layer1, layer2 } = useControls('Layers', {
    layer0: { value: true, label: 'Default Layer (0)' },
    layer1: { value: true, label: 'Layer 1 (Red)' },
    layer2: { value: true, label: 'Layer 2 (Blue)' },
  })

  const { camera } = useThree()

  // Update camera layers
  useFrame(() => {
    camera.layers.set(0) // Always include default layer
    if (layer1) camera.layers.enable(1)
    else camera.layers.disable(1)
    if (layer2) camera.layers.enable(2)
    else camera.layers.disable(2)
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Default layer (0) */}
      <Box position={[0, 0, 0]} args={[1.5, 1.5, 1.5]}>
        <meshStandardMaterial color="#ffffff" />
      </Box>

      {/* Layer 1 */}
      <Sphere position={[-1, 0, 0]} args={[0.8, 32, 32]} layers={1}>
        <meshStandardMaterial color="#ff0000" />
      </Sphere>

      {/* Layer 2 */}
      <Sphere position={[1, 0, 0]} args={[0.8, 32, 32]} layers={2}>
        <meshStandardMaterial color="#0000ff" />
      </Sphere>
    </group>
  )
}

// Multi-view rendering
function MultiViewPortal() {
  const portalRef = useRef<Group>(null)
  const [portalScene] = useState(() => new Scene())
  const [portalCamera] = useState(() => new ThreePerspectiveCamera(50, 1, 0.1, 100))

  // Create portal content
  useFrame((state) => {
    if (portalRef.current) {
      portalRef.current.rotation.y = state.clock.elapsedTime * 0.5
    }

    // Update portal camera
    portalCamera.position.set(Math.sin(state.clock.elapsedTime) * 5, 2, Math.cos(state.clock.elapsedTime) * 5)
    portalCamera.lookAt(0, 0, 0)
  })

  return (
    <group position={[4, 0, 0]}>
      {createPortal(
        <group ref={portalRef}>
          <mesh>
            <torusGeometry args={[1, 0.4, 16, 32]} />
            <meshStandardMaterial color="#ff6030" />
          </mesh>
          <ambientLight intensity={0.5} />
          <pointLight position={[2, 2, 2]} />
        </group>,
        portalScene,
      )}

      <Box args={[3, 3, 0.1]}>
        <meshBasicMaterial>
          <RenderTexture attach="map" scene={portalScene} camera={portalCamera}>
            <color attach="background" args={['#001030']} />
          </RenderTexture>
        </meshBasicMaterial>
      </Box>
    </group>
  )
}

export default function PortalsScene() {
  const { showGrid } = useControls('Scene', {
    showGrid: true,
  })

  return (
    <>
      {/* Title */}
      <Text position={[0, 4, 0]} fontSize={0.5} color="#ff6030" anchorX="center" anchorY="middle">
        Portals & Advanced Rendering
      </Text>

      {/* Render texture portal */}
      <group>
        <Text position={[-4, 2, 0]} fontSize={0.25} color="white" anchorX="center">
          Render Texture Portal
        </Text>
        <RenderTexturePortal />
      </group>

      {/* Layer demo */}
      <group>
        <Text position={[0, 2, 0]} fontSize={0.25} color="white" anchorX="center">
          Layer-based Visibility
        </Text>
        <LayerDemo />
      </group>

      {/* Multi-view portal */}
      <group>
        <Text position={[4, 2, 0]} fontSize={0.25} color="white" anchorX="center">
          Dynamic Camera Portal
        </Text>
        <MultiViewPortal />
      </group>

      {/* Info text */}
      <Text position={[0, -3, 0]} fontSize={0.2} color="#aaaaaa" anchorX="center" anchorY="middle" textAlign="center">
        Render to texture • Multiple scenes • Camera layers • Dynamic viewports
      </Text>

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Grid */}
      {showGrid && <gridHelper args={[20, 20, '#333', '#222']} position={[0, -1.99, 0]} />}

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow shadow-mapSize={[2048, 2048]} />

      <OrbitControls makeDefault enableDamping dampingFactor={0.05} />
    </>
  )
}

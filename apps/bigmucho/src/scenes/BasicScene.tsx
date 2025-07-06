import { useRef, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Mesh, Vector3, Group } from 'three'
import { useControls, folder } from 'leva'
import { OrbitControls, Text, Box, Sphere, Torus, Html } from '@react-three/drei'

export default function BasicScene() {
  const cubeRef = useRef<Mesh>(null)
  const sphereRef = useRef<Mesh>(null)
  const torusRef = useRef<Mesh>(null)
  const groupRef = useRef<Group>(null)

  // Demonstrate useThree hook
  const { camera, size, viewport } = useThree()
  const [frameCount, setFrameCount] = useState(0)

  // Leva controls with folders
  const { autoRotate, rotationSpeed } = useControls('Animation', {
    autoRotate: true,
    rotationSpeed: { value: 0.01, min: 0, max: 0.1, step: 0.001 },
  })

  const { showCube, showSphere, showTorus } = useControls('Visibility', {
    showCube: true,
    showSphere: true,
    showTorus: true,
  })

  const materials = useControls('Materials', {
    Cube: folder({
      cubeColor: '#ff6030',
      cubeWireframe: false,
      cubeMetalness: { value: 0.5, min: 0, max: 1 },
      cubeRoughness: { value: 0.5, min: 0, max: 1 },
    }),
    Sphere: folder({
      sphereColor: '#30ff60',
      sphereEmissive: '#000000',
      sphereEmissiveIntensity: { value: 0, min: 0, max: 1 },
    }),
    Torus: folder({
      torusColor: '#3060ff',
      torusTransmission: { value: 0, min: 0, max: 1 },
      torusThickness: { value: 0, min: 0, max: 1 },
    }),
  })

  // Demonstrate useFrame with different patterns
  useFrame((state, delta) => {
    if (autoRotate) {
      // Basic rotation
      if (cubeRef.current) {
        cubeRef.current.rotation.x += rotationSpeed
        cubeRef.current.rotation.y += rotationSpeed * 0.5
      }

      // Sin wave motion
      if (sphereRef.current) {
        sphereRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.5
        sphereRef.current.rotation.y += delta
      }

      // Orbit motion
      if (torusRef.current) {
        const t = state.clock.elapsedTime
        torusRef.current.position.x = Math.cos(t) * 3
        torusRef.current.position.z = Math.sin(t) * 3
        torusRef.current.rotation.x = t
        torusRef.current.rotation.y = t * 0.5
      }
    }

    // Update frame counter every 60 frames
    if (state.clock.elapsedTime % 1 < delta) {
      setFrameCount(state.frameloop)
    }
  })

  // Demonstrate useEffect with Three.js
  useEffect(() => {
    if (camera) {
      console.log('Camera FOV:', camera.fov)
      console.log('Viewport size:', size)
      console.log('Viewport dimensions:', viewport)
    }
  }, [camera, size, viewport])

  return (
    <>
      <group ref={groupRef}>
        {/* Cube - Basic mesh with standard material */}
        {showCube && (
          <Box ref={cubeRef} args={[2, 2, 2]} position={[0, 0, 0]} castShadow receiveShadow>
            <meshStandardMaterial
              color={materials.cubeColor}
              wireframe={materials.cubeWireframe}
              metalness={materials.cubeMetalness}
              roughness={materials.cubeRoughness}
            />
          </Box>
        )}

        {/* Sphere - With emissive properties */}
        {showSphere && (
          <Sphere ref={sphereRef} args={[1, 32, 32]} position={[-3, 0, 0]} castShadow>
            <meshStandardMaterial
              color={materials.sphereColor}
              emissive={materials.sphereEmissive}
              emissiveIntensity={materials.sphereEmissiveIntensity}
            />
          </Sphere>
        )}

        {/* Torus - With physical material */}
        {showTorus && (
          <Torus ref={torusRef} args={[1, 0.4, 16, 32]} position={[3, 0, 0]} castShadow>
            <meshPhysicalMaterial
              color={materials.torusColor}
              transmission={materials.torusTransmission}
              thickness={materials.torusThickness}
              roughness={0.1}
            />
          </Torus>
        )}
      </group>

      {/* 3D Text */}
      <Text position={[0, 3, 0]} fontSize={0.5} color="#ff6030" anchorX="center" anchorY="middle">
        Basic R3F Concepts
      </Text>

      {/* HTML in 3D space */}
      <Html position={[0, -2, 0]} center>
        <div
          style={{
            background: 'rgba(0,0,0,0.7)',
            padding: '10px',
            borderRadius: '5px',
            color: 'white',
            fontSize: '12px',
            textAlign: 'center',
          }}>
          <div>useFrame • useThree • Mesh Components</div>
          <div>
            Frame: {frameCount} | Size: {size.width}x{size.height}
          </div>
        </div>
      </Html>

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Grid */}
      <gridHelper args={[20, 20, '#333', '#222']} position={[0, -1.99, 0]} />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#ff6030" />

      <OrbitControls makeDefault enableDamping dampingFactor={0.05} />
    </>
  )
}

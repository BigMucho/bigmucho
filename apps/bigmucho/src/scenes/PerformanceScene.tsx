import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame, useThree, invalidate } from '@react-three/fiber'
import { Text, Box, Sphere, OrbitControls, Stats, Detailed } from '@react-three/drei'
import {
  InstancedMesh,
  Object3D,
  Color,
  MeshStandardMaterial,
  BoxGeometry,
  SphereGeometry,
  InstancedBufferAttribute,
  Mesh,
} from 'three'
import { useControls, button } from 'leva'

// Instanced cubes component
function InstancedCubes({ count = 1000 }) {
  const meshRef = useRef<InstancedMesh>(null)
  const tempObject = useMemo(() => new Object3D(), [])
  const tempColor = useMemo(() => new Color(), [])
  const colorArray = useMemo(() => new Float32Array(count * 3), [count])

  // Initialize instances
  useEffect(() => {
    if (!meshRef.current) return

    // Set initial positions and colors
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 20
      const y = (Math.random() - 0.5) * 20
      const z = (Math.random() - 0.5) * 20

      tempObject.position.set(x, y, z)
      tempObject.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0)
      tempObject.scale.setScalar(Math.random() * 0.5 + 0.5)
      tempObject.updateMatrix()

      meshRef.current.setMatrixAt(i, tempObject.matrix)

      // Set color
      tempColor.setHSL(Math.random(), 0.7, 0.5)
      colorArray[i * 3] = tempColor.r
      colorArray[i * 3 + 1] = tempColor.g
      colorArray[i * 3 + 2] = tempColor.b
    }

    meshRef.current.instanceMatrix.needsUpdate = true

    // Set color attribute
    const geometry = meshRef.current.geometry
    geometry.setAttribute('color', new InstancedBufferAttribute(colorArray, 3))
  }, [count, tempObject, tempColor, colorArray])

  // Animate instances
  useFrame((state) => {
    if (!meshRef.current) return

    const time = state.clock.elapsedTime

    for (let i = 0; i < count; i++) {
      meshRef.current.getMatrixAt(i, tempObject.matrix)
      tempObject.matrix.decompose(tempObject.position, tempObject.quaternion, tempObject.scale)

      // Animate rotation
      tempObject.rotation.x = Math.sin(time + i) * 0.01
      tempObject.rotation.y = Math.cos(time + i) * 0.01

      tempObject.updateMatrix()
      meshRef.current.setMatrixAt(i, tempObject.matrix)
    }

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial vertexColors />
    </instancedMesh>
  )
}

// Level of Detail component
function LODObject({ position }: { position: [number, number, number] }) {
  const { camera } = useThree()

  return (
    <Detailed distances={[0, 10, 20]} position={position}>
      {/* High detail */}
      <Sphere args={[1, 64, 64]} castShadow>
        <meshStandardMaterial color="#ff6030" wireframe />
      </Sphere>

      {/* Medium detail */}
      <Sphere args={[1, 16, 16]} castShadow>
        <meshStandardMaterial color="#ffaa00" wireframe />
      </Sphere>

      {/* Low detail */}
      <Box args={[2, 2, 2]} castShadow>
        <meshStandardMaterial color="#00ff00" wireframe />
      </Box>
    </Detailed>
  )
}

// On-demand rendering demo
function OnDemandCube() {
  const meshRef = useRef<Mesh>(null)
  const [rotation, setRotation] = useState(0)

  const animateCube = () => {
    if (!meshRef.current) return

    const animate = () => {
      if (meshRef.current) {
        meshRef.current.rotation.x += 0.01
        meshRef.current.rotation.y += 0.01
        setRotation(meshRef.current.rotation.x)
        invalidate() // Trigger re-render

        if (meshRef.current.rotation.x < Math.PI * 2) {
          requestAnimationFrame(animate)
        }
      }
    }

    meshRef.current.rotation.set(0, 0, 0)
    animate()
  }

  useEffect(() => {
    // Store the animate function for the button
    ;(window as any).__animateOnDemand = animateCube
  }, [])

  return (
    <group position={[5, 0, 0]}>
      <Box ref={meshRef} args={[2, 2, 2]} castShadow>
        <meshStandardMaterial color="#ff00ff" />
      </Box>
      <Text position={[0, -2, 0]} fontSize={0.3} color="#ffffff" anchorX="center">
        On-Demand Rendering
      </Text>
      <Text position={[0, -2.5, 0]} fontSize={0.2} color="#aaaaaa" anchorX="center">
        Rotation: {rotation.toFixed(2)}
      </Text>
      <Text position={[0, -3, 0]} fontSize={0.15} color="#666666" anchorX="center">
        Click "Animate On Demand" button
      </Text>
    </group>
  )
}

export default function PerformanceScene() {
  const [instances, setInstances] = useState(1000)

  const controls = useControls('Performance', {
    instanceCount: {
      value: 1000,
      min: 100,
      max: 10000,
      step: 100,
      onChange: (v) => setInstances(v),
    },
    animateOnDemand: button(() => {
      if ((window as any).__animateOnDemand) {
        ;(window as any).__animateOnDemand()
      }
    }),
    showStats: true,
  })

  return (
    <>
      {/* Title */}
      <Text position={[0, 4, 0]} fontSize={0.5} color="#ff6030" anchorX="center" anchorY="middle">
        Performance Optimizations
      </Text>

      {/* Instanced meshes section */}
      <group position={[-5, 0, 0]}>
        <Text position={[0, 3, 0]} fontSize={0.3} color="#ffffff" anchorX="center">
          Instanced Meshes ({instances} cubes)
        </Text>
        <InstancedCubes count={instances} />
      </group>

      {/* LOD section */}
      <group>
        <Text position={[0, 3, 0]} fontSize={0.3} color="#ffffff" anchorX="center">
          Level of Detail (LOD)
        </Text>
        <Text position={[0, 2.5, 0]} fontSize={0.2} color="#aaaaaa" anchorX="center">
          Move camera closer/farther
        </Text>
        <LODObject position={[0, 0, 0]} />
      </group>

      {/* On-demand rendering */}
      <OnDemandCube />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Grid */}
      <gridHelper args={[30, 30, '#333', '#222']} position={[0, -1.99, 0]} />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow shadow-mapSize={[2048, 2048]} />

      <OrbitControls makeDefault enableDamping dampingFactor={0.05} />

      {/* Performance stats */}
      {controls.showStats && <Stats />}
    </>
  )
}

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'
import { useControls } from 'leva'
import { OrbitControls } from '@react-three/drei'

export default function Scene() {
  const meshRef = useRef<Mesh>(null)

  const { color, wireframe, rotationSpeed } = useControls('Cube', {
    color: '#ff6030',
    wireframe: false,
    rotationSpeed: { value: 0.01, min: 0, max: 0.1, step: 0.001 },
  })

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotationSpeed
      meshRef.current.rotation.y += rotationSpeed * 0.5
    }
  })

  return (
    <>
      <mesh ref={meshRef} position={[0, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color={color} wireframe={wireframe} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Simple grid helper */}
      <gridHelper args={[10, 10]} />

      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow shadow-mapSize={[1024, 1024]} />

      <OrbitControls makeDefault />
    </>
  )
}

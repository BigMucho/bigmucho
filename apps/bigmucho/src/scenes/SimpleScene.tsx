import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'

export default function SimpleScene() {
  const meshRef = useRef<Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01
      meshRef.current.rotation.y += 0.005
    }
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <mesh ref={meshRef}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </>
  )
}

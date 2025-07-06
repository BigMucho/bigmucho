import { Canvas } from '@react-three/fiber'

function App() {
  return (
    <Canvas>
      <mesh>
        <boxGeometry />
        <meshBasicMaterial color="orange" />
      </mesh>
    </Canvas>
  )
}

export default App

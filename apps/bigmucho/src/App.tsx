import { Canvas } from '@react-three/fiber'
import { Leva } from 'leva'
import Scene from './scenes/Scene'

function App() {
  return (
    <>
      <Leva />
      <Canvas camera={{ position: [0, 5, 10], fov: 50 }} shadows>
        <Scene />
      </Canvas>
    </>
  )
}

export default App

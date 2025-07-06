import { lazy, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'

// Lazy load the scene
const SimpleScene = lazy(() => import('./scenes/SimpleScene'))

function App() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }} frameloop="demand">
      <Suspense fallback={null}>
        <SimpleScene />
      </Suspense>
    </Canvas>
  )
}

export default App

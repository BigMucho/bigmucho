import { useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Loader, Html } from '@react-three/drei'
import { Leva } from 'leva'
import './App.css'

// Import all demo scenes
import BasicScene from './scenes/BasicScene'
import InteractiveScene from './scenes/InteractiveScene'
import PerformanceScene from './scenes/PerformanceScene'
import LoadersScene from './scenes/LoadersScene'
import ShadersScene from './scenes/ShadersScene'
import PortalsScene from './scenes/PortalsScene'

const scenes = [
  { name: 'Basic Concepts', component: BasicScene, description: 'Core hooks, animations, and basic 3D objects' },
  { name: 'Interactions', component: InteractiveScene, description: 'Mouse events, drag & drop, hover states' },
  { name: 'Performance', component: PerformanceScene, description: 'Instancing, LOD, on-demand rendering' },
  { name: 'Loading Assets', component: LoadersScene, description: 'Models, textures, and suspense' },
  { name: 'Shaders', component: ShadersScene, description: 'Custom materials and shader effects' },
  { name: 'Advanced', component: PortalsScene, description: 'Portals, render targets, and layers' },
]

function App() {
  const [activeScene, setActiveScene] = useState(0)
  const Scene = scenes[activeScene].component

  return (
    <div className="app-container">
      <Leva />
      <nav className="scene-nav">
        <h1>React Three Fiber Showcase</h1>
        <div className="scene-buttons">
          {scenes.map((scene, index) => (
            <button
              key={scene.name}
              className={`scene-button ${activeScene === index ? 'active' : ''}`}
              onClick={() => setActiveScene(index)}>
              <span className="scene-name">{scene.name}</span>
              <span className="scene-description">{scene.description}</span>
            </button>
          ))}
        </div>
      </nav>

      <div className="canvas-container">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }} style={{ width: '100%', height: '100%' }} shadows>
          <Suspense fallback={<Html center>Loading...</Html>}>
            <Scene />
          </Suspense>
        </Canvas>
        <Loader />
      </div>
    </div>
  )
}

export default App

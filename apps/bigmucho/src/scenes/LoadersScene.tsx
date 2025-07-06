import { Suspense, useState } from 'react'
import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'
import {
  Box,
  Sphere,
  Text,
  useGLTF,
  useTexture,
  OrbitControls,
  Environment,
  Html,
  Preload,
  useFBX,
  useProgress,
} from '@react-three/drei'
import { useControls } from 'leva'

// Texture loading component
function TexturedBox() {
  // Using a single texture that's more likely to work
  const texture = useTexture('https://images.unsplash.com/photo-1567360425618-1594206637d2?w=512&h=512&fit=crop')

  return (
    <Box args={[2, 2, 2]} position={[-3, 0, 0]} castShadow receiveShadow>
      <meshStandardMaterial map={texture} roughness={0.8} metalness={0.2} />
    </Box>
  )
}

// Multiple textures with different loading states
function MultiTextureDemo() {
  const [textureType, setTextureType] = useState('wood')

  const textureUrls = {
    wood: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=512&h=512&fit=crop',
    marble: 'https://images.unsplash.com/photo-1566306599157-e2b7b6c6a3ce?w=512&h=512&fit=crop',
    fabric: 'https://images.unsplash.com/photo-1558865869-c93f6f8482af?w=512&h=512&fit=crop',
  }

  const texture = useTexture(textureUrls[textureType as keyof typeof textureUrls])

  return (
    <group position={[0, 0, 0]}>
      <Sphere args={[1.5, 32, 32]} castShadow>
        <meshStandardMaterial map={texture} roughness={0.5} metalness={0.5} />
      </Sphere>
      <Html position={[0, -2, 0]} center>
        <div style={{ textAlign: 'center' }}>
          <button onClick={() => setTextureType('wood')} style={{ margin: '2px' }}>
            Wood
          </button>
          <button onClick={() => setTextureType('marble')} style={{ margin: '2px' }}>
            Marble
          </button>
          <button onClick={() => setTextureType('fabric')} style={{ margin: '2px' }}>
            Fabric
          </button>
        </div>
      </Html>
    </group>
  )
}

// GLTF model loader
function GLTFModel() {
  // Using a simple GLTF model from drei-assets
  const { scene } = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/duck/model.gltf')

  return <primitive object={scene} position={[3, 0, 0]} scale={0.5} castShadow receiveShadow />
}

// Loading progress indicator
function LoadingProgress() {
  const { active, progress, errors, item, loaded, total } = useProgress()

  if (!active) return null

  return (
    <Html center>
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.8)',
          padding: '20px',
          borderRadius: '10px',
          color: 'white',
          textAlign: 'center',
          minWidth: '200px',
        }}>
        <h3 style={{ margin: '0 0 10px 0' }}>Loading Assets</h3>
        <div style={{ marginBottom: '10px' }}>{Math.round(progress)}%</div>
        <div
          style={{
            width: '100%',
            height: '4px',
            background: '#333',
            borderRadius: '2px',
            overflow: 'hidden',
          }}>
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: '#ff6030',
              transition: 'width 0.3s',
            }}
          />
        </div>
        <div style={{ fontSize: '12px', marginTop: '10px', opacity: 0.7 }}>
          {loaded} / {total} items
        </div>
        {item && <div style={{ fontSize: '10px', marginTop: '5px', opacity: 0.5 }}>Loading: {item}</div>}
      </div>
    </Html>
  )
}

// Simple working texture demo
function SimpleTextureDemo() {
  // Using data URLs as fallback for textures
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')!

  // Create a simple gradient texture
  const gradient = ctx.createLinearGradient(0, 0, 256, 256)
  gradient.addColorStop(0, '#ff6030')
  gradient.addColorStop(1, '#ff0066')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 256, 256)

  const [texture] = useState(() => {
    const tex = new TextureLoader().load(canvas.toDataURL())
    return tex
  })

  return (
    <group position={[3, 0, 0]}>
      <Box args={[2, 2, 2]} castShadow>
        <meshStandardMaterial map={texture} />
      </Box>
      <Text position={[0, -2, 0]} fontSize={0.2} color="#ffffff" anchorX="center">
        Procedural Texture
      </Text>
    </group>
  )
}

// Main scene
export default function LoadersScene() {
  const { showEnvironment, environmentPreset } = useControls('Environment', {
    showEnvironment: true,
    environmentPreset: {
      value: 'sunset',
      options: ['sunset', 'dawn', 'night', 'warehouse', 'forest', 'apartment', 'studio', 'city', 'park', 'lobby'],
    },
  })

  return (
    <>
      {/* Title */}
      <Text position={[0, 4, 0]} fontSize={0.5} color="#ff6030" anchorX="center" anchorY="middle">
        Asset Loading with Suspense
      </Text>

      <Suspense fallback={<LoadingProgress />}>
        {/* Textured box */}
        <group position={[0, 0, -3]}>
          <Text position={[0, 2, 0]} fontSize={0.3} color="white" anchorX="center">
            PBR Textures
          </Text>
          <TexturedBox />
        </group>

        {/* Multi-texture demo */}
        <group position={[0, 0, 0]}>
          <Text position={[0, 2, 0]} fontSize={0.3} color="white" anchorX="center">
            Dynamic Textures
          </Text>
          <MultiTextureDemo />
        </group>

        {/* GLTF Model */}
        <group position={[0, 0, 3]}>
          <Text position={[0, 2, 0]} fontSize={0.3} color="white" anchorX="center">
            GLTF Model
          </Text>
          <GLTFModel />
        </group>

        {/* Procedural texture */}
        <SimpleTextureDemo />

        {/* Environment map */}
        {showEnvironment && <Environment preset={environmentPreset as any} background blur={0.5} />}
      </Suspense>

      {/* Preload assets */}
      <Preload all />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Lighting (when environment is off) */}
      {!showEnvironment && (
        <>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} castShadow shadow-mapSize={[2048, 2048]} />
        </>
      )}

      <OrbitControls makeDefault enableDamping dampingFactor={0.05} />
    </>
  )
}

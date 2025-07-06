import { useState, useRef } from 'react'
import { useFrame, ThreeEvent } from '@react-three/fiber'
import { Box, Sphere, Cone, Text, useCursor, OrbitControls } from '@react-three/drei'
import { Vector3, Mesh, MeshStandardMaterial } from 'three'
import { useControls } from 'leva'
import { useSpring, animated, config } from '@react-spring/three'
import { useGesture } from '@use-gesture/react'

// Animated mesh components
const AnimatedBox = animated(Box)
const AnimatedSphere = animated(Sphere)

// Interactive box component
function InteractiveBox({ position }: { position: [number, number, number] }) {
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  const meshRef = useRef<Mesh>(null)

  useCursor(hovered)

  const { scale, color } = useSpring({
    scale: clicked ? 1.5 : hovered ? 1.2 : 1,
    color: clicked ? '#ff0000' : hovered ? '#ffaa00' : '#ff6030',
    config: config.wobbly,
  })

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    setClicked(!clicked)
  }

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHovered(true)
  }

  const handlePointerOut = () => {
    setHovered(false)
  }

  useFrame((state) => {
    if (meshRef.current && hovered) {
      meshRef.current.rotation.y += 0.02
    }
  })

  return (
    <AnimatedBox
      ref={meshRef}
      args={[1, 1, 1]}
      position={position}
      scale={scale}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onPointerMissed={() => console.log('Clicked outside box')}
      castShadow>
      <animated.meshStandardMaterial color={color} />
    </AnimatedBox>
  )
}

// Draggable sphere component
function DraggableSphere({ position: initialPosition }: { position: [number, number, number] }) {
  const [position, setPosition] = useState(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const meshRef = useRef<Mesh>(null)

  useCursor(isDragging)

  const bind = useGesture({
    onDrag: ({ offset: [x, y] }) => {
      const newPos: [number, number, number] = [
        initialPosition[0] + x / 50,
        initialPosition[1] + y / -50,
        initialPosition[2],
      ]
      setPosition(newPos)
    },
    onDragStart: () => setIsDragging(true),
    onDragEnd: () => setIsDragging(false),
  })

  const { scale, color } = useSpring({
    scale: isDragging ? 1.2 : 1,
    color: isDragging ? '#00ff00' : '#30ff60',
    config: config.stiff,
  })

  return (
    <AnimatedSphere
      ref={meshRef}
      args={[0.5, 32, 32]}
      position={position}
      scale={scale}
      {...(bind() as any)}
      castShadow>
      <animated.meshStandardMaterial color={color} />
    </AnimatedSphere>
  )
}

// Hover effects cone
function HoverCone({ position }: { position: [number, number, number] }) {
  const [hovered, setHovered] = useState(false)
  const [rotation, setRotation] = useState(0)
  const materialRef = useRef<MeshStandardMaterial>(null)

  const { showEvents } = useControls('Debug', {
    showEvents: false,
  })

  useFrame((state, delta) => {
    if (hovered) {
      setRotation(rotation + delta * 2)
      if (materialRef.current) {
        materialRef.current.emissiveIntensity = Math.sin(state.clock.elapsedTime * 5) * 0.5 + 0.5
      }
    }
  })

  const handlePointerEnter = (e: ThreeEvent<PointerEvent>) => {
    if (showEvents) console.log('Pointer entered cone', e)
    setHovered(true)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerLeave = (e: ThreeEvent<PointerEvent>) => {
    if (showEvents) console.log('Pointer left cone', e)
    setHovered(false)
    document.body.style.cursor = 'auto'
  }

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (showEvents && hovered) {
      console.log('Pointer position:', e.point)
    }
  }

  const handleDoubleClick = (e: ThreeEvent<MouseEvent>) => {
    if (showEvents) console.log('Double clicked cone!', e)
    const newColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`
    if (materialRef.current) {
      materialRef.current.color.set(newColor)
    }
  }

  return (
    <Cone
      args={[0.5, 1, 32]}
      position={position}
      rotation={[0, rotation, 0]}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      onDoubleClick={handleDoubleClick}
      castShadow>
      <meshStandardMaterial
        ref={materialRef}
        color={hovered ? '#ff00ff' : '#3060ff'}
        emissive={hovered ? '#ff00ff' : '#000000'}
        emissiveIntensity={0}
      />
    </Cone>
  )
}

// Main scene
export default function InteractiveScene() {
  const [missedClicks, setMissedClicks] = useState(0)

  const { enableOrbitControls } = useControls('Controls', {
    enableOrbitControls: true,
  })

  return (
    <>
      {/* Title */}
      <Text position={[0, 3, 0]} fontSize={0.5} color="#ff6030" anchorX="center" anchorY="middle">
        Interactive Objects
      </Text>

      {/* Subtitle */}
      <Text position={[0, 2.5, 0]} fontSize={0.2} color="#ffffff" anchorX="center" anchorY="middle">
        Click boxes • Drag spheres • Hover cones • Double-click to change color
      </Text>

      {/* Interactive boxes */}
      <InteractiveBox position={[-2, 0, 0]} />
      <InteractiveBox position={[0, 0, 0]} />
      <InteractiveBox position={[2, 0, 0]} />

      {/* Draggable spheres */}
      <DraggableSphere position={[-2, 1.5, 0]} />
      <DraggableSphere position={[0, 1.5, 0]} />
      <DraggableSphere position={[2, 1.5, 0]} />

      {/* Hover cones */}
      <HoverCone position={[-2, -1.5, 0]} />
      <HoverCone position={[0, -1.5, 0]} />
      <HoverCone position={[2, -1.5, 0]} />

      {/* Click counter */}
      <Text position={[0, -3, 0]} fontSize={0.3} color="#aaaaaa" anchorX="center" anchorY="middle">
        Missed clicks: {missedClicks}
      </Text>

      {/* Floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -2.5, 0]}
        receiveShadow
        onPointerMissed={() => setMissedClicks(missedClicks + 1)}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Grid */}
      <gridHelper args={[20, 20, '#333', '#222']} position={[0, -2.49, 0]} />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow shadow-mapSize={[2048, 2048]} />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#ff6030" />

      {/* Conditional orbit controls */}
      {enableOrbitControls && <OrbitControls makeDefault enableDamping dampingFactor={0.05} />}
    </>
  )
}

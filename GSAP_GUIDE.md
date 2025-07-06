# GSAP Integration Guide for React Three Fiber

This guide provides practical patterns and best practices for integrating GSAP (GreenSock Animation Platform) with React Three Fiber in this project.

## Installation

```bash
# Install GSAP and React integration
yarn add gsap @gsap/react

# Optional: Install additional GSAP plugins
yarn add gsap-trial  # For premium plugins like MorphSVG, DrawSVG, etc.
```

## Basic Setup

### 1. Register GSAP Plugins

Create a file to register GSAP plugins once in your app:

```jsx
// src/utils/gsap-setup.js
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register plugins
gsap.registerPlugin(useGSAP, ScrollTrigger)

// Sync GSAP ticker with R3F render loop for better performance
export const GsapTicker = () => {
  const pg = useRef(0)

  useFrame((_, delta) => {
    pg.current += delta
    gsap.updateRoot(pg.current)
  })

  useEffect(() => {
    gsap.ticker.remove(gsap.updateRoot)
    return () => gsap.ticker.remove(gsap.updateRoot)
  }, [])

  return null
}
```

Add the ticker component to your main Canvas:

```jsx
<Canvas>
  <GsapTicker />
  {/* Your scene components */}
</Canvas>
```

### 2. Basic Animation Pattern

Use the `useGSAP` hook for automatic cleanup and React integration:

```jsx
import { useGSAP } from '@gsap/react'
import { useRef } from 'react'

function AnimatedMesh() {
  const meshRef = useRef()

  useGSAP(() => {
    // Simple position animation
    gsap.to(meshRef.current.position, {
      x: 5,
      duration: 2,
      ease: 'power3.inOut',
      repeat: -1,
      yoyo: true,
    })

    // Rotation animation
    gsap.to(meshRef.current.rotation, {
      y: Math.PI * 2,
      duration: 4,
      ease: 'none',
      repeat: -1,
    })
  }, []) // Empty dependency array for one-time setup

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  )
}
```

## Common Animation Patterns

### Timeline Animations

For complex sequences, use GSAP timelines:

```jsx
function TimelineAnimation() {
  const groupRef = useRef()
  const tl = useRef()

  useGSAP(() => {
    tl.current = gsap
      .timeline({ repeat: -1, yoyo: true })
      .to(groupRef.current.position, { x: 5, duration: 1 })
      .to(groupRef.current.rotation, { y: Math.PI, duration: 1 }, '-=0.5')
      .to(groupRef.current.scale, { x: 2, y: 2, z: 2, duration: 0.5 })
  }, [])

  return <group ref={groupRef}>{/* Your objects */}</group>
}
```

### Scroll-Based Animations

Integrate ScrollTrigger for scroll-driven 3D animations:

```jsx
function ScrollAnimation() {
  const meshRef = useRef()

  useGSAP(() => {
    gsap.to(meshRef.current.position, {
      y: -5,
      scrollTrigger: {
        trigger: '.scroll-container',
        start: 'top center',
        end: 'bottom center',
        scrub: 1,
        markers: false, // Set to true for debugging
      },
    })
  }, [])

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}
```

### Interactive Animations

Combine GSAP with R3F events:

```jsx
function InteractiveMesh() {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  useGSAP(() => {
    if (hovered) {
      gsap.to(meshRef.current.scale, {
        x: 1.2,
        y: 1.2,
        z: 1.2,
        duration: 0.3,
        ease: 'back.out(1.7)',
      })
    } else {
      gsap.to(meshRef.current.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.3,
        ease: 'power2.inOut',
      })
    }
  }, [hovered])

  return (
    <mesh ref={meshRef} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <boxGeometry />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}
```

### Camera Animations

Animate cameras with care to avoid motion sickness:

```jsx
function CameraController() {
  const { camera } = useThree()

  useGSAP(() => {
    const tl = gsap.timeline()

    tl.to(camera.position, {
      x: 10,
      y: 5,
      z: 10,
      duration: 3,
      ease: 'power2.inOut',
      onUpdate: () => camera.lookAt(0, 0, 0),
    })
  }, [camera])

  return null
}
```

## Performance Best Practices

### 1. Use GPU-Accelerated Properties

Focus on properties that can be GPU-accelerated:

```jsx
// ✅ Good - GPU accelerated
gsap.to(mesh.position, { x: 10 })
gsap.to(mesh.rotation, { y: Math.PI })
gsap.to(mesh.scale, { x: 2, y: 2, z: 2 })
gsap.to(material, { opacity: 0.5 })

// ❌ Avoid - CPU intensive
gsap.to(geometry.attributes.position.array, { ... }) // Modify geometry
gsap.to(material, { color: new THREE.Color() }) // Complex color transitions
```

### 2. Batch Animations with Stagger

For multiple objects, use stagger to distribute load:

```jsx
function StaggeredCubes() {
  const cubesRef = useRef([])

  useGSAP(() => {
    gsap.from(cubesRef.current, {
      scale: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'back.out(1.7)',
    })
  }, [])

  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={i} ref={(el) => (cubesRef.current[i] = el)} position={[i * 1.5 - 7.5, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="orange" />
        </mesh>
      ))}
    </>
  )
}
```

### 3. Cleanup and Memory Management

Always clean up animations to prevent memory leaks:

```jsx
function AnimatedComponent() {
  const meshRef = useRef()

  useGSAP(() => {
    const tween = gsap.to(meshRef.current.position, { x: 10 })

    return () => {
      tween.kill() // Cleanup specific tween
      // or use: gsap.killTweensOf(meshRef.current)
    }
  }, [])

  // The useGSAP hook automatically handles cleanup with gsap.context()
}
```

## Responsive Animations

Handle different screen sizes and orientations:

```jsx
function ResponsiveAnimation() {
  const meshRef = useRef()

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(max-width: 768px)', () => {
      // Mobile animations
      gsap.to(meshRef.current.scale, { x: 0.5, y: 0.5, z: 0.5 })
    })

    mm.add('(min-width: 769px)', () => {
      // Desktop animations
      gsap.to(meshRef.current.scale, { x: 1, y: 1, z: 1 })
    })

    return () => mm.revert()
  }, [])

  return (
    <mesh ref={meshRef}>
      <sphereGeometry />
      <meshStandardMaterial />
    </mesh>
  )
}
```

## Debugging

### Enable GSAP DevTools in Development

```jsx
import { GSDevTools } from 'gsap/GSDevTools'

function DebugAnimation() {
  const meshRef = useRef()

  useGSAP(() => {
    const tl = gsap
      .timeline({ id: 'main-animation' })
      .to(meshRef.current.position, { x: 5, duration: 2 })
      .to(meshRef.current.rotation, { y: Math.PI, duration: 1 }, '-=1')

    // Only in development
    if (process.env.NODE_ENV === 'development') {
      GSDevTools.create({ animation: tl })
    }
  }, [])

  return <mesh ref={meshRef}>{/* ... */}</mesh>
}
```

### Monitor Performance

```jsx
function PerformanceMonitor() {
  useGSAP(() => {
    // Log FPS during animations
    gsap.ticker.add(() => {
      if (gsap.ticker.frame % 60 === 0) {
        // Log every second
        console.log(`GSAP FPS: ${gsap.ticker.fps.toFixed(2)}`)
      }
    })
  }, [])

  return null
}
```

## Common Gotchas and Solutions

### 1. Animations Not Playing

- Ensure GSAP plugins are registered
- Check if refs are properly attached
- Verify the target object exists before animating

### 2. Memory Leaks

- Always use `useGSAP` hook instead of raw `useEffect`
- Clean up timelines and tweens in cleanup functions
- Kill animations when components unmount

### 3. Performance Issues

- Limit the number of simultaneous animations
- Use `will-change` CSS property sparingly
- Optimize with `force3D: true` for transform animations
- Consider using `gsap.ticker.lagSmoothing()` for consistent playback

### 4. React Strict Mode

- Animations may run twice in development
- Use `useGSAP` hook which handles this automatically

## Integration with Existing R3F Hooks

### Combining with useFrame

```jsx
function HybridAnimation() {
  const meshRef = useRef()
  const rotationSpeed = useRef(1)

  // GSAP for complex animations
  useGSAP(() => {
    gsap.to(rotationSpeed, {
      current: 5,
      duration: 2,
      yoyo: true,
      repeat: -1,
      ease: 'power2.inOut',
    })
  }, [])

  // useFrame for continuous updates
  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta * rotationSpeed.current
  })

  return <mesh ref={meshRef}>{/* ... */}</mesh>
}
```

## Example: Complete Scene with GSAP

```jsx
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'

export default function GSAPScene() {
  const groupRef = useRef()
  const cubesRef = useRef([])

  useGSAP(() => {
    // Entry animation
    const tl = gsap.timeline()

    tl.from(groupRef.current.position, {
      y: -10,
      duration: 1,
      ease: 'bounce.out',
    }).from(
      cubesRef.current,
      {
        scale: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'back.out(1.7)',
      },
      '-=0.5',
    )

    // Continuous rotation
    gsap.to(groupRef.current.rotation, {
      y: Math.PI * 2,
      duration: 10,
      repeat: -1,
      ease: 'none',
    })
  }, [])

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      {Array.from({ length: 5 }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => (cubesRef.current[i] = el)}
          position={[Math.cos((i * Math.PI * 2) / 5) * 3, 0, Math.sin((i * Math.PI * 2) / 5) * 3]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={`hsl(${i * 72}, 70%, 50%)`} />
        </mesh>
      ))}
    </group>
  )
}
```

## Resources

- [GSAP Documentation](https://gsap.com/docs/)
- [GSAP + React Guide](https://gsap.com/resources/react/)
- [useGSAP Hook Documentation](https://gsap.com/resources/react-basics/)
- [ScrollTrigger Documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [GSAP Forums](https://gsap.com/community/forums/)

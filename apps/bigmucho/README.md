# BigMucho - React Three Fiber Showcase

A comprehensive demo application showcasing the features and capabilities of React Three Fiber (R3F).

## 🚀 Quick Start

```bash
# From the monorepo root
yarn install
yarn workspace @apps/bigmucho dev

# Or from this directory
yarn dev
```

Visit `http://localhost:3000`

## 🎯 Features Demonstrated

### 1. **Basic Concepts**

- Core hooks: `useFrame`, `useThree`, `useEffect`
- 3D primitives with Drei helpers (Box, Sphere, Torus)
- Material properties and lighting
- Orbital controls with damping
- HTML overlays in 3D space
- Leva controls integration

### 2. **Interactive Objects**

- Mouse events (click, hover, double-click)
- Drag and drop with @use-gesture
- React Spring animations
- Cursor state management
- Event propagation and bubbling
- Pointer missed detection

### 3. **Performance Optimizations**

- Instanced meshes (1000+ objects)
- Level of Detail (LOD) rendering
- On-demand rendering modes
- Performance stats monitoring
- Dynamic instance management
- Optimized render loops

### 4. **Asset Loading**

- Texture loading with Suspense
- PBR material textures
- GLTF model loading
- Environment maps
- Loading progress indicators
- Error boundaries
- Asset preloading

### 5. **Custom Shaders**

- GLSL vertex shaders
- GLSL fragment shaders
- Uniform management
- Wave displacement effects
- Gradient and rim lighting
- Procedural noise textures
- Real-time shader updates

### 6. **Advanced Rendering**

- Render-to-texture portals
- Multiple scenes
- Camera layers
- Dynamic viewports
- Scene composition
- Custom render targets

## 📁 Project Structure

```
bigmucho/
├── src/
│   ├── scenes/         # Demo scenes
│   │   ├── BasicScene.tsx      # Core R3F concepts
│   │   ├── InteractiveScene.tsx # Event handling
│   │   ├── PerformanceScene.tsx # Optimizations
│   │   ├── LoadersScene.tsx    # Asset loading
│   │   ├── ShadersScene.tsx    # Custom shaders
│   │   └── PortalsScene.tsx    # Advanced rendering
│   ├── App.tsx         # Main app with navigation
│   ├── App.css         # Navigation styles
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── public/             # Static assets
├── vercel.json         # Deployment config
├── vite.config.ts      # Build configuration
└── package.json        # Dependencies
```

## 🛠 Tech Stack

- **React 19** - Latest React with Suspense
- **Three.js** - 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers and abstractions
- **Leva** - GUI controls for React
- **@react-spring/three** - Animation library
- **@use-gesture/react** - Gesture handling
- **Vite** - Build tool with HMR
- **TypeScript** - Type safety

## ⚡ Performance

Optimized production build:

- React/ReactDOM: ~12KB
- Three.js: ~689KB
- React Three Fiber: ~320KB
- **Total: ~1MB gzipped**

### Build Optimizations

```typescript
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom'],
        'three-vendor': ['three'],
        'r3f-vendor': ['@react-three/fiber', '@react-three/drei'],
      },
    },
  },
}
```

## 🚀 Commands

```bash
# Development
yarn dev              # Start dev server

# Building
yarn build            # Build for production
yarn preview          # Preview production build

# Analysis
yarn build            # Generates stats.html
```

## 🔧 Troubleshooting

### Duplicate React Instances

This app includes critical configuration to prevent duplicate React instances:

```typescript
// vite.config.ts
resolve: {
  dedupe: ['react', 'react-dom', '@react-three/fiber'],
}
```

Without this, you'll see: "R3F: Hooks can only be used within the Canvas component!"

## 📚 Learning Path

1. Start with **Basic Concepts** to understand core R3F hooks
2. Explore **Interactive Objects** for event handling
3. Study **Performance** scene for optimization techniques
4. Load assets with **Loaders** scene
5. Create effects in **Shaders** scene
6. Advanced techniques in **Portals** scene

## 🎮 Development Tips

1. Use Leva controls to experiment with settings
2. Check console for event logs in Interactive scene
3. Monitor Stats panel in Performance scene
4. Try different environments in Loaders scene
5. Adjust shader parameters in real-time

## 📦 Deployment

Configured for Vercel deployment:

```json
// vercel.json
{
  "buildCommand": "yarn workspace @apps/bigmucho build",
  "outputDirectory": "apps/bigmucho/dist"
}
```

## 🔗 Resources

- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)
- [Three.js Docs](https://threejs.org/docs)
- [Drei Storybook](https://drei.pmnd.rs/)
- [R3F Examples](https://docs.pmnd.rs/react-three-fiber/examples/showcase)
- [GLSL Shaders](https://thebookofshaders.com/)

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies
yarn install

# Development
yarn dev              # Start development mode
yarn examples         # Run example app

# Building
yarn build            # Build all packages (using preconstruct)
yarn prebuild         # Copy README to packages before build

# Testing
yarn test             # Run all tests with coverage
yarn test:watch       # Run tests in watch mode
jest path/to/test     # Run specific test file
jest -t "test name"   # Run specific test by name

# Linting & Formatting
yarn eslint           # Run ESLint on packages/**/src/**/*.{ts,tsx}
yarn eslint:fix       # Fix ESLint issues
yarn format           # Check Prettier formatting
yarn format:fix       # Apply Prettier formatting

# Type Checking
yarn typecheck        # Run TypeScript compiler checks

# Release Management
yarn changeset:add    # Add a changeset for version management
yarn vers             # Version packages
yarn release          # Build and publish packages
```

## Architecture Overview

### Core Reconciler Pattern

react-three-fiber implements a custom React reconciler that bridges React's declarative component model with Three.js's imperative API. The reconciler (`packages/fiber/src/core/reconciler.tsx`) translates JSX elements like `<mesh />` directly into Three.js objects (`new THREE.Mesh()`).

Key architectural concepts:

1. **Instance Management**: Every Three.js object gets an `__r3f` property containing its React fiber instance, enabling bidirectional linking between React components and Three.js objects.

2. **Store Architecture**: Uses Zustand (`packages/fiber/src/core/store.ts`) to maintain central state for scene, camera, renderer, and GL context. The store is accessible via `useThree()` hook.

3. **Render Loop**: The render loop (`packages/fiber/src/core/loop.ts`) implements frame scheduling with:
   - Priority-based rendering
   - Automatic invalidation
   - Before/after/tail effect stages
   - Manual frame control

4. **Event System**: Custom event handling (`packages/fiber/src/core/events.ts`) that:
   - Translates DOM events to 3D space via raycasting
   - Implements pointer capture API
   - Follows React event bubbling/capture patterns

### Web vs Native Implementation

The library supports both web and React Native through platform-specific Canvas components:

- **Web**: `packages/fiber/src/web/Canvas.tsx` - Uses DOM canvas with resize observer
- **Native**: `packages/fiber/src/native/Canvas.tsx` - Uses Expo GL with React Native's PanResponder

Both share the same core reconciler but have platform-specific event handling and context setup.

### Testing Architecture

The test renderer (`packages/test-renderer/`) provides:
- Mock WebGL context
- Synchronous rendering for tests
- Event simulation utilities
- Scene graph inspection

Use `createTestInstance()` for unit testing Three.js components with full reconciler support.

### Performance Patterns

The codebase enforces performance through:

1. **Custom ESLint Rules** (`packages/eslint-plugin/`):
   - `no-clone-in-loop`: Prevents vector cloning in render loops
   - `no-new-in-loop`: Prevents object instantiation in render loops

2. **Reconciler Optimizations**:
   - Shallow prop comparison
   - Selective re-rendering
   - Atomic updates for args changes

### Extension System

Add custom Three.js classes to the JSX namespace:

```typescript
import { extend } from '@react-three/fiber'
extend({ CustomClass })
// Now usable as <customClass />
```

The catalogue system maps JSX element names to Three.js constructors with automatic PascalCase transformation.

### Key Hooks

- `useFrame(callback, priority)`: Subscribe to render loop
- `useThree(selector)`: Access root state with optional selector
- `useLoader(Loader, url)`: Suspense-based asset loading
- `useGraph(object)`: Traverse object scene graph

### Development Workflow

1. This is a monorepo using yarn workspaces and preconstruct
2. Changes require changesets for version management
3. Tests must pass before committing (enforced by husky)
4. The library maintains compatibility with React 19+ (v9) and React 18 (v8)

### Important Patterns

1. **Props Pass-through**: Most props on Three.js elements are passed directly to the underlying object
2. **Attach Prop**: Use `attach="material"` to attach objects to specific properties
3. **Args Prop**: Constructor arguments via `args={[...]}` trigger full object reconstruction
4. **Primitive**: Use `<primitive object={existingObject} />` to add existing Three.js objects
5. **Portal System**: `createPortal()` enables rendering into different scene contexts
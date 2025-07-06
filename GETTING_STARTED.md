# Getting Started with react-three-fiber

This guide will help you understand the project structure and get up and running with development.

## Project Overview

react-three-fiber is a React renderer for Three.js that allows you to build 3D scenes declaratively with reusable components. This is a monorepo containing:

- **@react-three/fiber** - The core library
- **@react-three/test-renderer** - Testing utilities for R3F components
- **@react-three/eslint-plugin** - Custom ESLint rules for performance
- **example** - Demo application showcasing various features

## Prerequisites

- Node.js 16+
- Yarn 1.x (this project uses Yarn classic, not Yarn 2+)

## Initial Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/pmndrs/react-three-fiber.git
   cd react-three-fiber
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```
   This will:
   - Install all dependencies for all packages
   - Set up yarn workspaces
   - Run `preconstruct dev` to link packages for development
   - Install git hooks via husky

## Development

### Running the Example App

The easiest way to see react-three-fiber in action:

```bash
yarn examples
```

This starts the example app at `http://localhost:5173` with hot module replacement.

### Working on Core Library

When developing the core library (`packages/fiber`), changes are automatically reflected in the example app thanks to preconstruct's development setup.

```bash
# Start development mode (links packages)
yarn dev

# Then in another terminal, run the examples
yarn examples
```

## Building

### Build All Packages

```bash
yarn build
```

This uses preconstruct to build:

- CommonJS and ESM bundles
- TypeScript definitions
- Separate entry points for web and React Native

### Build Individual Package

```bash
cd packages/fiber
yarn build
```

## Testing

### Run All Tests

```bash
yarn test
```

### Run Tests in Watch Mode

```bash
yarn test:watch
```

### Run Specific Test File

```bash
jest packages/fiber/tests/utils.test.ts
```

### Run Tests Matching Pattern

```bash
jest -t "useFrame"
```

### Coverage Report

```bash
yarn test --coverage
```

## Code Quality

### Linting

```bash
# Check for lint errors
yarn eslint

# Auto-fix lint errors
yarn eslint:fix
```

### Type Checking

```bash
yarn typecheck
```

### Formatting

```bash
# Check formatting
yarn format

# Fix formatting
yarn format:fix
```

## Project Structure

```
react-three-fiber/
├── packages/
│   ├── fiber/              # Core library
│   │   ├── src/
│   │   │   ├── core/      # Reconciler, store, hooks
│   │   │   ├── web/       # Web-specific components
│   │   │   └── native/    # React Native components
│   │   └── tests/
│   ├── test-renderer/      # Testing utilities
│   └── eslint-plugin/      # Custom ESLint rules
├── example/                # Demo application
│   ├── src/
│   │   └── demos/         # Individual demo components
│   └── package.json
├── docs/                   # Documentation
├── .changeset/            # Version management
└── package.json           # Root package with scripts
```

## Common Development Tasks

### Adding a New Demo

1. Create a new component in `example/src/demos/`
2. Export it from `example/src/demos/index.ts`
3. It will automatically appear in the demo selector

### Making Changes to Core

1. Edit files in `packages/fiber/src/`
2. Write/update tests in `packages/fiber/tests/`
3. Run tests to ensure nothing breaks
4. The example app will hot-reload with your changes

### Debugging

- Use React DevTools - R3F components appear in the component tree
- Three.js Inspector browser extension for scene inspection
- Add `debug` prop to Canvas: `<Canvas debug>`

## Release Process

This project uses changesets for version management:

1. Make your changes
2. Add a changeset:
   ```bash
   yarn changeset:add
   ```
3. Select packages to version and describe changes
4. Commit the changeset file
5. Maintainers will handle versioning and publishing

## Troubleshooting

### "Cannot find module @react-three/fiber"

Run `yarn install` and ensure `yarn dev` has been run to set up package links.

### Build Errors

1. Clear all build artifacts:
   ```bash
   rm -rf packages/*/dist
   ```
2. Reinstall dependencies:
   ```bash
   rm -rf node_modules yarn.lock
   yarn install
   ```

### Test Failures

- Ensure you're using the correct Node version
- Some tests require a WebGL context - they use a mock by default
- Check if tests are flaky by running them individually

### "R3F: Hooks can only be used within the Canvas component!" in Monorepo

This error in Vite-based apps within the monorepo is caused by duplicate React instances. Fix by adding to your `vite.config.ts`:

```typescript
export default defineConfig({
  // ... other config
  resolve: {
    dedupe: ['react', 'react-dom', '@react-three/fiber'],
  },
})
```

This forces Vite to use single instances of these packages across the workspace.

## Useful Resources

- [Documentation](https://docs.pmnd.rs/react-three-fiber)
- [Discord Community](https://discord.gg/ZZjjNvJ)
- [Examples Collection](https://docs.pmnd.rs/react-three-fiber/getting-started/examples)
- [API Reference](https://docs.pmnd.rs/react-three-fiber/api)

## Next Steps

1. Explore the example demos to understand R3F patterns
2. Read through the core reconciler code to understand the architecture
3. Try building a simple 3D scene
4. Join the Discord community for help and discussions

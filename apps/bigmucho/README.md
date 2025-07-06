# BigMucho

A 3D web application built with react-three-fiber.

## Development

This app is part of the react-three-fiber monorepo. To run it:

1. From the root of the monorepo:

   ```bash
   yarn install
   yarn dev
   ```

2. Then start the BigMucho app:

   ```bash
   yarn workspace @apps/bigmucho dev
   ```

   Or navigate to this directory and run:

   ```bash
   cd apps/bigmucho
   yarn dev
   ```

The app will start at `http://localhost:3000`

## Features

- Built with React 19 and Three.js
- Uses @react-three/fiber for declarative 3D
- @react-three/drei for useful helpers
- Leva for runtime controls
- Vite for fast development
- TypeScript for type safety

## Project Structure

```
bigmucho/
├── src/
│   ├── components/     # Reusable 3D components
│   ├── scenes/         # Scene compositions
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── public/             # Static assets
├── index.html          # HTML template
└── vite.config.ts      # Vite configuration
```

## Building

```bash
yarn build
```

## Troubleshooting

### Vite Configuration

This app includes a critical configuration in `vite.config.ts` to prevent duplicate React instances in the monorepo:

```typescript
resolve: {
  dedupe: ['react', 'react-dom', '@react-three/fiber'],
}
```

Without this, you may encounter "R3F: Hooks can only be used within the Canvas component!" errors.

## Adding Components

1. Create new components in `src/components/`
2. Create scenes in `src/scenes/`
3. Use Leva controls for runtime tweaking
4. Leverage @react-three/drei for common patterns

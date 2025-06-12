# Migration to Bun + TypeScript + ESM

This document outlines the conversion of hostparty from JavaScript to TypeScript with Bun and ESM.

## Changes Made

### 1. Package Configuration
- Updated `package.json` to use ESM (`"type": "module"`)
- Switched from npm/grunt to Bun
- Added TypeScript and type definitions
- Removed legacy dependencies (bluebird, lodash)

### 2. TypeScript Configuration
- Created `tsconfig.json` with modern ES2022 target
- Set up proper module resolution for ESM
- Enabled strict type checking

### 3. Source Code Conversion
- Moved all source files to `src/` directory
- Converted all `.js` files to `.ts` with proper TypeScript types
- Updated imports to use ESM syntax
- Replaced promises with native async/await
- Added comprehensive type definitions

### 4. Testing
- Migrated from Mocha + Chai to Bun's built-in test runner
- Updated test files to TypeScript
- Simplified test setup without Grunt

### 5. Build System
- Replaced Grunt with simple Bun scripts
- Added TypeScript compilation to `dist/` directory
- Set up proper module exports

## New Commands

```bash
# Build the project
bun run build

# Development mode (watch)
bun run dev

# Run tests
bun test

# Type checking
bun run lint

# Clean build artifacts
bun run clean
```

## Breaking Changes

- Minimum Node.js version requirement may have changed
- CLI binary is now at `dist/bin/cli.js` (after build)
- Import paths use `.js` extensions (TypeScript requirement for ESM)
- Removed `lodash` and `bluebird` dependencies

## Type Safety

The conversion adds comprehensive TypeScript types:

```typescript
import party, { type PartyAPI, type PartyOptions, type HostsMap } from 'hostparty';

const options: PartyOptions = {
  path: '/custom/hosts',
  force: true,
  group: false
};

const hosts: HostsMap = await party
  .setup(options)
  .list();
```
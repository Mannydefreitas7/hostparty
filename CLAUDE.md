# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Build**: `bun run build` (compiles TypeScript to dist/)
- **Development mode**: `bun run dev` (TypeScript watch mode)
- **Run tests**: `bun test` (runs tests in src/tests/)
- **Lint/Type check**: `bun run lint` (TypeScript type checking)
- **Clean**: `bun run clean` (removes dist/ directory)

## Architecture Overview

This is a Node.js CLI tool and TypeScript API for managing system hosts files across platforms (Unix/Linux/macOS/Windows). Built with Bun, ESM, and TypeScript.

### Core Structure

- **`src/app.ts`**: Main entry point that exports the API from `lib/party.ts`
- **`src/lib/party.ts`**: Core API implementation with methods for hosts file manipulation
- **`src/lib/utils.ts`**: Utility functions for IP/hostname validation and entry sorting
- **`src/bin/cli.ts`**: CLI interface (compiled to dist/bin/cli.js)
- **`dist/`**: Compiled JavaScript output directory

### Key API Methods

The main API (`src/lib/party.ts`) provides promise-based methods with TypeScript types:
- `add(ip, hostNames)`: Add hostname(s) to IP mapping
- `remove(ips)`: Remove entire IP entries
- `purge(hostNames)`: Remove specific hostnames from any IP
- `list(filter)`: List hosts file contents with optional filtering
- `setup(options)`: Configure options (path, force, group)

### Protected Entries

The system protects certain IPs (`::1`, `fe80::1%lo0`) and hosts (`localhost`) from removal unless `--force` flag is used.

### Cross-Platform File Paths

Automatically detects hosts file location:
- Unix/Linux/macOS: `/etc/hosts`
- Windows: `%SystemRoot%\System32\drivers\etc\hosts`

### Testing Setup

Tests use Bun's built-in test runner with a mock hosts file at `src/tests/etc/hosts.test.orig` and are configured through `src/tests/tests-setup.ts`. Tests are written in TypeScript and located in `src/tests/`.
<div align="center">

![HostParty Header](./assets/header.svg)

**Cross-platform CLI tool & TypeScript API for managing your hosts file**

[![NPM Version](https://img.shields.io/npm/v/hostparty.svg)](https://www.npmjs.com/package/hostparty)
[![CI](https://github.com/MannyDeFreitas7/hostparty/actions/workflows/ci.yml/badge.svg)](https://github.com/MannyDeFreitas7/hostparty/actions/workflows/ci.yml)
[![Release](https://github.com/MannyDeFreitas7/hostparty/actions/workflows/release.yml/badge.svg)](https://github.com/MannyDeFreitas7/hostparty/actions/workflows/release.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-000000?logo=bun&logoColor=white)](https://bun.sh)
[![ESM](https://img.shields.io/badge/ESM-Module-brightgreen)](https://nodejs.org/api/esm.html)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

*Programmatically manage your system's hosts file with ease. Built with modern TypeScript, ESM modules, and Bun.*

[Installation](#installation) • [CLI Usage](#cli-usage) • [API Reference](#api-reference) • [Examples](#examples)

</div>

---

## ✨ Features

- 🔧 **Cross-platform**: Works on Windows, macOS, and Linux
- 🎯 **Type-safe**: Full TypeScript support with comprehensive type definitions
- ⚡ **Modern**: Built with Bun, ESM modules, and async/await
- 🛡️ **Safe**: Protects system-critical entries (can be overridden with `--force`)
- 📝 **Flexible**: Both CLI tool and programmatic API
- 🧪 **Tested**: Comprehensive test suite with Bun test runner

## 📦 Installation

### Global Installation (CLI)

```bash
# Using npm
npm install -g hostparty

# Using bun (recommended)
bun install -g hostparty

# Using yarn
yarn global add hostparty
```

### Local Installation (API)

```bash
# Using npm
npm install hostparty

# Using bun (recommended)
bun add hostparty

# Using yarn
yarn add hostparty
```

## 🚀 CLI Usage

### Basic Commands

```bash
# List all entries in hosts file
hostparty list

# Add a hostname to an IP
hostparty add 127.0.0.1 myapp.local

# Add multiple hostnames to an IP
hostparty add 192.168.1.100 api.local admin.local

# Remove all entries for an IP
hostparty remove 192.168.1.100

# Remove specific hostnames (regardless of IP)
hostparty purge myapp.local api.local

# Filter hosts by hostname
hostparty list local
```

### Advanced Options

```bash
# Use custom hosts file path
hostparty list --path /custom/path/hosts

# Force operations on protected entries
hostparty remove ::1 --force

# Display one hostname per line instead of grouping
hostparty list --no-group

# Show help
hostparty --help

# Show version
hostparty --version
```

### Examples

```bash
# Development setup
hostparty add 127.0.0.1 myapp.local api.myapp.local admin.myapp.local

# Staging environment
hostparty add 192.168.1.50 staging.myapp.com staging-api.myapp.com

# Block websites (redirect to localhost)
hostparty add 127.0.0.1 facebook.com www.facebook.com

# Clean up development entries
hostparty purge myapp.local api.myapp.local admin.myapp.local
```

## 🔧 API Reference

### Import

```typescript
import party from 'hostparty';
// or
import { setup, add, remove, list, purge } from 'hostparty';
```

### Setup Options

```typescript
import party, { type PartyOptions } from 'hostparty';

const options: PartyOptions = {
  path: '/custom/hosts',      // Custom hosts file path
  force: true,                // Allow operations on protected entries
  group: false               // Don't group hostnames by IP
};

party.setup(options);
```

### Methods

#### `add(ip: string, hostNames: string | string[]): Promise<void>`

Add hostname(s) to an IP address.

```typescript
// Add single hostname
await party.add('127.0.0.1', 'myapp.local');

// Add multiple hostnames
await party.add('192.168.1.100', ['api.local', 'admin.local']);
```

#### `remove(ips: string | string[]): Promise<void>`

Remove entire IP entries from hosts file.

```typescript
// Remove single IP
await party.remove('192.168.1.100');

// Remove multiple IPs
await party.remove(['192.168.1.100', '192.168.1.101']);
```

#### `purge(hostNames: string | string[]): Promise<void>`

Remove specific hostnames from any IP mapping.

```typescript
// Remove single hostname
await party.purge('myapp.local');

// Remove multiple hostnames
await party.purge(['api.local', 'admin.local']);
```

#### `list(filter?: string): Promise<HostsMap>`

List hosts file contents with optional filtering.

```typescript
import { type HostsMap } from 'hostparty';

// List all entries
const hosts: HostsMap = await party.list();

// Filter by hostname
const filtered = await party.list('local');

console.log(hosts);
// Output: { '127.0.0.1': ['localhost', 'myapp.local'] }
```

## 📝 Examples

### Basic Usage

```typescript
import party from 'hostparty';

async function setupDevEnvironment() {
  try {
    // Add development domains
    await party.add('127.0.0.1', [
      'myapp.local',
      'api.myapp.local',
      'admin.myapp.local'
    ]);
    
    // List current entries
    const hosts = await party.list();
    console.log('Current hosts:', hosts);
    
    console.log('✅ Development environment ready!');
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  }
}

setupDevEnvironment();
```

### Advanced Configuration

```typescript
import party, { type PartyOptions, type HostsMap } from 'hostparty';

class HostsManager {
  constructor(private options: PartyOptions = {}) {
    party.setup(this.options);
  }
  
  async addDevDomains(ip: string, domains: string[]): Promise<void> {
    await party.add(ip, domains);
    console.log(`✅ Added ${domains.length} domains to ${ip}`);
  }
  
  async cleanup(domains: string[]): Promise<void> {
    await party.purge(domains);
    console.log(`🧹 Cleaned up ${domains.length} domains`);
  }
  
  async listByFilter(filter: string): Promise<HostsMap> {
    return await party.list(filter);
  }
}

// Usage
const manager = new HostsManager({ force: true });

await manager.addDevDomains('127.0.0.1', [
  'myapp.test',
  'api.myapp.test'
]);

const devHosts = await manager.listByFilter('test');
console.log('Development hosts:', devHosts);
```

### Error Handling

```typescript
import party from 'hostparty';

async function safeHostsOperation() {
  try {
    await party.add('invalid-ip', 'test.local');
  } catch (error) {
    if (error.message.includes('Invalid IP address')) {
      console.error('❌ Please provide a valid IP address');
    } else if (error.message.includes('permission denied')) {
      console.error('❌ Permission denied. Try running with sudo/administrator');
    } else {
      console.error('❌ Operation failed:', error.message);
    }
  }
}
```

## 🛡️ Protected Entries

HostParty protects certain system-critical entries by default:

- **IPs**: `::1`, `fe80::1%lo0`
- **Hostnames**: `localhost`

Use the `--force` flag or `{ force: true }` option to override protection.

## 🗂️ File Locations

HostParty automatically detects your system's hosts file:

- **Linux/macOS**: `/etc/hosts`
- **Windows**: `%SystemRoot%\System32\drivers\etc\hosts`

## 🔨 Development

### Prerequisites

- [Bun](https://bun.sh) (recommended) or Node.js 18+
- TypeScript knowledge for contributing

### Setup

```bash
# Clone the repository
git clone https://github.com/MannyDeFreitas7/hostparty.git
cd hostparty

# Install dependencies
bun install

# Build the project
bun run build

# Run tests
bun test

# Development mode (watch)
bun run dev
```

### Available Scripts

```bash
bun run build      # Compile TypeScript to dist/
bun run dev        # TypeScript watch mode
bun test           # Run tests with Bun
bun run lint       # Type checking
bun run clean      # Remove build artifacts
```

## 📜 License

MIT License - see [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Manuel De Freitas** ([@MannyDeFreitas7](https://github.com/MannyDeFreitas7))

---

<div align="center">

**⭐ If you find HostParty useful, please give it a star on GitHub! ⭐**

[GitHub](https://github.com/MannyDeFreitas7/hostparty) • [NPM](https://www.npmjs.com/package/hostparty) • [Issues](https://github.com/MannyDeFreitas7/hostparty/issues)

</div>
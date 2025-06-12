# GitHub Actions Workflow Guide

This document explains the CI/CD workflows for HostParty and how to use them.

## 🔄 Workflows Overview

### 1. **CI Workflow** (`ci.yml`)
**Trigger**: Push to main/master, Pull Requests
**Purpose**: Continuous Integration testing

**What it does:**
- Tests on Node.js 18.x, 20.x, 22.x
- Installs dependencies with Bun
- Runs TypeScript linting
- Builds the project
- Runs test suite
- Tests CLI functionality
- Uploads build artifacts (on main branch)

### 2. **Release & Publish Workflow** (`release.yml`)
**Trigger**: 
- Push with version tags (`v*.*.*`, `release-*`)
- Merged PRs from `release/` branches or with `release` label

**What it does:**
- Runs full test suite
- Builds production assets
- Creates GitHub Release
- Publishes to NPM Registry
- Generates deployment summary

## 🚀 How to Release

### Method 1: Tag-based Release (Recommended)

1. **Update version in package.json**:
   ```bash
   # Update version manually or using bun
   bun version patch  # 1.0.16 -> 1.0.17
   bun version minor  # 1.0.16 -> 1.1.0
   bun version major  # 1.0.16 -> 2.0.0
   ```

2. **Commit and push changes**:
   ```bash
   git add package.json
   git commit -m "chore: bump version to v1.0.17"
   git push origin main
   ```

3. **Create and push a tag**:
   ```bash
   git tag v1.0.17
   git push origin v1.0.17
   ```

4. **Workflow automatically**:
   - Creates GitHub Release
   - Publishes to NPM
   - Updates package version

### Method 2: Release Branch (Alternative)

1. **Create release branch**:
   ```bash
   git checkout -b release/v1.0.17
   ```

2. **Update version**:
   ```bash
   bun version 1.0.17 --no-git-tag-version
   git add package.json
   git commit -m "chore: prepare release v1.0.17"
   git push origin release/v1.0.17
   ```

3. **Create PR with 'release' label**:
   - Open PR from `release/v1.0.17` to `main`
   - Add `release` label to the PR
   - When merged, workflow triggers automatically

### Method 3: PR Label Release

1. **Create any branch with changes**
2. **Open PR to main**
3. **Add `release` label to PR**
4. **When merged**, workflow triggers release

## 🔑 Required Secrets

Set these secrets in your GitHub repository settings:

### `NPM_TOKEN`
**Required for NPM publishing**

1. Go to [npmjs.com](https://www.npmjs.com/)
2. Login to your account
3. Go to Access Tokens → Generate New Token
4. Choose "Automation" type
5. Copy the token
6. In GitHub: Settings → Secrets and variables → Actions
7. Add `NPM_TOKEN` with your token value

## 📋 Workflow Status

### CI Status Indicators
```markdown
[![CI](https://github.com/MannyDeFreitas7/hostparty/actions/workflows/ci.yml/badge.svg)](https://github.com/MannyDeFreitas7/hostparty/actions/workflows/ci.yml)
```

### Release Status
```markdown
[![Release](https://github.com/MannyDeFreitas7/hostparty/actions/workflows/release.yml/badge.svg)](https://github.com/MannyDeFreitas7/hostparty/actions/workflows/release.yml)
```

## 🐛 Troubleshooting

### Common Issues

**1. NPM Publish Fails**
- Check if `NPM_TOKEN` secret is set correctly
- Verify you have publish permissions for the package
- Ensure version number is unique (not already published)

**2. Build Fails**
- Check TypeScript compilation errors
- Verify all tests pass locally: `bun test`
- Run linting: `bun run lint`

**3. Release Not Created**
- Verify tag format matches `v*.*.*` pattern
- Check if version in package.json is valid
- Ensure you have write permissions to the repository

**4. Workflow Not Triggering**
- Verify branch protection rules
- Check if workflows are enabled in repository settings
- Ensure proper permissions in workflow files

## 📁 File Structure

```
.github/
├── workflows/
│   ├── ci.yml           # Continuous Integration
│   └── release.yml      # Release & Publish
└── WORKFLOW_GUIDE.md    # This file
```

## 🔧 Customization

### Modify CI Matrix
Edit `ci.yml` to change Node.js versions:
```yaml
strategy:
  matrix:
    node-version: [18.x, 20.x, 22.x]  # Add/remove versions
```

### Change Release Triggers
Edit `release.yml` triggers:
```yaml
on:
  push:
    tags:
      - 'v*.*.*'        # Version tags
      - 'release-*'     # Release tags
```

### Add Pre-release Support
Add to `release.yml`:
```yaml
- name: Check if pre-release
  id: prerelease
  run: |
    if [[ ${{ steps.version.outputs.version }} =~ -[a-zA-Z] ]]; then
      echo "prerelease=true" >> $GITHUB_OUTPUT
    else
      echo "prerelease=false" >> $GITHUB_OUTPUT
    fi
```

## 📊 Monitoring

- **GitHub Actions Tab**: View workflow runs and logs
- **NPM Package**: Monitor download stats at npmjs.com
- **GitHub Releases**: Track release history and assets
- **Dependabot**: Automatic dependency updates (if enabled)

## 🎯 Best Practices

1. **Always test locally** before pushing
2. **Use semantic versioning** (semver.org)
3. **Write meaningful commit messages**
4. **Review PR changes** before merging
5. **Monitor workflow failures** and fix promptly
6. **Keep secrets secure** and rotate regularly
7. **Document breaking changes** in release notes
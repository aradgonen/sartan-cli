#  Sartan

*One Command to Rule Them All*

[![npm version](https://badge.fury.io/js/sartan.svg)](https://badge.fury.io/js/sartan)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js CI](https://github.com/your-username/sartan/workflows/Node.js%20CI/badge.svg)](https://github.com/your-username/sartan/actions)

> **Sartan** is the universal package manager wrapper that brings harmony to your Node.js monorepos. Say goodbye to remembering different commands for npm, yarn, and pnpm – Sartan speaks fluent npm and translates seamlessly.

## ✨ Why Sartan?

**Before Sartan:**
```bash
cd project-a && npm install lodash
cd ../project-b && yarn add lodash  
cd ../project-c && pnpm add lodash
```

**After Sartan:**
```bash
# From anywhere in your monorepo
sartan install lodash  #  Works everywhere!
```

---

##  Features That Matter

###  **Intelligent Detection**
Sartan automatically detects your package manager by scanning:
- `packageManager` field in package.json
- Lock files (pnpm-lock.yaml, yarn.lock, package-lock.json)  
- Workspace configurations

###  **Universal Language**
Write commands in familiar npm syntax. Sartan translates them perfectly:

| Your Command | npm | yarn | pnpm |
|--------------|-----|------|------|
| `sartan install react` | `npm install react` | `yarn add react` | `pnpm add react` |
| `sartan uninstall react` | `npm uninstall react` | `yarn remove react` | `pnpm remove react` |
| `sartan run dev` | `npm run dev` | `yarn dev` | `pnpm run dev` |

###  **Monorepo Native**
Sartan understands workspace hierarchies and executes commands from the right location, making it perfect for:
- Lerna projects
- Nx workspaces
- Rush monorepos
- Custom workspace setups

### ⚡ **Zero Config**
No setup required. Install and go:
```bash
npm install -g sartan
sartan install  # Just works! ✨
```

---

##  Installation

```bash
# Install globally for system-wide access
npm install -g sartan

# Or use with npx (no installation needed)
npx sartan install lodash
```

---

##  Quick Start

```bash
# Navigate to any project
cd my-awesome-monorepo/packages/frontend

# Use familiar npm commands
sartan install            # Install dependencies  
sartan install react     # Add a package
sartan run dev           # Run your dev server
sartan test --watch      # Run tests in watch mode
sartan build             # Build your project

# Sartan handles the rest! 
```

---

## ️ Command Reference

### Core Commands
```bash
sartan install [package]     # Install dependencies
sartan uninstall <package>   # Remove packages  
sartan run <script>          # Execute package.json scripts
sartan update [package]      # Update packages
sartan audit                 # Security audit
sartan outdated             # Check for updates
```

### Developer Commands
```bash
sartan start                # Start your application
sartan test                 # Run test suite
sartan build               # Build for production
sartan publish             # Publish to registry
```

### Utility Commands
```bash
sartan --detect                    # Show detected package manager
sartan --force-manager yarn       # Force specific manager
sartan --help                     # Show help
sartan --version                  # Show version
```

---

##  Real-World Examples

### Monorepo Development
```bash
# Work seamlessly across different projects
cd packages/ui-components && sartan install
cd ../api-server && sartan run dev  
cd ../mobile-app && sartan test --coverage

# Sartan adapts to each project's package manager! 
```

### Team Consistency
```bash
# Everyone uses the same commands, regardless of their preferred PM
git clone awesome-project
cd awesome-project
sartan install    # Works for Sarah (yarn), Mike (pnpm), and Jane (npm)
sartan run dev    # Everyone's happy! 
```

### CI/CD Pipelines
```yaml
# .github/workflows/ci.yml
- name: Install dependencies
  run: sartan install

- name: Run tests  
  run: sartan test

- name: Build project
  run: sartan build
```

---

##  Smart Detection Logic

Sartan uses a sophisticated detection algorithm:

1. ** Explicit Declaration**: Checks `packageManager` in package.json
2. ** Lock File Analysis**: Scans for lock files in workspace hierarchy  
3. ** Workspace Detection**: Identifies monorepo roots automatically
4. ** Fallback Strategy**: Defaults to npm if nothing found

```json
{
  "packageManager": "pnpm@8.6.0",
  "workspaces": ["packages/*"]
}
```

---

##  Benefits

### For Developers
- ** Mental Load**: Remember one syntax instead of three
- **⚡ Speed**: No context switching between package managers
- ** Focus**: Concentrate on code, not tooling differences

### For Teams  
- ** Onboarding**: New team members learn one command set
- ** Documentation**: Consistent commands in all READMEs
- ** Flexibility**: Easy to switch package managers later

### For Projects
- ** Monorepo Friendly**: Works across complex workspace structures
- ** CI/CD Ready**: Simplifies build and deployment scripts
- ** Future Proof**: Adapts as your tooling evolves

---

##  Contributing

We love contributions! Sartan is built for the community, by the community.

```bash
git clone https://github.com/your-username/sartan.git
cd sartan
sartan install  # Yes, use Sartan to develop Sartan! 
sartan run dev
```

---

##  License

MIT © [Your Name](https://github.com/your-username)

---

##  Show Your Support

If Sartan makes your development life easier, give us a star! ⭐

```bash
# Share the love
sartan --version  # Check you're running the latest
```

---

<div align="center">

**Made with  for the Node.js community**

[ Star on GitHub](https://github.com/your-username/sartan) • [ Documentation](https://sartan.dev) • [ Report Bug](https://github.com/your-username/sartan/issues) • [ Request Feature](https://github.com/your-username/sartan/issues)

*"Finally, a package manager wrapper that just works!"* – Happy Developer

</div>
# Basic commands
sartan install              # Install all dependencies
sartan install lodash       # Add lodash package
sartan uninstall lodash     # Remove lodash package
sartan run dev             # Run dev script
sartan test --watch        # Run tests with flags

# Utility commands
sartan --detect            # Show detected package manager
sartan --force-manager yarn install  # Force use of yarn

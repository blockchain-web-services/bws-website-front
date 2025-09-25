# Documentation Overview

## Core Documentation

| Document | Purpose | Topics Covered |
|----------|---------|---------------|
| **[Architecture](./ARCHITECTURE.md)** | System design and structure | Technology stack, project structure, design principles |
| **[Development Guidelines](./DEVELOPMENT_GUIDELINES.md)** | Code standards and practices | Coding standards, workflow, common patterns |
| **[Building](./BUILDING.md)** | Build procedures | Build setup, development server, production builds |
| **[Testing](./TESTING.md)** | Test procedures | Test setup, running tests, writing tests |
| **[GitHub Pages Deployment](./GITHUB_PAGES_DEPLOYMENT.md)** | Deployment configuration | GitHub Pages setup, custom domain, deployment |
| **[GitHub Actions](./GITHUB_ACTIONS.md)** | CI/CD automation | Workflows, automation, monitoring |

## Quick Reference Guide

### Getting Started
1. **Setup** → See [Building > Initial Setup](./BUILDING.md#initial-setup)
2. **Development** → See [Building > Development Build](./BUILDING.md#development-build)
3. **Testing** → See [Testing > Running Tests](./TESTING.md#running-tests)
4. **Deployment** → See [GitHub Pages Deployment](./GITHUB_PAGES_DEPLOYMENT.md)

### Common Tasks

| Task | Documentation |
|------|--------------|
| Start development server | [Building > Development Build](./BUILDING.md#development-build) |
| Build for production | [Building > Production Build](./BUILDING.md#production-build) |
| Run all tests | [Testing > Running Tests](./TESTING.md#running-tests) |
| Run specific test suite | [Testing > Running Tests](./TESTING.md#running-tests) |
| Deploy to production | [GitHub Pages Deployment](./GITHUB_PAGES_DEPLOYMENT.md#deployment-process) |
| Add new page | [Development Guidelines > Common Patterns](./DEVELOPMENT_GUIDELINES.md#adding-a-new-page) |
| Fix build errors | [Building > Troubleshooting](./BUILDING.md#troubleshooting) |
| Debug test failures | [Testing > Troubleshooting](./TESTING.md#troubleshooting) |
| Configure GitHub Actions | [GitHub Actions](./GITHUB_ACTIONS.md) |

## Documentation Principles

### Single Source of Truth
Each topic is documented in exactly one place:
- **Architecture** → ARCHITECTURE.md only
- **Build commands** → BUILDING.md only
- **Test commands** → TESTING.md only
- **Deployment** → GITHUB_PAGES_DEPLOYMENT.md only
- **Workflows** → GITHUB_ACTIONS.md only
- **Code standards** → DEVELOPMENT_GUIDELINES.md only

### Cross-References
Documents link to related information rather than duplicating it.

### Maintenance
When updating documentation:
1. Identify the correct document for your topic
2. Make changes in that document only
3. Add cross-references if needed
4. Never duplicate information
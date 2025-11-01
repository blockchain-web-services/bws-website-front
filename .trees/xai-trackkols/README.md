# BWS Website

Production website for Blockchain Web Services, deployed at [www.bws.ninja](https://www.bws.ninja)

## Quick Start

```bash
# Clone repository
git clone [repository-url]
cd bws-website-front

# Setup build environment
cd build && npm install

# Start development server
npm run dev
# Opens at http://localhost:8087
```

## Documentation

All documentation is in the `/docs/` folder:

| Document | Description |
|----------|-------------|
| **[Overview](./docs/OVERVIEW.md)** | Documentation index and quick reference |
| **[Architecture](./docs/ARCHITECTURE.md)** | Technology stack, project structure, design principles |
| **[Development Guidelines](./docs/DEVELOPMENT_GUIDELINES.md)** | Code standards, workflow, best practices |
| **[Building](./docs/BUILDING.md)** | Build setup, development server, production builds |
| **[Testing](./docs/TESTING.md)** | Test setup, running tests, writing tests |
| **[GitHub Pages Deployment](./docs/GITHUB_PAGES_DEPLOYMENT.md)** | Deployment configuration and process |
| **[GitHub Actions](./docs/GITHUB_ACTIONS.md)** | CI/CD workflows and automation |

## Project Structure

```
bws-website-front/
├── src/          # Source code (Astro components and pages)
├── public/       # Static assets (CSS, images, fonts)
├── build/        # Build tools and dependencies
├── tests/        # Test suite and dependencies
├── docs/         # Documentation
├── _site/        # Build output (generated)
└── astro.config.mjs
```

## Key Features

- **Static Site Generation** - Built with Astro for optimal performance
- **Component-Based** - Modular Astro components for maintainability
- **GitHub Pages Hosting** - Automated deployment via GitHub Actions
- **Comprehensive Testing** - E2E, visual, accessibility, and performance tests
- **CI/CD Pipeline** - Automated testing, building, and deployment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the [Development Guidelines](./docs/DEVELOPMENT_GUIDELINES.md)
4. Test your changes (see [Testing](./docs/TESTING.md))
5. Submit a pull request

## Support

- **Documentation**: [/docs/](./docs/)
- **Issues**: [GitHub Issues](https://github.com/blockchain-web-services/bws-website-front/issues)
- **Live Site**: [www.bws.ninja](https://www.bws.ninja)

## License

MIT License - see LICENSE file for details
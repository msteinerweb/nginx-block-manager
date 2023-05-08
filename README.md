# Nginx Block Manager

Nginx Block Manager is a TypeScript library that provides a simple interface to manage Nginx configuration files. It allows you to easily read, modify, and generate Nginx server and location blocks. The main goal of this library is to simplify the management of Nginx configuration files, especially when it comes to automating tasks.

## Features

- Read and parse existing Nginx configuration files
- Create and modify server and location blocks
- Generate valid Nginx configuration files
- Support for Nginx directives

## Getting Started

These instructions will help you set up and use Nginx Block Manager in your project.

### Prerequisites

You need to have Node.js and npm installed on your system. You can download and install them from the official [Node.js website](https://nodejs.org/).

### Installation

To install Nginx Block Manager, run the following command in your project's root directory:

```bash
npm install nginx-block-manager
```

## Usage

Here is a basic example of how to use Nginx Block Manager in your project:

```typescript
import { NginxBlockManager } from 'nginx-block-manager';

const configPath = '/path/to/your/nginx.conf';

const nginxManager = new NginxBlockManager(configPath);

// Read the Nginx configuration file
nginxManager.readConfig();

// Add a new server block
const newServerBlock = nginxManager.createServerBlock({
    listen: '80',
    server_name: 'example.com',
    root: '/var/www/html'
});

// Add a location block to the new server block
const locationBlock = newServerBlock.createLocationBlock({
    location: '/',
    try_files: '$uri $uri/ /index.html',
    expires: '30d'
});

// Save the changes to the configuration file
nginxManager.writeConfig();
```

## API Reference

For a detailed API reference, please refer to the [API documentation](./docs/API.md).

## Contributing

We welcome contributions from the community. If you would like to contribute to the development of Nginx Block Manager, please see the [CONTRIBUTING.md](./CONTRIBUTING.md) file for guidelines.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## Acknowledgements

- [Nginx](https://nginx.org/) - The high-performance web server and reverse proxy server that inspired this library
- [TypeScript](https://www.typescriptlang.org/) - The programming language used to develop this library

## Contact

For any questions, suggestions, or bug reports, feel free to open an issue on the [GitHub repository](https://github.com/msteinerweb/nginx-block-manager/issues).

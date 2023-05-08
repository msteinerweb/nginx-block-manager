# Nginx Block Manager

Nginx Block Manager is a utility to help you manage server and location blocks in your Nginx configuration. With a simple and easy-to-use API, you can create, update, and delete server and location blocks, as well as retrieve information from existing blocks.

## Features

- Create, update, and delete server blocks
- Create, update, and delete location blocks within server blocks
- Retrieve information from server and location blocks
- List all servers in the Nginx configuration directory
- Test Nginx configuration for syntax errors
- Reload Nginx configuration

## Usage

First, import the `NginxBlockManager` class from the package:

```javascript
const { NginxBlockManager } = require('nginx-block-manager');
```

Create an instance of the `NginxBlockManager` class, passing the path to your Nginx configuration directory as a parameter:

```javascript
const manager = new NginxBlockManager();
```

Now you can use the available methods to manage your Nginx server and location blocks. For a detailed list of available methods and their usage, please refer to the [API documentation](API.md).

### Example

```javascript
const { NginxBlockManager } = require('nginx-block-manager');

const manager = new NginxBlockManager();

(async () => {
    // Add a new server block
    await manager.addServerBlock('example.com');

    // Add a location block to the server block
    await manager.addLocationBlock('example.com', '/api');

    // Add a key-value pair to the location block
    await manager.addKeyToLocation('example.com', '/api', 'proxy_pass', 'http://localhost:3000');

})();
```

## Requirements

- Node.js >= 14.x
- Nginx installed and configured on your system

## API Documentation

Please refer to the [API.md](API.md) file for a detailed description of the available methods and their usage.

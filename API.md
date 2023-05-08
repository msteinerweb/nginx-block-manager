# Nginx Block Manager API Reference

This API reference provides detailed information on how to use the classes and methods provided by the Nginx Block Manager library.

## Table of Contents

- [Class: NginxBlockManager](#class-nginxblockmanager)
  - [Constructor](#constructor)
  - [Methods](#methods)
- [Class: ServerBlock](#class-serverblock)
  - [Methods](#methods-1)
- [Class: LocationBlock](#class-locationblock)
  - [Methods](#methods-2)

## Class: NginxBlockManager

### Constructor

```typescript
constructor(configPath: string)
```

#### Parameters

- `configPath` (string): Path to the Nginx configuration file.

### Methods

#### `readConfig(): void`

Reads the Nginx configuration file.

#### `writeConfig(): void`

Writes the changes made to the Nginx configuration file.

#### `createServerBlock(params: Record<string, string>): ServerBlock`

Creates a new server block and returns the created `ServerBlock` instance.

##### Parameters

- `params` (Record<string, string>): An object containing key-value pairs of directives and their values.

##### Returns

- `ServerBlock`: The created server block instance.

## Class: ServerBlock

### Methods

#### `createLocationBlock(params: Record<string, string>): LocationBlock`

Creates a new location block within the server block and returns the created `LocationBlock` instance.

##### Parameters

- `params` (Record<string, string>): An object containing key-value pairs of directives and their values.

##### Returns

- `LocationBlock`: The created location block instance.

## Class: LocationBlock

### Methods

There are no specific methods for the `LocationBlock` class. The `LocationBlock` class instances store the directives and their values as properties, and you can directly interact with them.

## Example

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

For more information, please refer to the [README.md](./README.md) file.

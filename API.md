Here is an updated API.md for the `nginx-block-manager` repository, including the new methods you have implemented:

# Nginx Block Manager API

`NginxBlockManager` is a utility class to manage Nginx configuration files with an easy-to-use API. It allows you to create, read, update and delete Nginx server blocks, location blocks, and their key-value pairs.

## Table of Contents

- [Constructor](#constructor)
- [Config Files](#config-files)
- [Server Blocks](#server-blocks)
- [Location Blocks](#location-blocks)
- [Utilities](#utilities)

## Constructor

### NginxBlockManager(paths: NginxPaths)

- `paths`: An object with two properties:
  - `nginxConfigPath`: The path to the Nginx configuration files (usually `/etc/nginx/sites-available`).
  - `nginxEnabledPath`: The path to the enabled Nginx configuration files (usually `/etc/nginx/sites-enabled`).

Create a new instance of the `NginxBlockManager` class.

## Config Files

### createConfigFile(domain: string): Promise<void>

- `domain`: The domain name for the server block (e.g., `example.com`).

Create a new configuration file for the given domain.

### checkConfigFileExists(domain: string): Promise<boolean>

- `domain`: The domain name for the server block (e.g., `example.com`).

Check if a configuration file exists for the given domain.

### deleteConfigFile(domain: string): Promise<void>

- `domain`: The domain name for the server block (e.g., `example.com`).

Delete the configuration file for the given domain.

### enableConfigFile(domain: string): Promise<void>

- `domain`: The domain name for the server block (e.g., `example.com`).

Enable the configuration file for the given domain by creating a symlink in the `sites-enabled` directory.

### disableConfigFile(domain: string): Promise<void>

- `domain`: The domain name for the server block (e.g., `example.com`).

Disable the configuration file for the given domain by removing the symlink in the `sites-enabled` directory.

### checkConfigFileEnabled(domain: string): Promise<boolean>

- `domain`: The domain name for the server block (e.g., `example.com`).

Check if the configuration file for the given domain is enabled.

## Server Blocks

### addKeyToServer(domain: string, key: NginxServerKey, value: string): Promise<void>

- `domain`: The domain name for the server block (e.g., `example.com`).
- `key`: The key to add to the server block (e.g., `listen`).
- `value`: The value to associate with the key (e.g., `80`).

Add a key-value pair to the server block of the given domain.

### updateKeyInServer(domain: string, key: NginxServerKey, value: string): Promise<void>

- `domain`: The domain name for the server block (e.g., `example.com`).
- `key`: The key to update in the server block (e.g., `listen`).
- `value`: The new value to associate with the key (e.g., `80`).

Update the value of a key in the server block of the given domain.

### deleteKeyFromServer(domain: string, key: NginxServerKey): Promise<void>

- `domain`: The domain name for the server block (e.g., `example.com`).
- `key`: The key to remove from the server block (e.g., `listen`).

Remove a key-value pair from the server block of thegiven domain.

### getKeyFromServer(domain: string, key: NginxServerKey): Promise<string>

- `domain`: The domain name for the server block (e.g., `example.com`).
- `key`: The key to retrieve from the server block (e.g., `listen`).

Retrieve the value of a key from the server block of the given domain.

### getAllServers(): Promise<string[]>

List all the servers in the nginx configuration directory.

## Location Blocks

### addLocationBlock(domain: string, location: string): Promise<void>

- `domain`: The domain name for the server block (e.g., `example.com`).
- `location`: The location block path (e.g., `/api`).

Add a new location block to the server block of the given domain.

### deleteLocationBlock(domain: string, location: string): Promise<void>

- `domain`: The domain name for the server block (e.g., `example.com`).
- `location`: The location block path (e.g., `/api`).

Delete a location block from the server block of the given domain.

### addKeyToLocation(domain: string, location: string, key: NginxLocationKey, value: string): Promise<void>

- `domain`: The domain name for the server block (e.g., `example.com`).
- `location`: The location block path (e.g., `/api`).
- `key`: The key to add to the location block (e.g., `proxy_pass`).
- `value`: The value to associate with the key (e.g., `http://localhost:3000`).

Add a key-value pair to a location block in the server block of the given domain.

### updateKeyInLocation(domain: string, location: string, key: NginxLocationKey, value: string): Promise<void>

- `domain`: The domain name for the server block (e.g., `example.com`).
- `location`: The location block path (e.g., `/api`).
- `key`: The key to update in the location block (e.g., `proxy_pass`).
- `value`: The new value to associate with the key (e.g., `http://localhost:3000`).

Update the value of a key in a location block in the server block of the given domain.

### deleteKeyFromLocation(domain: string, location: string, key: NginxLocationKey): Promise<void>

- `domain`: The domain name for the server block (e.g., `example.com`).
- `location`: The location block path (e.g., `/api`).
- `key`: The key to remove from the location block (e.g., `proxy_pass`).

Remove a key-value pair from a location block in the server block of the given domain.

### getKeyFromLocation(domain: string, location: string, key: NginxLocationKey): Promise<string>

- `domain`: The domain name for the server block (e.g., `example.com`).
- `location`: The location block path (e.g., `/api`).
- `key`: The key to retrieve from the location block (e.g., `proxy_pass`).

Retrieve the value of a key from a location block in the server block of the given domain.

## Utilities

### getAllConfigs(): Promise<string[]>

List all configuration files in the Nginx configuration directory.

# NginxConfigManager

`NginxConfigManager` is a utility class for managing Nginx server and location blocks in configuration files. This class simplifies the process of creating, updating, and removing server and location blocks, as well as managing their respective keys and values.

## Features

- Create, enable, disable, and remove configuration files for domains
- Add, update, and remove keys in server blocks
- Create, delete, and rename location blocks within server blocks
- Add, update, and remove keys in location blocks
- Test the Nginx configuration and reload Nginx

## Usage

```javascript
const NginxConfigManager = require('./NginxConfigManager');
const manager = new NginxConfigManager();
```

### Config Files

- `createConfigFile(domain: string)`: Creates a new configuration file for the given domain with a basic server block.

- `enableConfigFile(domain: string)`: Enables the configuration file for the given domain by creating a symlink in the `sites-enabled` directory.

- `disableConfigFile(domain: string)`: Disables the configuration file for the given domain by removing the symlink from the `sites-enabled` directory.

- `removeConfigFile(domain: string)`: Removes the configuration file for the given domain.

### Server Blocks

- `addKeyToServer(domain: string, key: string, value: string)`: Adds a key with the given value to the server block of the specified domain.

- `updateKeyInServer(domain: string, key: string, newValue: string)`: Updates the value of the given key in the server block of the specified domain.

- `removeKeyFromServer(domain: string, key: string)`: Removes the given key from the server block of the specified domain.

- `getKeyValueFromServer(domain: string, key: string)`: Retrieves the value of the given key from the server block of the specified domain.

### Location Blocks

- `createLocation(domain: string, location: string)`: Creates a new location block with the given path in the server block of the specified domain.

- `deleteLocation(domain: string, location: string)`: Deletes the location block with the given path from the server block of the specified domain.

- `renameLocation(domain: string, oldLocation: string, newLocation: string)`: Renames the location block with the old path to the new path in the server block of the specified domain.

- `addKeyToLocation(domain: string, location: string, key: string, value: string)`: Adds a key with the given value to the location block with the specified path in the server block of the given domain.

- `updateKeyInLocation(domain: string, location: string, key: string, newValue: string)`: Updates the value of the given key in the location block with the specified path in the server block of the given domain.

- `removeKeyFromLocation(domain: string, location: string, key: string)`: Removes the given key from the location block with the specified path in the server block of the given domain.

- `getKeyValueFromLocation(domain: string, location: string, key: string)`: Retrieves the value of the given key from the location block with the specified path in the server block of the given domain.

### Nginx Control

- `testConfig()`: Tests the Nginx configuration for any errors and returns the output as a string.

- `reloadNginx()`: Reloads the Nginx configuration, applying any changes made to the configuration files.

## Example

```javascript
(async () => {
    // Create a new config file for example.com
    await manager.createConfigFile('example.com');

    // Enable the config file for example.com
    await manager.enableConfigFile('example.com');

    // Add a listen directive to the server block for example.com
    await manager.addKeyToServer('example.com', 'listen', '80');

    // Add a root directive to the server block for example.com
    await manager.addKeyToServer('example.com', 'root', '/var/www/example.com/html');

    // Create a location block for example.com
    await manager.createLocation('example.com', '/images');

    // Add a try_files directive to the location block for example.com
    await manager.addKeyToLocation('example.com', '/images', 'try_files', '$uri /index.html');

    // Update the root directive in the server block for example.com
    await manager.updateKeyInServer('example.com', 'root', '/var/www/example.com/public_html');

    // Remove the try_files directive from the location block for example.com
    await manager.removeKeyFromLocation('example.com', '/images', 'try_files');

    // Rename the location block for example.com
    await manager.renameLocation('example.com', '/images', '/assets');

    // Test the Nginx configuration
    const testOutput = await manager.testConfig();
    console.log(testOutput);

    // Reload Nginx to apply the changes
    await manager.reloadNginx();
})();
```

This example demonstrates how to create and enable a new configuration file, add and update directives in server and location blocks, and test and reload the Nginx configuration.

**Note**: Ensure that you have the necessary permissions to create, modify, and delete files in the Nginx configuration directories, as well as to reload the Nginx service. Running the script with elevated privileges, such as using `sudo`, may be required.

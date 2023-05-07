# NginxBlockManager
NginxBlockManager is a JavaScript class that provides methods for managing Nginx server configuration files.
## Requirements
- Node.js
- Nginx server

## Usage
js
import { NginxBlockManager } from './NginxBlockManager';

const manager = new NginxBlockManager({
    nginxConfigPath: '/etc/nginx/sites-available',
    nginxEnabledPath: '/etc/nginx/sites-enabled',
});
## API
### constructor({ nginxConfigPath, nginxEnabledPath })
Creates a new NginxBlockManager instance with the given configuration options.
### createConfigFile(domain: string)
Creates a new configuration file for the given domain.
### enableConfigFile(domain: string)
Enables the configuration file for the given domain.
### disableConfigFile(domain: string)
Disables the configuration file for the given domain.
### removeConfigFile(domain: string)
Removes the configuration file for the given domain.
### checkConfigFileEnabled(domain: string)
Checks if the configuration file for the specified domain is enabled (i.e., if the symlink to the configuration file exists in the 'sites-enabled' directory).
### checkConfigFileExists(domain: string)
Checks if the configuration file for the specified domain exists.
### createSubdomain(domain: string, subdomain: string)
Creates a subdomain for the specified domain.
### removeSubdomain(domain: string, subdomain: string)
Removes a subdomain from the specified domain.
### getSubdomains(domain: string)
Retrieves a list of subdomains for the specified domain.
### checkSubdomainExists(domain: string, subdomain: string)
Checks if a subdomain exists for the specified domain.
...
### getAllKeyValuesFromServer(domain: string)
Retrieves all key-value pairs from the server block of the specified domain's configuration file.
### createLocation(domain: string, location: string)
Creates a new location block with the specified path in the specified domain's configuration file.
### removeKeyFromLocation(domain: string, location: string, key: string)
Removes the specified key from the specified location block in the specified domain's configuration file.
### getKeyValueFromLocation(domain: string, location: string, key: string)
Retrieves the value of the specified key from the specified location block in the specified domain's configuration file.
### getAllKeyValuesFromLocation(domain: string, location: string)
Retrieves all key-value pairs from the specified location block in the specified domain's configuration file.

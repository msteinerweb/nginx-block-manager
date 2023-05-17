import { NginxServerKey, NginxLocationKey } from './NginxBlockTypes';
/**
 * NginxManager class provides methods for managing Nginx server configuration files.
 */
export declare class NginxBlockManager {
    private nginxConfigPath;
    private nginxEnabledPath;
    /**
     * NginxManager constructor.
     * @param {Object} options - The configuration options.
     * @param {string} options.nginxConfigPath - The path to the Nginx configuration files.
     * @param {string} options.nginxEnabledPath - The path to the enabled Nginx configuration files.
     */
    constructor({ nginxConfigPath, nginxEnabledPath, }?: {
        nginxConfigPath?: string;
        nginxEnabledPath?: string;
    });
    /**
     * Generates the configuration file name based on the domain.
     * @param {string} domain - The domain name.
     * @returns {string} - The configuration file name.
     */
    private getConfigFileName;
    /**
     * Creates a new configuration file for the given domain.
     * @param {string} domain - The domain name.
     * @returns {Promise<void>} - A Promise that resolves when the configuration file is created.
     */
    createConfigFile(domain: string): Promise<void>;
    /**
     * Enables the configuration file for the given domain.
     * @param {string} domain - The domain name.
     * @returns {Promise<void>} - A Promise that resolves when the configuration file is enabled.
     */
    enableConfigFile(domain: string): Promise<void>;
    /**
     * Disables the configuration file for the given domain.
     * @param {string} domain - The domain name.
     * @returns {Promise<void>} - A Promise that resolves when the configuration file is disabled.
     */
    disableConfigFile(domain: string): Promise<void>;
    /**
     * Remove the config file for a domain
     *
     * @param domain
     * @returns {Promise<void>}
     */
    deleteConfigFile(domain: string): Promise<void>;
    /**
     * Checks if the configuration file for the specified domain is enabled (i.e., if the symlink to the configuration file exists in the 'sites-enabled' directory).
     * @param {string} domain - The domain to check.
     * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating if the configuration file is enabled.
     */
    checkConfigFileEnabled(domain: string): Promise<boolean>;
    /**
     * Checks if the configuration file for the specified domain exists.
     * @param {string} domain - The domain to check.
     * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating if the configuration file exists.
     */
    checkConfigFileExists(domain: string): Promise<boolean>;
    /**
     * Lists Nginx configuration files.
     * @returns {Promise<string[]>} A promise resolving to an array of configuration file names.
     */
    getAllConfigs(): Promise<string[]>;
    /**
     * Creates a subdomain for the specified domain.
     * @param {string} domain - The domain to create the subdomain for.
     * @param {string} subdomain - The subdomain to create.
     * @returns {Promise<void>}
     * @throws {Error} If the configuration file for the domain does not exist or the subdomain already exists.
     */
    addSubdomain(domain: string, subdomain: string): Promise<void>;
    /**
     * Removes a subdomain from the specified domain.
     * @param {string} domain - The domain to remove the subdomain from.
     * @param {string} subdomain - The subdomain to remove.
     * @returns {Promise<void>}
     * @throws {Error} If the configuration file for the domain does not exist or the subdomain does not exist.
     */
    deleteSubdomain(domain: string, subdomain: string): Promise<void>;
    /**
     * Retrieves a list of subdomains for the specified domain.
     * @param {string} domain - The domain to retrieve the subdomains for.
     * @returns {Promise<string[]>} - A promise that resolves to an array of subdomains.
     * @throws {Error} If the configuration file for the domain does not exist.
     */
    getSubdomains(domain: string): Promise<string[]>;
    /**
     * Checks if a subdomain exists for the specified domain.
     * @param {string} domain - The domain to check for the subdomain.
     * @param {string} subdomain - The subdomain to check.
     * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating if the subdomain exists.
     * @throws {Error} If the configuration file for the domain does not exist.
     */
    checkSubdomainExists(domain: string, subdomain: string): Promise<boolean>;
    /**
     * Processes the server block of the specified domain's configuration file, applying a callback function to each server block found.
     * @private
     * @param {string} domain - The domain to process.
     * @param {(server: any) => void} callback - The callback function to apply to each server block.
     * @returns {Promise<void>}
     */
    private processServerBlock;
    /**
     * Adds a key-value pair to the server block of the specified domain's configuration file.
     * @param {string} domain - The domain to add the key-value pair to.
     * @param {string} key - The key to add.
     * @param {string} value - The value to add.
     * @returns {Promise<void>}
     */
    addKeyToServer(domain: string, key: NginxServerKey, value: string): Promise<void>;
    /**
     * Updates the value of the specified key in the server block of the specified domain's configuration file.
     * @param {string} domain - The domain to update the key-value pair in.
     * @param {string} key - The key to update.
     * @param {string} newValue - The new value to set.
     * @returns {Promise<void>}
     */
    updateKeyInServer(domain: string, key: NginxServerKey, newValue: string): Promise<void>;
    /**
     * Removes the specified key from the server block of the specified domain's configuration file.
     * @param {string} domain - The domain to remove the key from.
     * @param {string} key - The key to remove.
     * @returns {Promise<void>}
     */
    deleteKeyFromServer(domain: string, key: NginxServerKey): Promise<void>;
    /**
     * Adds multiple key-value pairs to the server block of the specified domain's configuration file.
     * @param {string} domain - The domain to add the key-value pairs to.
     * @param {Object} keyValuePairs - An object containing the key-value pairs to add.
     * @returns {Promise<void>}
     */
    addMultipleKeysToServer(domain: string, keyValuePairs: {
        [key in NginxServerKey]?: string;
    }): Promise<void>;
    /**
     * Updates multiple key-value pairs in the server block of the specified domain's configuration file.
     * @param {string} domain - The domain to update the key-value pairs in.
     * @param {Object} keyValuePairs - An object containing the key-value pairs to update.
     * @returns {Promise<void>}
     */
    updateMultipleKeysInServer(domain: string, keyValuePairs: {
        [key in NginxServerKey]?: string;
    }): Promise<void>;
    /**
     * Lists all the servers in the nginx configuration directory.
     * @returns {Promise<string[]>}
     */
    getAllServers(): Promise<string[]>;
    /**
     * Removes multiple keys from the server block of the specified domain's configuration file.
     * @param {string} domain - The domain to remove the keys from.
     * @param {string[]} keys - An array of keys to remove.
     * @returns {Promise<void>}
     */
    deleteMultipleKeysFromServer(domain: string, keys: NginxServerKey[]): Promise<void>;
    /**
     * Retrieves the value of the specified key from the server block of the specified domain's configuration file.
     * @param {string} domain - The domain to get the key-value from.
     * @param {string} key - The key to get the value for.
     * @returns {Promise<string | null>} - A promise that resolves to the value of the key, or null if the key is not found.
     */
    getKeyValueFromServer(domain: string, key: NginxServerKey): Promise<string | null>;
    /**
     * Retrieves all key-value pairs from the server block of the specified domain's configuration file.
     * @param {string} domain - The domain to get the key-value pairs from.
     * @returns {Promise<Object>} - A promise that resolves to an object containing all key-value pairs from the server block.
     */
    getAllKeyValuesFromServer(domain: string): Promise<Partial<{
        [key in NginxServerKey]: string;
    }>>;
    /**
     * Creates a new location block with the specified path in the specified domain's configuration file.
     * @param {string} domain - The domain to add the location block to.
     * @param {string} location - The path for the new location block.
     * @returns {Promise<void>}
     * @throws {Error} If the location block already exists.
     */
    addLocation(domain: string, location: string): Promise<void>;
    /**
     * Processes the location blocks of the specified domain's configuration file, applying a callback function to each location block found.
     * @private
     * @param {string} domain - The domain to process.
     * @param {(server: any, locationBlock: any, index: number) => void} callback - The callback function to apply to each location block.
     * @returns {Promise<void>}
     */
    private processLocationBlocks;
    /**
     * Removes the specified location block from the specified domain's configuration file.
     * @param {string} domain - The domain to remove the location block from.
     * @param {string} location - The path of the location block to remove.
     * @returns {Promise<void>}
     */
    deleteLocation(domain: string, location: string): Promise<void>;
    /**
     * Renames the specified location block in the specified domain's configuration file.
     * @param {string} domain - The domain to rename the location block in.
     * @param {string} oldLocation - The old path of the location block.
     * @param {string} newLocation - The new path of the location block.
     * @returns {Promise<void>}
     */
    updateLocation(domain: string, oldLocation: string, newLocation: string): Promise<void>;
    /**
     * Retrieves all location paths from the specified domain's configuration file.
     * @param {string} domain - The domain to get the location paths from.
     * @returns {Promise<string[]>} - A promise that resolves to an array of location paths.
     */
    getAllLocations(domain: string): Promise<string[]>;
    /**
     * Adds a key-value pair to the specified location block in the specified domain's configuration file.
     * @param {string} domain - The domain to add the key-value pair to.
     * @param {string} location - The path of the location block to add the key-value pair to.
     * @param {string} key - The key to add.
     * @param {string} value - The value to add.
     * @returns {Promise<void>}
     */
    addKeyToLocation(domain: string, location: string, key: NginxLocationKey, value: string): Promise<void>;
    /**
     * Adds multiple key-value pairs to the specified location block in the specified domain's configuration file.
     * @param {string} domain - The domain to add the key-value pairs to.
     * @param {string} location - The path of the location block to add the key-value pairs to.
     * @param {Object} keyValues - An object containing the key-value pairs to add.
     * @returns {Promise<void>}
     */
    addMultipleKeysToLocation(domain: string, location: string, keyValues: Partial<Record<NginxLocationKey, string>>): Promise<void>;
    /**
     * Updates the value of the specified key in the specified location block of the specified domain's configuration file.
     * @param {string} domain - The domain to update the key-value pair in.
     * @param {string} location - The path of the location block to update the key-value pair in.
     * @param {string} key - The key to update.
     * @param {string} newValue - The new value to set.
     * @returns {Promise<void>}
     */
    updateKeyInLocation(domain: string, location: string, key: NginxLocationKey, newValue: string): Promise<void>;
    /**
     * Updates multiple key-value pairs in the specified location block of the specified domain's configuration file.
     * @param {string} domain - The domain to update the key-value pairs in.
     * @param {string} location - The path of the location block to update the key-value pairs in.
     * @param {Object} keyValues - An object containing the key-value pairs to update.
     * @returns {Promise<void>}
     */
    updateMultipleKeysInLocation(domain: string, location: string, keyValues: Partial<Record<NginxLocationKey, string>>): Promise<void>;
    /**
     * Removes multiple keys from the specified location block in the specified domain's configuration file.
     * @param {string} domain - The domain to remove the keys from.
     * @param {string} location - The path of the location block to remove the keys from.
     * @param {string[]} keys - An array of keys to remove.
     * @returns {Promise<void>}
     */
    deleteMultipleKeysFromLocation(domain: string, location: string, keys: NginxLocationKey[]): Promise<void>;
    /**
     * Removes the specified key from the specified location block in the specified domain's configuration file.
     * @param {string} domain - The domain to remove the key from.
     * @param {string} location - The path of the location block to remove the key from.
     * @param {string} key - The key to remove.
     * @returns {Promise<void>}
     */
    deleteKeyFromLocation(domain: string, location: string, key: NginxLocationKey): Promise<void>;
    /**
     * Retrieves the value of the specified key from the specified location block in the specified domain's configuration file.
     * @param {string} domain - The domain to get the key-value from.
     * @param {string} location - The path of the location block to get the key-value from.
     * @param {string} key - The key to get the value for.
     * @returns {Promise<string | null>} - A promise that resolves to the value of the key, or null if the key is not found.
     */
    getKeyValueFromLocation(domain: string, location: string, key: NginxLocationKey): Promise<string | null>;
    /**
     * Retrieves all key-value pairs from the specified location block in the specified domain's configuration file.
     * @param {string} domain - The domain to get the key-value pairs from.
     * @param {string} location - The path of the location block to get the key-value pairs from.
     * @returns {Promise<Object | null>} - A promise that resolves to an object containing all key-value pairs from the location block, or null if the location is not found.
     */
    getAllKeyValuesFromLocation(domain: string, location: string): Promise<Partial<{
        [key in NginxLocationKey]: string;
    }> | null>;
}

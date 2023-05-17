"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NginxBlockManager = void 0;
const fse = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const nginx_conf_1 = require("nginx-conf");
/**
 * NginxManager class provides methods for managing Nginx server configuration files.
 */
class NginxBlockManager {
    /**
     * NginxManager constructor.
     * @param {Object} options - The configuration options.
     * @param {string} options.nginxConfigPath - The path to the Nginx configuration files.
     * @param {string} options.nginxEnabledPath - The path to the enabled Nginx configuration files.
     */
    constructor({ nginxConfigPath = '/etc/nginx/sites-available', nginxEnabledPath = '/etc/nginx/sites-enabled', } = {}) {
        this.nginxConfigPath = '/etc/nginx/sites-available';
        this.nginxEnabledPath = '/etc/nginx/sites-enabled';
        this.nginxConfigPath = nginxConfigPath;
        this.nginxEnabledPath = nginxEnabledPath;
        fse.ensureDirSync(this.nginxConfigPath);
        fse.ensureDirSync(this.nginxEnabledPath);
    }
    /**
     * Generates the configuration file name based on the domain.
     * @param {string} domain - The domain name.
     * @returns {string} - The configuration file name.
     */
    getConfigFileName(domain) {
        return `${domain}.conf`;
    }
    /**
     * Creates a new configuration file for the given domain.
     * @param {string} domain - The domain name.
     * @returns {Promise<void>} - A Promise that resolves when the configuration file is created.
     */
    async createConfigFile(domain) {
        const configName = this.getConfigFileName(domain);
        const configPath = path.resolve(`${this.nginxConfigPath}/${configName}`);
        // make sure the domain string isn't empty
        if (!domain) {
            throw new Error('Domain name cannot be empty');
        }
        // don't overwrite existing config files
        if (await fse.pathExists(configPath)) {
            throw new Error(`Config file for ${domain} already exists`);
        }
        // write basic config file
        await fse.writeFile(configPath, `server {
    listen 80;
    server_name ${domain};

}`);
    }
    /**
     * Enables the configuration file for the given domain.
     * @param {string} domain - The domain name.
     * @returns {Promise<void>} - A Promise that resolves when the configuration file is enabled.
     */
    async enableConfigFile(domain) {
        if (!await this.checkConfigFileExists(domain)) {
            throw new Error(`Config file for ${domain} does not exist`);
        }
        ;
        if (await this.checkConfigFileEnabled(domain)) {
            console.log(`Symlink for ${domain} already exists`);
            return;
        }
        const configName = this.getConfigFileName(domain);
        const filePath = path.resolve(`${this.nginxConfigPath}/${configName}`);
        const linkPath = path.resolve(`${this.nginxEnabledPath}/${configName}`);
        await fse.symlink(filePath, linkPath);
    }
    /**
     * Disables the configuration file for the given domain.
     * @param {string} domain - The domain name.
     * @returns {Promise<void>} - A Promise that resolves when the configuration file is disabled.
     */
    async disableConfigFile(domain) {
        if (!await this.checkConfigFileEnabled(domain)) {
            throw new Error(`Symlink for ${domain} does not exist`);
        }
        const configName = this.getConfigFileName(domain);
        try {
            await fse.remove(`${this.nginxEnabledPath}/${configName}`);
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Remove the config file for a domain
     *
     * @param domain
     * @returns {Promise<void>}
     */
    async deleteConfigFile(domain) {
        const configName = this.getConfigFileName(domain);
        const filePath = path.resolve(`${this.nginxConfigPath}/${configName}`);
        if (!await fse.pathExists(filePath)) {
            throw new Error(`Config file for ${domain} does not exist`);
        }
        await fse.remove(filePath);
    }
    /**
     * Checks if the configuration file for the specified domain is enabled (i.e., if the symlink to the configuration file exists in the 'sites-enabled' directory).
     * @param {string} domain - The domain to check.
     * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating if the configuration file is enabled.
     */
    async checkConfigFileEnabled(domain) {
        const configName = this.getConfigFileName(domain);
        const symlinkPath = path.resolve(`${this.nginxEnabledPath}/${configName}`);
        const symlinkExists = await fse.pathExists(symlinkPath);
        return symlinkExists;
    }
    /**
     * Checks if the configuration file for the specified domain exists.
     * @param {string} domain - The domain to check.
     * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating if the configuration file exists.
     */
    async checkConfigFileExists(domain) {
        const configName = this.getConfigFileName(domain);
        const filePath = path.resolve(`${this.nginxConfigPath}/${configName}`);
        return fse.pathExists(filePath);
    }
    /**
     * Lists Nginx configuration files.
     * @returns {Promise<string[]>} A promise resolving to an array of configuration file names.
     */
    async getAllConfigs() {
        const configFiles = await fse.readdir(this.nginxConfigPath);
        return configFiles;
    }
    /**
     * Creates a subdomain for the specified domain.
     * @param {string} domain - The domain to create the subdomain for.
     * @param {string} subdomain - The subdomain to create.
     * @returns {Promise<void>}
     * @throws {Error} If the configuration file for the domain does not exist or the subdomain already exists.
     */
    async addSubdomain(domain, subdomain) {
        const configName = this.getConfigFileName(domain);
        const configPath = path.resolve(`${this.nginxConfigPath}/${configName}`);
        if (!await fse.pathExists(configPath)) {
            throw new Error(`Config file for ${domain} does not exist`);
        }
        // check if subdomain already exists
        if (await this.checkSubdomainExists(domain, subdomain)) {
            throw new Error(`Subdomain ${subdomain} already exists`);
        }
        const subdomains = await this.getSubdomains(domain);
        // add subdomain to subdomains
        const fullSubDomain = `${subdomain}.${domain}`;
        subdomains.push(fullSubDomain);
        // update server_name
        await this.updateKeyInServer(domain, 'server_name', `${domain} ${subdomains.join(' ')}`);
    }
    /**
     * Removes a subdomain from the specified domain.
     * @param {string} domain - The domain to remove the subdomain from.
     * @param {string} subdomain - The subdomain to remove.
     * @returns {Promise<void>}
     * @throws {Error} If the configuration file for the domain does not exist or the subdomain does not exist.
     */
    async deleteSubdomain(domain, subdomain) {
        const configName = this.getConfigFileName(domain);
        const configPath = path.resolve(`${this.nginxConfigPath}/${configName}`);
        if (!await fse.pathExists(configPath)) {
            throw new Error(`Config file for ${domain} does not exist`);
        }
        // check if subdomain exists
        if (!await this.checkSubdomainExists(domain, subdomain)) {
            throw new Error(`Subdomain ${subdomain} does not exist`);
        }
        const serverName = await this.getKeyValueFromServer(domain, 'server_name');
        const subdomains = (serverName === null || serverName === void 0 ? void 0 : serverName.split(' ')) || [];
        // remove subdomain from subdomains
        const fullSubDomain = `${subdomain}.${domain}`;
        const index = subdomains.indexOf(fullSubDomain);
        subdomains.splice(index, 1);
        // update server_name
        await this.updateKeyInServer(domain, 'server_name', subdomains.join(' '));
    }
    /**
     * Retrieves a list of subdomains for the specified domain.
     * @param {string} domain - The domain to retrieve the subdomains for.
     * @returns {Promise<string[]>} - A promise that resolves to an array of subdomains.
     * @throws {Error} If the configuration file for the domain does not exist.
     */
    async getSubdomains(domain) {
        const configName = this.getConfigFileName(domain);
        const configPath = path.resolve(`${this.nginxConfigPath}/${configName}`);
        if (!await fse.pathExists(configPath)) {
            throw new Error(`Config file for ${domain} does not exist`);
        }
        const serverName = await this.getKeyValueFromServer(domain, 'server_name');
        const subdomains = (serverName === null || serverName === void 0 ? void 0 : serverName.split(' ')) || [];
        // remove domain from subdomains
        return subdomains.filter(subdomain => subdomain !== domain);
    }
    /**
     * Checks if a subdomain exists for the specified domain.
     * @param {string} domain - The domain to check for the subdomain.
     * @param {string} subdomain - The subdomain to check.
     * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating if the subdomain exists.
     * @throws {Error} If the configuration file for the domain does not exist.
     */
    async checkSubdomainExists(domain, subdomain) {
        const configName = this.getConfigFileName(domain);
        const configPath = path.resolve(`${this.nginxConfigPath}/${configName}`);
        if (!await fse.pathExists(configPath)) {
            throw new Error(`Config file for ${domain} does not exist`);
        }
        const fullSubDomain = `${subdomain}.${domain}`; // form the full subdomain
        const subdomains = await this.getSubdomains(domain);
        return subdomains.includes(fullSubDomain); // check for the full subdomain
    }
    /**
     * Processes the server block of the specified domain's configuration file, applying a callback function to each server block found.
     * @private
     * @param {string} domain - The domain to process.
     * @param {(server: any) => void} callback - The callback function to apply to each server block.
     * @returns {Promise<void>}
     */
    async processServerBlock(domain, callback) {
        const configName = this.getConfigFileName(domain);
        const configPath = path.resolve(`${this.nginxConfigPath}/${configName}`);
        return new Promise((resolve, reject) => {
            nginx_conf_1.NginxConfFile.create(configPath, (err, conf) => {
                var _a, _b;
                if (err) {
                    reject(err);
                }
                else {
                    const serverBlocks = (_b = (_a = conf === null || conf === void 0 ? void 0 : conf.nginx) === null || _a === void 0 ? void 0 : _a.server) !== null && _b !== void 0 ? _b : [];
                    for (const server of serverBlocks) {
                        callback(server);
                    }
                    conf === null || conf === void 0 ? void 0 : conf.on('flushed', () => {
                        resolve();
                    });
                    conf === null || conf === void 0 ? void 0 : conf.flush();
                }
            });
        });
    }
    /**
     * Adds a key-value pair to the server block of the specified domain's configuration file.
     * @param {string} domain - The domain to add the key-value pair to.
     * @param {string} key - The key to add.
     * @param {string} value - The value to add.
     * @returns {Promise<void>}
     */
    async addKeyToServer(domain, key, value) {
        // make sure key isn't blank
        if (key.toString() === '') {
            throw new Error('Key cannot be blank');
        }
        await this.processServerBlock(domain, (server) => {
            // Check if the key already exists in the server block
            const keyExists = server[key] !== undefined;
            // If the key does not exist, add the key and value to the server block
            if (!keyExists)
                server._add(key, value);
        });
    }
    /**
     * Updates the value of the specified key in the server block of the specified domain's configuration file.
     * @param {string} domain - The domain to update the key-value pair in.
     * @param {string} key - The key to update.
     * @param {string} newValue - The new value to set.
     * @returns {Promise<void>}
     */
    async updateKeyInServer(domain, key, newValue) {
        await this.processServerBlock(domain, (server) => {
            // Check if the key exists in the server block
            const keyExists = server[key] !== undefined;
            // If the key exists, update its value
            if (keyExists)
                server[key][0]._value = newValue;
        });
    }
    /**
     * Removes the specified key from the server block of the specified domain's configuration file.
     * @param {string} domain - The domain to remove the key from.
     * @param {string} key - The key to remove.
     * @returns {Promise<void>}
     */
    async deleteKeyFromServer(domain, key) {
        await this.processServerBlock(domain, (server) => {
            // Check if the key exists in the server block
            const keyExists = server[key] !== undefined;
            // If the key exists, remove it from the server block
            if (keyExists)
                server._remove(key);
        });
    }
    /**
     * Adds multiple key-value pairs to the server block of the specified domain's configuration file.
     * @param {string} domain - The domain to add the key-value pairs to.
     * @param {Object} keyValuePairs - An object containing the key-value pairs to add.
     * @returns {Promise<void>}
     */
    async addMultipleKeysToServer(domain, keyValuePairs) {
        await this.processServerBlock(domain, (server) => {
            for (const key in keyValuePairs) {
                if (keyValuePairs.hasOwnProperty(key)) {
                    const value = keyValuePairs[key];
                    // Check if the key already exists in the server block
                    const keyExists = server[key] !== undefined;
                    // If the key does not exist, add the key and value to the server block
                    if (!keyExists)
                        server._add(key, value);
                }
            }
        });
    }
    /**
     * Updates multiple key-value pairs in the server block of the specified domain's configuration file.
     * @param {string} domain - The domain to update the key-value pairs in.
     * @param {Object} keyValuePairs - An object containing the key-value pairs to update.
     * @returns {Promise<void>}
     */
    async updateMultipleKeysInServer(domain, keyValuePairs) {
        await this.processServerBlock(domain, (server) => {
            for (const key in keyValuePairs) {
                if (keyValuePairs.hasOwnProperty(key)) {
                    const newValue = keyValuePairs[key];
                    // Check if the key exists in the server block
                    const keyExists = server[key] !== undefined;
                    // If the key exists, update its value
                    if (keyExists)
                        server[key][0]._value = newValue;
                }
            }
        });
    }
    /**
     * Lists all the servers in the nginx configuration directory.
     * @returns {Promise<string[]>}
     */
    async getAllServers() {
        const files = await this.getAllConfigs();
        const servers = files.map((file) => {
            file = file.replace('.conf', '');
            return file;
        });
        return servers;
    }
    /**
     * Removes multiple keys from the server block of the specified domain's configuration file.
     * @param {string} domain - The domain to remove the keys from.
     * @param {string[]} keys - An array of keys to remove.
     * @returns {Promise<void>}
     */
    async deleteMultipleKeysFromServer(domain, keys) {
        await this.processServerBlock(domain, (server) => {
            for (const key of keys) {
                // Check if the key exists in the server block
                const keyExists = server[key] !== undefined;
                // If the key exists, remove it from the server block
                if (keyExists)
                    server._remove(key);
            }
        });
    }
    /**
     * Retrieves the value of the specified key from the server block of the specified domain's configuration file.
     * @param {string} domain - The domain to get the key-value from.
     * @param {string} key - The key to get the value for.
     * @returns {Promise<string | null>} - A promise that resolves to the value of the key, or null if the key is not found.
     */
    async getKeyValueFromServer(domain, key) {
        let keyValue = null;
        await this.processServerBlock(domain, (server) => {
            // Check if the key exists in the server block
            const keyExists = server[key] !== undefined;
            // If the key exists, get its value
            if (keyExists)
                keyValue = server[key][0]._value;
        });
        return keyValue;
    }
    /**
     * Retrieves all key-value pairs from the server block of the specified domain's configuration file.
     * @param {string} domain - The domain to get the key-value pairs from.
     * @returns {Promise<Object>} - A promise that resolves to an object containing all key-value pairs from the server block.
     */
    async getAllKeyValuesFromServer(domain) {
        const keyValues = {};
        await this.processServerBlock(domain, (server) => {
            for (const key in server) {
                if (server.hasOwnProperty(key) && typeof server[key] !== 'function') {
                    keyValues[key] = server[key][0]._value;
                }
            }
        });
        return keyValues;
    }
    /**
     * Creates a new location block with the specified path in the specified domain's configuration file.
     * @param {string} domain - The domain to add the location block to.
     * @param {string} location - The path for the new location block.
     * @returns {Promise<void>}
     * @throws {Error} If the location block already exists.
     */
    async addLocation(domain, location) {
        const configName = this.getConfigFileName(domain);
        const configPath = path.resolve(`${this.nginxConfigPath}/${configName}`);
        // make sure location is not empty
        if (!location) {
            throw new Error('Location cannot be empty');
        }
        // Wrap NginxConfFile.create in a Promise
        await new Promise((resolve, reject) => {
            nginx_conf_1.NginxConfFile.create(configPath, (err, conf) => {
                var _a, _b, _c, _d, _e, _f;
                if (err) {
                    reject(err);
                    return;
                }
                // make sure the location doesn't already exist
                const locations = (_d = (_c = (_b = (_a = conf === null || conf === void 0 ? void 0 : conf.nginx) === null || _a === void 0 ? void 0 : _a.server) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.location) !== null && _d !== void 0 ? _d : [];
                for (let i = 0; i < locations.length; i++) {
                    const locationBlock = locations[i];
                    const locationPath = locationBlock === null || locationBlock === void 0 ? void 0 : locationBlock._value;
                    if (locationPath === location) {
                        reject(new Error(`Location ${location} already exists`));
                        return;
                    }
                }
                // add the new location block
                const serverBlock = (_f = (_e = conf === null || conf === void 0 ? void 0 : conf.nginx) === null || _e === void 0 ? void 0 : _e.server) === null || _f === void 0 ? void 0 : _f[0];
                serverBlock === null || serverBlock === void 0 ? void 0 : serverBlock._add('location', `${location} {}`);
                // flush the changes to the config file
                conf === null || conf === void 0 ? void 0 : conf.on('flushed', () => {
                    resolve();
                });
            });
        });
    }
    /**
     * Processes the location blocks of the specified domain's configuration file, applying a callback function to each location block found.
     * @private
     * @param {string} domain - The domain to process.
     * @param {(server: any, locationBlock: any, index: number) => void} callback - The callback function to apply to each location block.
     * @returns {Promise<void>}
     */
    async processLocationBlocks(domain, callback) {
        const configName = this.getConfigFileName(domain);
        const configPath = `${this.nginxConfigPath}/${configName}`;
        return new Promise((resolve, reject) => {
            nginx_conf_1.NginxConfFile.create(configPath, (err, conf) => {
                var _a, _b, _c;
                if (err) {
                    reject(err);
                }
                else {
                    const serverBlocks = (_b = (_a = conf === null || conf === void 0 ? void 0 : conf.nginx) === null || _a === void 0 ? void 0 : _a.server) !== null && _b !== void 0 ? _b : [];
                    for (const server of serverBlocks) {
                        const locations = (_c = server === null || server === void 0 ? void 0 : server.location) !== null && _c !== void 0 ? _c : [];
                        for (let index = 0; index < locations.length; index++) {
                            const locationBlock = locations[index];
                            callback(server, locationBlock, index);
                        }
                    }
                    conf === null || conf === void 0 ? void 0 : conf.on('flushed', () => {
                        resolve();
                    });
                    conf === null || conf === void 0 ? void 0 : conf.flush();
                }
            });
        });
    }
    /**
     * Removes the specified location block from the specified domain's configuration file.
     * @param {string} domain - The domain to remove the location block from.
     * @param {string} location - The path of the location block to remove.
     * @returns {Promise<void>}
     */
    async deleteLocation(domain, location) {
        await this.processLocationBlocks(domain, (server, locationBlock, index) => {
            if ((locationBlock === null || locationBlock === void 0 ? void 0 : locationBlock._value) === location) {
                server._remove('location', index);
            }
        });
    }
    /**
     * Renames the specified location block in the specified domain's configuration file.
     * @param {string} domain - The domain to rename the location block in.
     * @param {string} oldLocation - The old path of the location block.
     * @param {string} newLocation - The new path of the location block.
     * @returns {Promise<void>}
     */
    async updateLocation(domain, oldLocation, newLocation) {
        await this.processLocationBlocks(domain, (server, locationBlock, index) => {
            if ((locationBlock === null || locationBlock === void 0 ? void 0 : locationBlock._value) === oldLocation) {
                locationBlock._value = newLocation;
            }
        });
    }
    /**
     * Retrieves all location paths from the specified domain's configuration file.
     * @param {string} domain - The domain to get the location paths from.
     * @returns {Promise<string[]>} - A promise that resolves to an array of location paths.
     */
    async getAllLocations(domain) {
        const locations = [];
        await this.processServerBlock(domain, (server) => {
            var _a;
            const locationBlocks = (_a = server === null || server === void 0 ? void 0 : server.location) !== null && _a !== void 0 ? _a : [];
            for (const locationBlock of locationBlocks) {
                const locationPath = locationBlock === null || locationBlock === void 0 ? void 0 : locationBlock._value;
                if (locationPath) {
                    locations.push(locationPath);
                }
            }
        });
        return locations;
    }
    /**
     * Adds a key-value pair to the specified location block in the specified domain's configuration file.
     * @param {string} domain - The domain to add the key-value pair to.
     * @param {string} location - The path of the location block to add the key-value pair to.
     * @param {string} key - The key to add.
     * @param {string} value - The value to add.
     * @returns {Promise<void>}
     */
    async addKeyToLocation(domain, location, key, value) {
        await this.processLocationBlocks(domain, (server, locationBlock, index) => {
            if ((locationBlock === null || locationBlock === void 0 ? void 0 : locationBlock._value) === location) {
                // Check if the key already exists in the location block
                const keyExists = locationBlock[key] !== undefined;
                // If the key does not exist, add the key and value to the location block
                if (!keyExists) {
                    locationBlock._add(key, value);
                }
            }
        });
    }
    /**
     * Adds multiple key-value pairs to the specified location block in the specified domain's configuration file.
     * @param {string} domain - The domain to add the key-value pairs to.
     * @param {string} location - The path of the location block to add the key-value pairs to.
     * @param {Object} keyValues - An object containing the key-value pairs to add.
     * @returns {Promise<void>}
     */
    async addMultipleKeysToLocation(domain, location, keyValues) {
        await this.processLocationBlocks(domain, (server, locationBlock, index) => {
            if ((locationBlock === null || locationBlock === void 0 ? void 0 : locationBlock._value) === location) {
                // Iterate over the key-value pairs in the keyValuePairs object
                for (const key in keyValues) {
                    if (keyValues.hasOwnProperty(key)) {
                        const value = keyValues[key];
                        // Check if the key already exists in the location block
                        const keyExists = locationBlock[key] !== undefined;
                        // If the key does not exist, add the key and value to the location block
                        if (!keyExists) {
                            locationBlock._add(key, value);
                        }
                    }
                }
            }
        });
    }
    /**
     * Updates the value of the specified key in the specified location block of the specified domain's configuration file.
     * @param {string} domain - The domain to update the key-value pair in.
     * @param {string} location - The path of the location block to update the key-value pair in.
     * @param {string} key - The key to update.
     * @param {string} newValue - The new value to set.
     * @returns {Promise<void>}
     */
    async updateKeyInLocation(domain, location, key, newValue) {
        await this.processLocationBlocks(domain, (server, locationBlock, index) => {
            if ((locationBlock === null || locationBlock === void 0 ? void 0 : locationBlock._value) === location) {
                // Check if the key exists in the location block
                const keyExists = locationBlock[key] !== undefined;
                // If the key exists, update its value
                if (keyExists) {
                    locationBlock[key][0]._value = newValue;
                }
            }
        });
    }
    /**
     * Updates multiple key-value pairs in the specified location block of the specified domain's configuration file.
     * @param {string} domain - The domain to update the key-value pairs in.
     * @param {string} location - The path of the location block to update the key-value pairs in.
     * @param {Object} keyValues - An object containing the key-value pairs to update.
     * @returns {Promise<void>}
     */
    async updateMultipleKeysInLocation(domain, location, keyValues) {
        await this.processLocationBlocks(domain, (server, locationBlock, index) => {
            if ((locationBlock === null || locationBlock === void 0 ? void 0 : locationBlock._value) === location) {
                for (const key in keyValues) {
                    if (keyValues.hasOwnProperty(key)) {
                        const newValue = keyValues[key];
                        // Check if the key exists in the location block
                        const keyExists = locationBlock[key] !== undefined;
                        // If the key exists, update its value
                        if (keyExists) {
                            locationBlock[key][0]._value = newValue;
                        }
                    }
                }
            }
        });
    }
    /**
     * Removes multiple keys from the specified location block in the specified domain's configuration file.
     * @param {string} domain - The domain to remove the keys from.
     * @param {string} location - The path of the location block to remove the keys from.
     * @param {string[]} keys - An array of keys to remove.
     * @returns {Promise<void>}
     */
    async deleteMultipleKeysFromLocation(domain, location, keys) {
        await this.processLocationBlocks(domain, (server, locationBlock, index) => {
            if ((locationBlock === null || locationBlock === void 0 ? void 0 : locationBlock._value) === location) {
                for (const key of keys) {
                    // Check if the key exists in the location block
                    const keyExists = locationBlock[key] !== undefined;
                    // If the key exists, remove it from the location block
                    if (keyExists) {
                        locationBlock._remove(key);
                    }
                }
            }
        });
    }
    /**
     * Removes the specified key from the specified location block in the specified domain's configuration file.
     * @param {string} domain - The domain to remove the key from.
     * @param {string} location - The path of the location block to remove the key from.
     * @param {string} key - The key to remove.
     * @returns {Promise<void>}
     */
    async deleteKeyFromLocation(domain, location, key) {
        await this.processLocationBlocks(domain, (server, locationBlock, index) => {
            if ((locationBlock === null || locationBlock === void 0 ? void 0 : locationBlock._value) === location) {
                // Check if the key exists in the location block
                const keyExists = locationBlock[key] !== undefined;
                // If the key exists, remove it from the location block
                if (keyExists) {
                    locationBlock._remove(key);
                }
            }
        });
    }
    /**
     * Retrieves the value of the specified key from the specified location block in the specified domain's configuration file.
     * @param {string} domain - The domain to get the key-value from.
     * @param {string} location - The path of the location block to get the key-value from.
     * @param {string} key - The key to get the value for.
     * @returns {Promise<string | null>} - A promise that resolves to the value of the key, or null if the key is not found.
     */
    async getKeyValueFromLocation(domain, location, key) {
        let keyValue = null;
        await this.processLocationBlocks(domain, (server, locationBlock, index) => {
            if ((locationBlock === null || locationBlock === void 0 ? void 0 : locationBlock._value) === location) {
                // Check if the key exists in the location block
                const keyExists = locationBlock[key] !== undefined;
                // If the key exists, get its value
                if (keyExists)
                    keyValue = locationBlock[key][0]._value;
            }
        });
        return keyValue;
    }
    /**
     * Retrieves all key-value pairs from the specified location block in the specified domain's configuration file.
     * @param {string} domain - The domain to get the key-value pairs from.
     * @param {string} location - The path of the location block to get the key-value pairs from.
     * @returns {Promise<Object | null>} - A promise that resolves to an object containing all key-value pairs from the location block, or null if the location is not found.
     */
    async getAllKeyValuesFromLocation(domain, location) {
        let keyValues = null;
        await this.processLocationBlocks(domain, (server, locationBlock, index) => {
            if ((locationBlock === null || locationBlock === void 0 ? void 0 : locationBlock._value) === location) {
                keyValues = {};
                for (const key in locationBlock) {
                    if (locationBlock.hasOwnProperty(key) && typeof locationBlock[key] !== 'function') {
                        keyValues[key] = locationBlock[key][0]._value;
                    }
                }
            }
        });
        return keyValues;
    }
}
exports.NginxBlockManager = NginxBlockManager;
//# sourceMappingURL=NginxBlockManager.js.map
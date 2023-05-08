import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';

import { NginxServerKey, NginxLocationKey } from './NginxBlockTypes';
import { NginxBlockManager } from './NginxBlockManager';
import * as fse from 'fs-extra';

const testDomain = 'test.com';
const testDomainSpecial = 'ex@mple.test-tld';
const testPaths = {
    nginxConfigPath: './test/sites-available',
    nginxEnabledPath: './test/sites-enabled',
};

describe('NginxManager', () => {
    let manager: NginxBlockManager;

    beforeEach(async () => {
        manager = new NginxBlockManager(testPaths);

        await manager.createConfigFile(testDomain);
    });

    afterEach(async () => {
        // Clean up test directories after each test
        await fse.remove('./test');
    });

    // Test: Create a new configuration file
    test('Create a new configuration file', async () => {
        const configFileExists = await manager.checkConfigFileExists(testDomain);
        expect(configFileExists).toBe(true);
    });

    // Test: Create a new configuration file with special characters
    test('Delete a configuration file', async () => {
        await manager.deleteConfigFile(testDomain);
        const configFileExists = await manager.checkConfigFileExists(testDomain);
        expect(configFileExists).toBe(false);
    });

    // Test: Create a new configuration file with special characters
    test('getAllLocations should return all location paths for a given domain', async () => {
        await manager.addLocation(testDomain, '/');
        await manager.addLocation(testDomain, '/api');
        await manager.addLocation(testDomain, '/static');

        const locations = await manager.getAllLocations(testDomain);
        expect(locations).toContain('/');
        expect(locations).toContain('/api');
        expect(locations).toContain('/static');
    });

    // Test: Enable and disable a configuration file
    test('Enable and disable a configuration file', async () => {
        await manager.enableConfigFile(testDomain);
        const configFileEnabled = await manager.checkConfigFileEnabled(testDomain);
        expect(configFileEnabled).toBe(true);

        await manager.disableConfigFile(testDomain);
        const configFileDisabled = !(await manager.checkConfigFileEnabled(testDomain));
        expect(configFileDisabled).toBe(true);
    });

    // Test: Add, update, and remove a key from the server block
    test('Add, update, and remove a key from the server block', async () => {
        await manager.addKeyToServer(testDomain, 'include', 'custom_value');
        let keyValue = await manager.getKeyValueFromServer(testDomain, 'include');
        expect(keyValue).toBe('custom_value');

        await manager.updateKeyInServer(testDomain, 'include', 'updated_value');
        keyValue = await manager.getKeyValueFromServer(testDomain, 'include');
        expect(keyValue).toBe('updated_value');

        await manager.deleteKeyFromServer(testDomain, 'include');
        keyValue = await manager.getKeyValueFromServer(testDomain, 'include');
        expect(keyValue).toBe(null);
    });

    // Test: Create a new location block and modify it
    test('Create a new location block and modify it', async () => {
        await manager.addLocation(testDomain, '/test');
        const locations = await manager.getAllLocations(testDomain);
        expect(locations).toContain('/test');

        await manager.addKeyToLocation(testDomain, '/test', 'alias', 'custom_value');
        let keyValue = await manager.getKeyValueFromLocation(testDomain, '/test', 'alias');
        expect(keyValue).toBe('custom_value');

        await manager.updateKeyInLocation(testDomain, '/test', 'alias', 'updated_value');
        keyValue = await manager.getKeyValueFromLocation(testDomain, '/test', 'alias');
        expect(keyValue).toBe('updated_value');

        await manager.deleteKeyFromLocation(testDomain, '/test', 'alias');
        keyValue = await manager.getKeyValueFromLocation(testDomain, '/test', 'alias');
        expect(keyValue).toBe(null);
    });

    // Test: Remove a location block
    test('Remove a location block', async () => {
        await manager.deleteLocation(testDomain, '/test');
        const locations = await manager.getAllLocations(testDomain);
        expect(locations).not.toContain('/test');
    });

    // Test: Subdomain creation and deletion
    test('Create and delete a subdomain', async () => {
        await manager.addSubdomain(testDomain, 'test');
        const subdomains = await manager.getSubdomains(testDomain);
        expect(subdomains).toContain(`test.${testDomain}`);

        await manager.deleteSubdomain(testDomain, 'test');
        const subdomainsAfterDelete = await manager.getSubdomains(testDomain);
        expect(subdomainsAfterDelete).not.toContain(`test.${testDomain}`);
    });

    // // Test: Add, update, and remove a key from the location block
    test('addMultipleKeysToLocation', async () => {
        const location = '/';
        const keysToAdd: Partial<Record<NginxLocationKey, string>> = {
            autoindex: 'value1',
            try_files: 'value2'
        };

        await manager.addLocation(testDomain, location);
        await manager.addMultipleKeysToLocation(testDomain, location, keysToAdd);

        for (const key in keysToAdd) {
            if (keysToAdd.hasOwnProperty(key)) {
                const typedKey = key as NginxLocationKey;
                const value = await manager.getKeyValueFromLocation(testDomain, location, typedKey);
                expect(value).toBe(keysToAdd[typedKey]);
            }
        }
    });

    // Test: Add, update, and remove a key from the location block
    test('updateMultipleKeysInLocation', async () => {
        const location = '/';
        const keysToAdd: Partial<Record<NginxLocationKey, string>> = { autoindex: 'value1', try_files: 'value2' };
        const keysToUpdate: Partial<Record<NginxLocationKey, string>> = { autoindex: 'newValue1', try_files: 'newValue2' };
        const keysToRemove: NginxLocationKey[] = ['autoindex'];

        await manager.addLocation(testDomain, location);

        // First, add the keys to the location block
        await manager.addMultipleKeysToLocation(testDomain, location, keysToAdd);

        // Then, update the keys
        await manager.updateMultipleKeysInLocation(testDomain, location, keysToUpdate);

        for (const key in keysToUpdate) {
            if (keysToUpdate.hasOwnProperty(key)) {
                const typedKey = key as NginxLocationKey;
                const value = await manager.getKeyValueFromLocation(testDomain, location, typedKey);
                expect(value).toBe(keysToUpdate[typedKey]);
            }
        }

        // Now, remove the keys from the location block
        for (const key of keysToRemove) {
            await manager.deleteKeyFromLocation(testDomain, location, key);
        }

        // Verify that the keys have been removed from the location block
        for (const key of keysToRemove) {
            const value = await manager.getKeyValueFromLocation(testDomain, location, key as NginxLocationKey);
            expect(value).toBeNull();
        }
    });

    // Test: Add, update, and remove a key from the location block
    test('deleteMultipleKeysFromLocation', async () => {
        const location = '/';
        const keysToRemove: NginxLocationKey[] = ['autoindex', 'try_files'];

        await manager.deleteMultipleKeysFromLocation(testDomain, location, keysToRemove);

        for (const key of keysToRemove) {
            const value = await manager.getKeyValueFromLocation(testDomain, location, key);
            expect(value).toBeNull();
        }
    });

    // Test: Get all key-value pairs from the location block
    test('getAllKeyValuesFromLocation', async () => {
        const location = '/';

        await manager.addLocation(testDomain, location);
        await manager.addMultipleKeysToLocation(testDomain, location, { index: 'index.html', root: '/var/www/html' });

        const allKeyValues = await manager.getAllKeyValuesFromLocation(testDomain, location);

        // You can add more assertions here, depending on the keys and values present in the location block
        // Adjust these assertions based on the properties you expect to find in your location block
        expect(allKeyValues).toHaveProperty('index');
        expect(allKeyValues).toHaveProperty('root');
    });

    test('addMultipleKeysToServer', async () => {
        const keysToAdd: Partial<Record<NginxServerKey, string>> = { access_log: 'value1', error_log: 'value2' };

        await manager.addMultipleKeysToServer(testDomain, keysToAdd);

        for (const key in keysToAdd) {
            if (keysToAdd.hasOwnProperty(key)) {
                const typedKey = key as NginxServerKey;
                const value = await manager.getKeyValueFromServer(testDomain, typedKey);
                expect(value).toBe(keysToAdd[typedKey]);
            }
        }
    });

    test('updateMultipleKeysInServer', async () => {
        const keysToAdd: Partial<Record<NginxServerKey, string>> = { error_log: 'value1', access_log: 'value2' };
        const keysToUpdate: Partial<Record<NginxServerKey, string>> = { error_log: 'newValue1', access_log: 'newValue2' };

        // First, add the keys to the server block
        await manager.addMultipleKeysToServer(testDomain, keysToAdd);

        // Then, update the keys
        await manager.updateMultipleKeysInServer(testDomain, keysToUpdate);

        for (const key in keysToUpdate) {
            if (keysToUpdate.hasOwnProperty(key)) {
                const typedKey = key as NginxServerKey;
                const value = await manager.getKeyValueFromServer(testDomain, typedKey);
                expect(value).toBe(keysToUpdate[typedKey]);
            }
        }
    });

    test('removeMultipleKeysFromServer', async () => {
        const keysToAdd: Partial<Record<NginxServerKey, string>> = { server_name: 'value1', listen: 'value2' };
        const keysToRemove: NginxServerKey[] = ['server_name', 'listen'];

        // First, add the keys to the server block
        await manager.addMultipleKeysToServer(testDomain, keysToAdd);

        // Then, remove the keys
        await manager.deleteMultipleKeysFromServer(testDomain, keysToRemove);

        for (const key of keysToRemove) {
            const value = await manager.getKeyValueFromServer(testDomain, key);
            expect(value).toBe(null);
        }
    });

    // Test: Get all key-value pairs from the server block
    test('getAllKeyValuesFromServer', async () => {
        const allKeyValues = await manager.getAllKeyValuesFromServer(testDomain);

        // You can add more assertions here, depending on the keys and values present in the server block
        expect(allKeyValues).toHaveProperty('listen');
        expect(allKeyValues).toHaveProperty('server_name');
    });

    // Test: List all configuration files
    test('List all configuration files', async () => {
        // Create another test configuration file
        const anotherTestDomain = 'another-test.com';
        await manager.createConfigFile(anotherTestDomain);

        // Call the getAllConfigs() method and verify if it returns both configuration files
        const configFiles = await manager.getAllConfigs();
        expect(configFiles).toContain(`${testDomain}.conf`);
        expect(configFiles).toContain(`${anotherTestDomain}.conf`);
    });

    // Test: List all servers
    test('List all servers', async () => {
        // Create another test configuration file
        const anotherTestDomain = 'another-test.com';
        await manager.createConfigFile(anotherTestDomain);

        // Call the getAllServers() method and verify if it returns both server names
        const serverNames = await manager.getAllServers();
        expect(serverNames).toContain(testDomain);
        expect(serverNames).toContain(anotherTestDomain);
    });

    // Error handling tests
    describe('error handling', () => {

        test('should throw an error when creating a config file for a domain that already exists', async () => {
            await expect(manager.createConfigFile(testDomain)).rejects.toThrow();
        });

        // Test: Create a new configuration file with a domain that contains special characters
        test('should throw an error when removing a config file for a domain that does not exist', async () => {
            await expect(manager.deleteConfigFile('nonexistent.com')).rejects.toThrow();
        });

        // Test: Create a new configuration file with a domain that contains special characters
        test('should throw an error when enabling a config file for a domain that does not exist', async () => {
            await expect(manager.enableConfigFile('nonexistent.com')).rejects.toThrow();
        });

        // Test: Create a new configuration file with a domain that contains special characters
        test('should throw an error when disabling a config file for a domain that does not exist', async () => {
            await expect(manager.disableConfigFile('nonexistent.com')).rejects.toThrow();
        });

        // Test: Create a new configuration file with a domain that contains special characters
        test('should throw an error when adding a key to a server block for a domain that does not exist', async () => {
            await expect(manager.addKeyToServer('nonexistent.com', 'include', 'value')).rejects.toThrow();
        });

        // Test: Create a new configuration file with a domain that contains special characters
        test('should throw an error when updating a key in a server block for a domain that does not exist', async () => {
            await expect(manager.updateKeyInServer('nonexistent.com', 'include', 'value')).rejects.toThrow();
        });

        // Test: Create a new configuration file with a domain that contains special characters
        test('should throw an error when removing a key from a server block for a domain that does not exist', async () => {
            await expect(manager.deleteKeyFromServer('nonexistent.com', 'include')).rejects.toThrow();
        });

        // Test: Create a new configuration file with a domain that contains special characters
        test('should throw an error when adding a key to a location block for a domain that does not exist', async () => {
            await expect(manager.addKeyToLocation('nonexistent.com', '/', 'alias', 'value')).rejects.toThrow();
        });

        // Test: Create a new configuration file with a domain that contains special characters
        test('should throw an error when updating a key in a location block for a domain that does not exist', async () => {
            await expect(manager.updateKeyInLocation('nonexistent.com', '/', 'alias', 'value')).rejects.toThrow();
        });

        // Test: Create a new configuration file with a domain that contains special characters
        test('should throw an error when removing a key from a location block for a domain that does not exist', async () => {
            await expect(manager.deleteKeyFromLocation('nonexistent.com', '/', 'alias')).rejects.toThrow();
        });

        // Test: Create a new configuration file with a domain that contains special characters
        test('should throw an error when creating a location block for a domain that does not exist', async () => {
            await expect(manager.addLocation('nonexistent.com', '/test')).rejects.toThrow();
        });

        // Test: Create a new configuration file with a domain that contains special characters
        test('should throw an error when deleting a location block for a domain that does not exist', async () => {
            await expect(manager.deleteLocation('nonexistent.com', '/test')).rejects.toThrow();
        });

        test('should throw an error when domain is an empty string', async () => {
            await expect(manager.createConfigFile('')).rejects.toThrow();
        });

        test('should throw an error when location is an empty string', async () => {
            await expect(manager.addLocation(testDomain, '')).rejects.toThrow();
        });

    });

    // Test with multiple domains
    describe('multiple domains', () => {
        const testDomain2 = 'test2.com';

        beforeEach(async () => {
            await manager.createConfigFile(testDomain2);
        });

        afterEach(async () => {
            await manager.deleteConfigFile(testDomain2);
        });

        test('should not interfere with each other\'s configuration files', async () => {
            await manager.addKeyToServer(testDomain, 'include', 'custom_value');
            let keyValue = await manager.getKeyValueFromServer(testDomain, 'include');
            expect(keyValue).toBe('custom_value');

            keyValue = await manager.getKeyValueFromServer(testDomain2, 'include');
            expect(keyValue).toBe(null);

            await manager.addLocation(testDomain, '/test');
            const locations = await manager.getAllLocations(testDomain);
            expect(locations).toContain('/test');

            const locations2 = await manager.getAllLocations(testDomain2);
            expect(locations2).not.toContain('/test');
        });
    });

    // Test with multiple blocks
    describe('multiple blocks', () => {
        beforeEach(async () => {
            await manager.addLocation(testDomain, '/api');
            await manager.addLocation(testDomain, '/static');
        });

        test('should handle multiple location blocks correctly', async () => {
            await manager.addKeyToLocation(testDomain, '/api', 'alias', 'custom_value');
            let keyValue = await manager.getKeyValueFromLocation(testDomain, '/api', 'alias');
            expect(keyValue).toBe('custom_value');

            keyValue = await manager.getKeyValueFromLocation(testDomain, '/static', 'alias');
            expect(keyValue).toBe(null);

            await manager.deleteLocation(testDomain, '/api');
            const locations = await manager.getAllLocations(testDomain);
            expect(locations).not.toContain('/api');
            expect(locations).toContain('/static');
        });
    });

    // Edge cases tests
    describe('edge cases', () => {
        test('should handle domains with special characters and unusual TLDs', async () => {
            await manager.createConfigFile(testDomainSpecial);
            const configFileExists = await manager.checkConfigFileExists(testDomainSpecial);
            expect(configFileExists).toBe(true);

            await manager.deleteConfigFile(testDomainSpecial);
            const configFileRemoved = !(await manager.checkConfigFileExists(testDomainSpecial));
            expect(configFileRemoved).toBe(true);
        });
    });

});

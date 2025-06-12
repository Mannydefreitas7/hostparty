/**
 * Party tests
 */

import { expect, test, beforeAll, afterAll, describe } from 'bun:test';
import party from '../lib/party.js';
import config, { setupTestFile, cleanupTestFile } from './tests-setup.js';

describe('Hosts file CRUD operations:', () => {
  beforeAll(() => {
    setupTestFile();
    
    // set the path manually. overrides the host mapping.
    party.setup({
      path: config.path
    });
  });

  afterAll(async () => {
    await cleanupTestFile();
  });

  test('Should return all entries in the test hosts file as a dictionary object.', async () => {
    const hosts = await party.list();
    
    expect(hosts).toBeInstanceOf(Object);
    expect(Object.keys(hosts).length).toBeGreaterThan(0);
    
    // Check for some known entries from the test file
    const hasLocalhost = Object.keys(hosts).some(key => key.includes('::1') || hosts[key].some((h: string) => h.includes('localhost')));
    expect(hasLocalhost).toBe(true);
  });

  test('Should add a new host entry', async () => {
    await party.add('192.168.1.1', 'test.local');
    const hosts = await party.list();
    
    expect(Object.keys(hosts)).toContain('192.168.1.1');
    expect(hosts['192.168.1.1']).toContain('test.local');
  });

  test('Should add multiple hosts to the same IP', async () => {
    await party.add('192.168.1.2', ['test1.local', 'test2.local']);
    const hosts = await party.list();
    
    expect(Object.keys(hosts)).toContain('192.168.1.2');
    expect(hosts['192.168.1.2']).toContain('test1.local');
    expect(hosts['192.168.1.2']).toContain('test2.local');
  });

  test('Should remove an IP entry', async () => {
    await party.add('192.168.1.3', 'remove-me.local');
    let hosts = await party.list();
    expect(Object.keys(hosts)).toContain('192.168.1.3');
    
    await party.remove('192.168.1.3');
    hosts = await party.list();
    expect(Object.keys(hosts)).not.toContain('192.168.1.3');
  });

  test('Should purge a specific hostname', async () => {
    await party.add('192.168.1.4', ['keep.local', 'purge-me.local']);
    let hosts = await party.list();
    expect(hosts['192.168.1.4']).toContain('purge-me.local');
    
    await party.purge('purge-me.local');
    hosts = await party.list();
    expect(hosts['192.168.1.4']).toContain('keep.local');
    expect(hosts['192.168.1.4']).not.toContain('purge-me.local');
  });

  test('Should filter hosts by hostname', async () => {
    const hosts = await party.list('localhost');
    
    expect(hosts).toBeInstanceOf(Object);
    // Should only contain entries with 'localhost' in the hostname
    Object.values(hosts).forEach(hostList => {
      expect(hostList.some(host => host.includes('localhost'))).toBe(true);
    });
  });

  test('Should throw error for invalid IP', async () => {
    expect(async () => {
      await party.add('invalid-ip', 'test.local');
    }).toThrow();
  });

  test('Should throw error for invalid hostname', async () => {
    expect(async () => {
      await party.add('192.168.1.5', 'invalid..hostname');
    }).toThrow();
  });
});
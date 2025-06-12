import os from 'os';
import util from 'util';
import path from 'path';
import fs from 'fs/promises';
import { utils } from './utils.js';
const protectedEntries = {
    ips: ['::1', 'fe80::1%lo0'],
    hosts: ['localhost']
};
let options = {
    group: true,
    force: false
};
/**
 * setup - configure default options
 */
const setup = (setupOptions) => {
    options = { ...options, ...setupOptions };
    return api;
};
/**
 * add - adds hostname(s) to an IP address mapping
 */
const add = async (ip, hostNames) => {
    ip = (ip || '').trim();
    const hostNamesArray = Array.isArray(hostNames) ? hostNames.filter(Boolean) : [hostNames].filter(Boolean);
    if (!ip.length && !hostNamesArray.length) {
        throw new Error('Neither a hostname or IP was supplied.');
    }
    if (!utils.validateIP(ip)) {
        throw new Error(util.format('Invalid IP address [%s] was supplied.', ip));
    }
    for (const host of hostNamesArray) {
        if (!utils.validateHost(host)) {
            throw new Error(util.format('Invalid hostname [%s] was supplied.', host));
        }
    }
    const hosts = await loadHosts();
    let row = hosts[ip];
    if (!row) {
        row = hostNamesArray;
    }
    else {
        row = [...row, ...hostNamesArray];
    }
    hosts[ip] = [...new Set(row)]; // Remove duplicates
    await saveToFile(hosts);
};
/**
 * remove - removes IP entries from hosts file
 */
const remove = async (ips) => {
    const ipsArray = Array.isArray(ips) ? ips : [ips];
    if (!ipsArray.length) {
        throw new Error('No IP addresses provided');
    }
    for (const ip of ipsArray) {
        if (!utils.validateIP(ip)) {
            throw new Error(util.format('Invalid IP address [%s] was supplied.', ip));
        }
    }
    for (const ip of ipsArray) {
        if (protectedEntries.ips.indexOf(ip) > -1) {
            if (!options.force) {
                throw new Error(util.format('%s is protected by the OS and cannot be removed. Use --force to override this.', ip));
            }
        }
    }
    const hosts = await loadHosts();
    for (const ip of ipsArray) {
        if (hosts[ip]) {
            delete hosts[ip];
        }
        else {
            throw new Error(util.format('IP %s not found in hosts file.', ip));
        }
    }
    await saveToFile(hosts);
};
/**
 * purge - removes specific hostnames from any IP mapping
 */
const purge = async (hostNames) => {
    const hostNamesArray = Array.isArray(hostNames) ? hostNames : [hostNames];
    for (const host of hostNamesArray) {
        if (!utils.validateHost(host)) {
            throw new Error(util.format("Invalid host [%s] supplied", host));
        }
    }
    const hosts = await loadHosts();
    // loop supplied hostnames
    for (const hostName of hostNamesArray) {
        // loop the hosts against the ip
        for (const [ip, hostList] of Object.entries(hosts)) {
            // purge the matching
            hosts[ip] = hostList.filter(host => host.toLowerCase().trim() !== hostName.toLowerCase().trim());
            // if the purge leaves the ip hostname bindings empty, remove it
            if (!hosts[ip].length) {
                delete hosts[ip];
            }
        }
    }
    await saveToFile(hosts);
};
/**
 * list - returns hosts file contents
 */
const list = async (filter) => {
    return await loadHosts(filter);
};
/**
 * getHostFilePath - determines the correct hosts file path for the OS
 */
const getHostFilePath = async () => {
    let filePath;
    // path was set by user via options
    if (options.path) {
        filePath = options.path;
    }
    else {
        // calculate the path
        switch (os.platform()) {
            case 'linux':
            case 'darwin':
            case 'freebsd':
            case 'openbsd':
                filePath = '/etc/hosts';
                break;
            case 'win32':
                const windir = process.env.windir || process.env.WINDIR;
                if (windir) {
                    filePath = path.normalize(path.join(windir, 'System32', 'drivers', 'etc', 'hosts'));
                }
                else {
                    throw new Error('Unable to determine Windows directory');
                }
                break;
            default:
                throw new Error(`Unsupported platform: ${os.platform()}`);
        }
    }
    return await fs.realpath(filePath);
};
/**
 * loadHosts - loads and parses the hosts file
 */
const loadHosts = async (filter) => {
    const filePath = await getHostFilePath();
    const file = await fs.readFile(filePath);
    const hosts = {};
    file.toString().split("\n").forEach((line) => {
        // comments are ignored
        if (line.indexOf('#') === 0) {
            return;
        }
        // split the string to get the ip and hosts
        const parts = line.replace(/(\s)+/g, ' ').split(' ');
        if (parts.length < 2 || !parts[0].length) {
            return;
        }
        let ip = hosts[parts[0]];
        const hostParts = parts.slice(1).filter(Boolean);
        if (ip) {
            ip = [...ip, ...hostParts];
        }
        else {
            ip = hostParts;
        }
        // only return matching hosts
        if (filter) {
            const matching = ip.filter((host) => host.indexOf(filter) > -1);
            if (matching.length) {
                ip = matching;
            }
            else {
                return;
            }
        }
        hosts[parts[0]] = [...new Set(ip)]; // Remove duplicates
    });
    return utils.sortEntries(hosts);
};
/**
 * saveToFile - saves hosts data to the hosts file
 */
const saveToFile = async (hosts) => {
    // sort the dictionary of entries
    const sortedHosts = utils.sortEntries(hosts);
    const filePath = await getHostFilePath();
    const contents = [];
    Object.entries(sortedHosts).forEach(([ip, hostList]) => {
        // group the hosts by IP
        if (options.group) {
            contents.push(util.format('%s %s', ip, hostList.join(' ')));
        }
        else {
            // don't group - 1 line per IP
            hostList.forEach((host) => {
                contents.push(util.format('%s %s', ip, host));
            });
        }
    });
    try {
        await fs.writeFile(filePath, contents.join("\n") + "\n");
    }
    catch (e) {
        let message = 'Error writing file';
        const elevated = (os.platform().match(/^win/i) ? 'Administrator' : 'root');
        // access denied?
        if (e.code === 'EACCES') {
            message = util.format('Write permission denied on %s. Try running as %s.', filePath, elevated);
        }
        throw new Error(message);
    }
};
const api = {
    setup,
    add,
    remove,
    list,
    purge
};
export default api;
//# sourceMappingURL=party.js.map
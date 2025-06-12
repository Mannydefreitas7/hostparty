#!/usr/bin/env node
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import util from 'util';
import { Command } from 'commander';
const program = new Command();
import table from 'text-table';
import party from '../lib/party.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkg = JSON.parse(readFileSync(join(__dirname, '../../package.json'), 'utf-8'));
const options = {
    path: {
        flag: '--path [path]',
        description: 'Path to the host file (auto-detection is enabled by default)'
    },
    force: {
        flag: '--force',
        description: 'Overrides checks & forces changes. Use with caution.'
    },
    group: {
        flag: '--no-group',
        description: 'One line per hostname, instead of grouping.'
    }
};
/**
 * pull the version out for calls to --version
 */
program.version(pkg.version);
/**
 * list - spits out the hosts file in tabular format
 */
program
    .command('list [hostname]')
    .option(options.path.flag, options.path.description)
    .option(options.group.flag, options.group.description)
    .description('Outputs the hosts file with optional matching hostname.')
    .action(async (hostname, opts) => {
    try {
        const hosts = await party
            .setup({
            path: opts.path,
            force: opts.force,
            group: !opts.group
        })
            .list(hostname);
        const tableOpts = {
            hsep: ' | ',
        };
        const tableData = [];
        // push data into array
        Object.entries(hosts).forEach(([ip, hostList]) => {
            if (opts.group) {
                tableData.push([ip, ...hostList]);
            }
            else {
                // don't group - 1 line per IP
                hostList.forEach((host) => {
                    tableData.push([ip, host]);
                });
            }
        });
        // delimit via pipe
        const tableOutput = table(tableData, tableOpts);
        process.stdout.write(util.format('%s\n', tableOutput));
        process.exit(0);
    }
    catch (error) {
        console.error(error);
        process.exit(-1);
    }
});
/**
 * add
 */
program
    .command('add [ip] [hosts...]')
    .option(options.path.flag, options.path.description)
    .option(options.force.flag, options.force.description)
    .description('Adds a new host(s) entry for an IP address.')
    .action(async (ip, hosts, opts) => {
    try {
        await party
            .setup({
            path: opts.path,
            force: opts.force
        })
            .add(ip, hosts);
        process.stdout.write(util.format('%s hostname(s) added to IP %s\n', hosts.length, ip));
        process.exit(0);
    }
    catch (error) {
        process.stdout.write(util.format('%s\n', error));
        process.exit(-1);
    }
});
/**
 * remove
 */
program
    .command('remove [ips...]')
    .option(options.path.flag, options.path.description)
    .option(options.force.flag, options.force.description)
    .description('Removes all entries for an IP address.')
    .action(async (ips, opts) => {
    try {
        await party
            .setup({
            path: opts.path,
            force: opts.force
        })
            .remove(ips);
        process.stdout.write(util.format('%s removed from file\n', ips.join(', ')));
        process.exit(0);
    }
    catch (error) {
        process.stdout.write(util.format('%s\n', error));
        process.exit(-1);
    }
});
/**
 * purge
 */
program
    .command('purge [hosts...]')
    .option(options.path.flag, options.path.description)
    .option(options.force.flag, options.force.description)
    .description('Removes all host(s) specified.')
    .action(async (hostnames, opts) => {
    try {
        await party
            .setup({
            path: opts.path,
            force: opts.force
        })
            .purge(hostnames);
        process.stdout.write(util.format('%s removed from file\n', hostnames.join(', ')));
        process.exit(0);
    }
    catch (error) {
        process.stdout.write(util.format('%s\n', error));
        process.exit(-1);
    }
});
// parse argv
program.parse(process.argv);
// nothing supplied! show help
if (program.args.length === 0) {
    program.help();
}
//# sourceMappingURL=cli.js.map
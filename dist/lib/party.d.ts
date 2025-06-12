import { type HostsMap } from './utils.js';
export interface PartyOptions {
    group?: boolean;
    force?: boolean;
    path?: string;
}
export interface PartyAPI {
    setup: (setup?: PartyOptions) => PartyAPI;
    add: (ip: string, hostNames: string | string[]) => Promise<void>;
    remove: (ips: string | string[]) => Promise<void>;
    list: (filter?: string) => Promise<HostsMap>;
    purge: (hostNames: string | string[]) => Promise<void>;
}
declare const api: PartyAPI;
export default api;
//# sourceMappingURL=party.d.ts.map
export interface HostsMap {
    [ip: string]: string[];
}
export declare const utils: {
    /**
     * sorts the host file entries by ip, and all hosts alphabetically
     *
     * the hosts are also normalised
     */
    sortEntries: (hosts: HostsMap) => HostsMap;
    /**
     * validateIP - validates an IP address
     */
    validateIP: (ip: string) => boolean;
    /**
     * validateHost - validates a hostname
     */
    validateHost: (hostName: string) => boolean;
};
export default utils;
//# sourceMappingURL=utils.d.ts.map
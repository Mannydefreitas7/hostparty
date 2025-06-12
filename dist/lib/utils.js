import isIp from 'is-ip';
export const utils = {
    /**
     * sorts the host file entries by ip, and all hosts alphabetically
     *
     * the hosts are also normalised
     */
    sortEntries: (hosts) => {
        // sort by ip key, alphabetically
        const keys = Object.keys(hosts).sort((a, b) => {
            // sort by first decimal part of IP
            const aNum = +a.replace(/\D/g, '');
            const bNum = +b.replace(/\D/g, '');
            return aNum - bNum;
        });
        const newHostMap = {};
        // sort the hostnames array alphabetically
        keys.forEach((k) => {
            // sort the hosts, then normalise them to lowercase
            newHostMap[k] = hosts[k]
                .sort((a, b) => a.toLowerCase().trim().localeCompare(b.toLowerCase().trim()))
                .map((host) => host.toLowerCase().trim());
        });
        return newHostMap;
    },
    /**
     * validateIP - validates an IP address
     */
    validateIP: (ip) => {
        // utilise the is-ip library
        return isIp(ip);
    },
    /**
     * validateHost - validates a hostname
     */
    validateHost: (hostName) => {
        const regex = /^((([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9]))$/;
        return regex.test(hostName);
    }
};
export default utils;
//# sourceMappingURL=utils.js.map
import isIp from 'is-ip';

export interface HostsMap {
  [ip: string]: string[];
}

export const utils = {
  /**
   * sorts the host file entries by ip, and all hosts alphabetically
   * 
   * the hosts are also normalised
   */
  sortEntries: (hosts: HostsMap): HostsMap => {
    // sort by ip key, alphabetically
    const keys = Object.keys(hosts).sort((a: string, b: string) => {
      // sort by first decimal part of IP
      const aNum = +a.replace(/\D/g, '');
      const bNum = +b.replace(/\D/g, '');
      return aNum - bNum;
    });
    
    const newHostMap: HostsMap = {};

    // sort the hostnames array alphabetically
    keys.forEach((k: string) => {
      // sort the hosts, then normalise them to lowercase
      newHostMap[k] = hosts[k]
        .sort((a: string, b: string) => a.toLowerCase().trim().localeCompare(b.toLowerCase().trim()))
        .map((host: string) => host.toLowerCase().trim());
    });

    return newHostMap;
  },

  /**
   * validateIP - validates an IP address
   */
  validateIP: (ip: string): boolean => {
    // utilise the is-ip library
    return isIp(ip);
  },

  /**
   * validateHost - validates a hostname
   */
  validateHost: (hostName: string): boolean => {
    const regex = /^((([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9]))$/;
    return regex.test(hostName);
  }
};

export default utils;
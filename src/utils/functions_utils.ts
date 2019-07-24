import { checksumAddress } from './convert';

const functionsUtils = {
  checksumAddressComparision(addr1: string, addr2: string): boolean {
    return checksumAddress(addr1) === checksumAddress(addr2);
  },
};

export default functionsUtils;

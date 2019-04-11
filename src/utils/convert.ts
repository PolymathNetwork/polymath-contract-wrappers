import { ethers } from 'ethers';

export function bytes32ToString(value: string): string {
  return ethers.utils.toUtf8String(value);
}

export function stringToBytes32(value: string): string {
  return ethers.utils.formatBytes32String(value);
}

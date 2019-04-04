import { ethers } from 'ethers';

export function bytes32ToString(value: string) {
  return ethers.utils.toUtf8String(value);
}

export function stringToBytes32(value: string) {
  return ethers.utils.formatBytes32String(value);
}
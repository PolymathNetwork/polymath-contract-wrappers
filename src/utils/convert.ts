import { ethers } from 'ethers';
import { BigNumber } from '@0x/utils';

const BASE = new BigNumber(10);

export function bytes32ToString(value: string): string {
  return ethers.utils.parseBytes32String(value);
}

export function stringToBytes32(value: string): string {
  return ethers.utils.formatBytes32String(value);
}

export function checksumAddress(value: string): string {
  return ethers.utils.getAddress(value);
}

export function bigNumberToDate(value: BigNumber) {
  const date = new Date(0);
  date.setUTCSeconds(value.toNumber());
  return date;
}

export function dateToBigNumber(value: Date) {
  return new BigNumber(parseInt((value.getTime() / 1000).toFixed(0), 10));
}

export function numberToBigNumber(value: number) {
  return new BigNumber(value);
}

export function dateArrayToBigNumberArray(value: Date[]) {
  return value.map<BigNumber>(x => {
    return dateToBigNumber(x);
  });
}

export function numberArrayToBigNumberArray(value: number[]) {
  return value.map<BigNumber>(x => {
    return numberToBigNumber(x);
  });
}

export function stringArrayToBytes32Array(value: string[]) {
  return value.map<string>(x => {
    return stringToBytes32(x);
  });
}

export function bytes32ArrayToStringArray(value: string[]) {
  return value.map<string>(x => {
    return bytes32ToString(x);
  });
}

export function weiToValue(value: BigNumber, decimals: BigNumber) {
  return value.dividedBy(BASE.exponentiatedBy(decimals));
}

export function weiArrayToValueArray(value: BigNumber[], decimals: BigNumber) {
  return value.map<BigNumber>(x => {
    return weiToValue(x, decimals);
  });
}

export function valueToWei(value: BigNumber, decimals: BigNumber) {
  return value.multipliedBy(BASE.exponentiatedBy(decimals));
}

export function valueArrayToWeiArray(value: BigNumber[], decimals: BigNumber) {
  return value.map<BigNumber>(x => {
    return valueToWei(x, decimals);
  });
}

export function packVersion(major: string, minor: string, patch: string) {
  // eslint-disable-next-line no-bitwise
  const packedVersion = (parseInt(major, 10) << 16) | (parseInt(minor, 10) << 8) | parseInt(patch, 10);
  return packedVersion;
}

export function stringToKeccak256(value: string) {
  return ethers.utils.formatBytes32String(value);
}

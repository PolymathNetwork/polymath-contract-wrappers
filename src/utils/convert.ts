import { ethers } from 'ethers';
import { BigNumber } from '@0x/utils';
import assert from './assert';

export function bytes32ToString(value: string): string {
  return ethers.utils.toUtf8String(value);
}

export function stringToBytes32(value: string): string {
  return ethers.utils.formatBytes32String(value);
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
  assert.assert(decimals.isInteger(), 'Decimals must be an integer number');
  assert.assert(decimals.isLessThanOrEqualTo(18), 'Decimals must be less than or equal to 18');
  return value.dividedBy(10**decimals.toNumber());
}

export function weiArrayToValueArray(value: BigNumber[], decimals: BigNumber) {
  return value.map<BigNumber>(x => {
    return weiToValue(x, decimals);
  });
}

export function valueToWei(value: BigNumber, decimals: BigNumber) {
  assert.assert(decimals.isInteger(), 'Decimals must be an integer number');
  assert.assert(decimals.isLessThanOrEqualTo(18), 'Decimals must be less than or equal to 18');
  return value.multipliedBy(10**decimals.toNumber());
}

export function valueArrayToWeiArray(value: BigNumber[], decimals: BigNumber) {
  return value.map<BigNumber>(x => {
    return valueToWei(x, decimals);
  });
}

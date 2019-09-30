import { ethersUtils, BigNumber } from '@polymathnetwork/abi-wrappers';
import { ModuleType, Partition, Perm, TransferResult, ErrorCode } from '../types';
import { PolymathError } from '../PolymathError';

const BASE = new BigNumber(10);

export function bytes32ToString(value: string): string {
  return ethersUtils.parseBytes32String(value);
}

export function stringToBytes32(value: string): string {
  return ethersUtils.formatBytes32String(value);  
}

export function stringToKeccak256(value: string): string {
  return ethersUtils.id(value);
}

export function checksumAddress(value: string): string {
  return ethersUtils.getAddress(value);
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

export function parsePartitionBytes32Value(value: string): Partition {
  switch (bytes32ToString(value)) {
    case 'UNLOCKED':
      return Partition.Unlocked;
    case 'LOCKED':
      return Partition.Locked;
    case '0':
      return Partition.Undefined;
    default:
      throw new PolymathError({ message: 'Partition not recognized', code: ErrorCode.NotFound });
  }
}
export function parsePermBytes32Value(value: string): Perm {
  switch (bytes32ToString(value)) {
    case Perm.Admin:
      return Perm.Admin;
    case Perm.Operator:
      return Perm.Operator;
    default:
      throw new PolymathError({ message: 'Permission not recognized', code: ErrorCode.NotFound });
  }
}
export function parseModuleTypeValue(value: BigNumber): ModuleType {
  switch (value.toNumber()) {
    case ModuleType.Dividends:
      return ModuleType.Dividends;
    case ModuleType.STO:
      return ModuleType.STO;
    case ModuleType.TransferManager:
      return ModuleType.TransferManager;
    case ModuleType.PermissionManager:
      return ModuleType.PermissionManager;
    case ModuleType.Burn:
      return ModuleType.Burn;
    default:
      throw new PolymathError({ message: 'Module Type not recognized', code: ErrorCode.NotFound });
  }
}
export function parseTransferResult(value: BigNumber): TransferResult {
  let transferResult: TransferResult = TransferResult.NA;
  switch (value.toNumber()) {
    case 0: {
      transferResult = TransferResult.INVALID;
      break;
    }
    case 1: {
      transferResult = TransferResult.NA;
      break;
    }
    case 2: {
      transferResult = TransferResult.VALID;
      break;
    }
    case 3: {
      transferResult = TransferResult.FORCE_VALID;
      break;
    }
    default: {
      break;
    }
  }
  return transferResult;
}

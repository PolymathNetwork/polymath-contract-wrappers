// PercentageTransferManager test
import { mock, instance, reset } from 'ts-mockito';
import {
  PercentageTransferManagerContract_3_0_0,
  ISecurityTokenContract_3_0_0,
  Web3Wrapper,
  PolyTokenEvents_3_0_0,
} from '@polymathnetwork/abi-wrappers';
import ContractFactory from '../../../../../factories/contractFactory';
import { PercentageTransferManager_3_0_0 } from '../3.0.0';
import PercentageTransferManagerCommon from '../common';

describe('PercentageTransferManagerWrapper', () => {
  let target: PercentageTransferManager_3_0_0;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: PercentageTransferManagerContract_3_0_0;
  let mockedContractFactory: ContractFactory;
  let mockedSecurityTokenContract: ISecurityTokenContract_3_0_0;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(PercentageTransferManagerContract_3_0_0);
    mockedContractFactory = mock(ContractFactory);
    mockedSecurityTokenContract = mock(ISecurityTokenContract_3_0_0);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new PercentageTransferManager_3_0_0(
      instance(mockedWrapper),
      myContractPromise,
      instance(mockedContractFactory),
    );
  });

  afterEach(() => {
    reset(mockedWrapper);
    reset(mockedContract);
    reset(mockedContractFactory);
    reset(mockedSecurityTokenContract);
  });

  describe('Types', () => {
    test('should extend PercentageTransferManagerCommon', async () => {
      expect(target instanceof PercentageTransferManagerCommon).toBe(true);
    });
  });

  describe('SubscribeAsync', () => {
    test('should throw as eventName does not belong to PercentageTransferManager', async () => {
      // Mocked parameters
      const mockedParams = {
        eventName: PolyTokenEvents_3_0_0.Transfer,
        indexFilterValues: {},
        callback: () => {},
        isVerbose: false,
      };

      // Real call
      await expect(target.subscribeAsync(mockedParams)).rejects.toEqual(
        new Error(
          `Expected eventName to be one of: 'ModifyHolderPercentage', 'ModifyWhitelist', 'SetAllowPrimaryIssuance', 'Pause', 'Unpause', encountered: Transfer`,
        ),
      );
    });
  });
});

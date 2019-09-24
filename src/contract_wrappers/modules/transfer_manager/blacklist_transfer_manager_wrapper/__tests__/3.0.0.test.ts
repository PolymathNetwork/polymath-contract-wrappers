import { mock, instance, reset } from 'ts-mockito';
import { Web3Wrapper, BlacklistTransferManagerContract_3_0_0, PolyTokenEvents_3_0_0 } from '@polymathnetwork/abi-wrappers';
import ContractFactory from '../../../../../factories/contractFactory';
import BlacklistTransferManagerCommon from '../common';
import { BlacklistTransferManager_3_0_0 } from '../3.0.0';

describe('BlacklistTransferManager 3.0.0', () => {
  let target: BlacklistTransferManager_3_0_0;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: BlacklistTransferManagerContract_3_0_0;
  let mockedContractFactory: ContractFactory;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(BlacklistTransferManagerContract_3_0_0);
    mockedContractFactory = mock(ContractFactory);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new BlacklistTransferManager_3_0_0(
      instance(mockedWrapper),
      myContractPromise,
      instance(mockedContractFactory),
    );
  });

  afterEach(() => {
    reset(mockedWrapper);
    reset(mockedContract);
    reset(mockedContractFactory);
  });

  describe('Types', () => {
    test('should extend Module', async () => {
      expect(target instanceof BlacklistTransferManagerCommon).toBe(true);
    });
  });

  describe('SubscribeAsync', () => {
    test('should throw as eventName does not belong to BlacklistTransferManager', async () => {
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
          `Expected eventName to be one of: 'AddBlacklistType', 'ModifyBlacklistType', 'DeleteBlacklistType', 'AddInvestorToBlacklist', 'DeleteInvestorFromBlacklist', 'Pause', 'Unpause', encountered: Transfer`,
        ),
      );
    });
  });
});

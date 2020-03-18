// RestrictedPartialSaleTransferManagerWrapper test
import { mock, instance, reset } from 'ts-mockito';
import {
  RestrictedPartialSaleTMContract_3_1_0,
  ISecurityTokenContract_3_0_0,
  PolyTokenEvents_3_0_0,
  Web3Wrapper,
} from '@polymathnetwork/abi-wrappers';
import { RestrictedPartialSaleTransferManager_3_1_0 } from '../3.1.0';
import ContractFactory from '../../../../../factories/contractFactory';

describe('RestrictedPartialSaleTransferManagerWrapper', () => {
  let target: RestrictedPartialSaleTransferManager_3_1_0;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: RestrictedPartialSaleTMContract_3_1_0;
  let mockedContractFactory: ContractFactory;
  let mockedSecurityTokenContract: ISecurityTokenContract_3_0_0;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(RestrictedPartialSaleTMContract_3_1_0);
    mockedContractFactory = mock(ContractFactory);
    mockedSecurityTokenContract = mock(ISecurityTokenContract_3_0_0);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new RestrictedPartialSaleTransferManager_3_1_0(
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

  describe('SubscribeAsync', () => {
    test('should throw as eventName does not belong to RestrictedPartialSaleTransferManager', async () => {
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
          `Expected eventName to be one of: 'ChangedExemptWalletList', 'Pause', 'Unpause', encountered: Transfer`,
        ),
      );
    });
  });
});

// GeneralTransferManager test
import { mock, instance, reset } from 'ts-mockito';
import {
  GeneralTransferManagerContract_3_0_0,
  ISecurityTokenContract_3_0_0,
  PolyTokenEvents_3_0_0,
  BigNumber,
  Web3Wrapper,
} from '@polymathnetwork/abi-wrappers';
import ContractFactory from '../../../../../factories/contractFactory';
import {GeneralTransferManager_3_0_0} from '../3.0.0';

describe('GeneralTransferManagerWrapper', () => {
  let target: GeneralTransferManager_3_0_0;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: GeneralTransferManagerContract_3_0_0;
  let mockedContractFactory: ContractFactory;
  let mockedSecurityTokenContract: ISecurityTokenContract_3_0_0;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(GeneralTransferManagerContract_3_0_0);
    mockedContractFactory = mock(ContractFactory);
    mockedSecurityTokenContract = mock(ISecurityTokenContract_3_0_0);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new GeneralTransferManager_3_0_0(
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
    test('should throw as eventName does not belong to GeneralTransferManager', async () => {
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
              `Expected eventName to be one of: 'ChangeIssuanceAddress', 'ChangeDefaults', 'ModifyKYCData', 'ModifyInvestorFlag', 'ModifyTransferRequirements', 'Pause', 'Unpause', encountered: Transfer`,
          ),
      );
    });
  });
});

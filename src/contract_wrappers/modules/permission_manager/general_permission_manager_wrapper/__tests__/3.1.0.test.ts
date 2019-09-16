// GeneralPermissionManagerWrapper test
import { instance, mock, reset, verify, when, objectContaining } from 'ts-mockito';
import {
  GeneralPermissionManagerContract_3_1_0,
  PolyTokenEvents_3_0_0,
  ISecurityTokenContract_3_0_0,
  Web3Wrapper,
} from '@polymathnetwork/abi-wrappers';
import ModuleWrapper from '../../../module_wrapper';
import { GeneralPermissionManager_3_1_0 } from '../3.1.0';
import ContractFactory from '../../../../../factories/contractFactory';
import {
  stringToBytes32,
  stringArrayToBytes32Array,
  bytes32ArrayToStringArray,
  numberToBigNumber,
} from '../../../../../utils/convert';
import { MockedCallMethod, MockedSendMethod, getMockedPolyResponse } from '../../../../../test_utils/mocked_methods';
import { Perm } from '../../../../../types';

describe('GeneralPermissionManagerWrapper', () => {
  // Declare GeneralPermissionManagerWrapper object
  let target: GeneralPermissionManager_3_1_0;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: GeneralPermissionManagerContract_3_1_0;
  let mockedContractFactory: ContractFactory;
  let mockedSecurityTokenContract: ISecurityTokenContract_3_0_0;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(GeneralPermissionManagerContract_3_1_0);
    mockedContractFactory = mock(ContractFactory);
    mockedSecurityTokenContract = mock(ISecurityTokenContract_3_0_0);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new GeneralPermissionManager_3_1_0(
      instance(mockedWrapper),
      myContractPromise,
      instance(mockedContractFactory),
    );
  });

  afterEach(() => {
    reset(mockedWrapper);
    reset(mockedContract);
    reset(mockedSecurityTokenContract);
    reset(mockedContractFactory);
  });

  describe('SubscribeAsync', () => {
    test('should throw as eventName does not belong to GeneralPermissionManagerEvents', async () => {
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
          `Expected eventName to be one of: 'ChangePermission', 'AddDelegate', 'Pause', 'Unpause', encountered: Transfer`,
        ),
      );
    });
  });
});

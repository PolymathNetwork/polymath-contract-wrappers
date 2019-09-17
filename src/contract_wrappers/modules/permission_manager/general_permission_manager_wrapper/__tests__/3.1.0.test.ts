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

  describe('addDelegateMulti', () => {
    test('should send the transaction to addDelegateMulti', async () => {
      // Owner Address expected
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';

      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // Mocked parameters
      const mockedParams = {
        delegates: ['0x1111111111111111111111111111111111111111'],
        details: ['details'],
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.addDelegateMulti).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.delegates,
          objectContaining(stringArrayToBytes32Array(mockedParams.details)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // checkDelegate
      const expectedDelegateResult = false;
      // Mocked method
      const mockedDelegateMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.checkDelegate).thenReturn(instance(mockedDelegateMethod));
      // Stub the request
      when(mockedDelegateMethod.callAsync(mockedParams.delegates[0])).thenResolve(expectedDelegateResult);

      // Real call
      const result = await target.addDelegateMulti(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.addDelegateMulti).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.delegates,
          objectContaining(stringArrayToBytes32Array(mockedParams.details)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedContract.checkDelegate).once();
      verify(mockedDelegateMethod.callAsync(mockedParams.delegates[0])).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('deleteDelegateMulti', () => {
    test('should send the transaction to deleteDelegateMulti', async () => {
      // Owner Address expected
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';

      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // Mocked parameters
      const mockedParams = {
        delegates: ['0x1111111111111111111111111111111111111111'],
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.deleteDelegateMulti).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(mockedParams.delegates, mockedParams.txData, mockedParams.safetyFactor),
      ).thenResolve(expectedResult);

      // checkDelegate
      const expectedDelegateResult = true;
      // Mocked method
      const mockedDelegateMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.checkDelegate).thenReturn(instance(mockedDelegateMethod));
      // Stub the request
      when(mockedDelegateMethod.callAsync(mockedParams.delegates[0])).thenResolve(expectedDelegateResult);

      // Real call
      const result = await target.deleteDelegateMulti(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.deleteDelegateMulti).once();
      verify(
        mockedMethod.sendTransactionAsync(mockedParams.delegates, mockedParams.txData, mockedParams.safetyFactor),
      ).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedContract.checkDelegate).once();
      verify(mockedDelegateMethod.callAsync(mockedParams.delegates[0])).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
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

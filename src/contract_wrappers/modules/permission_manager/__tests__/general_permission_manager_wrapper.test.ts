// GeneralPermissionManagerWrapper test
import { instance, mock, reset, verify, when, objectContaining } from 'ts-mockito';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { BigNumber } from '@0x/utils';
import {
  GeneralPermissionManagerContract,
  PolyTokenEvents,
  FeatureRegistryContract,
  ModuleFactoryContract,
  SecurityTokenContract,
} from '@polymathnetwork/abi-wrappers';
import ModuleWrapper from '../../module_wrapper';
import { Features, ModuleType } from '../../../../types';
import GeneralPermissionManagerWrapper from '../general_permission_manager_wrapper';
import ContractFactory from '../../../../factories/contractFactory';
import {
  stringToBytes32,
  stringArrayToBytes32Array,
  bytes32ArrayToStringArray,
  bytes32ToString,
  numberToBigNumber,
} from '../../../../utils/convert';
import { MockedCallMethod, MockedSendMethod, getMockedPolyResponse } from '../../../../test_utils/mocked_methods';

describe('GeneralPermissionManagerWrapper', () => {
  // Declare GeneralPermissionManagerWrapper object
  let target: GeneralPermissionManagerWrapper;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: GeneralPermissionManagerContract;
  let mockedContractFactory: ContractFactory;
  let mockedSecurityTokenContract: SecurityTokenContract;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(GeneralPermissionManagerContract);
    mockedContractFactory = mock(ContractFactory);
    mockedSecurityTokenContract = mock(SecurityTokenContract);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new GeneralPermissionManagerWrapper(
      instance(mockedWrapper),
      myContractPromise,
      instance(mockedContractFactory),
    );
  });

  afterEach(() => {
    reset(mockedWrapper);
    reset(mockedContract);
    reset(mockedSecurityTokenContract);
  });

  describe('Types', () => {
    test('should extend ModuleWrapper', async () => {
      expect(target instanceof ModuleWrapper).toBe(true);
    });
  });

  describe('perms', () => {
    test.todo('should fail as module is not an Eth address');
    test.todo('should fail as delegate is not an Eth address');

    test('should call to perms', async () => {
      // Address expected
      const expectedResult = true;
      const params = {
        module: '0x1111111111111111111111111111111111111111',
        delegate: '0x2222222222222222222222222222222222222222',
        permission: 'Permission1',
      };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.perms).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(params.module, params.delegate, stringToBytes32(params.permission))).thenResolve(
        expectedResult,
      );

      // Real call
      const result = await target.perms(params);
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.perms).once();
      verify(mockedMethod.callAsync(params.module, params.delegate, stringToBytes32(params.permission))).once();
    });
  });

  describe('allDelegates', () => {
    test('should call to allDelegates', async () => {
      // Address expected
      const expectedResult = 'result';
      const params = {
        delegateIndex: 1,
      };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.allDelegates).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(objectContaining(numberToBigNumber(params.delegateIndex)))).thenResolve(
        expectedResult,
      );

      // Real call
      const result = await target.allDelegates(params);
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.allDelegates).once();
      verify(mockedMethod.callAsync(objectContaining(numberToBigNumber(params.delegateIndex)))).once();
    });
  });

  describe('delegateDetails', () => {
    test.todo('should fail as delegate is not an Eth address');
    test('should call to delegateDetails', async () => {
      // Address expected
      const expectedResult = 'result';
      const params = {
        delegate: '0x1111111111111111111111111111111111111111',
      };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.delegateDetails).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(params.delegate)).thenResolve(expectedResult);

      // Real call
      const result = await target.delegateDetails(params);
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.delegateDetails).once();
      verify(mockedMethod.callAsync(params.delegate)).once();
    });
  });

  describe('checkPermission', () => {
    test.todo('should fail as delegate is not an Eth address');
    test.todo('should fail as module is not an Eth address');
    test('should call to checkPermission', async () => {
      // Address expected
      const expectedResult = true;
      const params = {
        module: '0x1111111111111111111111111111111111111111',
        delegate: '0x2222222222222222222222222222222222222222',
        permission: 'Permission1',
      };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.checkPermission).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(params.delegate, params.module, stringToBytes32(params.permission))).thenResolve(
        expectedResult,
      );

      // Real call
      const result = await target.checkPermission(params);
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.checkPermission).once();
      verify(mockedMethod.callAsync(params.delegate, params.module, stringToBytes32(params.permission))).once();
    });
  });

  describe('checkDelegate', () => {
    test.todo('should fail as delegate is not an Eth address');
    test.todo('should fail as delegate is not an 0x0 address');
    test('should call to checkDelegate', async () => {
      // Address expected
      const expectedResult = true;
      const params = {
        delegate: '0x2222222222222222222222222222222222222222',
      };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.checkDelegate).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(params.delegate)).thenResolve(expectedResult);

      // Real call
      const result = await target.checkDelegate(params);
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.checkDelegate).once();
      verify(mockedMethod.callAsync(params.delegate)).once();
    });
  });

  describe('getAllDelegatesWithPerm', () => {
    test.todo('should fail as module is not an Eth address');
    test('should call to getAllDelegatesWithPerm', async () => {
      // Address expected
      const expectedResult = ['string1', 'string2'];
      const params = {
        module: '0x2222222222222222222222222222222222222222',
        perm: 'Perm1',
      };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getAllDelegatesWithPerm).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(params.module, stringToBytes32(params.perm))).thenResolve(expectedResult);

      // Real call
      const result = await target.getAllDelegatesWithPerm(params);
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getAllDelegatesWithPerm).once();
      verify(mockedMethod.callAsync(params.module, stringToBytes32(params.perm))).once();
    });
  });

  describe('getAllDelegates', () => {
    test('should call to getAllDelegates', async () => {
      // Address expected
      const expectedResult = ['string1', 'string2'];
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getAllDelegates).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getAllDelegates();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getAllDelegates).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('getAllModulesAndPermsFromTypes', () => {
    test.todo('should fail as delegate is not an Eth address');
    test('should call to getAllModulesAndPermsFromTypes', async () => {
      // Address expected
      const modules = [
        '0x1111111111111111111111111111111111111111',
        '0x2222222222222222222222222222222222222222',
        '0x3333333333333333333333333333333333333333',
      ];
      const perms = stringArrayToBytes32Array(['Perm1', 'Perm2', 'Perm3']);
      const expectedResult = [modules, perms];
      const params = {
        delegate: '0x2222222222222222222222222222222222222222',
        types: [1],
      };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getAllModulesAndPermsFromTypes).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(params.delegate, params.types)).thenResolve(expectedResult);

      // Real call
      const result = await target.getAllModulesAndPermsFromTypes(params);
      // Result expectation
      expect(result.length).toBe(3);
      expect(result[0].module).toEqual(modules[0]);
      expect(result[0].permissions).toEqual([bytes32ArrayToStringArray(perms)[0]]);
      // Verifications
      verify(mockedContract.getAllModulesAndPermsFromTypes).once();
      verify(mockedMethod.callAsync(params.delegate, params.types)).once();
    });
  });

  describe('addDelegate', () => {
    test.todo('should fail as delegate is not an Eth address');
    test.todo('should fail as delegate is not a zero Eth address');
    test.todo('should fail as details is zero lenght');
    test('should send the transaction to addDelegate', async () => {
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
        delegate: '0x1111111111111111111111111111111111111111',
        details: 'details',
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.addDelegate).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.delegate,
          stringToBytes32(mockedParams.details),
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
      when(mockedDelegateMethod.callAsync(mockedParams.delegate)).thenResolve(expectedDelegateResult);

      // Real call
      const result = await target.addDelegate(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.addDelegate).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.delegate,
          stringToBytes32(mockedParams.details),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedContract.checkDelegate).once();
      verify(mockedDelegateMethod.callAsync(mockedParams.delegate)).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
    });
  });

  describe('deleteDelegate', () => {
    test.todo('should fail as delegate is not an Eth address');
    test.todo('should fail as delegate is not a zero Eth address');
    test('should send the transaction to addDelegate', async () => {
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
        delegate: '0x1111111111111111111111111111111111111111',
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.deleteDelegate).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(mockedParams.delegate, mockedParams.txData, mockedParams.safetyFactor),
      ).thenResolve(expectedResult);

      // checkDelegate
      const expectedDelegateResult = true;
      // Mocked method
      const mockedDelegateMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.checkDelegate).thenReturn(instance(mockedDelegateMethod));
      // Stub the request
      when(mockedDelegateMethod.callAsync(mockedParams.delegate)).thenResolve(expectedDelegateResult);

      // Real call
      const result = await target.deleteDelegate(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.deleteDelegate).once();
      verify(
        mockedMethod.sendTransactionAsync(mockedParams.delegate, mockedParams.txData, mockedParams.safetyFactor),
      ).once();
      verify(mockedContract.checkDelegate).once();
      verify(mockedDelegateMethod.callAsync(mockedParams.delegate)).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
    });
  });

  describe('changePermission', () => {
    test.todo('should fail as delegate is not an Eth address');
    test.todo('should fail as delegate is not a zero Eth address');
    test.todo('should fail as module is not an Eth address');
    test('should send the transaction to changePermission', async () => {
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
        delegate: '0x1111111111111111111111111111111111111111',
        module: '0x1111111111111111111111111111111111111111',
        perm: 'string',
        valid: false,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.changePermission).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.delegate,
          mockedParams.module,
          stringToBytes32(mockedParams.perm),
          mockedParams.valid,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.changePermission(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.changePermission).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.delegate,
          mockedParams.module,
          stringToBytes32(mockedParams.perm),
          mockedParams.valid,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
    });
  });

  /* describe('changePermissionMulti', () => {
    test.todo('should fail as delegate is not an Eth address');
    test.todo('should fail as delegate is not a zero Eth address');
    test.todo('should fail as module is not an Eth address');
    test.todo('should fail as modules is zero lenght');
    test.todo('should fail as modules lenght is not equals to perms lenght');
    test.todo('should fail as valids lenght is not equals to perms lenght');
    test('should send the transaction to changePermissionMulti', async () => {
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
      const mockedPerms = ['string', 'string2'];
      const mockedParams = {
        delegate: '0x1111111111111111111111111111111111111111',
        modules: ['0x1111111111111111111111111111111111111111', '0x2222222222222222222222222222222222222222'],
        perms: mockedPerms,
        valids: [true, true],
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.changePermissionMulti).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.delegate,
          mockedParams.modules,
          stringArrayToBytes32Array(mockedParams.perms),
          mockedParams.valids,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.changePermissionMulti(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.changePermissionMulti).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.delegate,
          mockedParams.modules,
          stringArrayToBytes32Array(mockedParams.perms),
          mockedParams.valids,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
    });
  }); */

  describe('SubscribeAsync', () => {
    test('should throw as eventName does not belong to GeneralPermissionManagerEvents', async () => {
      // Mocked parameters
      const mockedParams = {
        eventName: PolyTokenEvents.Transfer,
        indexFilterValues: {},
        callback: () => {},
        isVerbose: false,
      };

      // Real call
      await expect(target.subscribeAsync(mockedParams)).rejects.toEqual(
        new Error(`Expected eventName to be one of: 'ChangePermission', 'AddDelegate', encountered: Transfer`),
      );
    });
  });
});

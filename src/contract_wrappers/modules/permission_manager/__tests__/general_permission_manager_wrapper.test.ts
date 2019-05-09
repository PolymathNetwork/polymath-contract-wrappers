// GeneralPermissionManagerWrapper test
import { instance, mock, reset, verify, when, objectContaining } from 'ts-mockito';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { BigNumber } from '@0x/utils';
import {
  GeneralPermissionManagerContract,
  PolyTokenEvents,
  FeatureRegistryContract,
  ModuleFactoryContract,
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

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(GeneralPermissionManagerContract);
    mockedContractFactory = mock(ContractFactory);

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
});

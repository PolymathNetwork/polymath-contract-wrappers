// ModuleRegistryWrapper test
import { instance, mock, reset, verify, when } from 'ts-mockito';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { BigNumber } from '@0x/utils';
import {
  ModuleRegistryContract,
  PolyTokenEvents,
  FeatureRegistryContract,
  ModuleFactoryContract,
} from '@polymathnetwork/abi-wrappers';
import { Features, ModuleType } from '../../../types';
import ContractWrapper from '../../contract_wrapper';
import ModuleRegistryWrapper from '../module_registry_wrapper';
import ContractFactory from '../../../factories/contractFactory';
import {
  stringToBytes32,
  stringArrayToBytes32Array,
  bytes32ArrayToStringArray,
  bytes32ToString,
} from '../../../utils/convert';
import {MockedCallMethod, MockedSendMethod, getMockedPolyResponse} from '../../../test_utils/mocked_methods';

describe('ModuleRegistryWrapper', () => {
  let target: ModuleRegistryWrapper;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: ModuleRegistryContract;
  let mockedContractFactory: ContractFactory;
  let mockedModuleFactoryContract: ModuleFactoryContract;
  let mockedFeatureRegistryContract: FeatureRegistryContract;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(ModuleRegistryContract);
    mockedContractFactory = mock(ContractFactory);
    mockedModuleFactoryContract = mock(ModuleFactoryContract);
    mockedFeatureRegistryContract = mock(FeatureRegistryContract);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new ModuleRegistryWrapper(instance(mockedWrapper), myContractPromise, instance(mockedContractFactory));
  });

  afterEach(() => {
    reset(mockedWrapper);
    reset(mockedContract);
    reset(mockedContractFactory);
    reset(mockedModuleFactoryContract);
    reset(mockedFeatureRegistryContract);
  });

  describe('Types', () => {
    test('should extend ContractWrapper', async () => {
      expect(target instanceof ContractWrapper).toBe(true);
    });
  });

  describe('RegisterModule', () => {
    test.todo('should fail as moduleFactory is not an Eth address');

    test('should successfully call to registerModule', async () => {
      // Owner Address expected
      const expectedOwnerResult = '0x0123456789012345678901234567890123456789';

      // Setup mocked getfeature registry contract
      when(mockedContractFactory.getFeatureRegistryContract()).thenResolve(instance(mockedFeatureRegistryContract));
      const mockedGetFeatureStatusMethod = mock(MockedCallMethod);
      const currentFeatureStatus = true;
      when(mockedFeatureRegistryContract.getFeatureStatus).thenReturn(instance(mockedGetFeatureStatusMethod));
      when(mockedGetFeatureStatusMethod.callAsync(Features.CustomModulesAllowed)).thenResolve(currentFeatureStatus);

      // Setup mocked owner from module factory contract
      const moduleFactoryAddress = '0x3333333333333333333333333333333333333333';
      when(mockedContractFactory.getModuleFactoryContract(moduleFactoryAddress)).thenResolve(
        instance(mockedModuleFactoryContract),
      );
      const mockedModuleFactoryOwnerMethod = mock(MockedCallMethod);
      when(mockedModuleFactoryOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedModuleFactoryContract.owner).thenReturn(instance(mockedModuleFactoryOwnerMethod));

      // Stub the get types
      const mockedGetTypesMethod = mock(MockedCallMethod);
      const types = [new BigNumber(1), new BigNumber(2)];
      when(mockedModuleFactoryContract.getTypes).thenReturn(instance(mockedGetTypesMethod));
      when(mockedGetTypesMethod.callAsync()).thenResolve(types);

      // Mock contract paused
      const expectedPausedResult = false;
      const mockedPausedMethod = mock(MockedCallMethod);
      when(mockedContract.isPaused).thenReturn(instance(mockedPausedMethod));
      when(mockedPausedMethod.callAsync()).thenResolve(expectedPausedResult);

      // Mock contract Owner
      const mockedContractOwnerMethod = mock(MockedCallMethod);
      when(mockedContractOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedContract.owner).thenReturn(instance(mockedContractOwnerMethod));

      // Mock web3 wrapper
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // Module not already registered
      const mockedGetModulesMethod = mock(MockedCallMethod);
      when(mockedContract.getModulesByType).thenReturn(instance(mockedGetModulesMethod));
      const allModulesTypes = [
        ModuleType.PermissionManager,
        ModuleType.STO,
        ModuleType.Burn,
        ModuleType.Dividends,
        ModuleType.TransferManager,
      ];
      const expectedAlreadyRegisteredResult = [
        '0x1111111111111111111111111111111111111111',
        '0x2222222222222222222222222222222222222222',
      ];

      allModulesTypes.map(async type => {
        when(mockedGetModulesMethod.callAsync(type)).thenResolve(expectedAlreadyRegisteredResult);
      });

      // Mocked parameters
      const mockedParams = {
        moduleFactory: '0x3333333333333333333333333333333333333333',
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      const mockedMethod = mock(MockedSendMethod);
      when(mockedContract.registerModule).thenReturn(instance(mockedMethod));
      when(
        mockedMethod.sendTransactionAsync(mockedParams.moduleFactory, mockedParams.txData, mockedParams.safetyFactor),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.registerModule(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.registerModule).once();
      verify(
        mockedMethod.sendTransactionAsync(mockedParams.moduleFactory, mockedParams.txData, mockedParams.safetyFactor),
      ).once();
      verify(mockedContract.getModulesByType).times(5);
      allModulesTypes.map(async type => {
        verify(mockedGetModulesMethod.callAsync(type)).once();
      });
      verify(mockedContractFactory.getFeatureRegistryContract()).once();
      verify(mockedContractFactory.getModuleFactoryContract(moduleFactoryAddress)).twice();
      verify(mockedModuleFactoryOwnerMethod.callAsync()).once();
      verify(mockedModuleFactoryContract.owner).once();
      verify(mockedModuleFactoryContract.getTypes).once();
      verify(mockedGetTypesMethod.callAsync()).once();
      verify(mockedFeatureRegistryContract.getFeatureStatus).once();
      verify(mockedGetFeatureStatusMethod.callAsync(Features.CustomModulesAllowed)).once();
      verify(mockedContractOwnerMethod.callAsync()).once();
      verify(mockedContract.owner).once();
      verify(mockedContract.isPaused).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedPausedMethod.callAsync()).once();
    });
  });

  describe('RemoveModule', () => {
    test.todo('should fail as moduleFactory is not an Eth address');

    test('should successfully call to removeModule', async () => {
      // Owner Address expected
      const expectedOwnerResult = '0x0123456789012345678901234567890123456789';

      // Setup mocked owner from module factory contract
      const moduleFactoryAddress = '0x2222222222222222222222222222222222222222';
      when(mockedContractFactory.getModuleFactoryContract(moduleFactoryAddress)).thenResolve(
        instance(mockedModuleFactoryContract),
      );
      const mockedModuleFactoryOwnerMethod = mock(MockedCallMethod);
      when(mockedModuleFactoryOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedModuleFactoryContract.owner).thenReturn(instance(mockedModuleFactoryOwnerMethod));

      // Pause Result expected
      const expectedPausedResult = false;
      const mockedPausedMethod = mock(MockedCallMethod);
      when(mockedContract.isPaused).thenReturn(instance(mockedPausedMethod));
      when(mockedPausedMethod.callAsync()).thenResolve(expectedPausedResult);

      // Mock contract Owner
      const mockedContractOwnerMethod = mock(MockedCallMethod);
      when(mockedContractOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedContract.owner).thenReturn(instance(mockedContractOwnerMethod));

      // Mock web3 wrapper
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // Module already registered
      const mockedGetModulesMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getModulesByType).thenReturn(instance(mockedGetModulesMethod));
      const allModulesTypes = [
        ModuleType.PermissionManager,
        ModuleType.STO,
        ModuleType.Burn,
        ModuleType.Dividends,
        ModuleType.TransferManager,
      ];
      const expectedAlreadyRegisteredResult = [
        '0x1111111111111111111111111111111111111111',
        '0x2222222222222222222222222222222222222222',
      ];

      allModulesTypes.map(async type => {
        // Stub the request
        when(mockedGetModulesMethod.callAsync(type)).thenResolve(expectedAlreadyRegisteredResult);
      });

      // Mocked parameters
      const mockedParams = {
        moduleFactory: '0x2222222222222222222222222222222222222222',
        txData: {},
        safetyFactor: 10,
      };

      const expectedResult = getMockedPolyResponse();
      const mockedMethod = mock(MockedSendMethod);
      when(mockedContract.removeModule).thenReturn(instance(mockedMethod));
      when(
        mockedMethod.sendTransactionAsync(mockedParams.moduleFactory, mockedParams.txData, mockedParams.safetyFactor),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.removeModule(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContractFactory.getModuleFactoryContract(moduleFactoryAddress)).once();
      verify(mockedModuleFactoryOwnerMethod.callAsync()).once();
      verify(mockedContract.owner).once();
      verify(mockedModuleFactoryContract.owner).once();
      verify(mockedContract.removeModule).once();
      verify(
        mockedMethod.sendTransactionAsync(mockedParams.moduleFactory, mockedParams.txData, mockedParams.safetyFactor),
      ).once();
      verify(mockedContract.getModulesByType).times(5);
      allModulesTypes.map(async type => {
        verify(mockedGetModulesMethod.callAsync(type)).once();
      });
      verify(mockedContract.isPaused).once();
      verify(mockedPausedMethod.callAsync()).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('VerifyModule', () => {
    test.todo('should fail as moduleFactory is not an Eth address');

    test('should successfully call to verifyModule', async () => {
      // Pause Result expected
      const expectedPausedResult = false;
      // Mocked method
      const mockedPausedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.isPaused).thenReturn(instance(mockedPausedMethod));
      // Stub the request
      when(mockedPausedMethod.callAsync()).thenResolve(expectedPausedResult);

      // Owner Address expected
      const expectedOwnerResult = '0x0123456789012345678901234567890123456789';
      // Mocked method
      const mockedOwnerMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.owner).thenReturn(instance(mockedOwnerMethod));
      // Stub the request
      when(mockedOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);

      // Mock web3 wrapper
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // Module not already registered - the new Module factory is at '0x0123456789012345678901234567890123456789'
      const mockedGetModulesMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getModulesByType).thenReturn(instance(mockedGetModulesMethod));
      const allModulesTypes = [
        ModuleType.PermissionManager,
        ModuleType.STO,
        ModuleType.Burn,
        ModuleType.Dividends,
        ModuleType.TransferManager,
      ];
      const expectedAlreadyRegisteredResult = [
        '0x1111111111111111111111111111111111111111',
        '0x2222222222222222222222222222222222222222',
      ];

      allModulesTypes.map(async type => {
        // Stub the request
        when(mockedGetModulesMethod.callAsync(type)).thenResolve(expectedAlreadyRegisteredResult);
      });

      // Mocked parameters
      const mockedParams = {
        moduleFactory: '0x2222222222222222222222222222222222222222',
        verified: true,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.verifyModule).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.moduleFactory,
          mockedParams.verified,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.verifyModule(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.verifyModule).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.moduleFactory,
          mockedParams.verified,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedContract.getModulesByType).times(5);
      verify(mockedContract.owner).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('GetTagsByTypeAndToken', () => {
    test.todo('should fail as securityToken is not an Eth address');

    test('should call to getTagsByTypeAndToken (single module, multiple tags)', async () => {
      // Address expected
      const moduleAddress1 = '0x1111111111111111111111111111111111111111';
      const tags = stringArrayToBytes32Array(['Tag1', 'Tag2', 'Tag3']);
      const modules = [moduleAddress1, moduleAddress1, moduleAddress1];
      const expectedResult = [tags, modules];
      const securityTokenAddress = '0x0123456789012345678901234567890123456789';
      const params = { moduleType: ModuleType.PermissionManager, securityToken: securityTokenAddress };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getTagsByTypeAndToken).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(params.moduleType, params.securityToken)).thenResolve(expectedResult);

      // Real call
      const result = await target.getTagsByTypeAndToken(params);
      // Result expectation
      expect(result.length).toBe(1);
      expect(result[0].module).toEqual(moduleAddress1);
      expect(result[0].tags).toEqual(bytes32ArrayToStringArray(tags));
      // Verifications
      verify(mockedContract.getTagsByTypeAndToken).once();
      verify(mockedMethod.callAsync(params.moduleType, params.securityToken)).once();
    });

    test('should call to getTagsByTypeAndToken (multiple module, single tag)', async () => {
      // Address expected
      const moduleAddress1 = '0x1111111111111111111111111111111111111111';
      const moduleAddress2 = '0x2222222222222222222222222222222222222222';
      const moduleAddress3 = '0x3333333333333333333333333333333333333333';
      const tag1 = stringToBytes32('Tag1');
      const tags = [tag1, tag1, tag1];
      const modules = [moduleAddress1, moduleAddress2, moduleAddress3];
      const expectedResult = [tags, modules];
      const securityTokenAddress = '0x0123456789012345678901234567890123456789';
      const params = { moduleType: ModuleType.PermissionManager, securityToken: securityTokenAddress };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getTagsByTypeAndToken).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(ModuleType.PermissionManager, securityTokenAddress)).thenResolve(expectedResult);

      // Real call
      const result = await target.getTagsByTypeAndToken(params);
      // Result expectation
      expect(result.length).toBe(3);
      expect(result[0].module).toEqual(moduleAddress1);
      expect(result[0].tags.length).toBe(1);
      expect(result[0].tags[0]).toEqual(bytes32ToString(tag1));
      expect(result[1].module).toEqual(moduleAddress2);
      expect(result[1].tags.length).toBe(1);
      expect(result[1].tags[0]).toEqual(bytes32ToString(tag1));
      expect(result[2].module).toEqual(moduleAddress3);
      expect(result[2].tags.length).toBe(1);
      expect(result[2].tags[0]).toEqual(bytes32ToString(tag1));
      // Verifications
      verify(mockedContract.getTagsByTypeAndToken).once();
      verify(mockedMethod.callAsync(ModuleType.PermissionManager, securityTokenAddress)).once();
    });

    test('should call to getTagsByTypeAndToken (multiple module, multiple tags)', async () => {
      // Address expected
      const moduleAddress1 = '0x1111111111111111111111111111111111111111';
      const moduleAddress2 = '0x2222222222222222222222222222222222222222';
      const moduleAddress3 = '0x3333333333333333333333333333333333333333';
      const tag1 = stringToBytes32('Tag1');
      const tag2 = stringToBytes32('Tag2');
      const tag3 = stringToBytes32('Tag3');
      const tags = [tag1, tag3, tag2, tag3, tag2];
      const modules = [moduleAddress1, moduleAddress1, moduleAddress2, moduleAddress2, moduleAddress3];
      const expectedResult = [tags, modules];
      const securityTokenAddress = '0x0123456789012345678901234567890123456789';
      const params = { moduleType: ModuleType.PermissionManager, securityToken: securityTokenAddress };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getTagsByTypeAndToken).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(ModuleType.PermissionManager, securityTokenAddress)).thenResolve(expectedResult);

      // Real call
      const result = await target.getTagsByTypeAndToken(params);
      // Result expectation
      expect(result.length).toBe(3);
      expect(result[0].module).toEqual(moduleAddress1);
      expect(result[0].tags.length).toBe(2);
      expect(result[0].tags[0]).toEqual(bytes32ToString(tag1));
      expect(result[0].tags[1]).toEqual(bytes32ToString(tag3));
      expect(result[1].module).toEqual(moduleAddress2);
      expect(result[1].tags.length).toBe(2);
      expect(result[1].tags[0]).toEqual(bytes32ToString(tag2));
      expect(result[1].tags[1]).toEqual(bytes32ToString(tag3));
      expect(result[2].module).toEqual(moduleAddress3);
      expect(result[2].tags.length).toBe(1);
      expect(result[2].tags[0]).toEqual(bytes32ToString(tag2));
      // Verifications
      verify(mockedContract.getTagsByTypeAndToken).once();
      verify(mockedMethod.callAsync(ModuleType.PermissionManager, securityTokenAddress)).once();
    });
  });

  describe('GetTagsByType', () => {
    test('should call to getTagsByType (single module, multiple tags)', async () => {
      // Address expected
      const moduleAddress1 = '0x1111111111111111111111111111111111111111';
      const tags = stringArrayToBytes32Array(['Tag1', 'Tag2', 'Tag3']);
      const modules = [moduleAddress1, moduleAddress1, moduleAddress1];
      const expectedResult = [tags, modules];
      const params = { moduleType: ModuleType.Burn };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getTagsByType).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(params.moduleType)).thenResolve(expectedResult);

      // Real call
      const result = await target.getTagsByType(params);
      // Result expectation
      expect(result.length).toBe(1);
      expect(result[0].module).toEqual(moduleAddress1);
      expect(result[0].tags).toEqual(bytes32ArrayToStringArray(tags));
      // Verifications
      verify(mockedContract.getTagsByType).once();
      verify(mockedMethod.callAsync(params.moduleType)).once();
    });

    test('should call to getTagsByType (multiple module, single tag)', async () => {
      // Address expected
      const moduleAddress1 = '0x1111111111111111111111111111111111111111';
      const moduleAddress2 = '0x2222222222222222222222222222222222222222';
      const moduleAddress3 = '0x3333333333333333333333333333333333333333';
      const tag1 = stringToBytes32('Tag1');
      const tags = [tag1, tag1, tag1];
      const modules = [moduleAddress1, moduleAddress2, moduleAddress3];
      const expectedResult = [tags, modules];
      const params = { moduleType: ModuleType.STO };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getTagsByType).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(params.moduleType)).thenResolve(expectedResult);

      // Real call
      const result = await target.getTagsByType(params);
      // Result expectation
      expect(result.length).toBe(3);
      expect(result[0].module).toEqual(moduleAddress1);
      expect(result[0].tags.length).toBe(1);
      expect(result[0].tags[0]).toEqual(bytes32ToString(tag1));
      expect(result[1].module).toEqual(moduleAddress2);
      expect(result[1].tags.length).toBe(1);
      expect(result[1].tags[0]).toEqual(bytes32ToString(tag1));
      expect(result[2].module).toEqual(moduleAddress3);
      expect(result[2].tags.length).toBe(1);
      expect(result[2].tags[0]).toEqual(bytes32ToString(tag1));
      // Verifications
      verify(mockedContract.getTagsByType).once();
      verify(mockedMethod.callAsync(params.moduleType)).once();
    });

    test('should call to getTagsByType (multiple module, multiple tags)', async () => {
      // Address expected
      const moduleAddress1 = '0x1111111111111111111111111111111111111111';
      const moduleAddress2 = '0x2222222222222222222222222222222222222222';
      const moduleAddress3 = '0x3333333333333333333333333333333333333333';
      const tag1 = stringToBytes32('Tag1');
      const tag2 = stringToBytes32('Tag2');
      const tag3 = stringToBytes32('Tag3');
      const tags = [tag1, tag3, tag2, tag3, tag2];
      const modules = [moduleAddress1, moduleAddress1, moduleAddress2, moduleAddress2, moduleAddress3];
      const expectedResult = [tags, modules];
      const params = { moduleType: ModuleType.Dividends };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getTagsByType).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(params.moduleType)).thenResolve(expectedResult);

      // Real call
      const result = await target.getTagsByType(params);
      // Result expectation
      expect(result.length).toBe(3);
      expect(result[0].module).toEqual(moduleAddress1);
      expect(result[0].tags.length).toBe(2);
      expect(result[0].tags[0]).toEqual(bytes32ToString(tag1));
      expect(result[0].tags[1]).toEqual(bytes32ToString(tag3));
      expect(result[1].module).toEqual(moduleAddress2);
      expect(result[1].tags.length).toBe(2);
      expect(result[1].tags[0]).toEqual(bytes32ToString(tag2));
      expect(result[1].tags[1]).toEqual(bytes32ToString(tag3));
      expect(result[2].module).toEqual(moduleAddress3);
      expect(result[2].tags.length).toBe(1);
      expect(result[2].tags[0]).toEqual(bytes32ToString(tag2));
      // Verifications
      verify(mockedContract.getTagsByType).once();
      verify(mockedMethod.callAsync(params.moduleType)).once();
    });
  });

  describe('GetReputationByFactory', () => {
    test.todo('should fail as moduleFactory is not an Eth address');

    test('should call to get reputation by factory', async () => {
      // Address expected
      const expectedResult = [
        '0x1111111111111111111111111111111111111111',
        '0x2222222222222222222222222222222222222222',
      ];
      const factory = '0x0123456789012345678901234567890123456789';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getReputationByFactory).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(factory)).thenResolve(expectedResult);

      // Real call
      const result = await target.getReputationByFactory({ moduleFactory: factory });
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getReputationByFactory).once();
      verify(mockedMethod.callAsync(factory)).once();
    });
  });

  describe('GetModulesByType', () => {
    test('should call to getModulesByType', async () => {
      // Address expected
      const expectedResult = [
        '0x1111111111111111111111111111111111111111',
        '0x2222222222222222222222222222222222222222',
      ];
      const params = { moduleType: ModuleType.PermissionManager };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getModulesByType).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(params.moduleType)).thenResolve(expectedResult);

      // Real call
      const result = await target.getModulesByType(params);
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getModulesByType).once();
      verify(mockedMethod.callAsync(params.moduleType)).once();
    });
  });

  describe('GetModulesByTypeAndToken', () => {
    test.todo('should fail as securityToken is not an Eth address');

    test('should call to getModulesByTypeAndToken', async () => {
      // Address expected
      const expectedResult = ['0x0123456789012345678901234567890123456789'];
      const securityToken = '0x0123456789012345678901234567890123456789';
      const params = { moduleType: ModuleType.Dividends, securityToken };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getModulesByTypeAndToken).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(params.moduleType, params.securityToken)).thenResolve(expectedResult);

      // Real call
      const result = await target.getModulesByTypeAndToken(params);
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getModulesByTypeAndToken).once();
      verify(mockedMethod.callAsync(params.moduleType, params.securityToken)).once();
    });
  });

  describe('ReclaimERC20', () => {
    test.todo('should fail as tokenContract is not an Eth address');

    test('should call to reclaim ERC20 tokens', async () => {
      // Owner Address expected
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
      // Mocked method
      const mockedOwnerMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.owner).thenReturn(instance(mockedOwnerMethod));
      // Stub the request
      when(mockedOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const tokenContract = '0x0123456789012345678901234567890123456789';
      const mockedParams = {
        tokenContract,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.reclaimERC20).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(mockedParams.tokenContract, mockedParams.txData, mockedParams.safetyFactor),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.reclaimERC20(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.reclaimERC20).once();
      verify(
        mockedMethod.sendTransactionAsync(mockedParams.tokenContract, mockedParams.txData, mockedParams.safetyFactor),
      ).once();
      verify(mockedContract.owner).once();
      verify(mockedOwnerMethod.callAsync()).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('Pause/Unpause', () => {
    test('should call to pause', async () => {
      // Pause Result expected
      const expectedPauseResult = false;
      // Mocked method
      const mockedPauseMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.isPaused).thenReturn(instance(mockedPauseMethod));
      // Stub the request
      when(mockedPauseMethod.callAsync()).thenResolve(expectedPauseResult);

      // Owner Address expected
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
      // Mocked method
      const mockedOwnerMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.owner).thenReturn(instance(mockedOwnerMethod));
      // Stub the request
      when(mockedOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);
      const mockedParams = {
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.pause).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.sendTransactionAsync(mockedParams.txData, mockedParams.safetyFactor)).thenResolve(
        expectedResult,
      );

      // Real call
      const result = await target.pause(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.pause).once();
      verify(mockedMethod.sendTransactionAsync(mockedParams.txData, mockedParams.safetyFactor)).once();

      verify(mockedContract.owner).once();
      verify(mockedOwnerMethod.callAsync()).once();
      verify(mockedContract.isPaused).once();
      verify(mockedPauseMethod.callAsync()).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });

    test('should call to unpause', async () => {
      // Pause Result expected
      const expectedPauseResult = true;
      // Mocked method
      const mockedPauseMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.isPaused).thenReturn(instance(mockedPauseMethod));
      // Stub the request
      when(mockedPauseMethod.callAsync()).thenResolve(expectedPauseResult);

      // Owner Address expected
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
      // Mocked method
      const mockedOwnerMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.owner).thenReturn(instance(mockedOwnerMethod));
      // Stub the request
      when(mockedOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);
      const mockedParams = {
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.unpause).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.sendTransactionAsync(mockedParams.txData, mockedParams.safetyFactor)).thenResolve(
        expectedResult,
      );

      // Real call
      const result = await target.unpause(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.unpause).once();
      verify(mockedMethod.sendTransactionAsync(mockedParams.txData, mockedParams.safetyFactor)).once();

      verify(mockedContract.owner).once();
      verify(mockedOwnerMethod.callAsync()).once();
      verify(mockedContract.isPaused).once();
      verify(mockedPauseMethod.callAsync()).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });

    test('should call to isPaused', async () => {
      // Result expected
      const expectedResult = false;
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.isPaused).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.isPaused();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.isPaused).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('UpdateFromRegistry', () => {
    test('should call to updateFromRegistry', async () => {
      // Owner Address expected
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
      // Mocked method
      const mockedOwnerMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.owner).thenReturn(instance(mockedOwnerMethod));
      // Stub the request
      when(mockedOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);
      const mockedParams = {
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.updateFromRegistry).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.sendTransactionAsync(mockedParams.txData, mockedParams.safetyFactor)).thenResolve(
        expectedResult,
      );

      // Real call
      const result = await target.updateFromRegistry(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.updateFromRegistry).once();
      verify(mockedMethod.sendTransactionAsync(mockedParams.txData, mockedParams.safetyFactor)).once();

      verify(mockedContract.owner).once();
      verify(mockedOwnerMethod.callAsync()).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('Ownership', () => {
    test.todo('should fail as newOwner is not an Eth address');

    test('should call to transfer ownership', async () => {
      // Owner Address expected
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
      // Mocked method
      const mockedOwnerMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.owner).thenReturn(instance(mockedOwnerMethod));
      // Stub the request
      when(mockedOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);
      const newOwner = '0x0123456789012345678901234567890123456789';
      const mockedParams = {
        newOwner,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.transferOwnership).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.sendTransactionAsync(newOwner, mockedParams.txData, mockedParams.safetyFactor)).thenResolve(
        expectedResult,
      );

      // Real call
      const result = await target.transferOwnership(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.transferOwnership).once();
      verify(mockedMethod.sendTransactionAsync(newOwner, mockedParams.txData, mockedParams.safetyFactor)).once();

      verify(mockedContract.owner).once();
      verify(mockedOwnerMethod.callAsync()).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });

    test('should call owner', async () => {
      // Owner Address expected
      const expectedOwnerResult = '0x0123456789012345678901234567890123456789';
      // Mocked method
      const mockedOwnerMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.owner).thenReturn(instance(mockedOwnerMethod));
      // Stub the request
      when(mockedOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);

      // Real call
      const result = await target.owner();
      // Result expectation
      expect(result).toBe(expectedOwnerResult);
      // Verifications
      verify(mockedContract.owner).once();
      verify(mockedOwnerMethod.callAsync()).once();
    });
  });

  describe('SubscribeAsync', () => {
    test('should throw as eventName does not belong to FeatureRegistryEvents', async () => {
      // Mocked parameters
      const mockedParams = {
        eventName: PolyTokenEvents.Transfer,
        indexFilterValues: {},
        callback: () => {},
        isVerbose: false,
      };

      // Real call
      await expect(target.subscribeAsync(mockedParams)).rejects.toEqual(
        new Error(
          `Expected eventName to be one of: 'Pause', 'Unpause', 'ModuleUsed', 'ModuleRegistered', 'ModuleVerified', 'ModuleRemoved', 'OwnershipTransferred', encountered: Transfer`,
        ),
      );
    });
  });
});

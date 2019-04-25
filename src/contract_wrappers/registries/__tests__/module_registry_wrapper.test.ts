// PolymathRegistryWrapper test
import { instance, mock, reset, verify, when } from 'ts-mockito';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ModuleRegistryContract, PolyTokenEvents } from '@polymathnetwork/abi-wrappers';
import { MockedCallMethod, MockedSendMethod, getMockedPolyResponse } from '../../../../test_utils/mocked_methods';
import { ModuleType } from '../../../types';
import ContractWrapper from '../../contract_wrapper';
import ModuleRegistryWrapper from '../module_registry_wrapper';
import {
  stringToBytes32,
  stringArrayToBytes32Array,
  bytes32ArrayToStringArray,
  bytes32ToString,
} from '../../../utils/convert';

interface TagsByModule {
  module: string;
  tags: string[];
}

describe('ModuleRegistryWrapper', () => {
  // Declare PolyMathRegistryWrapper object
  let target: ModuleRegistryWrapper;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: ModuleRegistryContract;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(ModuleRegistryContract);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new ModuleRegistryWrapper(instance(mockedWrapper), myContractPromise);
  });

  afterEach(() => {
    reset(mockedWrapper);
    reset(mockedContract);
  });

  describe('Types', () => {
    test('should extend ContractWrapper', async () => {
      expect(target instanceof ContractWrapper).toBe(true);
    });
  });

  describe('RegisterModule', () => {
    test.todo('should fail as moduleFactory is not an Eth address');

    test('should successfully call to registerModule', async () => {
      // Mocked parameters
      const mockedParams = {
        moduleFactory: '0x0123456789012345678901234567890123456789',
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.registerModule).thenReturn(instance(mockedMethod));
      // Stub the request
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
    });
  });

  describe('RemoveModule', () => {
    test.todo('should fail as moduleFactory is not an Eth address');

    test('should successfully call to removeModule', async () => {
      // Mocked parameters
      const mockedParams = {
        moduleFactory: '0x0123456789012345678901234567890123456789',
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.removeModule).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(mockedParams.moduleFactory, mockedParams.txData, mockedParams.safetyFactor),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.removeModule(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.removeModule).once();
      verify(
        mockedMethod.sendTransactionAsync(mockedParams.moduleFactory, mockedParams.txData, mockedParams.safetyFactor),
      ).once();
    });
  });

  describe('VerifyModule', () => {
    test.todo('should fail as moduleFactory is not an Eth address');

    test('should successfully call to verifyModule', async () => {
      // Mocked parameters
      const mockedParams = {
        moduleFactory: '0x0123456789012345678901234567890123456789',
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
    });
  });

  describe('Pause/Unpause', () => {
    test('should call to pause', async () => {
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
    });

    test('should call to unpause', async () => {
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
    });

    test('should call to isPaused', async () => {
      // Address expected
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
    });
  });

  describe('Ownership', () => {
    test.todo('should fail as newOwner is not an Eth address');

    test('should call to transfer ownership', async () => {
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
    });

    test('should call owner', async () => {
      // Address expected
      const expectedResult = '0x0123456789012345678901234567890123456789';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.owner).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.owner();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.owner).once();
      verify(mockedMethod.callAsync()).once();
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

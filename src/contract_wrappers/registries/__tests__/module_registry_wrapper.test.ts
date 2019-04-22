// PolymathRegistryWrapper test
import { instance, mock, reset, verify, when } from 'ts-mockito';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ModuleRegistryContract, PolyTokenEvents } from '@polymathnetwork/abi-wrappers';
import { MockedCallMethod, MockedSendMethod } from '../../../../test_utils/mocked_methods';
import { ModuleType } from '../../../types';
import ContractWrapper from '../../contract_wrapper';
import ModuleRegistryWrapper from '../module_registry_wrapper';
import { stringToBytes32 } from '../../../utils/convert';

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

  test.todo('should test Eternal Storage methods');

  describe('Types', () => {
    test('should extend ContractWrapper', async () => {
      expect(target instanceof ContractWrapper).toBe(true);
    });
  });

  describe('Initialize', () => {
    test('should call to initialize the module registry', async () => {
      // Mocked parameters
      const mockedParams = {
        polymathRegistry: '0x0123456789012345678901234567890123456789',
        owner: '0x0123456789012345678901234567890123456789',
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = Promise.resolve;
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.initialize).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.polymathRegistry,
          mockedParams.owner,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.initialize(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.initialize).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.polymathRegistry,
          mockedParams.owner,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
    });
  });

  describe('Modules', () => {
    test('should call to use a module', async () => {
      // Mocked parameters
      const mockedParams = {
        moduleFactory: '0x0123456789012345678901234567890123456789',
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = Promise.resolve;
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.useModule).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(mockedParams.moduleFactory, mockedParams.txData, mockedParams.safetyFactor),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.useModule(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.useModule).once();
      verify(
        mockedMethod.sendTransactionAsync(mockedParams.moduleFactory, mockedParams.txData, mockedParams.safetyFactor),
      ).once();
    });

    test('should call to register a module', async () => {
      // Mocked parameters
      const mockedParams = {
        moduleFactory: '0x0123456789012345678901234567890123456789',
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = Promise.resolve;
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

    test('should call to remove a module', async () => {
      // Mocked parameters
      const mockedParams = {
        moduleFactory: '0x0123456789012345678901234567890123456789',
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = Promise.resolve;
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

    test('should call to verify a module', async () => {
      // Mocked parameters
      const mockedParams = {
        moduleFactory: '0x0123456789012345678901234567890123456789',
        verified: true,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = Promise.resolve;
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

  describe('GetTags', () => {
    test('should call to getTagsByTypeAndToken', async () => {
      // Address expected
      const expectedResult = [[stringToBytes32('1')], [stringToBytes32('1')]];
      const expectedReturn = [
        {
          module: '0x3100000000000000000000000000000000000000000000000000000000000000',
          tags: [
            '1\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000',
          ],
        },
      ];
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
      expect(result).toEqual(expectedReturn);
      // Verifications
      verify(mockedContract.getTagsByTypeAndToken).once();
      verify(mockedMethod.callAsync(ModuleType.PermissionManager, securityTokenAddress)).once();
    });

    test('should call to getTagsByType', async () => {
      // Address expected
      const expectedResult = [[stringToBytes32('1')], [stringToBytes32('1')]];
      const expectedReturn = [
        {
          module: '0x3100000000000000000000000000000000000000000000000000000000000000',
          tags: [
            '1\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000',
          ],
        },
      ];
      const params = { moduleType: ModuleType.PermissionManager };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getTagsByType).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(ModuleType.PermissionManager)).thenResolve(expectedResult);

      // Real call
      const result = await target.getTagsByType(params);
      // Result expectation
      expect(result).toEqual(expectedReturn);
      // Verifications
      verify(mockedContract.getTagsByType).once();
      verify(mockedMethod.callAsync(ModuleType.PermissionManager)).once();
    });
  });

  describe('GetReputationByFactory', () => {
    test('should call to get reputation by factory', async () => {
      // Address expected
      const expectedResult = ['0x0123456789012345678901234567890123456789'];
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

  describe('GetModules', () => {
    test('should call to get Modules by type', async () => {
      // Address expected
      const expectedResult = ['0x0123456789012345678901234567890123456789'];
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getModulesByType).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(ModuleType.PermissionManager)).thenResolve(expectedResult);

      // Real call
      const result = await target.getModulesByType({ moduleType: ModuleType.PermissionManager });
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getModulesByType).once();
      verify(mockedMethod.callAsync(ModuleType.PermissionManager)).once();
    });

    test('should call to get Modules by type and token', async () => {
      // Address expected
      const expectedResult = ['0x0123456789012345678901234567890123456789'];
      const securityToken = '0x0123456789012345678901234567890123456789';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getModulesByTypeAndToken).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(ModuleType.PermissionManager, securityToken)).thenResolve(expectedResult);

      // Real call
      const result = await target.getModulesByTypeAndToken({
        moduleType: ModuleType.PermissionManager,
        securityToken,
      });
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getModulesByTypeAndToken).once();
      verify(mockedMethod.callAsync(ModuleType.PermissionManager, securityToken)).once();
    });
  });

  describe('ReclaimERC20', () => {
    test('should call to reclaim ERC20 tokens', async () => {
      const tokenContract = '0x0123456789012345678901234567890123456789';
      const mockedParams = {
        tokenContract,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = Promise.resolve;
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

  describe('Pause Unpause', () => {
    test('should call to pause', async () => {
      const mockedParams = {
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = Promise.resolve;
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
      const expectedResult = Promise.resolve;
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

  describe('Update from Registry', () => {
    test('should call to update from registry', async () => {
      const mockedParams = {
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = Promise.resolve;
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
    test('should call to transfer ownership', async () => {
      const newOwner = '0x0123456789012345678901234567890123456789';
      const mockedParams = {
        newOwner,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = Promise.resolve;
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

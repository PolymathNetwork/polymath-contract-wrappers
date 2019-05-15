// SecurityTokenWrapper test
import { instance, mock, reset, verify, when, objectContaining } from 'ts-mockito';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { BigNumber } from '@0x/utils';
import { SecurityTokenContract } from '@polymathnetwork/abi-wrappers';
import ERC20TokenWrapper from '../erc20_wrapper';
import { ModuleType, ModuleName } from '../../../types';
import SecurityTokenWrapper from '../security_token_wrapper';
import ContractFactory from '../../../factories/contractFactory';
import { stringToBytes32, bytes32ToString, numberToBigNumber, dateToBigNumber } from '../../../utils/convert';
import { MockedCallMethod, MockedSendMethod, getMockedPolyResponse } from '../../../test_utils/mocked_methods';

describe('SecurityTokenWrapper', () => {
  // Declare SecurityTokenWrapper object
  let target: SecurityTokenWrapper;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: SecurityTokenContract;
  let mockedContractFactory: ContractFactory;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(SecurityTokenContract);
    mockedContractFactory = mock(ContractFactory);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new SecurityTokenWrapper(instance(mockedWrapper), myContractPromise, instance(mockedContractFactory));
  });

  afterEach(() => {
    reset(mockedWrapper);
    reset(mockedContract);
  });

  describe('Types', () => {
    test('should extend ERC20TokenWrapper', async () => {
      expect(target instanceof ERC20TokenWrapper).toBe(true);
    });
  });

  describe('currentCheckpointId', () => {
    test('should call to currentCheckpointId', async () => {
      const expectedResult = new BigNumber(1);
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.currentCheckpointId).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.currentCheckpointId();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.currentCheckpointId).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('granularity', () => {
    test('should call to granularity', async () => {
      const expectedResult = new BigNumber(1);
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.granularity).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.granularity();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.granularity).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('controller', () => {
    test('should call to controller', async () => {
      const expectedResult = 'string';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.controller).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.controller();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.controller).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('polyToken', () => {
    test('should call to polyToken', async () => {
      const expectedResult = 'string';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.polyToken).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.polyToken();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.polyToken).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('polymathRegistry', () => {
    test('should call to polymathRegistry', async () => {
      const expectedResult = 'string';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.polymathRegistry).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.polymathRegistry();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.polymathRegistry).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('controllerDisabled', () => {
    test('should call to controllerDisabled', async () => {
      const expectedResult = true;
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.controllerDisabled).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.controllerDisabled();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.controllerDisabled).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('owner', () => {
    test('should call to owner', async () => {
      const expectedResult = 'string';
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

  describe('mintingFrozen', () => {
    test('should call to mintingFrozen', async () => {
      const expectedResult = false;
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.mintingFrozen).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.mintingFrozen();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.mintingFrozen).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('moduleRegistry', () => {
    test('should call to moduleRegistry', async () => {
      const expectedResult = 'string';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.moduleRegistry).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.moduleRegistry();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.moduleRegistry).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('featureRegistry', () => {
    test('should call to featureRegistry', async () => {
      const expectedResult = 'string';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.featureRegistry).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.featureRegistry();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.featureRegistry).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('securityTokenRegistry', () => {
    test('should call to securityTokenRegistry', async () => {
      const expectedResult = 'string';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.securityTokenRegistry).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.securityTokenRegistry();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.securityTokenRegistry).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('tokenDetails', () => {
    test('should call to tokenDetails', async () => {
      const expectedResult = 'string';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.tokenDetails).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.tokenDetails();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.tokenDetails).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('transfersFrozen', () => {
    test('should call to transfersFrozen', async () => {
      const expectedResult = true;
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.transfersFrozen).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.transfersFrozen();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.transfersFrozen).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('getModulesByName', () => {
    test('should call to getModulesByName', async () => {
      const expectedResult = true;
      const mockedParams = {
        moduleName: ModuleName.GeneralPermissionManager,
      };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getModulesByName).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(stringToBytes32(mockedParams.moduleName))).thenResolve(expectedResult);

      // Real call
      const result = await target.getModulesByName(mockedParams);
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getModulesByName).once();
      verify(mockedMethod.callAsync(stringToBytes32(mockedParams.moduleName))).once();
    });
  });

  describe('getInvestors', () => {
    test('should call to getInvestors', async () => {
      const expectedResult = ['string', 'string'];
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getInvestors).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getInvestors();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getInvestors).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('getInvestorsAt', () => {
    test('should call to getInvestorsAt', async () => {
      const expectedResult = ['string', 'string'];
      const mockedParams = {
        checkpointId: 1,
      };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getInvestorsAt).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(objectContaining(numberToBigNumber(mockedParams.checkpointId)))).thenResolve(
        expectedResult,
      );

      // Real call
      const result = await target.getInvestorsAt(mockedParams);
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getInvestorsAt).once();
      verify(mockedMethod.callAsync(objectContaining(numberToBigNumber(mockedParams.checkpointId)))).once();
    });
  });

  describe('iterateInvestors', () => {
    test('should call to iterateInvestors', async () => {
      const expectedResult = ['string', 'string'];
      const mockedParams = {
        start: new Date(),
        end: new Date(),
      };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.iterateInvestors).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.callAsync(
          objectContaining(dateToBigNumber(mockedParams.start)),
          objectContaining(dateToBigNumber(mockedParams.end)),
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.iterateInvestors(mockedParams);
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.iterateInvestors).once();
      verify(
        mockedMethod.callAsync(
          objectContaining(dateToBigNumber(mockedParams.start)),
          objectContaining(dateToBigNumber(mockedParams.end)),
        ),
      ).once();
    });
  });

  describe('getInvestorCount', () => {
    test('should call to getInvestorCount', async () => {
      const expectedResult = new BigNumber(0);
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getInvestorCount).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getInvestorCount();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getInvestorCount).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('checkPermission', () => {
    test.todo('should fail as modudelegateAddressle is not an Eth address');
    test.todo('should fail as moduleAddress is not an Eth address');

    test('should call to checkPermission', async () => {
      const expectedResult = true;
      const mockedParams = {
        delegateAddress: '0x1111111111111111111111111111111111111111',
        moduleAddress: '0x1111111111111111111111111111111111111111',
        permission: 'string',
      };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.checkPermission).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.callAsync(
          mockedParams.delegateAddress,
          mockedParams.moduleAddress,
          stringToBytes32(mockedParams.permission),
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.checkPermission(mockedParams);
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.checkPermission).once();
      verify(
        mockedMethod.callAsync(
          mockedParams.delegateAddress,
          mockedParams.moduleAddress,
          stringToBytes32(mockedParams.permission),
        ),
      ).once();
    });
  });

  describe('getCheckpointTimes', () => {
    test('should call to getCheckpointTimes', async () => {
      const expectedResult = new BigNumber(0);
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getCheckpointTimes).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getCheckpointTimes();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getCheckpointTimes).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('totalSupplyAt', () => {
    test('should call to totalSupplyAt', async () => {
      const expectedResult = new BigNumber(1);
      const mockedParams = {
        checkpointId: 1,
      };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.totalSupplyAt).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(objectContaining(numberToBigNumber(mockedParams.checkpointId)))).thenResolve(
        expectedResult,
      );

      // Real call
      const result = await target.totalSupplyAt(mockedParams);
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.totalSupplyAt).once();
      verify(mockedMethod.callAsync(objectContaining(numberToBigNumber(mockedParams.checkpointId)))).once();
    });
  });

  describe('balanceOfAt', () => {
    test.todo('should fail as investor is not an Eth address');

    test('should call to balanceOfAt', async () => {
      const expectedResult = new BigNumber(1);
      const mockedParams = {
        investor: '0x1111111111111111111111111111111111111111',
        checkpointId: 1,
      };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.balanceOfAt).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.callAsync(mockedParams.investor, objectContaining(numberToBigNumber(mockedParams.checkpointId))),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.balanceOfAt(mockedParams);
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.balanceOfAt).once();
      verify(
        mockedMethod.callAsync(mockedParams.investor, objectContaining(numberToBigNumber(mockedParams.checkpointId))),
      ).once();
    });
  });

  describe('getVersion', () => {
    test('should call to getVersion', async () => {
      const expectedResult = new BigNumber(1);
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getVersion).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getVersion();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getVersion).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('getModulesByType', () => {
    test('should call to getModulesByType', async () => {
      const expectedResult = ['string'];
      const mockedParams = {
        type: ModuleType.Burn,
      };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getModulesByType).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(mockedParams.type)).thenResolve(expectedResult);

      // Real call
      const result = await target.getModulesByType(mockedParams);
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getModulesByType).once();
      verify(mockedMethod.callAsync(mockedParams.type)).once();
    });
  });

  describe('getModule', () => {
    test.todo('should fail as moduleAddress is not an Eth address');

    test('should call to getModule', async () => {
      const expectedString = 'Name';
      const expectedNumbers = [new BigNumber(1), new BigNumber(2)];
      const expectedResult = [
        stringToBytes32(expectedString),
        'stringstringstring',
        'stringstringstring',
        true,
        expectedNumbers,
      ];
      const mockedParams = {
        moduleAddress: '0x1111111111111111111111111111111111111111',
      };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getModule).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(mockedParams.moduleAddress)).thenResolve(expectedResult);

      // Real call
      const result = await target.getModule(mockedParams);
      // Result expectation
      expect(result.name).toBe(bytes32ToString(stringToBytes32(expectedString)));
      expect(result.address).toBe(expectedResult[1]);
      expect(result.factoryAddress).toBe(expectedResult[2]);
      expect(result.archived).toBe(expectedResult[3]);
      expect(result.types).toEqual(expectedNumbers.map(x => x.toNumber()));
      // Verifications
      verify(mockedContract.getModule).once();
      verify(mockedMethod.callAsync(mockedParams.moduleAddress)).once();
    });
  });

  /* describe('verifyTransfer', () => {
    test.todo('should fail as from is not an Eth address');
    test.todo('should fail as to is not an Eth address');
    test.todo('should fail as granularity is a zero big number');

    test('should call to verifyTransfer', async () => {
      // Granurality
      const expectedGranularityResult = new BigNumber(10);
      // Mocked method
      const mockedGranularityMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.granularity).thenReturn(instance(mockedGranularityMethod));
      // Stub the request
      when(mockedGranularityMethod.callAsync()).thenResolve(expectedGranularityResult);

      const expectedResult = true;
      const mockedParams = {
        from: '0x1111111111111111111111111111111111111111',
        to: '0x2222222222222222222222222222222222222222',
        value: new BigNumber(100),
        data: 'string',
      };
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.verifyTransfer).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.callAsync(mockedParams.from, mockedParams.to, mockedParams.value, mockedParams.data),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.verifyTransfer(mockedParams);
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.granularity).once();
      verify(mockedGranularityMethod.callAsync()).once();
      verify(mockedContract.verifyTransfer).once();
      verify(mockedMethod.callAsync(mockedParams.from, mockedParams.to, mockedParams.value, mockedParams.data)).once();
    });
  }); */

  describe('decreaseApproval', () => {
    test.todo('should fail as spender is not an Eth address');
    test('should send the transaction to decreaseApproval', async () => {
      // Mocked parameters
      const mockedParams = {
        spender: '0x2222222222222222222222222222222222222222',
        value: new BigNumber(2),
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.decreaseApproval).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.spender,
          mockedParams.value,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.decreaseApproval(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.decreaseApproval).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.spender,
          mockedParams.value,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
    });
  });

  describe('renounceOwnership', () => {
    test('should send the transaction to renounceOwnership', async () => {
      // Mocked parameters
      const mockedParams = {
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.renounceOwnership).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.sendTransactionAsync(mockedParams.txData, mockedParams.safetyFactor)).thenResolve(
        expectedResult,
      );

      // Real call
      const result = await target.renounceOwnership(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.renounceOwnership).once();
      verify(mockedMethod.sendTransactionAsync(mockedParams.txData, mockedParams.safetyFactor)).once();
    });
  });

  describe('increaseApproval', () => {
    test.todo('should fail as spender is not an Eth address');
    test('should send the transaction to increaseApproval', async () => {
      // Mocked parameters
      const mockedParams = {
        spender: '0x1111111111111111111111111111111111111111',
        value: new BigNumber(1),
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.increaseApproval).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.spender,
          mockedParams.value,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.increaseApproval(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.increaseApproval).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.spender,
          mockedParams.value,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
    });
  });

  describe('transferOwnership', () => {
    test.todo('should fail as newOwner is not a zero Eth address');
    test('should send the transaction to transferOwnership', async () => {
      // Mocked parameters
      const mockedParams = {
        newOwner: '0x1111111111111111111111111111111111111111',
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.transferOwnership).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(mockedParams.newOwner, mockedParams.txData, mockedParams.safetyFactor),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.transferOwnership(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.transferOwnership).once();
      verify(
        mockedMethod.sendTransactionAsync(mockedParams.newOwner, mockedParams.txData, mockedParams.safetyFactor),
      ).once();
    });
  });

  describe('archiveModule', () => {
    test.todo('should fail as moduleAddress is not an Eth address');
    test('should send the transaction to archiveModule', async () => {
      // Mocked parameters
      const mockedParams = {
        moduleAddress: '0x1111111111111111111111111111111111111111',
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.archiveModule).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(mockedParams.moduleAddress, mockedParams.txData, mockedParams.safetyFactor),
      ).thenResolve(expectedResult);

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

      // getModuleArchiveModule  expected
      const expectedGetModuleString = 'Name';
      const expectedGetModuleNumbers = [new BigNumber(1), new BigNumber(2)];
      const expectedGetModuleResult = [
        stringToBytes32(expectedGetModuleString),
        'stringstringstring',
        'stringstringstring',
        false,
        expectedGetModuleNumbers,
      ];
      const mockedGetModuleParams = {
        moduleAddress: '0x1111111111111111111111111111111111111111',
      };
      // Mocked method
      const mockedGetModuleMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getModule).thenReturn(instance(mockedGetModuleMethod));
      // Stub the request
      when(mockedGetModuleMethod.callAsync(mockedGetModuleParams.moduleAddress)).thenResolve(expectedGetModuleResult);

      // Real call
      const result = await target.archiveModule(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.owner).once();
      verify(mockedOwnerMethod.callAsync()).once();
      verify(mockedContract.archiveModule).once();
      verify(
        mockedMethod.sendTransactionAsync(mockedParams.moduleAddress, mockedParams.txData, mockedParams.safetyFactor),
      ).once();
      verify(mockedContract.getModule).twice();
      verify(mockedGetModuleMethod.callAsync(mockedParams.moduleAddress)).twice();
    });
  });

  describe('unarchiveModule', () => {
    test.todo('should fail as moduleAddress is not an Eth address');
    test('should send the transaction to unarchiveModule', async () => {
      // Mocked parameters
      const mockedParams = {
        moduleAddress: '0x1111111111111111111111111111111111111111',
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.unarchiveModule).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(mockedParams.moduleAddress, mockedParams.txData, mockedParams.safetyFactor),
      ).thenResolve(expectedResult);

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

      const expectedGetModuleString = 'Name';
      const expectedGetModuleNumbers = [new BigNumber(1), new BigNumber(2)];
      const expectedGetModuleResult = [
        stringToBytes32(expectedGetModuleString),
        'stringstringstring',
        'stringstringstring',
        true,
        expectedGetModuleNumbers,
      ];
      const mockedGetModuleParams = {
        moduleAddress: '0x1111111111111111111111111111111111111111',
      };
      // Mocked method
      const mockedGetModuleMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getModule).thenReturn(instance(mockedGetModuleMethod));
      // Stub the request
      when(mockedGetModuleMethod.callAsync(mockedGetModuleParams.moduleAddress)).thenResolve(expectedGetModuleResult);

      // Real call
      const result = await target.unarchiveModule(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.owner).once();
      verify(mockedOwnerMethod.callAsync()).once();
      verify(mockedContract.unarchiveModule).once();
      verify(
        mockedMethod.sendTransactionAsync(mockedParams.moduleAddress, mockedParams.txData, mockedParams.safetyFactor),
      ).once();
      verify(mockedContract.getModule).twice();
      verify(mockedGetModuleMethod.callAsync(mockedParams.moduleAddress)).twice();
    });
  });

  describe('removeModule', () => {
    test.todo('should fail as moduleAddress is not an Eth address');
    test('should send the transaction to removeModule', async () => {
      // Mocked parameters
      const mockedParams = {
        moduleAddress: '0x1111111111111111111111111111111111111111',
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
        mockedMethod.sendTransactionAsync(mockedParams.moduleAddress, mockedParams.txData, mockedParams.safetyFactor),
      ).thenResolve(expectedResult);

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

      const expectedGetModuleString = 'Name';
      const expectedGetModuleNumbers = [new BigNumber(1), new BigNumber(2)];
      const expectedGetModuleResult = [
        stringToBytes32(expectedGetModuleString),
        '0x1111111111111111111111111111111111111111',
        '0x1111111111111111111111111111111111111111',
        true,
        expectedGetModuleNumbers,
      ];
      const mockedGetModuleParams = {
        moduleAddress: '0x1111111111111111111111111111111111111111',
      };
      // Mocked method
      const mockedGetModuleMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getModule).thenReturn(instance(mockedGetModuleMethod));
      // Stub the request
      when(mockedGetModuleMethod.callAsync(mockedGetModuleParams.moduleAddress)).thenResolve(expectedGetModuleResult);

      // Real call
      const result = await target.removeModule(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.owner).once();
      verify(mockedOwnerMethod.callAsync()).once();
      verify(mockedContract.removeModule).once();
      verify(
        mockedMethod.sendTransactionAsync(mockedParams.moduleAddress, mockedParams.txData, mockedParams.safetyFactor),
      ).once();
      verify(mockedContract.getModule).twice();
      verify(mockedGetModuleMethod.callAsync(mockedParams.moduleAddress)).twice();
    });
  });

  describe('withdrawERC20', () => {
    test.todo('should fail as tokenContract is not an Eth address');
    test('should send the transaction to withdrawERC20', async () => {
      // Mocked parameters
      const mockedParams = {
        tokenContract: '0x1111111111111111111111111111111111111111',
        value: new BigNumber(1),
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.withdrawERC20).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.tokenContract,
          mockedParams.value,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

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

      // Real call
      const result = await target.withdrawERC20(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.owner).once();
      verify(mockedOwnerMethod.callAsync()).once();
      verify(mockedContract.withdrawERC20).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.tokenContract,
          mockedParams.value,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
    });
  });
});

// SecurityTokenWrapper test
import { instance, mock, reset, verify, when, objectContaining } from 'ts-mockito';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { BigNumber } from '@0x/utils';
import { ethers } from 'ethers';
import {
  CountTransferManager,
  ERC20DividendCheckpoint,
  CappedSTO,
  USDTieredSTO,
  PercentageTransferManager,
  EtherDividendCheckpoint,
} from '@polymathnetwork/contract-artifacts';
import {
  SecurityTokenContract,
  FeatureRegistryContract,
  FeatureRegistryEvents,
  ModuleFactoryContract,
  PolyTokenContract,
  ModuleRegistryContract,
} from '@polymathnetwork/abi-wrappers';
import ERC20TokenWrapper from '../erc20_wrapper';
import { ModuleType, ModuleName, Features, FundRaiseType, PERCENTAGE_DECIMALS, FULL_DECIMALS } from '../../../types';
import SecurityTokenWrapper from '../security_token_wrapper';
import ContractFactory from '../../../factories/contractFactory';
import {
  stringToBytes32,
  bytes32ToString,
  numberToBigNumber,
  dateToBigNumber,
  valueToWei,
  valueArrayToWeiArray,
  weiToValue,
} from '../../../utils/convert';
import { MockedCallMethod, MockedSendMethod, getMockedPolyResponse } from '../../../test_utils/mocked_methods';

describe('SecurityTokenWrapper', () => {
  // Declare SecurityTokenWrapper object
  let target: SecurityTokenWrapper;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: SecurityTokenContract;
  let mockedContractFactory: ContractFactory;
  let mockedFeatureRegistryContract: FeatureRegistryContract;
  let mockedModuleFactoryContract: ModuleFactoryContract;
  let mockedPolyTokenContract: PolyTokenContract;
  let mockedModuleRegistryContract: ModuleRegistryContract;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(SecurityTokenContract);
    mockedContractFactory = mock(ContractFactory);
    mockedFeatureRegistryContract = mock(FeatureRegistryContract);
    mockedModuleFactoryContract = mock(ModuleFactoryContract);
    mockedPolyTokenContract = mock(PolyTokenContract);
    mockedModuleRegistryContract = mock(ModuleRegistryContract);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new SecurityTokenWrapper(instance(mockedWrapper), myContractPromise, instance(mockedContractFactory));
  });

  afterEach(() => {
    reset(mockedWrapper);
    reset(mockedContract);
    reset(mockedFeatureRegistryContract);
    reset(mockedContractFactory);
    reset(mockedModuleFactoryContract);
    reset(mockedPolyTokenContract);
    reset(mockedModuleRegistryContract);
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
      const expectedResult = '0x0123456789012345678901234567890123456789';
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
      const expectedResult = '0x0123456789012345678901234567890123456789';
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
      const expectedResult = '0x0123456789012345678901234567890123456789';
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
      const expectedResult = '0x0123456789012345678901234567890123456789';
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
      const expectedResult = '0x0123456789012345678901234567890123456789';
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
      const expectedResult = '0x0123456789012345678901234567890123456789';
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
      const expectedResult = [
        '0x0123456789012345678901234567890123456789',
        '0x0123456789012345678901234567890123456788',
      ];
      const mockedParams = {
        moduleName: ModuleName.generalPermissionManager,
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
      const expectedResult = [
        '0x0123456789012345678901234567890123456789',
        '0x0123456789012345678901234567890123456789',
      ];
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
      const expectedResult = [
        '0x0123456789012345678901234567890123456788',
        '0x0123456789012345678901234567890123456789',
      ];
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
      const expectedResult = [
        '0x0123456789012345678901234567890123456788',
        '0x0123456789012345678901234567890123456789',
      ];
      const mockedParams = {
        start: 1,
        end: 5,
      };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.iterateInvestors).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.callAsync(
          objectContaining(numberToBigNumber(mockedParams.start)),
          objectContaining(numberToBigNumber(mockedParams.end)),
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
          objectContaining(numberToBigNumber(mockedParams.start)),
          objectContaining(numberToBigNumber(mockedParams.end)),
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
      const expectedResult = [new BigNumber(0), new BigNumber(1)];
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

      const expectedDecimalsResult = new BigNumber(18);
      const mockedDecimalsMethod = mock(MockedCallMethod);
      when(mockedContract.decimals).thenReturn(instance(mockedDecimalsMethod));
      when(mockedDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);

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
      expect(result).toEqual(weiToValue(expectedResult, expectedDecimalsResult));
      // Verifications
      verify(mockedContract.totalSupplyAt).once();
      verify(mockedMethod.callAsync(objectContaining(numberToBigNumber(mockedParams.checkpointId)))).once();
      verify(mockedContract.decimals).once();
      verify(mockedDecimalsMethod.callAsync()).once();
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

      const expectedDecimalsResult = new BigNumber(18);
      const mockedDecimalsMethod = mock(MockedCallMethod);
      when(mockedContract.decimals).thenReturn(instance(mockedDecimalsMethod));
      when(mockedDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);

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
      expect(result).toEqual(weiToValue(expectedResult, expectedDecimalsResult));
      // Verifications
      verify(mockedContract.balanceOfAt).once();
      verify(
        mockedMethod.callAsync(mockedParams.investor, objectContaining(numberToBigNumber(mockedParams.checkpointId))),
      ).once();
      verify(mockedContract.decimals).once();
      verify(mockedDecimalsMethod.callAsync()).once();
    });
  });

  describe('getVersion', () => {
    test('should call to getVersion', async () => {
      const expectedResult = [new BigNumber(1), new BigNumber(1), new BigNumber(0)];
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
      const expectedResult = [
        '0x0123456789012345678901234567890123456789',
        '0x0123456789012345678901234567890123456788',
      ];
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

  describe('verifyTransfer', () => {
    test.todo('should fail as from is not an Eth address');
    test.todo('should fail as to is not an Eth address');
    test.todo('should fail as granularity is a zero big number');

    test('should call to verifyTransfer', async () => {
      const expectedResult = false;
      const mockedParams = {
        from: '0x1111111111111111111111111111111111111111',
        to: '0x2222222222222222222222222222222222222222',
        value: new BigNumber(0.9),
        data: 'string',
      };

      const expectedDecimalsResult = new BigNumber(18);
      const mockedDecimalsMethod = mock(MockedCallMethod);
      when(mockedContract.decimals).thenReturn(instance(mockedDecimalsMethod));
      when(mockedDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);

      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.verifyTransfer).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.callAsync(
          mockedParams.from,
          mockedParams.to,
          objectContaining(valueToWei(mockedParams.value, expectedDecimalsResult)),
          mockedParams.data,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.verifyTransfer(mockedParams);
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.verifyTransfer).once();
      verify(
        mockedMethod.callAsync(
          mockedParams.from,
          mockedParams.to,
          objectContaining(valueToWei(mockedParams.value, expectedDecimalsResult)),
          mockedParams.data,
        ),
      ).once();
      verify(mockedContract.decimals).once();
      verify(mockedDecimalsMethod.callAsync()).once();
    });
  });

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

      const expectedDecimalsResult = new BigNumber(18);
      const mockedDecimalsMethod = mock(MockedCallMethod);
      when(mockedContract.decimals).thenReturn(instance(mockedDecimalsMethod));
      when(mockedDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.decreaseApproval).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.spender,
          objectContaining(valueToWei(mockedParams.value, expectedDecimalsResult)),
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
          objectContaining(valueToWei(mockedParams.value, expectedDecimalsResult)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedContract.decimals).once();
      verify(mockedDecimalsMethod.callAsync()).once();
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

      const expectedDecimalsResult = new BigNumber(18);
      const mockedDecimalsMethod = mock(MockedCallMethod);
      when(mockedContract.decimals).thenReturn(instance(mockedDecimalsMethod));
      when(mockedDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.increaseApproval).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.spender,
          objectContaining(valueToWei(mockedParams.value, expectedDecimalsResult)),
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
          objectContaining(valueToWei(mockedParams.value, expectedDecimalsResult)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedContract.decimals).once();
      verify(mockedDecimalsMethod.callAsync()).once();
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

  describe('UpdateFromRegistry', () => {
    test.todo('should fail as moduleAddress is not an Eth address');
    test('should send the transaction to upgradeFromRegistry', async () => {
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      const mockedParams = {
        txData: {},
        safetyFactor: 10,
      };
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
      verify(mockedMethod.sendTransactionAsync(mockedParams.txData, mockedParams.safetyFactor)).once();
      verify(mockedContract.updateFromRegistry).once();
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
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
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
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
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
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
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

      const expectedDecimalsResult = new BigNumber(18);
      const mockedDecimalsMethod = mock(MockedCallMethod);
      when(mockedContract.decimals).thenReturn(instance(mockedDecimalsMethod));
      when(mockedDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.withdrawERC20).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.tokenContract,
          objectContaining(valueToWei(mockedParams.value, expectedDecimalsResult)),
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
          objectContaining(valueToWei(mockedParams.value, expectedDecimalsResult)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedContract.decimals).once();
      verify(mockedDecimalsMethod.callAsync()).once();
    });
  });

  describe('changeModuleBudget', () => {
    test.todo('should fail as module is not an Eth address');
    test('should send the transaction to changeModuleBudget', async () => {
      // Mocked parameters
      const mockedParams = {
        module: '0x1111111111111111111111111111111111111111',
        change: new BigNumber(1),
        increase: true,
        txData: {},
        safetyFactor: 10,
      };

      const expectedDecimalsResult = new BigNumber(18);
      const mockedDecimalsMethod = mock(MockedCallMethod);
      when(mockedContract.decimals).thenReturn(instance(mockedDecimalsMethod));
      when(mockedDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.changeModuleBudget).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.module,
          objectContaining(valueToWei(mockedParams.change, expectedDecimalsResult)),
          mockedParams.increase,
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
      const result = await target.changeModuleBudget(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.owner).once();
      verify(mockedOwnerMethod.callAsync()).once();
      verify(mockedContract.changeModuleBudget).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.module,
          objectContaining(valueToWei(mockedParams.change, expectedDecimalsResult)),
          mockedParams.increase,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedContract.getModule).once();
      verify(mockedGetModuleMethod.callAsync(mockedParams.module)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedContract.decimals).once();
      verify(mockedDecimalsMethod.callAsync()).once();
    });
  });

  describe('updateTokenDetails', () => {
    test('should send the transaction to updateTokenDetails', async () => {
      // Mocked parameters
      const mockedParams = {
        newTokenDetails: 'string',
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.updateTokenDetails).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(mockedParams.newTokenDetails, mockedParams.txData, mockedParams.safetyFactor),
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
      const result = await target.updateTokenDetails(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.owner).once();
      verify(mockedOwnerMethod.callAsync()).once();
      verify(mockedContract.updateTokenDetails).once();
      verify(
        mockedMethod.sendTransactionAsync(mockedParams.newTokenDetails, mockedParams.txData, mockedParams.safetyFactor),
      ).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('changeGranularity', () => {
    test('should send the transaction to changeGranularity', async () => {
      // Mocked parameters
      const mockedParams = {
        granularity: new BigNumber(1),
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.changeGranularity).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(mockedParams.granularity, mockedParams.txData, mockedParams.safetyFactor),
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
      const result = await target.changeGranularity(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.owner).once();
      verify(mockedOwnerMethod.callAsync()).once();
      verify(mockedContract.changeGranularity).once();
      verify(
        mockedMethod.sendTransactionAsync(mockedParams.granularity, mockedParams.txData, mockedParams.safetyFactor),
      ).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('freezeTransfers', () => {
    test('should send the transaction to freezeTransfers', async () => {
      // Mocked parameters
      const mockedParams = {
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.freezeTransfers).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.sendTransactionAsync(mockedParams.txData, mockedParams.safetyFactor)).thenResolve(
        expectedResult,
      );

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

      const expectedFrozenResult = false;
      // Mocked method
      const mockedFrozenMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.transfersFrozen).thenReturn(instance(mockedFrozenMethod));
      // Stub the request
      when(mockedFrozenMethod.callAsync()).thenResolve(expectedFrozenResult);

      // Real call
      const result = await target.freezeTransfers(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.owner).once();
      verify(mockedOwnerMethod.callAsync()).once();
      verify(mockedContract.freezeTransfers).once();
      verify(mockedMethod.sendTransactionAsync(mockedParams.txData, mockedParams.safetyFactor)).once();
      verify(mockedContract.transfersFrozen).once();
      verify(mockedFrozenMethod.callAsync()).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('unfreezeTransfers', () => {
    test('should send the transaction to unfreezeTransfers', async () => {
      // Mocked parameters
      const mockedParams = {
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.unfreezeTransfers).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.sendTransactionAsync(mockedParams.txData, mockedParams.safetyFactor)).thenResolve(
        expectedResult,
      );

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

      const expectedFrozenResult = false;
      // Mocked method
      const mockedFrozenMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.transfersFrozen).thenReturn(instance(mockedFrozenMethod));
      // Stub the request
      when(mockedFrozenMethod.callAsync()).thenResolve(expectedFrozenResult);

      // Real call
      const result = await target.unfreezeTransfers(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.owner).once();
      verify(mockedOwnerMethod.callAsync()).once();
      verify(mockedContract.unfreezeTransfers).once();
      verify(mockedMethod.sendTransactionAsync(mockedParams.txData, mockedParams.safetyFactor)).once();
      verify(mockedContract.transfersFrozen).once();
      verify(mockedFrozenMethod.callAsync()).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('transferWithData', () => {
    test.todo('should fail as to is not a zero Eth address');
    test('should send the transaction to transferWithData', async () => {
      // Mocked parameters
      const mockedParams = {
        to: '0x1111111111111111111111111111111111111111',
        value: new BigNumber(1),
        data: 'string',
        txData: {},
        safetyFactor: 10,
      };

      const expectedDecimalsResult = new BigNumber(18);
      const mockedDecimalsMethod = mock(MockedCallMethod);
      when(mockedContract.decimals).thenReturn(instance(mockedDecimalsMethod));
      when(mockedDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.transferWithData).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.to,
          objectContaining(valueToWei(mockedParams.value, expectedDecimalsResult)),
          mockedParams.data,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.transferWithData(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.transferWithData).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.to,
          objectContaining(valueToWei(mockedParams.value, expectedDecimalsResult)),
          mockedParams.data,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedContract.decimals).once();
      verify(mockedDecimalsMethod.callAsync()).once();
    });
  });

  describe('transferFromWithData', () => {
    test.todo('should fail as from is not an Eth address');
    test.todo('should fail as to is not a zero Eth address');
    test('should send the transaction to transferFromWithData', async () => {
      // Mocked parameters
      const mockedParams = {
        from: '0x1111111111111111111111111111111111111111',
        to: '0x2222222222222222222222222222222222222222',
        value: new BigNumber(1),
        data: 'string',
        txData: {},
        safetyFactor: 10,
      };

      const expectedDecimalsResult = new BigNumber(18);
      const mockedDecimalsMethod = mock(MockedCallMethod);
      when(mockedContract.decimals).thenReturn(instance(mockedDecimalsMethod));
      when(mockedDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.transferFromWithData).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.from,
          mockedParams.to,
          objectContaining(valueToWei(mockedParams.value, expectedDecimalsResult)),
          mockedParams.data,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.transferFromWithData(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.transferFromWithData).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.from,
          mockedParams.to,
          objectContaining(valueToWei(mockedParams.value, expectedDecimalsResult)),
          mockedParams.data,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedContract.decimals).once();
      verify(mockedDecimalsMethod.callAsync()).once();
    });
  });

  describe('freezeMinting', () => {
    test('should send the transaction to freezeMinting', async () => {
      // Mocked parameters
      const mockedParams = {
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.freezeMinting).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.sendTransactionAsync(mockedParams.txData, mockedParams.safetyFactor)).thenResolve(
        expectedResult,
      );

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

      const expectedFrozenResult = false;
      // Mocked method
      const mockedFrozenMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.mintingFrozen).thenReturn(instance(mockedFrozenMethod));
      // Stub the request
      when(mockedFrozenMethod.callAsync()).thenResolve(expectedFrozenResult);

      // Setup mocked Get Feature registry contract
      when(mockedContractFactory.getFeatureRegistryContract()).thenResolve(instance(mockedFeatureRegistryContract));
      const mockedGetFeatureStatusMethod = mock(MockedCallMethod);
      const currentFeatureStatus = true;
      when(mockedFeatureRegistryContract.getFeatureStatus).thenReturn(instance(mockedGetFeatureStatusMethod));
      when(mockedGetFeatureStatusMethod.callAsync(Features.FreezeMintingAllowed)).thenResolve(currentFeatureStatus);

      // Real call
      const result = await target.freezeMinting(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.freezeMinting).once();
      verify(mockedMethod.sendTransactionAsync(mockedParams.txData, mockedParams.safetyFactor)).once();
      verify(mockedContract.owner).once();
      verify(mockedOwnerMethod.callAsync()).once();
      verify(mockedContract.mintingFrozen).once();
      verify(mockedFrozenMethod.callAsync()).once();
      verify(mockedContractFactory.getFeatureRegistryContract()).once();
      verify(mockedFeatureRegistryContract.getFeatureStatus).once();
      verify(mockedGetFeatureStatusMethod.callAsync(Features.FreezeMintingAllowed)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('mint', () => {
    test.todo('should fail as investor is not a zero Eth address');
    test('should send the transaction to mint', async () => {
      // Mocked parameters
      const mockedParams = {
        investor: '0x1111111111111111111111111111111111111111',
        value: new BigNumber(2),
        txData: {},
        safetyFactor: 10,
      };

      const expectedDecimalsResult = new BigNumber(18);
      const mockedDecimalsMethod = mock(MockedCallMethod);
      when(mockedContract.decimals).thenReturn(instance(mockedDecimalsMethod));
      when(mockedDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.mint).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.investor,
          objectContaining(valueToWei(mockedParams.value, expectedDecimalsResult)),
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

      const expectedFrozenResult = false;
      // Mocked method
      const mockedFrozenMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.mintingFrozen).thenReturn(instance(mockedFrozenMethod));
      // Stub the request
      when(mockedFrozenMethod.callAsync()).thenResolve(expectedFrozenResult);

      // Real call
      const result = await target.mint(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.mint).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.investor,
          objectContaining(valueToWei(mockedParams.value, expectedDecimalsResult)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedContract.owner).once();
      verify(mockedOwnerMethod.callAsync()).once();
      verify(mockedContract.mintingFrozen).once();
      verify(mockedFrozenMethod.callAsync()).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedContract.decimals).once();
      verify(mockedDecimalsMethod.callAsync()).once();
    });
  });

  describe('mintWithData', () => {
    test.todo('should fail as investor is not a zero Eth address');
    test('should send the transaction to mintWithData', async () => {
      // Mocked parameters
      const mockedParams = {
        investor: '0x1111111111111111111111111111111111111111',
        value: new BigNumber(2),
        data: 'string',
        txData: {},
        safetyFactor: 10,
      };

      const expectedDecimalsResult = new BigNumber(18);
      const mockedDecimalsMethod = mock(MockedCallMethod);
      when(mockedContract.decimals).thenReturn(instance(mockedDecimalsMethod));
      when(mockedDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.mintWithData).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.investor,
          objectContaining(valueToWei(mockedParams.value, expectedDecimalsResult)),
          mockedParams.data,
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

      const expectedFrozenResult = false;
      // Mocked method
      const mockedFrozenMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.mintingFrozen).thenReturn(instance(mockedFrozenMethod));
      // Stub the request
      when(mockedFrozenMethod.callAsync()).thenResolve(expectedFrozenResult);

      // Real call
      const result = await target.mintWithData(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.mintWithData).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.investor,
          objectContaining(valueToWei(mockedParams.value, expectedDecimalsResult)),
          mockedParams.data,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedContract.owner).once();
      verify(mockedOwnerMethod.callAsync()).once();
      verify(mockedContract.mintingFrozen).once();
      verify(mockedFrozenMethod.callAsync()).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedContract.decimals).once();
      verify(mockedDecimalsMethod.callAsync()).once();
    });
  });

  describe('mintMulti', () => {
    test.todo('should fail as investors is not a zero Eth address');
    test.todo('should fail as investors length is not equals than values length');
    test('should send the transaction to mintMulti', async () => {
      // Mocked parameters
      const mockedParams = {
        investors: ['0x1111111111111111111111111111111111111111', '0x1111111111111111111111111111111111111111'],
        values: [new BigNumber(2), new BigNumber(2)],
        txData: {},
        safetyFactor: 10,
      };

      const expectedDecimalsResult = new BigNumber(18);
      const mockedDecimalsMethod = mock(MockedCallMethod);
      when(mockedContract.decimals).thenReturn(instance(mockedDecimalsMethod));
      when(mockedDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.mintMulti).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.investors,
          objectContaining(valueArrayToWeiArray(mockedParams.values, expectedDecimalsResult)),
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

      const expectedFrozenResult = false;
      // Mocked method
      const mockedFrozenMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.mintingFrozen).thenReturn(instance(mockedFrozenMethod));
      // Stub the request
      when(mockedFrozenMethod.callAsync()).thenResolve(expectedFrozenResult);

      // Real call
      const result = await target.mintMulti(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.mintMulti).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.investors,
          objectContaining(valueArrayToWeiArray(mockedParams.values, expectedDecimalsResult)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedContract.owner).once();
      verify(mockedOwnerMethod.callAsync()).once();
      verify(mockedContract.mintingFrozen).once();
      verify(mockedFrozenMethod.callAsync()).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedContract.decimals).once();
      verify(mockedDecimalsMethod.callAsync()).once();
    });
  });

  describe('burnWithData', () => {
    test('should send the transaction to burnWithData', async () => {
      // Mocked parameters
      const mockedParams = {
        value: new BigNumber(1),
        data: 'string',
        txData: {},
        safetyFactor: 10,
      };

      const expectedDecimalsResult = new BigNumber(18);
      const mockedDecimalsMethod = mock(MockedCallMethod);
      when(mockedContract.decimals).thenReturn(instance(mockedDecimalsMethod));
      when(mockedDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.burnWithData).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          objectContaining(valueToWei(mockedParams.value, expectedDecimalsResult)),
          stringToBytes32(mockedParams.data),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Owner Address expected
      const owner = '0x5555555555555555555555555555555555555555';
      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([owner]);

      const expectedBalanceResult = valueToWei(new BigNumber(100), expectedDecimalsResult);
      const params = {
        owner,
      };
      // Mocked method
      const mockedBalanceMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.balanceOf).thenReturn(instance(mockedBalanceMethod));
      // Stub the request
      when(mockedBalanceMethod.callAsync(params.owner)).thenResolve(expectedBalanceResult);

      // Real call
      const result = await target.burnWithData(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.burnWithData).once();
      verify(
        mockedMethod.sendTransactionAsync(
          objectContaining(valueToWei(mockedParams.value, expectedDecimalsResult)),
          stringToBytes32(mockedParams.data),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedContract.balanceOf).once();
      verify(mockedBalanceMethod.callAsync(params.owner)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedContract.decimals).twice();
      verify(mockedDecimalsMethod.callAsync()).twice();
    });
  });

  describe('burnFromWithData', () => {
    test('should send the transaction to burnFromWithData', async () => {
      // Mocked parameters
      const mockedParams = {
        from: '0x5555555555555555555555555555555555555555',
        value: new BigNumber(10),
        data: 'string',
        txData: {},
        safetyFactor: 10,
      };

      const expectedDecimalsResult = new BigNumber(18);
      const mockedDecimalsMethod = mock(MockedCallMethod);
      when(mockedContract.decimals).thenReturn(instance(mockedDecimalsMethod));
      when(mockedDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.burnFromWithData).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.from,
          objectContaining(valueToWei(mockedParams.value, expectedDecimalsResult)),
          mockedParams.data,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Owner Address expected
      const owner = '0x5555555555555555555555555555555555555555';
      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([owner]);

      const expectedBalanceResult = valueToWei(new BigNumber(100), expectedDecimalsResult);
      const params = {
        owner,
      };
      // Mocked method
      const mockedBalanceMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.balanceOf).thenReturn(instance(mockedBalanceMethod));
      // Stub the request
      when(mockedBalanceMethod.callAsync(params.owner)).thenResolve(expectedBalanceResult);

      const expectedAllowanceResult = valueToWei(new BigNumber(50), expectedDecimalsResult);
      // Mocked method
      const mockedAllowanceMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.allowance).thenReturn(instance(mockedAllowanceMethod));
      // Stub the request
      when(mockedAllowanceMethod.callAsync(mockedParams.from, params.owner)).thenResolve(expectedAllowanceResult);

      // Real call
      const result = await target.burnFromWithData(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.burnFromWithData).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.from,
          objectContaining(valueToWei(mockedParams.value, expectedDecimalsResult)),
          mockedParams.data,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedContract.balanceOf).once();
      verify(mockedBalanceMethod.callAsync(params.owner)).once();
      verify(mockedContract.allowance).once();
      verify(mockedAllowanceMethod.callAsync(mockedParams.from, params.owner)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedContract.decimals).times(3);
      verify(mockedDecimalsMethod.callAsync()).times(3);
    });
  });

  describe('createCheckpoint', () => {
    test('should send the transaction to createCheckpoint', async () => {
      // Mocked parameters
      const mockedParams = {
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.createCheckpoint).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.sendTransactionAsync(mockedParams.txData, mockedParams.safetyFactor)).thenResolve(
        expectedResult,
      );

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

      const expectedCurrentResult = new BigNumber(10);
      // Mocked method
      const mockedCurrentMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.currentCheckpointId).thenReturn(instance(mockedCurrentMethod));
      // Stub the request
      when(mockedCurrentMethod.callAsync()).thenResolve(expectedCurrentResult);

      // Real call
      const result = await target.createCheckpoint(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.createCheckpoint).once();
      verify(mockedMethod.sendTransactionAsync(mockedParams.txData, mockedParams.safetyFactor)).once();
      verify(mockedContract.owner).once();
      verify(mockedOwnerMethod.callAsync()).once();
      verify(mockedContract.currentCheckpointId).once();
      verify(mockedCurrentMethod.callAsync()).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('setController', () => {
    test.todo('should fail as controller is not an Eth address');
    test('should send the transaction to setController', async () => {
      // Mocked parameters
      const mockedParams = {
        controller: '0x5555555555555555555555555555555555555555',
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.setController).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(mockedParams.controller, mockedParams.txData, mockedParams.safetyFactor),
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

      const expectedControllerResult = false;
      // Mocked method
      const mockedControllerMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.controllerDisabled).thenReturn(instance(mockedControllerMethod));
      // Stub the request
      when(mockedControllerMethod.callAsync()).thenResolve(expectedControllerResult);

      // Real call
      const result = await target.setController(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.setController).once();
      verify(
        mockedMethod.sendTransactionAsync(mockedParams.controller, mockedParams.txData, mockedParams.safetyFactor),
      ).once();
      verify(mockedContract.owner).once();
      verify(mockedOwnerMethod.callAsync()).once();
      verify(mockedContract.controllerDisabled).once();
      verify(mockedControllerMethod.callAsync()).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('disableController', () => {
    test('should send the transaction to disableController', async () => {
      // Mocked parameters
      const mockedParams = {
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.disableController).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.sendTransactionAsync(mockedParams.txData, mockedParams.safetyFactor)).thenResolve(
        expectedResult,
      );

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

      const expectedControllerResult = false;
      // Mocked method
      const mockedControllerMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.controllerDisabled).thenReturn(instance(mockedControllerMethod));
      // Stub the request
      when(mockedControllerMethod.callAsync()).thenResolve(expectedControllerResult);

      // Real call
      const result = await target.disableController(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.disableController).once();
      verify(mockedMethod.sendTransactionAsync(mockedParams.txData, mockedParams.safetyFactor)).once();
      verify(mockedContract.owner).once();
      verify(mockedOwnerMethod.callAsync()).once();
      verify(mockedContract.controllerDisabled).once();
      verify(mockedControllerMethod.callAsync()).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('forceTransfer', () => {
    test.todo('should fail as from is not an Eth address');
    test.todo('should fail as to is not a zero Eth address');
    test('should send the transaction to forceTransfer', async () => {
      // Mocked parameters
      const mockedParams = {
        from: '0x1111111111111111111111111111111111111111',
        to: '0x2222222222222222222222222222222222222222',
        value: new BigNumber(1),
        data: 'string',
        log: 'log',
        txData: {},
        safetyFactor: 10,
      };

      const expectedDecimalsResult = new BigNumber(18);
      const mockedDecimalsMethod = mock(MockedCallMethod);
      when(mockedContract.decimals).thenReturn(instance(mockedDecimalsMethod));
      when(mockedDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.forceTransfer).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.from,
          mockedParams.to,
          objectContaining(valueToWei(mockedParams.value, expectedDecimalsResult)),
          mockedParams.data,
          mockedParams.log,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const expectedBalanceResult = valueToWei(new BigNumber(100), expectedDecimalsResult);
      const params = {
        owner: '0x1111111111111111111111111111111111111111',
      };
      // Mocked method
      const mockedBalanceMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.balanceOf).thenReturn(instance(mockedBalanceMethod));
      // Stub the request
      when(mockedBalanceMethod.callAsync(params.owner)).thenResolve(expectedBalanceResult);

      const expectedControllerResult = '0x5555555555555555555555555555555555555555';
      const mockedControllerMethod = mock(MockedCallMethod);
      when(mockedContract.controller).thenReturn(instance(mockedControllerMethod));
      when(mockedControllerMethod.callAsync()).thenResolve(expectedControllerResult);

      // Real call
      const result = await target.forceTransfer(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.forceTransfer).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.from,
          mockedParams.to,
          objectContaining(valueToWei(mockedParams.value, expectedDecimalsResult)),
          mockedParams.data,
          mockedParams.log,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedContract.balanceOf).once();
      verify(mockedBalanceMethod.callAsync(params.owner)).once();
      verify(mockedContract.controller).once();
      verify(mockedControllerMethod.callAsync()).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedContract.decimals).twice();
      verify(mockedDecimalsMethod.callAsync()).twice();
    });
  });

  describe('forceBurn', () => {
    test.todo('should fail as from is not an Eth address');
    test('should send the transaction to forceBurn', async () => {
      // Mocked parameters
      const mockedParams = {
        from: '0x1111111111111111111111111111111111111111',
        value: new BigNumber(1),
        data: 'string',
        log: 'log',
        txData: {},
        safetyFactor: 10,
      };

      const expectedDecimalsResult = new BigNumber(18);
      const mockedDecimalsMethod = mock(MockedCallMethod);
      when(mockedContract.decimals).thenReturn(instance(mockedDecimalsMethod));
      when(mockedDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.forceBurn).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.from,
          objectContaining(valueToWei(mockedParams.value, expectedDecimalsResult)),
          mockedParams.data,
          mockedParams.log,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const expectedBalanceResult = valueToWei(new BigNumber(100), expectedDecimalsResult);
      const params = {
        owner: '0x1111111111111111111111111111111111111111',
      };
      // Mocked method
      const mockedBalanceMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.balanceOf).thenReturn(instance(mockedBalanceMethod));
      // Stub the request
      when(mockedBalanceMethod.callAsync(params.owner)).thenResolve(expectedBalanceResult);

      const expectedControllerResult = '0x5555555555555555555555555555555555555555';
      const mockedControllerMethod = mock(MockedCallMethod);
      when(mockedContract.controller).thenReturn(instance(mockedControllerMethod));
      when(mockedControllerMethod.callAsync()).thenResolve(expectedControllerResult);

      // Real call
      const result = await target.forceBurn(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.forceBurn).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.from,
          objectContaining(valueToWei(mockedParams.value, expectedDecimalsResult)),
          mockedParams.data,
          mockedParams.log,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedContract.balanceOf).once();
      verify(mockedBalanceMethod.callAsync(params.owner)).once();
      verify(mockedContract.controller).once();
      verify(mockedControllerMethod.callAsync()).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedContract.decimals).twice();
      verify(mockedDecimalsMethod.callAsync()).twice();
    });
  });

  describe('addModule', () => {
    test.todo('should fail as address is not an Eth address');

    test('should send the transaction to addModule for CountTransferManager', async () => {
      const ADDRESS = '0x1111111111111111111111111111111111111111';
      const OWNER = '0x5555555555555555555555555555555555555555';
      const expectedResult = getMockedPolyResponse();
      const mockedMethod = mock(MockedSendMethod);
      when(mockedContract.addModule).thenReturn(instance(mockedMethod));

      const expectedDecimalsResult = new BigNumber(16);
      const mockedDecimalsMethod = mock(MockedCallMethod);
      when(mockedContract.decimals).thenReturn(instance(mockedDecimalsMethod));
      when(mockedDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);

      // checkOnlyOwner
      const expectedOwnerResult = OWNER;
      const mockedOwnerMethod = mock(MockedCallMethod);
      when(mockedContract.owner).thenReturn(instance(mockedOwnerMethod));
      when(mockedOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // checkModuleCostBelowMaxCost
      when(mockedContractFactory.getModuleFactoryContract(ADDRESS)).thenResolve(instance(mockedModuleFactoryContract));
      const mockedGetModuleStatusMethod = mock(MockedCallMethod);
      const moduleResult = new BigNumber(1);
      when(mockedModuleFactoryContract.getSetupCost).thenReturn(instance(mockedGetModuleStatusMethod));
      when(mockedGetModuleStatusMethod.callAsync()).thenResolve(moduleResult);

      const stAddressResult = '0x7777777777777777777777777777777777777777';
      when(mockedContract.address).thenReturn(stAddressResult);

      when(mockedContractFactory.getPolyTokenContract()).thenResolve(instance(mockedPolyTokenContract));
      const mockedBalanceMethod = mock(MockedCallMethod);
      const balanceResult = new BigNumber(1);
      when(mockedPolyTokenContract.balanceOf).thenReturn(instance(mockedBalanceMethod));
      when(mockedBalanceMethod.callAsync(stAddressResult)).thenResolve(balanceResult);

      // Setup mocked Get Feature registry contract
      when(mockedContractFactory.getFeatureRegistryContract()).thenResolve(instance(mockedFeatureRegistryContract));
      const mockedGetFeatureStatusMethod = mock(MockedCallMethod);
      const currentFeatureStatus = true;
      when(mockedFeatureRegistryContract.getFeatureStatus).thenReturn(instance(mockedGetFeatureStatusMethod));
      when(mockedGetFeatureStatusMethod.callAsync(Features.CustomModulesAllowed)).thenResolve(currentFeatureStatus);

      // Setup mocked contractFactory owner
      const mockedModuleFactoryOwnerMethod = mock(MockedCallMethod);
      when(mockedModuleFactoryContract.owner).thenReturn(instance(mockedModuleFactoryOwnerMethod));
      when(mockedModuleFactoryOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);

      const expectedAlreadyRegisteredResult = [
        '0x1111111111111111111111111111111111111111',
        '0x2222222222222222222222222222222222222222',
      ];
      when(mockedContractFactory.getModuleRegistryContract()).thenResolve(instance(mockedModuleRegistryContract));
      const mockedGetModulesMethod = mock(MockedCallMethod);
      when(mockedModuleRegistryContract.getModulesByType).thenReturn(instance(mockedGetModulesMethod));
      when(mockedGetModulesMethod.callAsync(ModuleType.PermissionManager)).thenResolve(expectedAlreadyRegisteredResult);
      when(mockedGetModulesMethod.callAsync(ModuleType.STO)).thenResolve(expectedAlreadyRegisteredResult);
      when(mockedGetModulesMethod.callAsync(ModuleType.Burn)).thenResolve(expectedAlreadyRegisteredResult);
      when(mockedGetModulesMethod.callAsync(ModuleType.Dividends)).thenResolve(expectedAlreadyRegisteredResult);
      when(mockedGetModulesMethod.callAsync(ModuleType.TransferManager)).thenResolve(expectedAlreadyRegisteredResult);

      // Mock getVersion
      const expectedGetVersionResult = [new BigNumber(3), new BigNumber(4), new BigNumber(5)];
      const mockedGetVersionMethod = mock(MockedCallMethod);
      when(mockedContract.getVersion).thenReturn(instance(mockedGetVersionMethod));
      when(mockedGetVersionMethod.callAsync()).thenResolve(expectedGetVersionResult);

      // Mock getUpperBoundsSTVersion
      const expectedGetUpperBoundsSTVersionResult = [new BigNumber(4), new BigNumber(5), new BigNumber(6)];
      const mockedGetUpperBoundsSTVersionMethod = mock(MockedCallMethod);
      when(mockedModuleFactoryContract.getUpperSTVersionBounds).thenReturn(
        instance(mockedGetUpperBoundsSTVersionMethod),
      );
      when(mockedGetUpperBoundsSTVersionMethod.callAsync()).thenResolve(expectedGetUpperBoundsSTVersionResult);

      // Mock getLowerBoundsSTVersion
      const expectedGetLowerBoundsSTVersionResult = [new BigNumber(1), new BigNumber(2), new BigNumber(3)];
      const mockedGetLowerBoundsSTVersionMethod = mock(MockedCallMethod);
      when(mockedModuleFactoryContract.getLowerSTVersionBounds).thenReturn(
        instance(mockedGetLowerBoundsSTVersionMethod),
      );
      when(mockedGetLowerBoundsSTVersionMethod.callAsync()).thenResolve(expectedGetLowerBoundsSTVersionResult);

      // checkModuleStructAddressIsEmpty
      const expectedModuleResult = [
        stringToBytes32('CountTransferManager'),
        '0x0000000000000000000000000000000000000000',
        '0x5555555555555555555555555555555555555555',
        false,
        [new BigNumber(1), new BigNumber(2)],
      ];
      const mockedModuleMethod = mock(MockedCallMethod);

      when(mockedContract.getModule).thenReturn(instance(mockedModuleMethod));
      when(mockedModuleMethod.callAsync(ADDRESS)).thenResolve(expectedModuleResult);

      // === Start CountTransferManager test ===
      const ctmParams = {
        maxHolderCount: 10,
      };
      const mockedCtmParams = {
        moduleName: ModuleName.countTransferManager,
        address: ADDRESS,
        maxCost: new BigNumber(1),
        budget: new BigNumber(1),
        data: ctmParams,
        txData: {},
        safetyFactor: 10,
      };

      const iCtmFace = new ethers.utils.Interface(CountTransferManager.abi);
      const ctmData = iCtmFace.functions.configure.encode([mockedCtmParams.data.maxHolderCount]);

      when(
        mockedMethod.sendTransactionAsync(
          mockedCtmParams.address,
          objectContaining(ctmData),
          objectContaining(valueToWei(mockedCtmParams.maxCost, FULL_DECIMALS)),
          objectContaining(valueToWei(mockedCtmParams.budget, FULL_DECIMALS)),
          mockedCtmParams.txData,
          mockedCtmParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      const ctmResult = await target.addModule({
        moduleName: ModuleName.countTransferManager,
        address: mockedCtmParams.address,
        maxCost: mockedCtmParams.maxCost,
        budget: mockedCtmParams.budget,
        data: {
          maxHolderCount: ctmParams.maxHolderCount,
        },
        txData: mockedCtmParams.txData,
        safetyFactor: mockedCtmParams.safetyFactor,
      });

      expect(ctmResult).toBe(expectedResult);
      verify(
        mockedMethod.sendTransactionAsync(
          mockedCtmParams.address,
          objectContaining(ctmData),
          objectContaining(valueToWei(mockedCtmParams.maxCost, FULL_DECIMALS)),
          objectContaining(valueToWei(mockedCtmParams.budget, FULL_DECIMALS)),
          mockedCtmParams.txData,
          mockedCtmParams.safetyFactor,
        ),
      ).once();
      // === End CountTransferManager test ===

      verify(mockedContract.addModule).once();
      verify(mockedContract.owner).twice();
      verify(mockedOwnerMethod.callAsync()).twice();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedModuleFactoryContract.getSetupCost).once();
      verify(mockedGetModuleStatusMethod.callAsync()).once();
      verify(mockedPolyTokenContract.balanceOf).once();
      verify(mockedBalanceMethod.callAsync(stAddressResult)).once();
      verify(mockedContract.getModule).once();
      verify(mockedModuleMethod.callAsync(ADDRESS)).once();
      verify(mockedContractFactory.getFeatureRegistryContract()).once();
      verify(mockedFeatureRegistryContract.getFeatureStatus).once();
      verify(mockedGetFeatureStatusMethod.callAsync(Features.CustomModulesAllowed)).once();
      verify(mockedModuleFactoryContract.owner).once();
      verify(mockedModuleFactoryOwnerMethod.callAsync()).once();
      verify(mockedContractFactory.getModuleRegistryContract()).once();
      verify(mockedModuleRegistryContract.getModulesByType).times(5);
      verify(mockedGetModulesMethod.callAsync(ModuleType.PermissionManager)).once();
      verify(mockedGetModulesMethod.callAsync(ModuleType.STO)).once();
      verify(mockedGetModulesMethod.callAsync(ModuleType.Burn)).once();
      verify(mockedGetModulesMethod.callAsync(ModuleType.Dividends)).once();
      verify(mockedGetModulesMethod.callAsync(ModuleType.TransferManager)).once();
      verify(mockedContract.getVersion).once();
      verify(mockedGetVersionMethod.callAsync()).once();
      verify(mockedModuleFactoryContract.getUpperSTVersionBounds).once();
      verify(mockedModuleFactoryContract.getLowerSTVersionBounds).once();
      verify(mockedGetLowerBoundsSTVersionMethod.callAsync()).once();
      verify(mockedGetUpperBoundsSTVersionMethod.callAsync()).once();
      verify(mockedContractFactory.getModuleFactoryContract(ADDRESS)).times(4);
      verify(mockedContractFactory.getPolyTokenContract()).once();
      verify(mockedContract.decimals).once();
      verify(mockedDecimalsMethod.callAsync()).once();
      verify(mockedContract.address).once();
    });

    test('should send the transaction to addModule for PercentageTransferManager', async () => {
      const ADDRESS = '0x1111111111111111111111111111111111111111';
      const OWNER = '0x5555555555555555555555555555555555555555';
      const expectedResult = getMockedPolyResponse();
      const mockedMethod = mock(MockedSendMethod);
      when(mockedContract.addModule).thenReturn(instance(mockedMethod));

      const expectedDecimalsResult = new BigNumber(18);
      const mockedDecimalsMethod = mock(MockedCallMethod);
      when(mockedContract.decimals).thenReturn(instance(mockedDecimalsMethod));
      when(mockedDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);

      // checkOnlyOwner
      const expectedOwnerResult = OWNER;
      const mockedOwnerMethod = mock(MockedCallMethod);
      when(mockedContract.owner).thenReturn(instance(mockedOwnerMethod));
      when(mockedOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // checkModuleCostBelowMaxCost
      when(mockedContractFactory.getModuleFactoryContract(ADDRESS)).thenResolve(instance(mockedModuleFactoryContract));
      const mockedGetModuleStatusMethod = mock(MockedCallMethod);
      const moduleResult = new BigNumber(1);
      when(mockedModuleFactoryContract.getSetupCost).thenReturn(instance(mockedGetModuleStatusMethod));
      when(mockedGetModuleStatusMethod.callAsync()).thenResolve(moduleResult);

      const stAddressResult = '0x7777777777777777777777777777777777777777';
      when(mockedContract.address).thenReturn(stAddressResult);

      when(mockedContractFactory.getPolyTokenContract()).thenResolve(instance(mockedPolyTokenContract));
      const mockedBalanceMethod = mock(MockedCallMethod);
      const balanceResult = new BigNumber(1);
      when(mockedPolyTokenContract.balanceOf).thenReturn(instance(mockedBalanceMethod));
      when(mockedBalanceMethod.callAsync(stAddressResult)).thenResolve(balanceResult);

      // Setup mocked Get Feature registry contract
      when(mockedContractFactory.getFeatureRegistryContract()).thenResolve(instance(mockedFeatureRegistryContract));
      const mockedGetFeatureStatusMethod = mock(MockedCallMethod);
      const currentFeatureStatus = true;
      when(mockedFeatureRegistryContract.getFeatureStatus).thenReturn(instance(mockedGetFeatureStatusMethod));
      when(mockedGetFeatureStatusMethod.callAsync(Features.CustomModulesAllowed)).thenResolve(currentFeatureStatus);

      // Setup mocked contractFactory owner
      const mockedModuleFactoryOwnerMethod = mock(MockedCallMethod);
      when(mockedModuleFactoryContract.owner).thenReturn(instance(mockedModuleFactoryOwnerMethod));
      when(mockedModuleFactoryOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);

      const expectedAlreadyRegisteredResult = [
        '0x1111111111111111111111111111111111111111',
        '0x2222222222222222222222222222222222222222',
      ];
      when(mockedContractFactory.getModuleRegistryContract()).thenResolve(instance(mockedModuleRegistryContract));
      const mockedGetModulesMethod = mock(MockedCallMethod);
      when(mockedModuleRegistryContract.getModulesByType).thenReturn(instance(mockedGetModulesMethod));
      when(mockedGetModulesMethod.callAsync(ModuleType.PermissionManager)).thenResolve(expectedAlreadyRegisteredResult);
      when(mockedGetModulesMethod.callAsync(ModuleType.STO)).thenResolve(expectedAlreadyRegisteredResult);
      when(mockedGetModulesMethod.callAsync(ModuleType.Burn)).thenResolve(expectedAlreadyRegisteredResult);
      when(mockedGetModulesMethod.callAsync(ModuleType.Dividends)).thenResolve(expectedAlreadyRegisteredResult);
      when(mockedGetModulesMethod.callAsync(ModuleType.TransferManager)).thenResolve(expectedAlreadyRegisteredResult);

      // Mock getVersion
      const expectedGetVersionResult = [new BigNumber(3), new BigNumber(4), new BigNumber(5)];
      const mockedGetVersionMethod = mock(MockedCallMethod);
      when(mockedContract.getVersion).thenReturn(instance(mockedGetVersionMethod));
      when(mockedGetVersionMethod.callAsync()).thenResolve(expectedGetVersionResult);

      // Mock getUpperBoundsSTVersion
      const expectedGetUpperBoundsSTVersionResult = [new BigNumber(4), new BigNumber(5), new BigNumber(6)];
      const mockedGetUpperBoundsSTVersionMethod = mock(MockedCallMethod);
      when(mockedModuleFactoryContract.getUpperSTVersionBounds).thenReturn(
        instance(mockedGetUpperBoundsSTVersionMethod),
      );
      when(mockedGetUpperBoundsSTVersionMethod.callAsync()).thenResolve(expectedGetUpperBoundsSTVersionResult);

      // Mock getLowerBoundsSTVersion
      const expectedGetLowerBoundsSTVersionResult = [new BigNumber(1), new BigNumber(2), new BigNumber(3)];
      const mockedGetLowerBoundsSTVersionMethod = mock(MockedCallMethod);
      when(mockedModuleFactoryContract.getLowerSTVersionBounds).thenReturn(
        instance(mockedGetLowerBoundsSTVersionMethod),
      );
      when(mockedGetLowerBoundsSTVersionMethod.callAsync()).thenResolve(expectedGetLowerBoundsSTVersionResult);

      // checkModuleStructAddressIsEmpty
      const expectedModuleResult = [
        stringToBytes32('PercentageTransferManager'),
        '0x0000000000000000000000000000000000000000',
        '0x5555555555555555555555555555555555555555',
        false,
        [new BigNumber(1), new BigNumber(2)],
      ];
      const mockedModuleMethod = mock(MockedCallMethod);
      when(mockedContract.getModule).thenReturn(instance(mockedModuleMethod));
      when(mockedModuleMethod.callAsync(ADDRESS)).thenResolve(expectedModuleResult);

      // === Start PercentageTransferManager test ===
      const ptmParams = {
        maxHolderPercentage: new BigNumber(1),
        allowPrimaryIssuance: true,
      };
      const mockedPtmParams = {
        moduleName: ModuleName.percentageTransferManager,
        address: ADDRESS,
        maxCost: new BigNumber(1),
        budget: new BigNumber(1),
        data: ptmParams,
        txData: {},
        safetyFactor: 10,
      };

      const iPtmFace = new ethers.utils.Interface(PercentageTransferManager.abi);
      const ptmData = iPtmFace.functions.configure.encode([
        valueToWei(mockedPtmParams.data.maxHolderPercentage, PERCENTAGE_DECIMALS).toString(),
        mockedPtmParams.data.allowPrimaryIssuance,
      ]);

      when(
        mockedMethod.sendTransactionAsync(
          mockedPtmParams.address,
          objectContaining(ptmData),
          objectContaining(valueToWei(mockedPtmParams.maxCost, expectedDecimalsResult)),
          objectContaining(valueToWei(mockedPtmParams.budget, expectedDecimalsResult)),
          mockedPtmParams.txData,
          mockedPtmParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      const ptmResult = await target.addModule({
        moduleName: ModuleName.percentageTransferManager,
        address: mockedPtmParams.address,
        maxCost: mockedPtmParams.maxCost,
        budget: mockedPtmParams.budget,
        data: {
          maxHolderPercentage: ptmParams.maxHolderPercentage,
          allowPrimaryIssuance: ptmParams.allowPrimaryIssuance,
        },
        txData: mockedPtmParams.txData,
        safetyFactor: mockedPtmParams.safetyFactor,
      });

      expect(ptmResult).toBe(expectedResult);
      verify(
        mockedMethod.sendTransactionAsync(
          mockedPtmParams.address,
          objectContaining(ptmData),
          objectContaining(valueToWei(mockedPtmParams.maxCost, expectedDecimalsResult)),
          objectContaining(valueToWei(mockedPtmParams.budget, expectedDecimalsResult)),
          mockedPtmParams.txData,
          mockedPtmParams.safetyFactor,
        ),
      ).once();
      // === End PTM test ===

      verify(mockedContract.addModule).once();
      verify(mockedContract.owner).twice();
      verify(mockedOwnerMethod.callAsync()).twice();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedModuleFactoryContract.getSetupCost).once();
      verify(mockedGetModuleStatusMethod.callAsync()).once();
      verify(mockedPolyTokenContract.balanceOf).once();
      verify(mockedBalanceMethod.callAsync(stAddressResult)).once();
      verify(mockedContract.getModule).once();
      verify(mockedModuleMethod.callAsync(ADDRESS)).once();
      verify(mockedContractFactory.getFeatureRegistryContract()).once();
      verify(mockedFeatureRegistryContract.getFeatureStatus).once();
      verify(mockedGetFeatureStatusMethod.callAsync(Features.CustomModulesAllowed)).once();
      verify(mockedModuleFactoryContract.owner).once();
      verify(mockedModuleFactoryOwnerMethod.callAsync()).once();
      verify(mockedContractFactory.getModuleRegistryContract()).once();
      verify(mockedModuleRegistryContract.getModulesByType).times(5);
      verify(mockedGetModulesMethod.callAsync(ModuleType.PermissionManager)).once();
      verify(mockedGetModulesMethod.callAsync(ModuleType.STO)).once();
      verify(mockedGetModulesMethod.callAsync(ModuleType.Burn)).once();
      verify(mockedGetModulesMethod.callAsync(ModuleType.Dividends)).once();
      verify(mockedGetModulesMethod.callAsync(ModuleType.TransferManager)).once();
      verify(mockedContract.getVersion).once();
      verify(mockedGetVersionMethod.callAsync()).once();
      verify(mockedModuleFactoryContract.getUpperSTVersionBounds).once();
      verify(mockedModuleFactoryContract.getLowerSTVersionBounds).once();
      verify(mockedGetLowerBoundsSTVersionMethod.callAsync()).once();
      verify(mockedGetUpperBoundsSTVersionMethod.callAsync()).once();
      verify(mockedContractFactory.getModuleFactoryContract(ADDRESS)).times(4);
      verify(mockedContractFactory.getPolyTokenContract()).once();
      verify(mockedContract.decimals).once();
      verify(mockedDecimalsMethod.callAsync()).once();
      verify(mockedContract.address).once();
    });

    test('should send the transaction to addModule for CappedSTO', async () => {
      const ADDRESS = '0x1111111111111111111111111111111111111111';
      const OWNER = '0x5555555555555555555555555555555555555555';
      const expectedResult = getMockedPolyResponse();
      const mockedMethod = mock(MockedSendMethod);
      when(mockedContract.addModule).thenReturn(instance(mockedMethod));

      const expectedDecimalsResult = new BigNumber(18);
      const mockedDecimalsMethod = mock(MockedCallMethod);
      when(mockedContract.decimals).thenReturn(instance(mockedDecimalsMethod));
      when(mockedDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);

      // checkOnlyOwner
      const expectedOwnerResult = OWNER;
      const mockedOwnerMethod = mock(MockedCallMethod);
      when(mockedContract.owner).thenReturn(instance(mockedOwnerMethod));
      when(mockedOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // checkModuleCostBelowMaxCost
      when(mockedContractFactory.getModuleFactoryContract(ADDRESS)).thenResolve(instance(mockedModuleFactoryContract));
      const mockedGetModuleStatusMethod = mock(MockedCallMethod);
      const moduleResult = new BigNumber(1);
      when(mockedModuleFactoryContract.getSetupCost).thenReturn(instance(mockedGetModuleStatusMethod));
      when(mockedGetModuleStatusMethod.callAsync()).thenResolve(moduleResult);

      // Setup mocked Get Feature registry contract
      when(mockedContractFactory.getFeatureRegistryContract()).thenResolve(instance(mockedFeatureRegistryContract));
      const mockedGetFeatureStatusMethod = mock(MockedCallMethod);
      const currentFeatureStatus = true;
      when(mockedFeatureRegistryContract.getFeatureStatus).thenReturn(instance(mockedGetFeatureStatusMethod));
      when(mockedGetFeatureStatusMethod.callAsync(Features.CustomModulesAllowed)).thenResolve(currentFeatureStatus);

      // Setup mocked contractFactory owner
      const mockedModuleFactoryOwnerMethod = mock(MockedCallMethod);
      when(mockedModuleFactoryContract.owner).thenReturn(instance(mockedModuleFactoryOwnerMethod));
      when(mockedModuleFactoryOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);

      const expectedAlreadyRegisteredResult = [
        '0x1111111111111111111111111111111111111111',
        '0x2222222222222222222222222222222222222222',
      ];
      when(mockedContractFactory.getModuleRegistryContract()).thenResolve(instance(mockedModuleRegistryContract));
      const mockedGetModulesMethod = mock(MockedCallMethod);
      when(mockedModuleRegistryContract.getModulesByType).thenReturn(instance(mockedGetModulesMethod));
      when(mockedGetModulesMethod.callAsync(ModuleType.PermissionManager)).thenResolve(expectedAlreadyRegisteredResult);
      when(mockedGetModulesMethod.callAsync(ModuleType.STO)).thenResolve(expectedAlreadyRegisteredResult);
      when(mockedGetModulesMethod.callAsync(ModuleType.Burn)).thenResolve(expectedAlreadyRegisteredResult);
      when(mockedGetModulesMethod.callAsync(ModuleType.Dividends)).thenResolve(expectedAlreadyRegisteredResult);
      when(mockedGetModulesMethod.callAsync(ModuleType.TransferManager)).thenResolve(expectedAlreadyRegisteredResult);

      // Mock getVersion
      const expectedGetVersionResult = [new BigNumber(3), new BigNumber(4), new BigNumber(5)];
      const mockedGetVersionMethod = mock(MockedCallMethod);
      when(mockedContract.getVersion).thenReturn(instance(mockedGetVersionMethod));
      when(mockedGetVersionMethod.callAsync()).thenResolve(expectedGetVersionResult);

      // Mock getUpperBoundsSTVersion
      const expectedGetUpperBoundsSTVersionResult = [new BigNumber(4), new BigNumber(5), new BigNumber(6)];
      const mockedGetUpperBoundsSTVersionMethod = mock(MockedCallMethod);
      when(mockedModuleFactoryContract.getUpperSTVersionBounds).thenReturn(
        instance(mockedGetUpperBoundsSTVersionMethod),
      );
      when(mockedGetUpperBoundsSTVersionMethod.callAsync()).thenResolve(expectedGetUpperBoundsSTVersionResult);

      // Mock getLowerBoundsSTVersion
      const expectedGetLowerBoundsSTVersionResult = [new BigNumber(1), new BigNumber(2), new BigNumber(3)];
      const mockedGetLowerBoundsSTVersionMethod = mock(MockedCallMethod);
      when(mockedModuleFactoryContract.getLowerSTVersionBounds).thenReturn(
        instance(mockedGetLowerBoundsSTVersionMethod),
      );
      when(mockedGetLowerBoundsSTVersionMethod.callAsync()).thenResolve(expectedGetLowerBoundsSTVersionResult);

      const stAddressResult = '0x7777777777777777777777777777777777777777';
      when(mockedContract.address).thenReturn(stAddressResult);

      when(mockedContractFactory.getPolyTokenContract()).thenResolve(instance(mockedPolyTokenContract));
      const mockedBalanceMethod = mock(MockedCallMethod);
      const balanceResult = new BigNumber(1);
      when(mockedPolyTokenContract.balanceOf).thenReturn(instance(mockedBalanceMethod));
      when(mockedBalanceMethod.callAsync(stAddressResult)).thenResolve(balanceResult);

      // checkModuleStructAddressIsEmpty
      const expectedModuleResult = [
        stringToBytes32('CappedSTO'),
        '0x0000000000000000000000000000000000000000',
        '0x5555555555555555555555555555555555555555',
        false,
        [new BigNumber(1), new BigNumber(2)],
      ];
      const mockedModuleMethod = mock(MockedCallMethod);
      when(mockedContract.getModule).thenReturn(instance(mockedModuleMethod));
      when(mockedModuleMethod.callAsync(ADDRESS)).thenResolve(expectedModuleResult);

      // === Start CappedSTO test ===
      const cappedParams = {
        startTime: new Date(2030, 1),
        endTime: new Date(2031, 1),
        cap: new BigNumber(1),
        rate: new BigNumber(1),
        fundRaiseTypes: [FundRaiseType.ETH],
        fundsReceiver: '0x2222222222222222222222222222222222222222',
      };
      const mockedCappedParams = {
        moduleName: ModuleName.cappedSTO,
        address: ADDRESS,
        maxCost: new BigNumber(1),
        budget: new BigNumber(1),
        data: cappedParams,
        txData: {},
        safetyFactor: 10,
      };

      const iCappedFace = new ethers.utils.Interface(CappedSTO.abi);
      const cappedData = iCappedFace.functions.configure.encode([
        dateToBigNumber(mockedCappedParams.data.startTime).toNumber(),
        dateToBigNumber(mockedCappedParams.data.endTime).toNumber(),
        valueToWei(mockedCappedParams.data.cap, expectedDecimalsResult).toString(),
        valueToWei(mockedCappedParams.data.rate, FULL_DECIMALS).toString(),
        mockedCappedParams.data.fundRaiseTypes,
        mockedCappedParams.data.fundsReceiver,
      ]);

      when(
        mockedMethod.sendTransactionAsync(
          mockedCappedParams.address,
          objectContaining(cappedData),
          objectContaining(valueToWei(mockedCappedParams.maxCost, expectedDecimalsResult)),
          objectContaining(valueToWei(mockedCappedParams.budget, expectedDecimalsResult)),
          mockedCappedParams.txData,
          mockedCappedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      const cappedResult = await target.addModule({
        moduleName: ModuleName.cappedSTO,
        address: mockedCappedParams.address,
        maxCost: mockedCappedParams.maxCost,
        budget: mockedCappedParams.budget,
        data: {
          startTime: cappedParams.startTime,
          endTime: cappedParams.endTime,
          cap: cappedParams.cap,
          rate: cappedParams.rate,
          fundRaiseTypes: cappedParams.fundRaiseTypes,
          fundsReceiver: cappedParams.fundsReceiver,
        },
        txData: mockedCappedParams.txData,
        safetyFactor: mockedCappedParams.safetyFactor,
      });

      expect(cappedResult).toBe(expectedResult);
      verify(
        mockedMethod.sendTransactionAsync(
          mockedCappedParams.address,
          objectContaining(cappedData),
          objectContaining(valueToWei(mockedCappedParams.maxCost, expectedDecimalsResult)),
          objectContaining(valueToWei(mockedCappedParams.budget, expectedDecimalsResult)),
          mockedCappedParams.txData,
          mockedCappedParams.safetyFactor,
        ),
      ).once();
      // === End CappedSTO test ===

      verify(mockedContract.addModule).once();
      verify(mockedContract.owner).twice();
      verify(mockedOwnerMethod.callAsync()).twice();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedModuleFactoryContract.getSetupCost).once();
      verify(mockedGetModuleStatusMethod.callAsync()).once();
      verify(mockedPolyTokenContract.balanceOf).once();
      verify(mockedBalanceMethod.callAsync(stAddressResult)).once();
      verify(mockedContract.getModule).once();
      verify(mockedModuleMethod.callAsync(ADDRESS)).once();
      verify(mockedContractFactory.getFeatureRegistryContract()).once();
      verify(mockedFeatureRegistryContract.getFeatureStatus).once();
      verify(mockedGetFeatureStatusMethod.callAsync(Features.CustomModulesAllowed)).once();
      verify(mockedModuleFactoryContract.owner).once();
      verify(mockedModuleFactoryOwnerMethod.callAsync()).once();
      verify(mockedContractFactory.getModuleRegistryContract()).once();
      verify(mockedModuleRegistryContract.getModulesByType).times(5);
      verify(mockedGetModulesMethod.callAsync(ModuleType.PermissionManager)).once();
      verify(mockedGetModulesMethod.callAsync(ModuleType.STO)).once();
      verify(mockedGetModulesMethod.callAsync(ModuleType.Burn)).once();
      verify(mockedGetModulesMethod.callAsync(ModuleType.Dividends)).once();
      verify(mockedGetModulesMethod.callAsync(ModuleType.TransferManager)).once();
      verify(mockedContract.getVersion).once();
      verify(mockedGetVersionMethod.callAsync()).once();
      verify(mockedModuleFactoryContract.getUpperSTVersionBounds).once();
      verify(mockedModuleFactoryContract.getLowerSTVersionBounds).once();
      verify(mockedGetLowerBoundsSTVersionMethod.callAsync()).once();
      verify(mockedGetUpperBoundsSTVersionMethod.callAsync()).once();
      verify(mockedContractFactory.getModuleFactoryContract(ADDRESS)).times(4);
      verify(mockedContractFactory.getPolyTokenContract()).once();
      verify(mockedContract.decimals).once();
      verify(mockedDecimalsMethod.callAsync()).once();
      verify(mockedContract.address).once();
    });

    test('should send the transaction to addModule for USDTieredSTO', async () => {
      const ADDRESS = '0x1111111111111111111111111111111111111111';
      const OWNER = '0x5555555555555555555555555555555555555555';
      const expectedResult = getMockedPolyResponse();
      const mockedMethod = mock(MockedSendMethod);
      when(mockedContract.addModule).thenReturn(instance(mockedMethod));

      const expectedDecimalsResult = new BigNumber(18);
      const mockedDecimalsMethod = mock(MockedCallMethod);
      when(mockedContract.decimals).thenReturn(instance(mockedDecimalsMethod));
      when(mockedDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);

      // checkOnlyOwner
      const expectedOwnerResult = OWNER;
      const mockedOwnerMethod = mock(MockedCallMethod);
      when(mockedContract.owner).thenReturn(instance(mockedOwnerMethod));
      when(mockedOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // checkModuleCostBelowMaxCost
      when(mockedContractFactory.getModuleFactoryContract(ADDRESS)).thenResolve(instance(mockedModuleFactoryContract));
      const mockedGetModuleStatusMethod = mock(MockedCallMethod);
      const moduleResult = new BigNumber(1);
      when(mockedModuleFactoryContract.getSetupCost).thenReturn(instance(mockedGetModuleStatusMethod));
      when(mockedGetModuleStatusMethod.callAsync()).thenResolve(moduleResult);

      const stAddressResult = '0x7777777777777777777777777777777777777777';
      when(mockedContract.address).thenReturn(stAddressResult);

      when(mockedContractFactory.getPolyTokenContract()).thenResolve(instance(mockedPolyTokenContract));
      const mockedBalanceMethod = mock(MockedCallMethod);
      const balanceResult = new BigNumber(1);
      when(mockedPolyTokenContract.balanceOf).thenReturn(instance(mockedBalanceMethod));
      when(mockedBalanceMethod.callAsync(stAddressResult)).thenResolve(balanceResult);

      // Setup mocked Get Feature registry contract
      when(mockedContractFactory.getFeatureRegistryContract()).thenResolve(instance(mockedFeatureRegistryContract));
      const mockedGetFeatureStatusMethod = mock(MockedCallMethod);
      const currentFeatureStatus = true;
      when(mockedFeatureRegistryContract.getFeatureStatus).thenReturn(instance(mockedGetFeatureStatusMethod));
      when(mockedGetFeatureStatusMethod.callAsync(Features.CustomModulesAllowed)).thenResolve(currentFeatureStatus);

      // Setup mocked contractFactory owner
      const mockedModuleFactoryOwnerMethod = mock(MockedCallMethod);
      when(mockedModuleFactoryContract.owner).thenReturn(instance(mockedModuleFactoryOwnerMethod));
      when(mockedModuleFactoryOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);

      const expectedAlreadyRegisteredResult = [
        '0x1111111111111111111111111111111111111111',
        '0x2222222222222222222222222222222222222222',
      ];
      when(mockedContractFactory.getModuleRegistryContract()).thenResolve(instance(mockedModuleRegistryContract));
      const mockedGetModulesMethod = mock(MockedCallMethod);
      when(mockedModuleRegistryContract.getModulesByType).thenReturn(instance(mockedGetModulesMethod));
      when(mockedGetModulesMethod.callAsync(ModuleType.PermissionManager)).thenResolve(expectedAlreadyRegisteredResult);
      when(mockedGetModulesMethod.callAsync(ModuleType.STO)).thenResolve(expectedAlreadyRegisteredResult);
      when(mockedGetModulesMethod.callAsync(ModuleType.Burn)).thenResolve(expectedAlreadyRegisteredResult);
      when(mockedGetModulesMethod.callAsync(ModuleType.Dividends)).thenResolve(expectedAlreadyRegisteredResult);
      when(mockedGetModulesMethod.callAsync(ModuleType.TransferManager)).thenResolve(expectedAlreadyRegisteredResult);

      // Mock getVersion
      const expectedGetVersionResult = [new BigNumber(3), new BigNumber(4), new BigNumber(5)];
      const mockedGetVersionMethod = mock(MockedCallMethod);
      when(mockedContract.getVersion).thenReturn(instance(mockedGetVersionMethod));
      when(mockedGetVersionMethod.callAsync()).thenResolve(expectedGetVersionResult);

      // Mock getUpperBoundsSTVersion
      const expectedGetUpperBoundsSTVersionResult = [new BigNumber(4), new BigNumber(5), new BigNumber(6)];
      const mockedGetUpperBoundsSTVersionMethod = mock(MockedCallMethod);
      when(mockedModuleFactoryContract.getUpperSTVersionBounds).thenReturn(
        instance(mockedGetUpperBoundsSTVersionMethod),
      );
      when(mockedGetUpperBoundsSTVersionMethod.callAsync()).thenResolve(expectedGetUpperBoundsSTVersionResult);

      // Mock getLowerBoundsSTVersion
      const expectedGetLowerBoundsSTVersionResult = [new BigNumber(1), new BigNumber(2), new BigNumber(3)];
      const mockedGetLowerBoundsSTVersionMethod = mock(MockedCallMethod);
      when(mockedModuleFactoryContract.getLowerSTVersionBounds).thenReturn(
        instance(mockedGetLowerBoundsSTVersionMethod),
      );
      when(mockedGetLowerBoundsSTVersionMethod.callAsync()).thenResolve(expectedGetLowerBoundsSTVersionResult);

      // checkModuleStructAddressIsEmpty
      const expectedModuleResult = [
        stringToBytes32('USDTieredSTO'),
        '0x0000000000000000000000000000000000000000',
        '0x5555555555555555555555555555555555555555',
        false,
        [new BigNumber(1), new BigNumber(2)],
      ];
      const mockedModuleMethod = mock(MockedCallMethod);
      when(mockedContract.getModule).thenReturn(instance(mockedModuleMethod));
      when(mockedModuleMethod.callAsync(ADDRESS)).thenResolve(expectedModuleResult);

      // === Start USDTieredSTO test ===
      const usdTieredStoParams = {
        startTime: new Date(2030, 1),
        endTime: new Date(2031, 1),
        ratePerTier: [new BigNumber(10), new BigNumber(20)],
        ratePerTierDiscountPoly: [new BigNumber(1), new BigNumber(2)],
        tokensPerTierTotal: [new BigNumber(100), new BigNumber(200)],
        tokensPerTierDiscountPoly: [new BigNumber(1), new BigNumber(2)],
        nonAccreditedLimitUSD: new BigNumber(1),
        minimumInvestmentUSD: new BigNumber(1),
        fundRaiseTypes: [FundRaiseType.StableCoin],
        wallet: '0x1111111111111111111111111111111111111111',
        reserveWallet: '0x2222222222222222222222222222222222222222',
        usdTokens: ['0x1111111111111111111111111111111111111111', '0x2222222222222222222222222222222222222222'],
      };
      const mockedUsdTieredStoParams = {
        moduleName: ModuleName.usdTieredSTO,
        address: ADDRESS,
        maxCost: new BigNumber(1),
        budget: new BigNumber(1),
        data: usdTieredStoParams,
        txData: {},
        safetyFactor: 10,
      };

      const iUsdTieredStoFace = new ethers.utils.Interface(USDTieredSTO.abi);
      const usdTieredStoData = iUsdTieredStoFace.functions.configure.encode([
        dateToBigNumber(mockedUsdTieredStoParams.data.startTime).toNumber(),
        dateToBigNumber(mockedUsdTieredStoParams.data.endTime).toNumber(),
        mockedUsdTieredStoParams.data.ratePerTier.map(e => {
          return valueToWei(e, FULL_DECIMALS).toString();
        }),
        mockedUsdTieredStoParams.data.ratePerTierDiscountPoly.map(e => {
          return valueToWei(e, FULL_DECIMALS).toString();
        }),
        mockedUsdTieredStoParams.data.tokensPerTierTotal.map(e => {
          return valueToWei(e, expectedDecimalsResult).toString();
        }),
        mockedUsdTieredStoParams.data.tokensPerTierDiscountPoly.map(e => {
          return valueToWei(e, expectedDecimalsResult).toString();
        }),
        valueToWei(mockedUsdTieredStoParams.data.nonAccreditedLimitUSD, FULL_DECIMALS).toString(),
        valueToWei(mockedUsdTieredStoParams.data.minimumInvestmentUSD, FULL_DECIMALS).toString(),
        mockedUsdTieredStoParams.data.fundRaiseTypes,
        mockedUsdTieredStoParams.data.wallet,
        mockedUsdTieredStoParams.data.reserveWallet,
        mockedUsdTieredStoParams.data.usdTokens,
      ]);

      when(
        mockedMethod.sendTransactionAsync(
          mockedUsdTieredStoParams.address,
          objectContaining(usdTieredStoData),
          objectContaining(valueToWei(mockedUsdTieredStoParams.maxCost, expectedDecimalsResult)),
          objectContaining(valueToWei(mockedUsdTieredStoParams.budget, expectedDecimalsResult)),
          mockedUsdTieredStoParams.txData,
          mockedUsdTieredStoParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      const usdTieredStoResult = await target.addModule({
        moduleName: ModuleName.usdTieredSTO,
        address: mockedUsdTieredStoParams.address,
        maxCost: mockedUsdTieredStoParams.maxCost,
        budget: mockedUsdTieredStoParams.budget,
        data: {
          startTime: usdTieredStoParams.startTime,
          endTime: usdTieredStoParams.endTime,
          ratePerTier: usdTieredStoParams.ratePerTier,
          ratePerTierDiscountPoly: usdTieredStoParams.ratePerTierDiscountPoly,
          tokensPerTierTotal: usdTieredStoParams.tokensPerTierTotal,
          tokensPerTierDiscountPoly: usdTieredStoParams.tokensPerTierDiscountPoly,
          nonAccreditedLimitUSD: usdTieredStoParams.nonAccreditedLimitUSD,
          minimumInvestmentUSD: usdTieredStoParams.minimumInvestmentUSD,
          fundRaiseTypes: usdTieredStoParams.fundRaiseTypes,
          wallet: usdTieredStoParams.wallet,
          reserveWallet: usdTieredStoParams.reserveWallet,
          usdTokens: usdTieredStoParams.usdTokens,
        },
        txData: mockedUsdTieredStoParams.txData,
        safetyFactor: mockedUsdTieredStoParams.safetyFactor,
      });

      expect(usdTieredStoResult).toBe(expectedResult);
      verify(
        mockedMethod.sendTransactionAsync(
          mockedUsdTieredStoParams.address,
          objectContaining(usdTieredStoData),
          objectContaining(valueToWei(mockedUsdTieredStoParams.maxCost, expectedDecimalsResult)),
          objectContaining(valueToWei(mockedUsdTieredStoParams.budget, expectedDecimalsResult)),
          mockedUsdTieredStoParams.txData,
          mockedUsdTieredStoParams.safetyFactor,
        ),
      ).once();
      // === End USDTieredSTO test ===

      verify(mockedContract.addModule).once();
      verify(mockedContract.owner).twice();
      verify(mockedOwnerMethod.callAsync()).twice();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedModuleFactoryContract.getSetupCost).once();
      verify(mockedGetModuleStatusMethod.callAsync()).once();
      verify(mockedPolyTokenContract.balanceOf).once();
      verify(mockedBalanceMethod.callAsync(stAddressResult)).once();
      verify(mockedContract.getModule).once();
      verify(mockedModuleMethod.callAsync(ADDRESS)).once();
      verify(mockedContractFactory.getFeatureRegistryContract()).once();
      verify(mockedFeatureRegistryContract.getFeatureStatus).once();
      verify(mockedGetFeatureStatusMethod.callAsync(Features.CustomModulesAllowed)).once();
      verify(mockedModuleFactoryContract.owner).once();
      verify(mockedModuleFactoryOwnerMethod.callAsync()).once();
      verify(mockedContractFactory.getModuleRegistryContract()).once();
      verify(mockedModuleRegistryContract.getModulesByType).times(5);
      verify(mockedGetModulesMethod.callAsync(ModuleType.PermissionManager)).once();
      verify(mockedGetModulesMethod.callAsync(ModuleType.STO)).once();
      verify(mockedGetModulesMethod.callAsync(ModuleType.Burn)).once();
      verify(mockedGetModulesMethod.callAsync(ModuleType.Dividends)).once();
      verify(mockedGetModulesMethod.callAsync(ModuleType.TransferManager)).once();
      verify(mockedContract.getVersion).once();
      verify(mockedGetVersionMethod.callAsync()).once();
      verify(mockedModuleFactoryContract.getUpperSTVersionBounds).once();
      verify(mockedModuleFactoryContract.getLowerSTVersionBounds).once();
      verify(mockedGetLowerBoundsSTVersionMethod.callAsync()).once();
      verify(mockedGetUpperBoundsSTVersionMethod.callAsync()).once();
      verify(mockedContractFactory.getModuleFactoryContract(ADDRESS)).times(4);
      verify(mockedContractFactory.getPolyTokenContract()).once();
      verify(mockedContract.decimals).once();
      verify(mockedDecimalsMethod.callAsync()).once();
      verify(mockedContract.address).once();
    });

    test('should send the transaction to addModule for ERC20DividendCheckpoint', async () => {
      const ADDRESS = '0x1111111111111111111111111111111111111111';
      const OWNER = '0x5555555555555555555555555555555555555555';
      const expectedResult = getMockedPolyResponse();
      const mockedMethod = mock(MockedSendMethod);
      when(mockedContract.addModule).thenReturn(instance(mockedMethod));

      const expectedDecimalsResult = new BigNumber(18);
      const mockedDecimalsMethod = mock(MockedCallMethod);
      when(mockedContract.decimals).thenReturn(instance(mockedDecimalsMethod));
      when(mockedDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);

      // checkOnlyOwner
      const expectedOwnerResult = OWNER;
      const mockedOwnerMethod = mock(MockedCallMethod);
      when(mockedContract.owner).thenReturn(instance(mockedOwnerMethod));
      when(mockedOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // checkModuleCostBelowMaxCost
      when(mockedContractFactory.getModuleFactoryContract(ADDRESS)).thenResolve(instance(mockedModuleFactoryContract));
      const mockedGetModuleStatusMethod = mock(MockedCallMethod);
      const moduleResult = new BigNumber(1);
      when(mockedModuleFactoryContract.getSetupCost).thenReturn(instance(mockedGetModuleStatusMethod));
      when(mockedGetModuleStatusMethod.callAsync()).thenResolve(moduleResult);

      const stAddressResult = '0x7777777777777777777777777777777777777777';
      when(mockedContract.address).thenReturn(stAddressResult);

      when(mockedContractFactory.getPolyTokenContract()).thenResolve(instance(mockedPolyTokenContract));
      const mockedBalanceMethod = mock(MockedCallMethod);
      const balanceResult = new BigNumber(1);
      when(mockedPolyTokenContract.balanceOf).thenReturn(instance(mockedBalanceMethod));
      when(mockedBalanceMethod.callAsync(stAddressResult)).thenResolve(balanceResult);

      // Setup mocked Get Feature registry contract
      when(mockedContractFactory.getFeatureRegistryContract()).thenResolve(instance(mockedFeatureRegistryContract));
      const mockedGetFeatureStatusMethod = mock(MockedCallMethod);
      const currentFeatureStatus = true;
      when(mockedFeatureRegistryContract.getFeatureStatus).thenReturn(instance(mockedGetFeatureStatusMethod));
      when(mockedGetFeatureStatusMethod.callAsync(Features.CustomModulesAllowed)).thenResolve(currentFeatureStatus);

      // Setup mocked contractFactory owner
      const mockedModuleFactoryOwnerMethod = mock(MockedCallMethod);
      when(mockedModuleFactoryContract.owner).thenReturn(instance(mockedModuleFactoryOwnerMethod));
      when(mockedModuleFactoryOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);

      const expectedAlreadyRegisteredResult = [
        '0x1111111111111111111111111111111111111111',
        '0x2222222222222222222222222222222222222222',
      ];
      when(mockedContractFactory.getModuleRegistryContract()).thenResolve(instance(mockedModuleRegistryContract));
      const mockedGetModulesMethod = mock(MockedCallMethod);
      when(mockedModuleRegistryContract.getModulesByType).thenReturn(instance(mockedGetModulesMethod));
      when(mockedGetModulesMethod.callAsync(ModuleType.PermissionManager)).thenResolve(expectedAlreadyRegisteredResult);
      when(mockedGetModulesMethod.callAsync(ModuleType.STO)).thenResolve(expectedAlreadyRegisteredResult);
      when(mockedGetModulesMethod.callAsync(ModuleType.Burn)).thenResolve(expectedAlreadyRegisteredResult);
      when(mockedGetModulesMethod.callAsync(ModuleType.Dividends)).thenResolve(expectedAlreadyRegisteredResult);
      when(mockedGetModulesMethod.callAsync(ModuleType.TransferManager)).thenResolve(expectedAlreadyRegisteredResult);

      // Mock getVersion
      const expectedGetVersionResult = [new BigNumber(3), new BigNumber(4), new BigNumber(5)];
      const mockedGetVersionMethod = mock(MockedCallMethod);
      when(mockedContract.getVersion).thenReturn(instance(mockedGetVersionMethod));
      when(mockedGetVersionMethod.callAsync()).thenResolve(expectedGetVersionResult);

      // Mock getUpperBoundsSTVersion
      const expectedGetUpperBoundsSTVersionResult = [new BigNumber(4), new BigNumber(5), new BigNumber(6)];
      const mockedGetUpperBoundsSTVersionMethod = mock(MockedCallMethod);
      when(mockedModuleFactoryContract.getUpperSTVersionBounds).thenReturn(
        instance(mockedGetUpperBoundsSTVersionMethod),
      );
      when(mockedGetUpperBoundsSTVersionMethod.callAsync()).thenResolve(expectedGetUpperBoundsSTVersionResult);

      // Mock getLowerBoundsSTVersion
      const expectedGetLowerBoundsSTVersionResult = [new BigNumber(1), new BigNumber(2), new BigNumber(3)];
      const mockedGetLowerBoundsSTVersionMethod = mock(MockedCallMethod);
      when(mockedModuleFactoryContract.getLowerSTVersionBounds).thenReturn(
        instance(mockedGetLowerBoundsSTVersionMethod),
      );
      when(mockedGetLowerBoundsSTVersionMethod.callAsync()).thenResolve(expectedGetLowerBoundsSTVersionResult);

      // checkModuleStructAddressIsEmpty
      const expectedModuleResult = [
        stringToBytes32('ERC20DividendCheckpoint'),
        '0x0000000000000000000000000000000000000000',
        '0x5555555555555555555555555555555555555555',
        false,
        [new BigNumber(1), new BigNumber(2)],
      ];
      const mockedModuleMethod = mock(MockedCallMethod);
      when(mockedContract.getModule).thenReturn(instance(mockedModuleMethod));
      when(mockedModuleMethod.callAsync(ADDRESS)).thenResolve(expectedModuleResult);

      // === Start ERC20DividendCheckpoint test ===
      const erc20DividendParams = {
        wallet: '0x1111111111111111111111111111111111111111',
      };
      const mockedErc20DividendParams = {
        moduleName: ModuleName.erc20DividendCheckpoint,
        address: ADDRESS,
        maxCost: new BigNumber(1),
        budget: new BigNumber(1),
        data: erc20DividendParams,
        txData: {},
        safetyFactor: 10,
      };

      const iErc20DividendFace = new ethers.utils.Interface(ERC20DividendCheckpoint.abi);
      const erc20DividendData = iErc20DividendFace.functions.configure.encode([mockedErc20DividendParams.data.wallet]);

      when(
        mockedMethod.sendTransactionAsync(
          mockedErc20DividendParams.address,
          objectContaining(erc20DividendData),
          objectContaining(valueToWei(mockedErc20DividendParams.maxCost, expectedDecimalsResult)),
          objectContaining(valueToWei(mockedErc20DividendParams.budget, expectedDecimalsResult)),
          mockedErc20DividendParams.txData,
          mockedErc20DividendParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      const erc20DividendResult = await target.addModule({
        moduleName: ModuleName.erc20DividendCheckpoint,
        address: mockedErc20DividendParams.address,
        maxCost: mockedErc20DividendParams.maxCost,
        budget: mockedErc20DividendParams.budget,
        data: {
          wallet: erc20DividendParams.wallet,
        },
        txData: mockedErc20DividendParams.txData,
        safetyFactor: mockedErc20DividendParams.safetyFactor,
      });

      expect(erc20DividendResult).toBe(expectedResult);
      verify(
        mockedMethod.sendTransactionAsync(
          mockedErc20DividendParams.address,
          objectContaining(erc20DividendData),
          objectContaining(valueToWei(mockedErc20DividendParams.maxCost, expectedDecimalsResult)),
          objectContaining(valueToWei(mockedErc20DividendParams.budget, expectedDecimalsResult)),
          mockedErc20DividendParams.txData,
          mockedErc20DividendParams.safetyFactor,
        ),
      ).once();
      // === End ERC20DividendCheckpoint test ===

      verify(mockedContract.addModule).once();
      verify(mockedContract.owner).twice();
      verify(mockedOwnerMethod.callAsync()).twice();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedModuleFactoryContract.getSetupCost).once();
      verify(mockedGetModuleStatusMethod.callAsync()).once();
      verify(mockedPolyTokenContract.balanceOf).once();
      verify(mockedBalanceMethod.callAsync(stAddressResult)).once();
      verify(mockedContract.getModule).once();
      verify(mockedModuleMethod.callAsync(ADDRESS)).once();
      verify(mockedContractFactory.getFeatureRegistryContract()).once();
      verify(mockedFeatureRegistryContract.getFeatureStatus).once();
      verify(mockedGetFeatureStatusMethod.callAsync(Features.CustomModulesAllowed)).once();
      verify(mockedModuleFactoryContract.owner).once();
      verify(mockedModuleFactoryOwnerMethod.callAsync()).once();
      verify(mockedContractFactory.getModuleRegistryContract()).once();
      verify(mockedModuleRegistryContract.getModulesByType).times(5);
      verify(mockedGetModulesMethod.callAsync(ModuleType.PermissionManager)).once();
      verify(mockedGetModulesMethod.callAsync(ModuleType.STO)).once();
      verify(mockedGetModulesMethod.callAsync(ModuleType.Burn)).once();
      verify(mockedGetModulesMethod.callAsync(ModuleType.Dividends)).once();
      verify(mockedGetModulesMethod.callAsync(ModuleType.TransferManager)).once();
      verify(mockedContract.getVersion).once();
      verify(mockedGetVersionMethod.callAsync()).once();
      verify(mockedModuleFactoryContract.getUpperSTVersionBounds).once();
      verify(mockedModuleFactoryContract.getLowerSTVersionBounds).once();
      verify(mockedGetLowerBoundsSTVersionMethod.callAsync()).once();
      verify(mockedGetUpperBoundsSTVersionMethod.callAsync()).once();
      verify(mockedContractFactory.getModuleFactoryContract(ADDRESS)).times(4);
      verify(mockedContractFactory.getPolyTokenContract()).once();
      verify(mockedContract.decimals).once();
      verify(mockedDecimalsMethod.callAsync()).once();
      verify(mockedContract.address).once();
    });

    test('should send the transaction to addModule for EtherDividendCheckpoint', async () => {
      const ADDRESS = '0x1111111111111111111111111111111111111111';
      const OWNER = '0x5555555555555555555555555555555555555555';
      const expectedResult = getMockedPolyResponse();
      const mockedMethod = mock(MockedSendMethod);
      when(mockedContract.addModule).thenReturn(instance(mockedMethod));

      const expectedDecimalsResult = new BigNumber(18);
      const mockedDecimalsMethod = mock(MockedCallMethod);
      when(mockedContract.decimals).thenReturn(instance(mockedDecimalsMethod));
      when(mockedDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);

      // checkOnlyOwner
      const expectedOwnerResult = OWNER;
      const mockedOwnerMethod = mock(MockedCallMethod);
      when(mockedContract.owner).thenReturn(instance(mockedOwnerMethod));
      when(mockedOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // checkModuleCostBelowMaxCost
      when(mockedContractFactory.getModuleFactoryContract(ADDRESS)).thenResolve(instance(mockedModuleFactoryContract));
      const mockedGetModuleStatusMethod = mock(MockedCallMethod);
      const moduleResult = new BigNumber(1);
      when(mockedModuleFactoryContract.getSetupCost).thenReturn(instance(mockedGetModuleStatusMethod));
      when(mockedGetModuleStatusMethod.callAsync()).thenResolve(moduleResult);

      const stAddressResult = '0x7777777777777777777777777777777777777777';
      when(mockedContract.address).thenReturn(stAddressResult);

      when(mockedContractFactory.getPolyTokenContract()).thenResolve(instance(mockedPolyTokenContract));
      const mockedBalanceMethod = mock(MockedCallMethod);
      const balanceResult = new BigNumber(1);
      when(mockedPolyTokenContract.balanceOf).thenReturn(instance(mockedBalanceMethod));
      when(mockedBalanceMethod.callAsync(stAddressResult)).thenResolve(balanceResult);

      // Setup mocked Get Feature registry contract
      when(mockedContractFactory.getFeatureRegistryContract()).thenResolve(instance(mockedFeatureRegistryContract));
      const mockedGetFeatureStatusMethod = mock(MockedCallMethod);
      const currentFeatureStatus = true;
      when(mockedFeatureRegistryContract.getFeatureStatus).thenReturn(instance(mockedGetFeatureStatusMethod));
      when(mockedGetFeatureStatusMethod.callAsync(Features.CustomModulesAllowed)).thenResolve(currentFeatureStatus);

      // Setup mocked contractFactory owner
      const mockedModuleFactoryOwnerMethod = mock(MockedCallMethod);
      when(mockedModuleFactoryContract.owner).thenReturn(instance(mockedModuleFactoryOwnerMethod));
      when(mockedModuleFactoryOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);

      const expectedAlreadyRegisteredResult = [
        '0x1111111111111111111111111111111111111111',
        '0x2222222222222222222222222222222222222222',
      ];
      when(mockedContractFactory.getModuleRegistryContract()).thenResolve(instance(mockedModuleRegistryContract));
      const mockedGetModulesMethod = mock(MockedCallMethod);
      when(mockedModuleRegistryContract.getModulesByType).thenReturn(instance(mockedGetModulesMethod));
      when(mockedGetModulesMethod.callAsync(ModuleType.PermissionManager)).thenResolve(expectedAlreadyRegisteredResult);
      when(mockedGetModulesMethod.callAsync(ModuleType.STO)).thenResolve(expectedAlreadyRegisteredResult);
      when(mockedGetModulesMethod.callAsync(ModuleType.Burn)).thenResolve(expectedAlreadyRegisteredResult);
      when(mockedGetModulesMethod.callAsync(ModuleType.Dividends)).thenResolve(expectedAlreadyRegisteredResult);
      when(mockedGetModulesMethod.callAsync(ModuleType.TransferManager)).thenResolve(expectedAlreadyRegisteredResult);

      // Mock getVersion
      const expectedGetVersionResult = [new BigNumber(3), new BigNumber(4), new BigNumber(5)];
      const mockedGetVersionMethod = mock(MockedCallMethod);
      when(mockedContract.getVersion).thenReturn(instance(mockedGetVersionMethod));
      when(mockedGetVersionMethod.callAsync()).thenResolve(expectedGetVersionResult);

      // Mock getUpperBoundsSTVersion
      const expectedGetUpperBoundsSTVersionResult = [new BigNumber(4), new BigNumber(5), new BigNumber(6)];
      const mockedGetUpperBoundsSTVersionMethod = mock(MockedCallMethod);
      when(mockedModuleFactoryContract.getUpperSTVersionBounds).thenReturn(
        instance(mockedGetUpperBoundsSTVersionMethod),
      );
      when(mockedGetUpperBoundsSTVersionMethod.callAsync()).thenResolve(expectedGetUpperBoundsSTVersionResult);

      // Mock getLowerBoundsSTVersion
      const expectedGetLowerBoundsSTVersionResult = [new BigNumber(1), new BigNumber(2), new BigNumber(3)];
      const mockedGetLowerBoundsSTVersionMethod = mock(MockedCallMethod);
      when(mockedModuleFactoryContract.getLowerSTVersionBounds).thenReturn(
        instance(mockedGetLowerBoundsSTVersionMethod),
      );
      when(mockedGetLowerBoundsSTVersionMethod.callAsync()).thenResolve(expectedGetLowerBoundsSTVersionResult);

      // checkModuleStructAddressIsEmpty
      const expectedModuleResult = [
        stringToBytes32('EtherDividendCheckpoint'),
        '0x0000000000000000000000000000000000000000',
        '0x5555555555555555555555555555555555555555',
        false,
        [new BigNumber(1), new BigNumber(2)],
      ];
      const mockedModuleMethod = mock(MockedCallMethod);
      when(mockedContract.getModule).thenReturn(instance(mockedModuleMethod));
      when(mockedModuleMethod.callAsync(ADDRESS)).thenResolve(expectedModuleResult);

      // === Start EtherDividendCheckpoint test ===
      const etherDividendParams = {
        wallet: '0x1111111111111111111111111111111111111111',
      };
      const mockedEtherDividendParams = {
        moduleName: ModuleName.etherDividendCheckpoint,
        address: ADDRESS,
        maxCost: new BigNumber(1),
        budget: new BigNumber(1),
        data: etherDividendParams,
        txData: {},
        safetyFactor: 10,
      };

      const iEtherDividendFace = new ethers.utils.Interface(EtherDividendCheckpoint.abi);
      const etherDividendData = iEtherDividendFace.functions.configure.encode([mockedEtherDividendParams.data.wallet]);

      when(
        mockedMethod.sendTransactionAsync(
          mockedEtherDividendParams.address,
          objectContaining(etherDividendData),
          objectContaining(valueToWei(mockedEtherDividendParams.maxCost, expectedDecimalsResult)),
          objectContaining(valueToWei(mockedEtherDividendParams.budget, expectedDecimalsResult)),
          mockedEtherDividendParams.txData,
          mockedEtherDividendParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      const etherDividendResult = await target.addModule({
        moduleName: ModuleName.etherDividendCheckpoint,
        address: mockedEtherDividendParams.address,
        maxCost: mockedEtherDividendParams.maxCost,
        budget: mockedEtherDividendParams.budget,
        data: {
          wallet: etherDividendParams.wallet,
        },
        txData: mockedEtherDividendParams.txData,
        safetyFactor: mockedEtherDividendParams.safetyFactor,
      });

      expect(etherDividendResult).toBe(expectedResult);
      verify(
        mockedMethod.sendTransactionAsync(
          mockedEtherDividendParams.address,
          objectContaining(etherDividendData),
          objectContaining(valueToWei(mockedEtherDividendParams.maxCost, expectedDecimalsResult)),
          objectContaining(valueToWei(mockedEtherDividendParams.budget, expectedDecimalsResult)),
          mockedEtherDividendParams.txData,
          mockedEtherDividendParams.safetyFactor,
        ),
      ).once();
      // === End EtherDividendCheckpoint test ===

      verify(mockedContract.addModule).once();
      verify(mockedContract.owner).twice();
      verify(mockedOwnerMethod.callAsync()).twice();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedModuleFactoryContract.getSetupCost).once();
      verify(mockedGetModuleStatusMethod.callAsync()).once();
      verify(mockedPolyTokenContract.balanceOf).once();
      verify(mockedBalanceMethod.callAsync(stAddressResult)).once();
      verify(mockedContract.getModule).once();
      verify(mockedModuleMethod.callAsync(ADDRESS)).once();
      verify(mockedContractFactory.getFeatureRegistryContract()).once();
      verify(mockedFeatureRegistryContract.getFeatureStatus).once();
      verify(mockedGetFeatureStatusMethod.callAsync(Features.CustomModulesAllowed)).once();
      verify(mockedModuleFactoryContract.owner).once();
      verify(mockedModuleFactoryOwnerMethod.callAsync()).once();
      verify(mockedContractFactory.getModuleRegistryContract()).once();
      verify(mockedModuleRegistryContract.getModulesByType).times(5);
      verify(mockedGetModulesMethod.callAsync(ModuleType.PermissionManager)).once();
      verify(mockedGetModulesMethod.callAsync(ModuleType.STO)).once();
      verify(mockedGetModulesMethod.callAsync(ModuleType.Burn)).once();
      verify(mockedGetModulesMethod.callAsync(ModuleType.Dividends)).once();
      verify(mockedGetModulesMethod.callAsync(ModuleType.TransferManager)).once();
      verify(mockedContract.getVersion).once();
      verify(mockedGetVersionMethod.callAsync()).once();
      verify(mockedModuleFactoryContract.getUpperSTVersionBounds).once();
      verify(mockedModuleFactoryContract.getLowerSTVersionBounds).once();
      verify(mockedGetUpperBoundsSTVersionMethod.callAsync()).once();
      verify(mockedGetLowerBoundsSTVersionMethod.callAsync()).once();
      verify(mockedContractFactory.getModuleFactoryContract(ADDRESS)).times(4);
      verify(mockedContractFactory.getPolyTokenContract()).once();
      verify(mockedContract.decimals).once();
      verify(mockedDecimalsMethod.callAsync()).once();
      verify(mockedContract.address).once();
    });
  });

  describe('SubscribeAsync', () => {
    test('should throw as eventName does not belong to FeatureRegistryEvents', async () => {
      // Mocked parameters
      const mockedParams = {
        eventName: FeatureRegistryEvents.ChangeFeatureStatus,
        indexFilterValues: {},
        callback: () => {},
        isVerbose: false,
      };

      // Real call
      await expect(target.subscribeAsync(mockedParams)).rejects.toEqual(
        new Error(
          `Expected eventName to be one of: 'ModuleAdded', 'UpdateTokenDetails', 'GranularityChanged', 'ModuleArchived', 'ModuleUnarchived', 'ModuleRemoved', 'ModuleBudgetChanged', 'FreezeTransfers', 'CheckpointCreated', 'FreezeMinting', 'Minted', 'Burnt', 'SetController', 'ForceTransfer', 'ForceBurn', 'DisableController', 'OwnershipRenounced', 'OwnershipTransferred', 'Approval', 'Transfer', encountered: ChangeFeatureStatus`,
        ),
      );
    });
  });
});

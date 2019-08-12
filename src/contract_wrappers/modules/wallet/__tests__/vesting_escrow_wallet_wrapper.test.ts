// VestingEscrowWallet test
import { mock, instance, reset, when, verify, objectContaining } from 'ts-mockito';
import {
  VestingEscrowWalletContract,
  ISecurityTokenContract,
  PolyTokenEvents,
  BigNumber,
  Web3Wrapper,
} from '@polymathnetwork/abi-wrappers';
import { getMockedPolyResponse, MockedCallMethod, MockedSendMethod } from '../../../../test_utils/mocked_methods';
import VestingEscrowWalletWrapper from '../vesting_escrow_wallet_wrapper';
import ContractFactory from '../../../../factories/contractFactory';
import ModuleWrapper from '../../module_wrapper';
import {
  numberToBigNumber,
  stringToBytes32,
  bytes32ToString,
  bigNumberToDate,
  dateToBigNumber,
} from '../../../../utils/convert';

describe('VestingEscrowWalletWrapper', () => {
  let target: VestingEscrowWalletWrapper;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: VestingEscrowWalletContract;
  let mockedContractFactory: ContractFactory;
  let mockedSecurityTokenContract: ISecurityTokenContract;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(VestingEscrowWalletContract);
    mockedContractFactory = mock(ContractFactory);
    mockedSecurityTokenContract = mock(ISecurityTokenContract);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new VestingEscrowWalletWrapper(
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

  describe('Types', () => {
    test('should extend ModuleWrapper', async () => {
      expect(target instanceof ModuleWrapper).toBe(true);
    });
  });

  describe('Paused', () => {
    test('should get isPaused', async () => {
      // Address expected
      const expectedResult = true;
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.paused).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.paused();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.paused).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('Pause/Unpause', () => {
    test('should call to pause', async () => {
      // Pause Result expected
      const expectedPauseResult = false;
      // Mocked method
      const mockedPauseMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.paused).thenReturn(instance(mockedPauseMethod));
      // Stub the request
      when(mockedPauseMethod.callAsync()).thenResolve(expectedPauseResult);

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
      verify(mockedContract.paused).once();
      verify(mockedPauseMethod.callAsync()).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
    });

    test('should call to unpause', async () => {
      // Pause Result expected
      const expectedPauseResult = true;
      // Mocked method
      const mockedPauseMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.paused).thenReturn(instance(mockedPauseMethod));
      // Stub the request
      when(mockedPauseMethod.callAsync()).thenResolve(expectedPauseResult);

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
      verify(mockedContract.paused).once();
      verify(mockedPauseMethod.callAsync()).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('TreasuryWallet', () => {
    test('should get address from treasuryWallet', async () => {
      // Address expected
      const expectedResult = '0x1111111111111111111111111111111111111111';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.treasuryWallet).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.treasuryWallet();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.treasuryWallet).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('unassignedTokens', () => {
    test('should call to unassignedTokens', async () => {
      // Address expected
      const expectedResult = new BigNumber(1);
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.unassignedTokens).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.unassignedTokens();
      // Result expectation
      expect(result).toBe(expectedResult.toNumber());
      // Verifications
      verify(mockedContract.unassignedTokens).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('schedules', () => {
    test('should get schedules', async () => {
      // Address expected
      const expectedResult = [stringToBytes32('test'), new BigNumber(100), new BigNumber(200)];
      const mockedParams = {
        beneficiary: '0x3333333333333333333333333333333333333333',
        index: 1,
      };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.schedules).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.callAsync(mockedParams.beneficiary, objectContaining(numberToBigNumber(mockedParams.index))),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.schedules(mockedParams);
      // Result expectation
      expect(result.templateName).toEqual(bytes32ToString(expectedResult[0] as string));
      expect(result.claimedTokens).toEqual((expectedResult[1] as BigNumber).toNumber());
      expect(result.startTime).toEqual(bigNumberToDate(expectedResult[2] as BigNumber));

      // Verifications
      verify(mockedContract.schedules).once();
      verify(
        mockedMethod.callAsync(mockedParams.beneficiary, objectContaining(numberToBigNumber(mockedParams.index))),
      ).once();
    });
  });

  describe('templateNames', () => {
    test('should get templateNames', async () => {
      // Address expected
      const expectedResult = stringToBytes32('test');
      const mockedParams = {
        index: 1,
      };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.templateNames).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(objectContaining(numberToBigNumber(mockedParams.index)))).thenResolve(expectedResult);

      // Real call
      const result = await target.templateNames(mockedParams);
      // Result expectation
      expect(result).toEqual(bytes32ToString(expectedResult));

      // Verifications
      verify(mockedContract.templateNames).once();
      verify(mockedMethod.callAsync(objectContaining(numberToBigNumber(mockedParams.index)))).once();
    });
  });

  describe('beneficiaries', () => {
    test('should get beneficiaries', async () => {
      // Address expected
      const expectedResult = '0x5555555555555555555555555555555555555555';
      const mockedParams = {
        index: 1,
      };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.beneficiaries).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(objectContaining(numberToBigNumber(mockedParams.index)))).thenResolve(expectedResult);

      // Real call
      const result = await target.beneficiaries(mockedParams);
      // Result expectation
      expect(result).toBe(expectedResult);

      // Verifications
      verify(mockedContract.beneficiaries).once();
      verify(mockedMethod.callAsync(objectContaining(numberToBigNumber(mockedParams.index)))).once();
    });
  });

  describe('getTreasuryWallet', () => {
    test('should call to getTreasuryWallet', async () => {
      // Address expected
      const expectedResult = '0x5555555555555555555555555555555555555555';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getTreasuryWallet).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getTreasuryWallet();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getTreasuryWallet).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('getTemplateCount', () => {
    test('should call to getTemplateCount', async () => {
      // Address expected
      const expectedResult = new BigNumber(100);
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getTemplateCount).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getTemplateCount();
      // Result expectation
      expect(result).toEqual(expectedResult.toNumber());
      // Verifications
      verify(mockedContract.getTemplateCount).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('getAllTemplateNames', () => {
    test('should call to getAllTemplateNames', async () => {
      // Address expected
      const expectedResult = [stringToBytes32('template 1'), stringToBytes32('template 2')];
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getAllTemplateNames).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getAllTemplateNames();
      // Result expectation
      expect(result).toEqual(
        expectedResult.map(r => {
          return bytes32ToString(r);
        }),
      );
      // Verifications
      verify(mockedContract.getAllTemplateNames).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('getSchedule', () => {
    test('should get getSchedule', async () => {
      // Address expected
      const expectedResult = [
        new BigNumber(10),
        new BigNumber(100),
        new BigNumber(200),
        new BigNumber(10),
        new BigNumber(100),
        new BigNumber(0),
      ];
      const mockedParams = {
        beneficiary: '0x3333333333333333333333333333333333333333',
        templateName: 'test',
      };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getSchedule).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.callAsync(mockedParams.beneficiary, objectContaining(stringToBytes32(mockedParams.templateName))),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.getSchedule(mockedParams);
      // Result expectation
      expect(result.numberOfTokens).toEqual((expectedResult[0] as BigNumber).toNumber());
      expect(result.duration).toEqual((expectedResult[1] as BigNumber).toNumber());
      expect(result.frequency).toEqual((expectedResult[2] as BigNumber).toNumber());
      expect(result.startTime).toEqual(bigNumberToDate(expectedResult[3] as BigNumber));
      expect(result.claimedTokens).toEqual((expectedResult[4] as BigNumber).toNumber());
      expect(result.state).toEqual('CREATED');

      // Verifications
      verify(mockedContract.getSchedule).once();
      verify(
        mockedMethod.callAsync(mockedParams.beneficiary, objectContaining(stringToBytes32(mockedParams.templateName))),
      ).once();
    });
  });

  describe('getTemplateNames', () => {
    test('should call to getTemplateNames', async () => {
      const mockedParams = {
        beneficiary: '0x3333333333333333333333333333333333333333',
      };
      // Address expected
      const expectedResult = [stringToBytes32('template 1'), stringToBytes32('template 2')];
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getTemplateNames).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(mockedParams.beneficiary)).thenResolve(expectedResult);

      // Real call
      const result = await target.getTemplateNames(mockedParams);
      // Result expectation
      expect(result).toEqual(
        expectedResult.map(r => {
          return bytes32ToString(r);
        }),
      );
      // Verifications
      verify(mockedContract.getTemplateNames).once();
      verify(mockedMethod.callAsync(mockedParams.beneficiary)).once();
    });
  });

  describe('SubscribeAsync', () => {
    test('should throw as eventName does not belong to VestingEscrowWallet', async () => {
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
          `Expected eventName to be one of: 'AddSchedule', 'ModifySchedule', 'RevokeAllSchedules', 'RevokeSchedule', 'DepositTokens', 'SendToTreasury', 'SendTokens', 'AddTemplate', 'RemoveTemplate', 'TreasuryWalletChanged', 'Pause', 'Unpause', encountered: Transfer`,
        ),
      );
    });
  });
});

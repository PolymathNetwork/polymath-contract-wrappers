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
  valueToWei,
  weiToValue,
} from '../../../../utils/convert';
import { TransferStatusCode } from '../../../../types';

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

      // decimals
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const expectedDecimalsResult = new BigNumber(18);
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);

      // Stub the method
      when(mockedContract.unassignedTokens).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.unassignedTokens();
      // Result expectation
      expect(valueToWei(result, expectedDecimalsResult)).toEqual(expectedResult);
      // Verifications
      verify(mockedContract.unassignedTokens).once();
      verify(mockedMethod.callAsync()).once();
      // decimals
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenContract.decimals).once();
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).once();
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

      // decimals
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const expectedDecimalsResult = new BigNumber(18);
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);

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
      expect(result.claimedTokens).toEqual(
        weiToValue(expectedResult[1] as BigNumber, expectedDecimalsResult).toNumber(),
      );
      expect(result.startTime).toEqual(bigNumberToDate(expectedResult[2] as BigNumber));

      // Verifications
      verify(mockedContract.schedules).once();
      verify(
        mockedMethod.callAsync(mockedParams.beneficiary, objectContaining(numberToBigNumber(mockedParams.index))),
      ).once();
      // decimals
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenContract.decimals).once();
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).once();
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

      // decimals
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const expectedDecimalsResult = new BigNumber(18);
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);

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
      expect(valueToWei(result.numberOfTokens, expectedDecimalsResult)).toEqual(expectedResult[0]);
      expect(result.duration).toEqual((expectedResult[1] as BigNumber).toNumber());
      expect(result.frequency).toEqual((expectedResult[2] as BigNumber).toNumber());
      expect(result.startTime).toEqual(bigNumberToDate(expectedResult[3] as BigNumber));
      expect(result.claimedTokens).toEqual((expectedResult[4] as BigNumber).toNumber());
      expect(result.state).toEqual(0);

      // Verifications
      verify(mockedContract.getSchedule).once();
      verify(
        mockedMethod.callAsync(mockedParams.beneficiary, objectContaining(stringToBytes32(mockedParams.templateName))),
      ).once();
      // decimals
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenContract.decimals).once();
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).once();
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

  describe('getScheduleCount', () => {
    test('should call to getScheduleCount', async () => {
      const mockedParams = {
        beneficiary: '0x3333333333333333333333333333333333333333',
      };
      // Address expected
      const expectedResult = new BigNumber(1);
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getScheduleCount).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(mockedParams.beneficiary)).thenResolve(expectedResult);

      // Real call
      const result = await target.getScheduleCount(mockedParams);
      // Result expectation
      expect(result).toEqual(expectedResult.toNumber());
      // Verifications
      verify(mockedContract.getScheduleCount).once();
      verify(mockedMethod.callAsync(mockedParams.beneficiary)).once();
    });
  });

  describe('changeTreasuryWallet', () => {
    test('should changeTreasuryWallet', async () => {
      const mockedParams = {
        newTreasuryWallet: '0x4444444444444444444444444444444444444444',
        txData: {},
        safetyFactor: 10,
      };

      // isCallerTheSecurityTokenOwner
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.changeTreasuryWallet).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.newTreasuryWallet,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.changeTreasuryWallet(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.changeTreasuryWallet).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.newTreasuryWallet,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      // isCallerTheSecurityTokenOwner
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('depositTokens', () => {
    test('should depositTokens', async () => {
      const mockedParams = {
        numberOfTokens: new BigNumber(10),
        txData: {},
        safetyFactor: 10,
      };

      // address
      const expectedAddress = '0x4444444444444444444444444444444444444444';
      when(mockedContract.address).thenReturn(expectedAddress);
      // isCallerTheSecurityTokenOwner
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);
      // decimals
      const expectedDecimalsResult = new BigNumber(18);
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      // canTransferFrom
      const expectedStatusCode = TransferStatusCode.TransferSuccess;
      const expectedReasonCode = 'Reason';
      const expectedCanTransferFromResult = [expectedStatusCode, stringToBytes32(expectedReasonCode)];
      const mockedSecurityTokenCanTransferFromMethod = mock(MockedCallMethod);
      const mockedCanTransferFromParams = {
        from: expectedOwnerResult,
        to: expectedAddress,
        value: valueToWei(mockedParams.numberOfTokens, expectedDecimalsResult),
        data: '0x00',
      };
      when(mockedSecurityTokenContract.canTransferFrom).thenReturn(instance(mockedSecurityTokenCanTransferFromMethod));
      when(
        mockedSecurityTokenCanTransferFromMethod.callAsync(
          mockedCanTransferFromParams.from,
          mockedCanTransferFromParams.to,
          objectContaining(mockedCanTransferFromParams.value),
          mockedCanTransferFromParams.data,
        ),
      ).thenResolve(expectedCanTransferFromResult);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.depositTokens).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          objectContaining(valueToWei(mockedParams.numberOfTokens, expectedDecimalsResult)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.depositTokens(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);

      // Verifications
      verify(mockedContract.address).once();
      verify(mockedContract.depositTokens).once();
      verify(
        mockedMethod.sendTransactionAsync(
          objectContaining(valueToWei(mockedParams.numberOfTokens, expectedDecimalsResult)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      // isCallerTheSecurityTokenOwner
      verify(mockedContract.securityToken).times(3);
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).times(3);
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).times(3);
      verify(mockedWrapper.getAvailableAddressesAsync()).twice();
      // decimals
      verify(mockedSecurityTokenContract.decimals).once();
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).once();
      // canTransferFrom
      verify(mockedSecurityTokenContract.canTransferFrom).once();
      verify(
        mockedSecurityTokenCanTransferFromMethod.callAsync(
          mockedCanTransferFromParams.from,
          mockedCanTransferFromParams.to,
          objectContaining(mockedCanTransferFromParams.value),
          mockedCanTransferFromParams.data,
        ),
      ).once();
    });
  });

  describe('sendToTreasury', () => {
    test('should sendToTreasury', async () => {
      const mockedParams = {
        amount: new BigNumber(10),
        txData: {},
        safetyFactor: 10,
      };

      // isCallerTheSecurityTokenOwner
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);
      // unassignedTokens
      const expectedUnassignedResult = new BigNumber(100);
      const mockedUnassignedMethod = mock(MockedCallMethod);
      when(mockedContract.unassignedTokens).thenReturn(instance(mockedUnassignedMethod));
      when(mockedUnassignedMethod.callAsync()).thenResolve(expectedUnassignedResult);
      // getTreasuryWallet
      const expectedTreasuryResult = '0x4555555555555555555555555555555555555555';
      const mockedTreasuryMethod = mock(MockedCallMethod);
      when(mockedContract.getTreasuryWallet).thenReturn(instance(mockedTreasuryMethod));
      when(mockedTreasuryMethod.callAsync()).thenResolve(expectedTreasuryResult);
      // decimals
      const expectedDecimalsResult = new BigNumber(18);
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      // canTransfer
      const expectedStatusCode = TransferStatusCode.TransferSuccess;
      const expectedReasonCode = 'Reason';
      const expectedCanTransferFromResult = [expectedStatusCode, stringToBytes32(expectedReasonCode)];
      const mockedSecurityTokenCanTransferMethod = mock(MockedCallMethod);
      const mockedCanTransferParams = {
        to: expectedTreasuryResult,
        value: valueToWei(mockedParams.amount, expectedDecimalsResult),
        data: '0x00',
      };
      when(mockedSecurityTokenContract.canTransfer).thenReturn(instance(mockedSecurityTokenCanTransferMethod));
      when(
        mockedSecurityTokenCanTransferMethod.callAsync(
          mockedCanTransferParams.to,
          objectContaining(mockedCanTransferParams.value),
          mockedCanTransferParams.data,
        ),
      ).thenResolve(expectedCanTransferFromResult);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.sendToTreasury).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          objectContaining(valueToWei(mockedParams.amount, expectedDecimalsResult)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.sendToTreasury(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);

      // Verifications
      verify(mockedContract.sendToTreasury).once();
      verify(
        mockedMethod.sendTransactionAsync(
          objectContaining(valueToWei(mockedParams.amount, expectedDecimalsResult)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      // isCallerTheSecurityTokenOwner
      verify(mockedContract.securityToken).times(4);
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).times(4);
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).times(4);
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      // unassignedTokens
      verify(mockedContract.unassignedTokens).once();
      verify(mockedUnassignedMethod.callAsync()).once();
      // getTreasuryWallet
      verify(mockedContract.getTreasuryWallet).once();
      verify(mockedTreasuryMethod.callAsync()).once();
      // decimals
      verify(mockedSecurityTokenContract.decimals).times(2);
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).times(2);
      // canTransfer
      verify(mockedSecurityTokenContract.canTransfer).once();
      verify(
        mockedSecurityTokenCanTransferMethod.callAsync(
          mockedCanTransferParams.to,
          objectContaining(mockedCanTransferParams.value),
          mockedCanTransferParams.data,
        ),
      ).once();
    });
  });

  describe('pushAvailableTokens', () => {
    test('should pushAvailableTokens', async () => {
      const mockedParams = {
        beneficiary: '0x5555555555555555555555555555555555555555',
        txData: {},
        safetyFactor: 10,
      };

      // isCallerAllowed
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.pushAvailableTokens).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(mockedParams.beneficiary, mockedParams.txData, mockedParams.safetyFactor),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.pushAvailableTokens(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // isCallerTheSecurityTokenOwner
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      // Verifications
      verify(mockedContract.pushAvailableTokens).once();
      verify(
        mockedMethod.sendTransactionAsync(mockedParams.beneficiary, mockedParams.txData, mockedParams.safetyFactor),
      ).once();
    });
  });

  describe('pullAvailableTokens', () => {
    test('should pullAvailableTokens', async () => {
      const mockedParams = {
        txData: {},
        safetyFactor: 10,
      };

      // paused
      const expectedPausedResult = false;
      const mockedPausedMethod = mock(MockedCallMethod);
      when(mockedContract.paused).thenReturn(instance(mockedPausedMethod));
      when(mockedPausedMethod.callAsync()).thenResolve(expectedPausedResult);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.pullAvailableTokens).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.sendTransactionAsync(mockedParams.txData, mockedParams.safetyFactor)).thenResolve(
        expectedResult,
      );

      // Real call
      const result = await target.pullAvailableTokens(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.pullAvailableTokens).once();
      verify(mockedMethod.sendTransactionAsync(mockedParams.txData, mockedParams.safetyFactor)).once();
      verify(mockedContract.paused).once();
      verify(mockedPausedMethod.callAsync()).once();
    });
  });

  describe('addTemplate', () => {
    test('should addTemplate', async () => {
      const mockedParams = {
        name: 'template',
        numberOfTokens: new BigNumber(500),
        duration: 100,
        frequency: 10,
        txData: {},
        safetyFactor: 10,
      };

      // getAllTemplateNames
      const expectedPausedResult = [stringToBytes32('test'), stringToBytes32('test')];
      const mockedPausedMethod = mock(MockedCallMethod);
      when(mockedContract.getAllTemplateNames).thenReturn(instance(mockedPausedMethod));
      when(mockedPausedMethod.callAsync()).thenResolve(expectedPausedResult);

      // isCallerAllowed
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);
      // granularity
      const expectedGranularityResult = new BigNumber(50);
      const mockedSecurityTokenGranularityMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenGranularityMethod.callAsync()).thenResolve(expectedGranularityResult);
      when(mockedSecurityTokenContract.granularity).thenReturn(instance(mockedSecurityTokenGranularityMethod));
      // decimals
      const expectedDecimalsResult = new BigNumber(18);
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.addTemplate).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          stringToBytes32(mockedParams.name),
          objectContaining(valueToWei(mockedParams.numberOfTokens, expectedDecimalsResult)),
          objectContaining(numberToBigNumber(mockedParams.duration)),
          objectContaining(numberToBigNumber(mockedParams.frequency)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.addTemplate(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.addTemplate).once();
      verify(
        mockedMethod.sendTransactionAsync(
          stringToBytes32(mockedParams.name),
          objectContaining(valueToWei(mockedParams.numberOfTokens, expectedDecimalsResult)),
          objectContaining(numberToBigNumber(mockedParams.duration)),
          objectContaining(numberToBigNumber(mockedParams.frequency)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      // getAllTemplateNames
      verify(mockedContract.getAllTemplateNames).once();
      verify(mockedPausedMethod.callAsync()).once();
      // isCallerAllowed
      verify(mockedContract.securityToken).times(3);
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).times(3);
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).times(3);
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      // granurality
      verify(mockedSecurityTokenGranularityMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.granularity).once();
      // decimals
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.decimals).once();
    });
  });

  describe('removeTemplate', () => {
    test('should removeTemplate', async () => {
      const mockedParams = {
        name: 'template',
        txData: {},
        safetyFactor: 10,
      };

      // isCallerAllowed
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // getAllTemplateNames
      const expectedPausedResult = [stringToBytes32('template'), stringToBytes32('test')];
      const mockedPausedMethod = mock(MockedCallMethod);
      when(mockedContract.getAllTemplateNames).thenReturn(instance(mockedPausedMethod));
      when(mockedPausedMethod.callAsync()).thenResolve(expectedPausedResult);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.removeTemplate).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          stringToBytes32(mockedParams.name),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.removeTemplate(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.removeTemplate).once();
      verify(
        mockedMethod.sendTransactionAsync(
          stringToBytes32(mockedParams.name),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      // getAllTemplateNames
      verify(mockedContract.getAllTemplateNames).once();
      verify(mockedPausedMethod.callAsync()).once();
      // isCallerAllowed
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('addSchedule', () => {
    test('should addSchedule', async () => {
      const mockedParams = {
        beneficiary: '0x5555555555555555555555555555555555555555',
        templateName: 'template',
        numberOfTokens: new BigNumber(500),
        duration: 100,
        frequency: 10,
        startTime: new Date(2020, 10),
        txData: {},
        safetyFactor: 10,
      };

      // granularity
      const expectedGranularityResult = new BigNumber(50);
      const mockedSecurityTokenGranularityMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenGranularityMethod.callAsync()).thenResolve(expectedGranularityResult);
      when(mockedSecurityTokenContract.granularity).thenReturn(instance(mockedSecurityTokenGranularityMethod));

      // getScheduleCount
      const expectedScheduleCountResult = new BigNumber(0);
      const mockedScheduleCountMethod = mock(MockedCallMethod);
      when(mockedContract.getScheduleCount).thenReturn(instance(mockedScheduleCountMethod));
      when(mockedScheduleCountMethod.callAsync(mockedParams.beneficiary)).thenResolve(expectedScheduleCountResult);

      // getAllTemplateNames
      const expectedPausedResult = [stringToBytes32('test'), stringToBytes32('test')];
      const mockedPausedMethod = mock(MockedCallMethod);
      when(mockedContract.getAllTemplateNames).thenReturn(instance(mockedPausedMethod));
      when(mockedPausedMethod.callAsync()).thenResolve(expectedPausedResult);

      // isCallerAllowed
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // decimals
      const expectedDecimalsResult = new BigNumber(18);
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.addSchedule).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.beneficiary,
          stringToBytes32(mockedParams.templateName),
          objectContaining(valueToWei(mockedParams.numberOfTokens, expectedDecimalsResult)),
          objectContaining(numberToBigNumber(mockedParams.duration)),
          objectContaining(numberToBigNumber(mockedParams.frequency)),
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.addSchedule(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.addSchedule).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.beneficiary,
          stringToBytes32(mockedParams.templateName),
          objectContaining(valueToWei(mockedParams.numberOfTokens, expectedDecimalsResult)),
          objectContaining(numberToBigNumber(mockedParams.duration)),
          objectContaining(numberToBigNumber(mockedParams.frequency)),
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      // getScheduleCount
      verify(mockedContract.getScheduleCount).once();
      verify(mockedScheduleCountMethod.callAsync(mockedParams.beneficiary)).once();
      // getAllTemplateNames
      verify(mockedContract.getAllTemplateNames).once();
      verify(mockedPausedMethod.callAsync()).once();
      // isCallerAllowed
      verify(mockedContract.securityToken).times(3);
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).times(3);
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).times(3);
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      // granurality
      verify(mockedSecurityTokenGranularityMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.granularity).once();
      // decimals
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.decimals).once();
    });
  });

  describe('addScheduleFromTemplate', () => {
    test('should addScheduleFromTemplate', async () => {
      const mockedParams = {
        beneficiary: '0x5555555555555555555555555555555555555555',
        templateName: 'template',
        startTime: new Date(2020, 10),
        txData: {},
        safetyFactor: 10,
      };

      // getScheduleCount
      const expectedScheduleCountResult = new BigNumber(0);
      const mockedScheduleCountMethod = mock(MockedCallMethod);
      when(mockedContract.getScheduleCount).thenReturn(instance(mockedScheduleCountMethod));
      when(mockedScheduleCountMethod.callAsync(mockedParams.beneficiary)).thenResolve(expectedScheduleCountResult);

      // getAllTemplateNames
      const expectedPausedResult = [stringToBytes32('template'), stringToBytes32('test')];
      const mockedPausedMethod = mock(MockedCallMethod);
      when(mockedContract.getAllTemplateNames).thenReturn(instance(mockedPausedMethod));
      when(mockedPausedMethod.callAsync()).thenResolve(expectedPausedResult);

      // isCallerAllowed
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.addScheduleFromTemplate).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.beneficiary,
          stringToBytes32(mockedParams.templateName),
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.addScheduleFromTemplate(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.addScheduleFromTemplate).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.beneficiary,
          stringToBytes32(mockedParams.templateName),
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      // getScheduleCount
      verify(mockedContract.getScheduleCount).once();
      verify(mockedScheduleCountMethod.callAsync(mockedParams.beneficiary)).once();
      // getAllTemplateNames
      verify(mockedContract.getAllTemplateNames).once();
      verify(mockedPausedMethod.callAsync()).once();
      // isCallerAllowed
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('modifySchedule', () => {
    test('should modifySchedule', async () => {
      const mockedParams = {
        beneficiary: '0x5555555555555555555555555555555555555555',
        templateName: 'template',
        startTime: new Date(2020, 10),
        txData: {},
        safetyFactor: 10,
      };

      // isCallerAllowed
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.modifySchedule).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.beneficiary,
          stringToBytes32(mockedParams.templateName),
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.modifySchedule(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.modifySchedule).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.beneficiary,
          stringToBytes32(mockedParams.templateName),
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      // isCallerAllowed
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('revokeSchedule', () => {
    test('should revokeSchedule', async () => {
      const mockedParams = {
        beneficiary: '0x5555555555555555555555555555555555555555',
        templateName: 'template',
        txData: {},
        safetyFactor: 10,
      };

      // isCallerAllowed
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.revokeSchedule).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.beneficiary,
          stringToBytes32(mockedParams.templateName),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.revokeSchedule(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.revokeSchedule).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.beneficiary,
          stringToBytes32(mockedParams.templateName),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      // isCallerAllowed
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('revokeAllSchedules', () => {
    test('should revokeAllSchedules', async () => {
      const mockedParams = {
        beneficiary: '0x5555555555555555555555555555555555555555',
        txData: {},
        safetyFactor: 10,
      };

      // isCallerAllowed
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.revokeAllSchedules).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(mockedParams.beneficiary, mockedParams.txData, mockedParams.safetyFactor),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.revokeAllSchedules(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.revokeAllSchedules).once();
      verify(
        mockedMethod.sendTransactionAsync(mockedParams.beneficiary, mockedParams.txData, mockedParams.safetyFactor),
      ).once();
      // isCallerAllowed
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('pushAvailableTokensMulti', () => {
    test('should pushAvailableTokensMulti', async () => {
      const mockedParams = {
        fromIndex: 0,
        toIndex: 1,
        txData: {},
        safetyFactor: 10,
      };

      // isCallerAllowed
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.pushAvailableTokensMulti).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          objectContaining(numberToBigNumber(mockedParams.fromIndex)),
          objectContaining(numberToBigNumber(mockedParams.toIndex)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.pushAvailableTokensMulti(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.pushAvailableTokensMulti).once();
      verify(
        mockedMethod.sendTransactionAsync(
          objectContaining(numberToBigNumber(mockedParams.fromIndex)),
          objectContaining(numberToBigNumber(mockedParams.toIndex)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      // isCallerAllowed
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('addScheduleMulti', () => {
    test('should addScheduleMulti', async () => {
      const mockedParams = {
        beneficiaries: ['0x1555555555555555555555555555555555555555', '0x2555555555555555555555555555555555555555'],
        templateNames: ['test 1', 'test 2'],
        numberOfTokens: [new BigNumber(500), new BigNumber(1000)],
        durations: [100, 200],
        frequencies: [10, 20],
        startTimes: [new Date(2020, 10), new Date(2022, 10)],
        txData: {},
        safetyFactor: 10,
      };

      // getAllTemplatesNames
      const expectedAllTemplatesResult = [stringToBytes32('test 10'), stringToBytes32('test 20')];
      const mockedAllTemplatesMethod = mock(MockedCallMethod);
      when(mockedContract.getAllTemplateNames).thenReturn(instance(mockedAllTemplatesMethod));
      when(mockedAllTemplatesMethod.callAsync()).thenResolve(expectedAllTemplatesResult);

      // granularity
      const expectedGranularityResult = new BigNumber(50);
      const mockedSecurityTokenGranularityMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenGranularityMethod.callAsync()).thenResolve(expectedGranularityResult);
      when(mockedSecurityTokenContract.granularity).thenReturn(instance(mockedSecurityTokenGranularityMethod));

      // getScheduleCount
      const expectedScheduleCountResult = new BigNumber(0);
      const mockedScheduleCountMethod = mock(MockedCallMethod);
      when(mockedContract.getScheduleCount).thenReturn(instance(mockedScheduleCountMethod));
      when(mockedScheduleCountMethod.callAsync(mockedParams.beneficiaries[0])).thenResolve(expectedScheduleCountResult);
      when(mockedScheduleCountMethod.callAsync(mockedParams.beneficiaries[1])).thenResolve(expectedScheduleCountResult);

      // isCallerAllowed
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // decimals
      const expectedDecimalsResult = new BigNumber(18);
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.addScheduleMulti).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.beneficiaries,
          objectContaining(
            mockedParams.templateNames.map(name => {
              return stringToBytes32(name);
            }),
          ),
          objectContaining(
            mockedParams.numberOfTokens.map(tokens => {
              return valueToWei(tokens, expectedDecimalsResult);
            }),
          ),
          objectContaining(
            mockedParams.durations.map(duration => {
              return numberToBigNumber(duration);
            }),
          ),
          objectContaining(
            mockedParams.frequencies.map(frequency => {
              return numberToBigNumber(frequency);
            }),
          ),
          objectContaining(
            mockedParams.startTimes.map(startTime => {
              return dateToBigNumber(startTime);
            }),
          ),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.addScheduleMulti(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.addScheduleMulti).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.beneficiaries,
          objectContaining(
            mockedParams.templateNames.map(name => {
              return stringToBytes32(name);
            }),
          ),
          objectContaining(
            mockedParams.numberOfTokens.map(tokens => {
              return valueToWei(tokens, expectedDecimalsResult);
            }),
          ),
          objectContaining(
            mockedParams.durations.map(duration => {
              return numberToBigNumber(duration);
            }),
          ),
          objectContaining(
            mockedParams.frequencies.map(frequency => {
              return numberToBigNumber(frequency);
            }),
          ),
          objectContaining(
            mockedParams.startTimes.map(startTime => {
              return dateToBigNumber(startTime);
            }),
          ),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      // getAllTemplatesNames
      verify(mockedContract.getAllTemplateNames).twice();
      verify(mockedAllTemplatesMethod.callAsync()).twice();
      // granularity
      verify(mockedSecurityTokenGranularityMethod.callAsync()).twice();
      verify(mockedSecurityTokenContract.granularity).twice();
      // getScheduleCount
      verify(mockedContract.getScheduleCount).twice();
      verify(mockedScheduleCountMethod.callAsync(mockedParams.beneficiaries[0])).once();
      verify(mockedScheduleCountMethod.callAsync(mockedParams.beneficiaries[1])).once();
      // isCallerAllowed
      verify(mockedContract.securityToken).times(4);
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).times(4);
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).times(4);
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      // decimals
      verify(mockedSecurityTokenContract.decimals).once();
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).once();
    });
  });

  describe('addScheduleFromTemplateMulti', () => {
    test('should addScheduleFromTemplateMulti', async () => {
      const mockedParams = {
        beneficiaries: ['0x1555555555555555555555555555555555555555', '0x2555555555555555555555555555555555555555'],
        templateNames: ['test 1', 'test 2'],
        startTimes: [new Date(2020, 10), new Date(2022, 10)],
        txData: {},
        safetyFactor: 10,
      };

      // getAllTemplatesNames
      const expectedAllTemplatesResult = [stringToBytes32('test 1'), stringToBytes32('test 2')];
      const mockedAllTemplatesMethod = mock(MockedCallMethod);
      when(mockedContract.getAllTemplateNames).thenReturn(instance(mockedAllTemplatesMethod));
      when(mockedAllTemplatesMethod.callAsync()).thenResolve(expectedAllTemplatesResult);

      // getScheduleCount
      const expectedScheduleCountResult = new BigNumber(0);
      const mockedScheduleCountMethod = mock(MockedCallMethod);
      when(mockedContract.getScheduleCount).thenReturn(instance(mockedScheduleCountMethod));
      when(mockedScheduleCountMethod.callAsync(mockedParams.beneficiaries[0])).thenResolve(expectedScheduleCountResult);
      when(mockedScheduleCountMethod.callAsync(mockedParams.beneficiaries[1])).thenResolve(expectedScheduleCountResult);

      // isCallerAllowed
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.addScheduleFromTemplateMulti).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.beneficiaries,
          objectContaining(
            mockedParams.templateNames.map(name => {
              return stringToBytes32(name);
            }),
          ),
          objectContaining(
            mockedParams.startTimes.map(startTime => {
              return dateToBigNumber(startTime);
            }),
          ),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.addScheduleFromTemplateMulti(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.addScheduleFromTemplateMulti).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.beneficiaries,
          objectContaining(
            mockedParams.templateNames.map(name => {
              return stringToBytes32(name);
            }),
          ),
          objectContaining(
            mockedParams.startTimes.map(startTime => {
              return dateToBigNumber(startTime);
            }),
          ),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      // getAllTemplatesNames
      verify(mockedContract.getAllTemplateNames).twice();
      verify(mockedAllTemplatesMethod.callAsync()).twice();
      // getScheduleCount
      verify(mockedContract.getScheduleCount).twice();
      verify(mockedScheduleCountMethod.callAsync(mockedParams.beneficiaries[0])).once();
      verify(mockedScheduleCountMethod.callAsync(mockedParams.beneficiaries[1])).once();
      // isCallerAllowed
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('revokeSchedulesMulti', () => {
    test('should revokeSchedulesMulti', async () => {
      const mockedParams = {
        beneficiaries: ['0x1555555555555555555555555555555555555555', '0x2555555555555555555555555555555555555555'],
        txData: {},
        safetyFactor: 10,
      };

      // isCallerAllowed
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.revokeSchedulesMulti).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(mockedParams.beneficiaries, mockedParams.txData, mockedParams.safetyFactor),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.revokeSchedulesMulti(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.revokeSchedulesMulti).once();
      verify(
        mockedMethod.sendTransactionAsync(mockedParams.beneficiaries, mockedParams.txData, mockedParams.safetyFactor),
      ).once();
      // isCallerAllowed
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('modifyScheduleMulti', () => {
    test('should modifyScheduleMulti', async () => {
      const mockedParams = {
        beneficiaries: ['0x1555555555555555555555555555555555555555', '0x2555555555555555555555555555555555555555'],
        templateNames: ['test 1', 'test 2'],
        startTimes: [new Date(2020, 10), new Date(2022, 10)],
        txData: {},
        safetyFactor: 10,
      };

      // isCallerAllowed
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.modifyScheduleMulti).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.beneficiaries,
          objectContaining(
            mockedParams.templateNames.map(name => {
              return stringToBytes32(name);
            }),
          ),
          objectContaining(
            mockedParams.startTimes.map(startTime => {
              return dateToBigNumber(startTime);
            }),
          ),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.modifyScheduleMulti(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.modifyScheduleMulti).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.beneficiaries,
          objectContaining(
            mockedParams.templateNames.map(name => {
              return stringToBytes32(name);
            }),
          ),
          objectContaining(
            mockedParams.startTimes.map(startTime => {
              return dateToBigNumber(startTime);
            }),
          ),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      // isCallerAllowed
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
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

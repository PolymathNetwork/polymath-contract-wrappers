// VestingEscrowWallet test
import { mock, instance, reset, when, verify, objectContaining } from 'ts-mockito';
import {
  VestingEscrowWalletContract_3_1_0,
  ISecurityTokenContract_3_0_0,
  BigNumber,
  Web3Wrapper,
  PolyTokenEvents_3_0_0,
} from '@polymathnetwork/abi-wrappers';
import { getMockedPolyResponse, MockedCallMethod, MockedSendMethod } from '../../../../../test_utils/mocked_methods';
import { VestingEscrowWallet_3_1_0 } from '../3.1.0';
import ContractFactory from '../../../../../factories/contractFactory';
import { stringToBytes32, valueToWei, dateToBigNumber } from '../../../../../utils/convert';

describe('VestingEscrowWalletWrapper', () => {
  let target: VestingEscrowWallet_3_1_0;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: VestingEscrowWalletContract_3_1_0;
  let mockedContractFactory: ContractFactory;
  let mockedSecurityTokenContract: ISecurityTokenContract_3_0_0;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(VestingEscrowWalletContract_3_1_0);
    mockedContractFactory = mock(ContractFactory);
    mockedSecurityTokenContract = mock(ISecurityTokenContract_3_0_0);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new VestingEscrowWallet_3_1_0(instance(mockedWrapper), myContractPromise, instance(mockedContractFactory));
  });

  afterEach(() => {
    reset(mockedWrapper);
    reset(mockedContract);
    reset(mockedContractFactory);
    reset(mockedSecurityTokenContract);
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

  describe('templates', () => {
    test('should call to templates', async () => {
      const mockedParams = {
        templateName: 'test',
      };
      // Address expected
      const expectedResult = [new BigNumber(1), new BigNumber(365), new BigNumber(60), new BigNumber(1)];
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.templates).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(objectContaining(stringToBytes32(mockedParams.templateName)))).thenResolve(
        expectedResult,
      );

      // Real call
      const result = await target.templates(mockedParams.templateName);
      // Result expectation
      expect(result).toEqual({
        numberOfTokens: expectedResult[0],
        duration: expectedResult[1].toNumber(),
        frequency: expectedResult[2].toNumber(),
        index: expectedResult[3].toNumber(),
      });
      // Verifications
      verify(mockedContract.templates).once();
      verify(mockedMethod.callAsync(objectContaining(stringToBytes32(mockedParams.templateName)))).once();
    });
  });

  describe('getSchedulesCountByTemplate', () => {
    test('should call to getSchedulesCountByTemplate', async () => {
      const mockedParams = {
        templateName: 'test',
      };
      // Address expected
      const expectedResult = new BigNumber(10);
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getSchedulesCountByTemplate).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(objectContaining(stringToBytes32(mockedParams.templateName)))).thenResolve(
        expectedResult,
      );

      // Real call
      const result = await target.getSchedulesCountByTemplate(mockedParams.templateName);
      // Result expectation
      expect(result).toEqual(expectedResult.toNumber());
      // Verifications
      verify(mockedContract.getSchedulesCountByTemplate).once();
      verify(mockedMethod.callAsync(objectContaining(stringToBytes32(mockedParams.templateName)))).once();
    });
  });

  describe('getAllBeneficiaries', () => {
    test('should call to getAllBeneficiaries', async () => {
      // Address expected
      const expectedResult = [
        '0x1555555555555555555555555555555555555555',
        '0x2555555555555555555555555555555555555555',
      ];
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getAllBeneficiaries).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getAllBeneficiaries();
      // Result expectation
      expect(result).toEqual(expectedResult);
      // Verifications
      verify(mockedContract.getAllBeneficiaries).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('getAvailableTokens', () => {
    test('should call to getAvailableTokens', async () => {
      const mockedParams = {
        beneficiary: '0x9999999999999999999999999999999999999999',
      };
      // Address expected
      const expectedResult = new BigNumber(100);
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
      when(mockedContract.getAvailableTokens).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(mockedParams.beneficiary)).thenResolve(expectedResult);

      // Real call
      const result = await target.getAvailableTokens(mockedParams.beneficiary);
      // Result expectation
      expect(valueToWei(result, expectedDecimalsResult)).toEqual(expectedResult);
      // Verifications
      verify(mockedContract.getAvailableTokens).once();
      verify(mockedMethod.callAsync(mockedParams.beneficiary)).once();
      // decimals
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenContract.decimals).once();
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).once();
    });
  });

  describe('SubscribeAsync', () => {
    test('should throw as eventName does not belong to VestingEscrowWallet', async () => {
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
          `Expected eventName to be one of: 'AddSchedule', 'ModifySchedule', 'RevokeAllSchedules', 'RevokeSchedule', 'DepositTokens', 'SendToTreasury', 'SendTokens', 'AddTemplate', 'RemoveTemplate', 'TreasuryWalletChanged', 'Pause', 'Unpause', encountered: Transfer`,
        ),
      );
    });
  });
});

// VolumeRestrictionTransferManagerWrapper test
import { mock, instance, reset, when, verify, objectContaining } from 'ts-mockito';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { BigNumber } from '@0x/utils';
import { VolumeRestrictionTMContract, SecurityTokenContract, PolyTokenEvents } from '@polymathnetwork/abi-wrappers';
import { MockedCallMethod, MockedSendMethod, getMockedPolyResponse } from '../../../../test_utils/mocked_methods';
import { RestrictionType } from '../../../../types';
import ModuleWrapper from '../../module_wrapper';
import ContractFactory from '../../../../factories/contractFactory';
import VolumeRestrictionTransferManagerWrapper from '../volume_restriction_transfer_manager_wrapper';
import {
  bigNumberToDate,
  numberToBigNumber,
  dateToBigNumber,
  dateArrayToBigNumberArray,
  numberArrayToBigNumberArray,
  valueArrayToWeiArray,
  weiToValue,
  valueToWei,
} from '../../../../utils/convert';

describe('VolumeRestrictionTransferManagerWrapper', () => {
  let target: VolumeRestrictionTransferManagerWrapper;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: VolumeRestrictionTMContract;
  let mockedContractFactory: ContractFactory;
  let mockedSecurityTokenContract: SecurityTokenContract;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(VolumeRestrictionTMContract);
    mockedContractFactory = mock(ContractFactory);
    mockedSecurityTokenContract = mock(SecurityTokenContract);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new VolumeRestrictionTransferManagerWrapper(
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

  describe('paused', () => {
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

  describe('pause/unpause', () => {
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

  describe('verifyTransfer', () => {
    test('should verify Transfer', async () => {
      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const expectedDecimalsResult = new BigNumber(18);
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));

      const mockedParams = {
        from: '0x1111111111111111111111111111111111111111',
        to: '0x2222222222222222222222222222222222222222',
        amount: new BigNumber(10),
        data: 'Data',
        isTransfer: false,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.verifyTransfer).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.from,
          mockedParams.to,
          objectContaining(valueToWei(mockedParams.amount, expectedDecimalsResult)),
          mockedParams.data,
          mockedParams.isTransfer,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.verifyTransfer(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.verifyTransfer).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.from,
          mockedParams.to,
          objectContaining(valueToWei(mockedParams.amount, expectedDecimalsResult)),
          mockedParams.data,
          mockedParams.isTransfer,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.decimals).once();
    });
  });

  describe('individualRestriction', () => {
    test('should get individualRestriction', async () => {
      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const expectedDecimalsResult = new BigNumber(18);
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));

      const mockedParams = {
        holder: '0x1111111111111111111111111111111111111111',
      };
      // Address expected
      const allowedTokens = new BigNumber(1);
      const startTime = new BigNumber(2);
      const rollingPeriodInDays = new BigNumber(3);
      const endTime = new BigNumber(4);
      const restrictionType = new BigNumber(0);
      const expectedResult = [allowedTokens, startTime, rollingPeriodInDays, endTime, restrictionType];
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.individualRestriction).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(mockedParams.holder)).thenResolve(expectedResult);

      // Real call
      const result = await target.individualRestriction(mockedParams);
      // Result expectation
      expect(result.allowedTokens).toEqual(weiToValue(allowedTokens, expectedDecimalsResult));
      expect(result.startTime).toEqual(bigNumberToDate(startTime));
      expect(result.rollingPeriodInDays).toEqual(rollingPeriodInDays.toNumber());
      expect(result.endTime).toEqual(bigNumberToDate(endTime));
      expect(result.restrictionType).toEqual(RestrictionType.Fixed);
      // Verifications
      verify(mockedContract.individualRestriction).once();
      verify(mockedMethod.callAsync(mockedParams.holder)).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.decimals).once();
    });
  });

  describe('defaultRestriction', () => {
    test('should get defaultRestriction', async () => {
      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const expectedDecimalsResult = new BigNumber(18);
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));

      // Address expected
      const allowedTokens = new BigNumber(1);
      const startTime = new BigNumber(2);
      const rollingPeriodInDays = new BigNumber(3);
      const endTime = new BigNumber(4);
      const restrictionType = new BigNumber(0);
      const expectedResult = [allowedTokens, startTime, rollingPeriodInDays, endTime, restrictionType];
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.defaultRestriction).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.defaultRestriction();
      // Result expectation
      expect(result.allowedTokens).toEqual(weiToValue(allowedTokens, expectedDecimalsResult));
      expect(result.startTime).toEqual(bigNumberToDate(startTime));
      expect(result.rollingPeriodInDays).toEqual(rollingPeriodInDays.toNumber());
      expect(result.endTime).toEqual(bigNumberToDate(endTime));
      expect(result.restrictionType).toEqual(RestrictionType.Fixed);
      // Verifications
      verify(mockedContract.defaultRestriction).once();
      verify(mockedMethod.callAsync()).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.decimals).once();
    });
  });

  describe('defaultDailyRestriction', () => {
    test('should get defaultDailyRestriction', async () => {
      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const expectedDecimalsResult = new BigNumber(18);
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));

      // Address expected
      const allowedTokens = new BigNumber(1);
      const startTime = new BigNumber(2);
      const rollingPeriodInDays = new BigNumber(3);
      const endTime = new BigNumber(4);
      const restrictionType = new BigNumber(0);
      const expectedResult = [allowedTokens, startTime, rollingPeriodInDays, endTime, restrictionType];
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.defaultDailyRestriction).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.defaultDailyRestriction();
      // Result expectation
      expect(result.allowedTokens).toEqual(weiToValue(allowedTokens, expectedDecimalsResult));
      expect(result.startTime).toEqual(bigNumberToDate(startTime));
      expect(result.rollingPeriodInDays).toEqual(rollingPeriodInDays.toNumber());
      expect(result.endTime).toEqual(bigNumberToDate(endTime));
      expect(result.restrictionType).toEqual(RestrictionType.Fixed);
      // Verifications
      verify(mockedContract.defaultDailyRestriction).once();
      verify(mockedMethod.callAsync()).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.decimals).once();
    });
  });

  describe('exemptAddresses', () => {
    test('should get exemptAddresses', async () => {
      const mockedParams = {
        index: 1,
      };
      // Address expected
      const expectedResult = true;
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.exemptAddresses).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(objectContaining(numberToBigNumber(mockedParams.index)))).thenResolve(expectedResult);

      // Real call
      const result = await target.exemptAddresses(mockedParams);
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.exemptAddresses).once();
      verify(mockedMethod.callAsync(objectContaining(numberToBigNumber(mockedParams.index)))).once();
    });
  });

  describe('individualDailyRestriction', () => {
    test('should get individualDailyRestriction', async () => {
      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const expectedDecimalsResult = new BigNumber(18);
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));

      const mockedParams = {
        holder: '0x1111111111111111111111111111111111111111',
      };
      // Address expected
      const allowedTokens = new BigNumber(1);
      const startTime = new BigNumber(2);
      const rollingPeriodInDays = new BigNumber(3);
      const endTime = new BigNumber(4);
      const restrictionType = new BigNumber(0);
      const expectedResult = [allowedTokens, startTime, rollingPeriodInDays, endTime, restrictionType];
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.individualDailyRestriction).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(mockedParams.holder)).thenResolve(expectedResult);

      // Real call
      const result = await target.individualDailyRestriction(mockedParams);
      // Result expectation
      expect(result.allowedTokens).toEqual(weiToValue(allowedTokens, expectedDecimalsResult));
      expect(result.startTime).toEqual(bigNumberToDate(startTime));
      expect(result.rollingPeriodInDays).toEqual(rollingPeriodInDays.toNumber());
      expect(result.endTime).toEqual(bigNumberToDate(endTime));
      expect(result.restrictionType).toEqual(RestrictionType.Fixed);
      // Verifications
      verify(mockedContract.individualDailyRestriction).once();
      verify(mockedMethod.callAsync(mockedParams.holder)).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.decimals).once();
    });
  });

  describe('changeExemptWalletList', () => {
    test('should changeExemptWalletList', async () => {
      const mockedParams = {
        wallet: '0x7777777777777777777777777777777777777777',
        change: true,
        txData: {},
        safetyFactor: 10,
      };

      const expectedExemptResult = [
        '0x2222222222222222222222222222222222222222',
        '0x2222222222222222222222222222222222222222',
      ];
      const mockedExemptMethod = mock(MockedCallMethod);
      when(mockedContract.getExemptAddress).thenReturn(instance(mockedExemptMethod));
      when(mockedExemptMethod.callAsync()).thenResolve(expectedExemptResult);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.changeExemptWalletList).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.wallet,
          mockedParams.change,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.changeExemptWalletList(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getExemptAddress).once();
      verify(mockedExemptMethod.callAsync()).once();
      verify(mockedContract.changeExemptWalletList).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.wallet,
          mockedParams.change,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
    });
  });

  describe('addIndividualRestriction', () => {
    test('should addIndividualRestriction', async () => {
      const allowedTokens = new BigNumber(1);
      const startTime = new Date(2020, 1);
      const endTime = new Date(2021, 1);
      const restrictionType = 0;
      const mockedParams = {
        rollingPeriodInDays: 1,
        holder: '0x7777777777777777777777777777777777777777',
        allowedTokens,
        startTime,
        endTime,
        restrictionType,
        txData: {},
        safetyFactor: 10,
      };

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

      const expectedDecimalsResult = new BigNumber(18);
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const expectedExemptResult = [
        '0x7777777777777777777777777777777777777777',
        '0x2222222222222222222222222222222222222222',
      ];
      const mockedExemptMethod = mock(MockedCallMethod);
      when(mockedContract.getExemptAddress).thenReturn(instance(mockedExemptMethod));
      when(mockedExemptMethod.callAsync()).thenResolve(expectedExemptResult);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.addIndividualRestriction).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.holder,
          objectContaining(valueToWei(mockedParams.allowedTokens, expectedDecimalsResult)),
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(numberToBigNumber(mockedParams.rollingPeriodInDays)),
          objectContaining(dateToBigNumber(mockedParams.endTime)),
          mockedParams.restrictionType,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.addIndividualRestriction(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getExemptAddress).once();
      verify(mockedExemptMethod.callAsync()).once();
      verify(mockedContract.addIndividualRestriction).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.holder,
          objectContaining(valueToWei(mockedParams.allowedTokens, expectedDecimalsResult)),
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(numberToBigNumber(mockedParams.rollingPeriodInDays)),
          objectContaining(dateToBigNumber(mockedParams.endTime)),
          mockedParams.restrictionType,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).twice();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).twice();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).twice();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.decimals).once();
    });
  });

  describe('addIndividualDailyRestriction', () => {
    test('should addIndividualDailyRestriction', async () => {
      const allowedTokens = new BigNumber(1);
      const startTime = new Date(2020, 1);
      const endTime = new Date(2021, 1);
      const restrictionType = 0;
      const mockedParams = {
        rollingPeriodInDays: 1,
        holder: '0x7777777777777777777777777777777777777777',
        allowedTokens,
        startTime,
        endTime,
        restrictionType,
        txData: {},
        safetyFactor: 10,
      };

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

      const expectedDecimalsResult = new BigNumber(18);
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.addIndividualDailyRestriction).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.holder,
          objectContaining(valueToWei(mockedParams.allowedTokens, expectedDecimalsResult)),
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(dateToBigNumber(mockedParams.endTime)),
          mockedParams.restrictionType,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.addIndividualDailyRestriction(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.addIndividualDailyRestriction).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.holder,
          objectContaining(valueToWei(mockedParams.allowedTokens, expectedDecimalsResult)),
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(dateToBigNumber(mockedParams.endTime)),
          mockedParams.restrictionType,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).twice();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).twice();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).twice();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.decimals).once();
    });
  });

  describe('addIndividualDailyRestrictionMulti', () => {
    test('should addIndividualDailyRestrictionMulti', async () => {
      const allowedTokens = [new BigNumber(0), new BigNumber(0)];
      const startTimes = [new Date(2020, 1), new Date(2020, 2)];
      const endTimes = [new Date(2021, 1), new Date(2021, 2)];
      const restrictionTypes = [1, 1];
      const mockedParams = {
        holders: ['0x7777777777777777777777777777777777777777', '0x8888888888888888888888888888888888888888'],
        allowedTokens,
        startTimes,
        endTimes,
        restrictionTypes,
        txData: {},
        safetyFactor: 10,
      };

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

      const expectedDecimalsResult = new BigNumber(18);

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.addIndividualDailyRestrictionMulti).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.holders,
          objectContaining(valueArrayToWeiArray(mockedParams.allowedTokens, expectedDecimalsResult)),
          objectContaining(dateArrayToBigNumberArray(mockedParams.startTimes)),
          objectContaining(dateArrayToBigNumberArray(mockedParams.endTimes)),
          mockedParams.restrictionTypes,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.addIndividualDailyRestrictionMulti(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.addIndividualDailyRestrictionMulti).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.holders,
          objectContaining(valueArrayToWeiArray(mockedParams.allowedTokens, expectedDecimalsResult)),
          objectContaining(dateArrayToBigNumberArray(mockedParams.startTimes)),
          objectContaining(dateArrayToBigNumberArray(mockedParams.endTimes)),
          mockedParams.restrictionTypes,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('addIndividualRestrictionMulti', () => {
    test('should addIndividualRestrictionMulti', async () => {
      const allowedTokens = [new BigNumber(0), new BigNumber(0)];
      const startTimes = [new Date(2020, 1), new Date(2020, 2)];
      const endTimes = [new Date(2021, 1), new Date(2021, 2)];
      const restrictionTypes = [1, 1];
      const mockedParams = {
        rollingPeriodInDays: [1, 2],
        holders: ['0x7777777777777777777777777777777777777777', '0x8888888888888888888888888888888888888888'],
        allowedTokens,
        startTimes,
        endTimes,
        restrictionTypes,
        txData: {},
        safetyFactor: 10,
      };

      const expectedExemptResult = [
        '0x7777777777777777777777777777777777777777',
        '0x8888888888888888888888888888888888888888',
      ];
      const mockedExemptMethod = mock(MockedCallMethod);
      when(mockedContract.getExemptAddress).thenReturn(instance(mockedExemptMethod));
      when(mockedExemptMethod.callAsync()).thenResolve(expectedExemptResult);

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

      const expectedDecimalsResult = new BigNumber(18);

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.addIndividualRestrictionMulti).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.holders,
          objectContaining(valueArrayToWeiArray(mockedParams.allowedTokens, expectedDecimalsResult)),
          objectContaining(dateArrayToBigNumberArray(mockedParams.startTimes)),
          objectContaining(numberArrayToBigNumberArray(mockedParams.rollingPeriodInDays)),
          objectContaining(dateArrayToBigNumberArray(mockedParams.endTimes)),
          mockedParams.restrictionTypes,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.addIndividualRestrictionMulti(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.addIndividualRestrictionMulti).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.holders,
          objectContaining(valueArrayToWeiArray(mockedParams.allowedTokens, expectedDecimalsResult)),
          objectContaining(dateArrayToBigNumberArray(mockedParams.startTimes)),
          objectContaining(numberArrayToBigNumberArray(mockedParams.rollingPeriodInDays)),
          objectContaining(dateArrayToBigNumberArray(mockedParams.endTimes)),
          mockedParams.restrictionTypes,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedExemptMethod.callAsync()).once();
    });
  });

  describe('addDefaultRestriction', () => {
    test('should addDefaultRestriction', async () => {
      const allowedTokens = new BigNumber(1);
      const startTime = new Date(2020, 1);
      const endTime = new Date(2021, 1);
      const restrictionType = 0;
      const mockedParams = {
        rollingPeriodInDays: 1,
        allowedTokens,
        startTime,
        endTime,
        restrictionType,
        txData: {},
        safetyFactor: 10,
      };

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

      const expectedDecimalsResult = new BigNumber(18);
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.addDefaultRestriction).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          objectContaining(valueToWei(mockedParams.allowedTokens, expectedDecimalsResult)),
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(numberToBigNumber(mockedParams.rollingPeriodInDays)),
          objectContaining(dateToBigNumber(mockedParams.endTime)),
          mockedParams.restrictionType,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.addDefaultRestriction(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.addDefaultRestriction).once();
      verify(
        mockedMethod.sendTransactionAsync(
          objectContaining(valueToWei(mockedParams.allowedTokens, expectedDecimalsResult)),
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(numberToBigNumber(mockedParams.rollingPeriodInDays)),
          objectContaining(dateToBigNumber(mockedParams.endTime)),
          mockedParams.restrictionType,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).twice();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).twice();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).twice();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.decimals).once();
    });
  });

  describe('addDefaultDailyRestriction', () => {
    test('should addDefaultDailyRestriction', async () => {
      const allowedTokens = new BigNumber(1);
      const startTime = new Date(2020, 1);
      const endTime = new Date(2021, 1);
      const restrictionType = 0;
      const mockedParams = {
        allowedTokens,
        startTime,
        endTime,
        restrictionType,
        txData: {},
        safetyFactor: 10,
      };

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

      const expectedDecimalsResult = new BigNumber(18);
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.addDefaultDailyRestriction).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          objectContaining(valueToWei(mockedParams.allowedTokens, expectedDecimalsResult)),
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(dateToBigNumber(mockedParams.endTime)),
          mockedParams.restrictionType,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.addDefaultDailyRestriction(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.addDefaultDailyRestriction).once();
      verify(
        mockedMethod.sendTransactionAsync(
          objectContaining(valueToWei(mockedParams.allowedTokens, expectedDecimalsResult)),
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(dateToBigNumber(mockedParams.endTime)),
          mockedParams.restrictionType,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).twice();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).twice();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).twice();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.decimals).once();
    });
  });

  describe('removeIndividualRestriction', () => {
    test('should removeIndividualRestriction', async () => {
      const mockedParams = {
        holder: '0x5555555555555555555555555555555555555555',
        txData: {},
        safetyFactor: 10,
      };

      const expectedIndividualResult = [
        new BigNumber(1),
        new BigNumber(1),
        new BigNumber(1),
        new BigNumber(1),
        new BigNumber(1),
      ];
      const mockedIndividualMethod = mock(MockedCallMethod);
      when(mockedContract.individualRestriction).thenReturn(instance(mockedIndividualMethod));
      when(mockedIndividualMethod.callAsync(mockedParams.holder)).thenResolve(expectedIndividualResult);

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

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.removeIndividualRestriction).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(mockedParams.holder, mockedParams.txData, mockedParams.safetyFactor),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.removeIndividualRestriction(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.individualRestriction).once();
      verify(mockedIndividualMethod.callAsync(mockedParams.holder)).once();
      verify(mockedContract.removeIndividualRestriction).once();
      verify(
        mockedMethod.sendTransactionAsync(mockedParams.holder, mockedParams.txData, mockedParams.safetyFactor),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('removeIndividualRestrictionMulti', () => {
    test('should removeIndividualRestrictionMulti', async () => {
      const mockedParams = {
        holders: ['0x5555555555555555555555555555555555555555', '0x6666666666666666666666666666666666666666'],
        rollingPeriodInDays: [5, 10],
        allowedTokens: [new BigNumber(1), new BigNumber(2)],
        startTimes: [new Date(2020, 1), new Date(2020, 2)],
        endTimes: [new Date(2021, 1), new Date(2021, 2)],
        restrictionTypes: [0, 1],
        txData: {},
        safetyFactor: 10,
      };

      const expectedIndividualResult = [
        new BigNumber(1),
        new BigNumber(1),
        new BigNumber(1),
        new BigNumber(1),
        new BigNumber(1),
      ];
      const mockedIndividualMethod = mock(MockedCallMethod);
      when(mockedContract.individualRestriction).thenReturn(instance(mockedIndividualMethod));
      when(mockedIndividualMethod.callAsync(mockedParams.holders[0])).thenResolve(expectedIndividualResult);

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

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.removeIndividualRestrictionMulti).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(mockedParams.holders, mockedParams.txData, mockedParams.safetyFactor),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.removeIndividualRestrictionMulti(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.individualRestriction).twice();
      verify(mockedIndividualMethod.callAsync(mockedParams.holders[0])).once();
      verify(mockedContract.removeIndividualRestrictionMulti).once();
      verify(
        mockedMethod.sendTransactionAsync(mockedParams.holders, mockedParams.txData, mockedParams.safetyFactor),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('removeIndividualDailyRestriction', () => {
    test('should removeIndividualDailyRestriction', async () => {
      const mockedParams = {
        holder: '0x5555555555555555555555555555555555555555',
        rollingPeriodInDays: [5, 10],
        allowedTokens: [new BigNumber(1), new BigNumber(2)],
        startTimes: [new Date(2020, 1), new Date(2020, 2)],
        endTimes: [new Date(2021, 1), new Date(2021, 2)],
        restrictionTypes: [0, 1],
        txData: {},
        safetyFactor: 10,
      };

      const expectedIndividualResult = [
        new BigNumber(1),
        new BigNumber(1),
        new BigNumber(1),
        new BigNumber(1),
        new BigNumber(1),
      ];
      const mockedIndividualMethod = mock(MockedCallMethod);
      when(mockedContract.individualDailyRestriction).thenReturn(instance(mockedIndividualMethod));
      when(mockedIndividualMethod.callAsync(mockedParams.holder)).thenResolve(expectedIndividualResult);

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

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.removeIndividualDailyRestriction).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(mockedParams.holder, mockedParams.txData, mockedParams.safetyFactor),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.removeIndividualDailyRestriction(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.individualDailyRestriction).once();
      verify(mockedIndividualMethod.callAsync(mockedParams.holder)).once();
      verify(mockedContract.removeIndividualDailyRestriction).once();
      verify(
        mockedMethod.sendTransactionAsync(mockedParams.holder, mockedParams.txData, mockedParams.safetyFactor),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('removeIndividualDailyRestrictionMulti', () => {
    test('should removeIndividualDailyRestrictionMulti', async () => {
      const mockedParams = {
        holders: ['0x5555555555555555555555555555555555555555', '0x6666666666666666666666666666666666666666'],
        rollingPeriodInDays: [5, 10],
        allowedTokens: [new BigNumber(1), new BigNumber(2)],
        startTimes: [new Date(2020, 1), new Date(2020, 2)],
        endTimes: [new Date(2021, 1), new Date(2021, 2)],
        restrictionTypes: [0, 1],
        txData: {},
        safetyFactor: 10,
      };

      const expectedIndividualResult = [
        new BigNumber(1),
        new BigNumber(1),
        new BigNumber(1),
        new BigNumber(1),
        new BigNumber(1),
      ];
      const mockedIndividualMethod = mock(MockedCallMethod);
      when(mockedContract.individualRestriction).thenReturn(instance(mockedIndividualMethod));
      when(mockedIndividualMethod.callAsync(mockedParams.holders[0])).thenResolve(expectedIndividualResult);

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

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.removeIndividualDailyRestrictionMulti).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(mockedParams.holders, mockedParams.txData, mockedParams.safetyFactor),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.removeIndividualDailyRestrictionMulti(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.individualRestriction).twice();
      verify(mockedIndividualMethod.callAsync(mockedParams.holders[0])).once();
      verify(mockedContract.removeIndividualDailyRestrictionMulti).once();
      verify(
        mockedMethod.sendTransactionAsync(mockedParams.holders, mockedParams.txData, mockedParams.safetyFactor),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('removeDefaultRestriction', () => {
    test('should removeDefaultRestriction', async () => {
      const mockedParams = {
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.removeDefaultRestriction).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.sendTransactionAsync(mockedParams.txData, mockedParams.safetyFactor)).thenResolve(
        expectedResult,
      );

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

      const expectedRestrictionResult = [
        new BigNumber(1),
        new BigNumber(2),
        new BigNumber(3),
        new BigNumber(4),
        new BigNumber(1),
      ];
      const mockedRestrictionMethod = mock(MockedCallMethod);
      when(mockedContract.defaultRestriction).thenReturn(instance(mockedRestrictionMethod));
      when(mockedRestrictionMethod.callAsync()).thenResolve(expectedRestrictionResult);

      // Real call
      const result = await target.removeDefaultRestriction(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.removeDefaultRestriction).once();
      verify(mockedMethod.sendTransactionAsync(mockedParams.txData, mockedParams.safetyFactor)).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedContract.defaultRestriction).once();
      verify(mockedRestrictionMethod.callAsync()).once();
    });
  });

  describe('removeDefaultDailyRestriction', () => {
    test('should removeDefaultDailyRestriction', async () => {
      const mockedParams = {
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.removeDefaultDailyRestriction).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.sendTransactionAsync(mockedParams.txData, mockedParams.safetyFactor)).thenResolve(
        expectedResult,
      );

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

      const expectedRestrictionResult = [
        new BigNumber(1),
        new BigNumber(2),
        new BigNumber(3),
        new BigNumber(4),
        new BigNumber(1),
      ];
      const mockedRestrictionMethod = mock(MockedCallMethod);
      when(mockedContract.defaultDailyRestriction).thenReturn(instance(mockedRestrictionMethod));
      when(mockedRestrictionMethod.callAsync()).thenResolve(expectedRestrictionResult);

      // Real call
      const result = await target.removeDefaultDailyRestriction(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.removeDefaultDailyRestriction).once();
      verify(mockedMethod.sendTransactionAsync(mockedParams.txData, mockedParams.safetyFactor)).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedContract.defaultDailyRestriction).once();
      verify(mockedRestrictionMethod.callAsync()).once();
    });
  });

  describe('modifyIndividualRestriction', () => {
    test('should modifyIndividualRestriction', async () => {
      const allowedTokens = new BigNumber(1);
      const startTime = new Date(2020, 1);
      const endTime = new Date(2021, 1);
      const restrictionType = 0;
      const mockedParams = {
        rollingPeriodInDays: 1,
        holder: '0x7777777777777777777777777777777777777777',
        allowedTokens,
        startTime,
        endTime,
        restrictionType,
        txData: {},
        safetyFactor: 10,
      };

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

      const expectedDecimalsResult = new BigNumber(18);
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.modifyIndividualRestriction).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.holder,
          objectContaining(valueToWei(mockedParams.allowedTokens, expectedDecimalsResult)),
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(numberToBigNumber(mockedParams.rollingPeriodInDays)),
          objectContaining(dateToBigNumber(mockedParams.endTime)),
          mockedParams.restrictionType,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.modifyIndividualRestriction(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.modifyIndividualRestriction).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.holder,
          objectContaining(valueToWei(mockedParams.allowedTokens, expectedDecimalsResult)),
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(numberToBigNumber(mockedParams.rollingPeriodInDays)),
          objectContaining(dateToBigNumber(mockedParams.endTime)),
          mockedParams.restrictionType,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).twice();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).twice();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).twice();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.decimals).once();
    });
  });

  describe('modifyIndividualDailyRestriction', () => {
    test('should modifyIndividualDailyRestriction', async () => {
      const allowedTokens = new BigNumber(1);
      const startTime = new Date(2020, 1);
      const endTime = new Date(2021, 1);
      const restrictionType = 0;
      const mockedParams = {
        holder: '0x7777777777777777777777777777777777777777',
        allowedTokens,
        startTime,
        endTime,
        restrictionType,
        txData: {},
        safetyFactor: 10,
      };

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

      const expectedDecimalsResult = new BigNumber(18);
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.modifyIndividualDailyRestriction).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.holder,
          objectContaining(valueToWei(mockedParams.allowedTokens, expectedDecimalsResult)),
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(dateToBigNumber(mockedParams.endTime)),
          mockedParams.restrictionType,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.modifyIndividualDailyRestriction(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.modifyIndividualDailyRestriction).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.holder,
          objectContaining(valueToWei(mockedParams.allowedTokens, expectedDecimalsResult)),
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(dateToBigNumber(mockedParams.endTime)),
          mockedParams.restrictionType,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).twice();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).twice();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).twice();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.decimals).once();
    });
  });

  describe('modifyIndividualDailyRestrictionMulti', () => {
    test('should modifyIndividualDailyRestrictionMulti', async () => {
      const allowedTokens = [new BigNumber(1), new BigNumber(2)];
      const startTimes = [new Date(2020, 1), new Date(2020, 2)];
      const endTimes = [new Date(2021, 1), new Date(2021, 2)];
      const restrictionTypes = [0, 0];
      const mockedParams = {
        holders: ['0x7777777777777777777777777777777777777777', '0x7777777777777777777777777777777777777777'],
        allowedTokens,
        startTimes,
        endTimes,
        restrictionTypes,
        txData: {},
        safetyFactor: 10,
      };

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

      const expectedDecimalsResult = new BigNumber(18);
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.modifyIndividualDailyRestrictionMulti).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.holders,
          objectContaining(valueArrayToWeiArray(mockedParams.allowedTokens, expectedDecimalsResult)),
          objectContaining(dateArrayToBigNumberArray(mockedParams.startTimes)),
          objectContaining(dateArrayToBigNumberArray(mockedParams.endTimes)),
          mockedParams.restrictionTypes,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.modifyIndividualDailyRestrictionMulti(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.modifyIndividualDailyRestrictionMulti).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.holders,
          objectContaining(valueArrayToWeiArray(mockedParams.allowedTokens, expectedDecimalsResult)),
          objectContaining(dateArrayToBigNumberArray(mockedParams.startTimes)),
          objectContaining(dateArrayToBigNumberArray(mockedParams.endTimes)),
          mockedParams.restrictionTypes,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).times(3);
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).times(3);
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).times(3);
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).twice();
      verify(mockedSecurityTokenContract.decimals).twice();
    });
  });

  describe('modifyIndividualRestrictionMulti', () => {
    test('should modifyIndividualRestrictionMulti', async () => {
      const allowedTokens = [new BigNumber(1), new BigNumber(2)];
      const startTimes = [new Date(2020, 1), new Date(2020, 2)];
      const endTimes = [new Date(2021, 1), new Date(2021, 2)];
      const restrictionTypes = [0, 0];
      const mockedParams = {
        rollingPeriodInDays: [1, 2],
        holders: ['0x7777777777777777777777777777777777777777', '0x7777777777777777777777777777777777777777'],
        allowedTokens,
        startTimes,
        endTimes,
        restrictionTypes,
        txData: {},
        safetyFactor: 10,
      };

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

      const expectedDecimalsResult = new BigNumber(18);
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.modifyIndividualRestrictionMulti).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.holders,
          objectContaining(valueArrayToWeiArray(mockedParams.allowedTokens, expectedDecimalsResult)),
          objectContaining(dateArrayToBigNumberArray(mockedParams.startTimes)),
          objectContaining(numberArrayToBigNumberArray(mockedParams.rollingPeriodInDays)),
          objectContaining(dateArrayToBigNumberArray(mockedParams.endTimes)),
          mockedParams.restrictionTypes,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.modifyIndividualRestrictionMulti(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.modifyIndividualRestrictionMulti).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.holders,
          objectContaining(valueArrayToWeiArray(mockedParams.allowedTokens, expectedDecimalsResult)),
          objectContaining(dateArrayToBigNumberArray(mockedParams.startTimes)),
          objectContaining(numberArrayToBigNumberArray(mockedParams.rollingPeriodInDays)),
          objectContaining(dateArrayToBigNumberArray(mockedParams.endTimes)),
          mockedParams.restrictionTypes,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).times(3);
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).times(3);
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).times(3);
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).twice();
      verify(mockedSecurityTokenContract.decimals).twice();
    });
  });

  describe('modifyDefaultRestriction', () => {
    test('should modifyDefaultRestriction', async () => {
      const allowedTokens = new BigNumber(1);
      const startTime = new Date(2020, 1);
      const endTime = new Date(2021, 1);
      const restrictionType = 0;
      const mockedParams = {
        rollingPeriodInDays: 1,
        allowedTokens,
        startTime,
        endTime,
        restrictionType,
        txData: {},
        safetyFactor: 10,
      };

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

      const expectedDecimalsResult = new BigNumber(18);
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.modifyDefaultRestriction).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          objectContaining(valueToWei(mockedParams.allowedTokens, expectedDecimalsResult)),
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(numberToBigNumber(mockedParams.rollingPeriodInDays)),
          objectContaining(dateToBigNumber(mockedParams.endTime)),
          mockedParams.restrictionType,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.modifyDefaultRestriction(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.modifyDefaultRestriction).once();
      verify(
        mockedMethod.sendTransactionAsync(
          objectContaining(valueToWei(mockedParams.allowedTokens, expectedDecimalsResult)),
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(numberToBigNumber(mockedParams.rollingPeriodInDays)),
          objectContaining(dateToBigNumber(mockedParams.endTime)),
          mockedParams.restrictionType,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).twice();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).twice();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).twice();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.decimals).once();
    });
  });

  describe('modifyDefaultDailyRestriction', () => {
    test('should modifyDefaultDailyRestriction', async () => {
      const allowedTokens = new BigNumber(1);
      const startTime = new Date(2020, 1);
      const endTime = new Date(2021, 1);
      const restrictionType = 0;
      const mockedParams = {
        allowedTokens,
        startTime,
        endTime,
        restrictionType,
        txData: {},
        safetyFactor: 10,
      };

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

      const expectedDecimalsResult = new BigNumber(18);
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.modifyDefaultDailyRestriction).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          objectContaining(valueToWei(mockedParams.allowedTokens, expectedDecimalsResult)),
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(dateToBigNumber(mockedParams.endTime)),
          mockedParams.restrictionType,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.modifyDefaultDailyRestriction(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.modifyDefaultDailyRestriction).once();
      verify(
        mockedMethod.sendTransactionAsync(
          objectContaining(valueToWei(mockedParams.allowedTokens, expectedDecimalsResult)),
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(dateToBigNumber(mockedParams.endTime)),
          mockedParams.restrictionType,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).twice();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).twice();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).twice();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.decimals).once();
    });
  });

  describe('getIndividualBucketDetailsToUser', () => {
    test('should get getIndividualBucketDetailsToUser', async () => {
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const expectedDecimalsResult = new BigNumber(18);
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));

      // Address expected
      const user = '0x2222222222222222222222222222222222222222';
      const mockedParams = {
        user,
      };
      const lastTradedDayTime = new BigNumber(1);
      const sumOfLastPeriod = new BigNumber(2);
      const daysCovered = new BigNumber(3);
      const dailyLastTradedDayTime = new BigNumber(4);
      const lastTradedTimestamp = new BigNumber(5);
      const expectedResult = [
        lastTradedDayTime,
        sumOfLastPeriod,
        daysCovered,
        dailyLastTradedDayTime,
        lastTradedTimestamp,
      ];

      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getIndividualBucketDetailsToUser).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(mockedParams.user)).thenResolve(expectedResult);

      // Real call
      const result = await target.getIndividualBucketDetailsToUser(mockedParams);
      // Result expectation
      expect(result.lastTradedDayTime).toEqual(bigNumberToDate(lastTradedDayTime));
      expect(result.sumOfLastPeriod).toEqual(weiToValue(sumOfLastPeriod, expectedDecimalsResult));
      expect(result.daysCovered).toEqual(daysCovered.toNumber());
      expect(result.dailyLastTradedDayTime).toEqual(bigNumberToDate(dailyLastTradedDayTime));
      expect(result.lastTradedTimestamp).toEqual(bigNumberToDate(lastTradedTimestamp));
      // Verifications
      verify(mockedContract.getIndividualBucketDetailsToUser).once();
      verify(mockedMethod.callAsync(mockedParams.user)).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.decimals).once();
    });
  });

  describe('getDefaultBucketDetailsToUser', () => {
    test('should get getDefaultBucketDetailsToUser', async () => {
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const expectedDecimalsResult = new BigNumber(18);
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));

      // Address expected
      const user = '0x2222222222222222222222222222222222222222';
      const mockedParams = {
        user,
      };
      const lastTradedDayTime = new BigNumber(1);
      const sumOfLastPeriod = new BigNumber(2);
      const daysCovered = new BigNumber(3);
      const dailyLastTradedDayTime = new BigNumber(4);
      const lastTradedTimestamp = new BigNumber(5);
      const expectedResult = [
        lastTradedDayTime,
        sumOfLastPeriod,
        daysCovered,
        dailyLastTradedDayTime,
        lastTradedTimestamp,
      ];

      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getDefaultBucketDetailsToUser).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(mockedParams.user)).thenResolve(expectedResult);

      // Real call
      const result = await target.getDefaultBucketDetailsToUser(mockedParams);
      // Result expectation
      expect(result.lastTradedDayTime).toEqual(bigNumberToDate(lastTradedDayTime));
      expect(result.sumOfLastPeriod).toEqual(weiToValue(sumOfLastPeriod, expectedDecimalsResult));
      expect(result.daysCovered).toEqual(daysCovered.toNumber());
      expect(result.dailyLastTradedDayTime).toEqual(bigNumberToDate(dailyLastTradedDayTime));
      expect(result.lastTradedTimestamp).toEqual(bigNumberToDate(lastTradedTimestamp));
      // Verifications
      verify(mockedContract.getDefaultBucketDetailsToUser).once();
      verify(mockedMethod.callAsync(mockedParams.user)).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.decimals).once();
    });
  });

  describe('Get Total Traded By User', () => {
    test('Should getTotalTradedByUser', async () => {
      // Address expected
      const expectedResult = new BigNumber(100);
      const mockedParams = {
        user: '0x4444444444444444444444444444444444444444',
        at: new Date(2030, 1),
      };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getTotalTradedByUser).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(mockedParams.user, objectContaining(dateToBigNumber(mockedParams.at)))).thenResolve(
        expectedResult,
      );

      // Real call
      const result = await target.getTotalTradedByUser(mockedParams);
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getTotalTradedByUser).once();
      verify(mockedMethod.callAsync(mockedParams.user, objectContaining(dateToBigNumber(mockedParams.at)))).once();
    });
  });

  describe('Get Init Function', () => {
    test('Should getInitFunction', async () => {
      // Address expected
      const expectedResult = 'Function';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getInitFunction).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getInitFunction();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getInitFunction).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('Get Exempt Address', () => {
    test('should getExemptAddress', async () => {
      // Address expected
      const expectedResult = [
        '0x2222222222222222222222222222222222222222',
        '0x3333333333333333333333333333333333333333',
      ];
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getExemptAddress).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getExemptAddress();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getExemptAddress).once();
      verify(mockedMethod.callAsync()).once();
    });

    describe('Get Restricted Data', () => {
      test('should getRestrictedData', async () => {
        // Security Token Address expected
        const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
        // Setup get Security Token Address
        const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
        when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
        when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
        when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
          instance(mockedSecurityTokenContract),
        );
        const expectedDecimalsResult = new BigNumber(18);
        const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
        when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
        when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));

        const startTime = [new BigNumber(1925035200), new BigNumber(1925035201)];
        const endTime = [new BigNumber(1925035219), new BigNumber(1925035220)];
        const rollingPeriodInDays = [new BigNumber(5), new BigNumber(6)];
        const expectedResult = [
          ['0x4444444444444444444444444444444444444444', '0x2222222222222222222222222222222222222222'],
          [new BigNumber(100), new BigNumber(101)],
          startTime,
          rollingPeriodInDays,
          endTime,
          [new BigNumber(0), new BigNumber(0)],
        ];
        // Mocked method
        const mockedMethod = mock(MockedCallMethod);
        // Stub the method
        when(mockedContract.getRestrictedData).thenReturn(instance(mockedMethod));
        // Stub the request
        when(mockedMethod.callAsync()).thenResolve(expectedResult);

        // Real call
        const result = await target.getRestrictedData();
        // Result expectation
        for (let i = 0; i < expectedResult[0].length; i += 1) {
          expect(result[i].allAddresses).toEqual(expectedResult[0][i]);
          expect(result[i].allowedTokens).toEqual(
            weiToValue(expectedResult[1][i] as BigNumber, expectedDecimalsResult),
          );
          expect(result[i].startTime).toEqual(bigNumberToDate(startTime[i]));
          expect(result[i].rollingPeriodInDays).toEqual(rollingPeriodInDays[i].toNumber());
          expect(result[i].endTime).toEqual(bigNumberToDate(endTime[i]));
          expect(result[i].typeOfRestriction).toEqual(expectedResult[5][i]);
        }

        // Verifications
        verify(mockedContract.getRestrictedData).once();
        verify(mockedMethod.callAsync()).once();
        verify(mockedContract.securityToken).twice();
        verify(mockedGetSecurityTokenAddressMethod.callAsync()).twice();
        verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).twice();
        verify(mockedSecurityTokenDecimalsMethod.callAsync()).twice();
        verify(mockedSecurityTokenContract.decimals).twice();
      });
    });

    describe('SubscribeAsync', () => {
      test('should throw as eventName does not belong to VolumeRestrictionTransferManager', async () => {
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
            `Expected eventName to be one of: 'ChangedExemptWalletList', 'AddIndividualRestriction', 'AddIndividualDailyRestriction', 'ModifyIndividualRestriction', 'ModifyIndividualDailyRestriction', 'AddDefaultRestriction', 'AddDefaultDailyRestriction', 'ModifyDefaultRestriction', 'ModifyDefaultDailyRestriction', 'IndividualRestrictionRemoved', 'IndividualDailyRestrictionRemoved', 'DefaultRestrictionRemoved', 'DefaultDailyRestrictionRemoved', 'Pause', 'Unpause', encountered: Transfer`,
          ),
        );
      });
    });
  });
});

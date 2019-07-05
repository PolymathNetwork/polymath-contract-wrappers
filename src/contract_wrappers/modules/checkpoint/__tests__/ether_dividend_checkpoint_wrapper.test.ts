// EtherDividendCheckpointWrapper test
import { mock, instance, reset, when, verify, objectContaining } from 'ts-mockito';
import { BigNumber } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { EtherDividendCheckpointContract, ISecurityTokenContract, PolyTokenEvents } from '@polymathnetwork/abi-wrappers';
import { getMockedPolyResponse, MockedCallMethod, MockedSendMethod } from '../../../../test_utils/mocked_methods';
import EtherDividendCheckpointWrapper from '../ether_dividend_checkpoint_wrapper';
import ContractFactory from '../../../../factories/contractFactory';
import DividendCheckpointWrapper from '../dividend_checkpoint_wrapper';
import { dateToBigNumber, stringToBytes32, valueToWei } from '../../../../utils/convert';

describe('EtherDividendCheckpointWrapper', () => {
  // EtherDividend Wrapper is used as contract target here as DividendCheckpoint is abstract
  let target: EtherDividendCheckpointWrapper;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: EtherDividendCheckpointContract;
  let mockedContractFactory: ContractFactory;
  let mockedSecurityTokenContract: ISecurityTokenContract;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(EtherDividendCheckpointContract);
    mockedContractFactory = mock(ContractFactory);
    mockedSecurityTokenContract = mock(ISecurityTokenContract);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new EtherDividendCheckpointWrapper(
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
    test('should extend DividendCheckpoint', async () => {
      expect(target instanceof DividendCheckpointWrapper).toBe(true);
    });
  });
  describe('Create Dividend', () => {
    test('should createDividend', async () => {
      const expectedDecimalsResult = new BigNumber(18);
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
        maturity: new Date(2030, 1),
        expiry: new Date(2035, 1),
        name: 'Name',
        value: new BigNumber(100),
        txData: {},
        safetyFactor: 10,
      };
      const txPayableData = {
        ...{},
        value: valueToWei(mockedParams.value, expectedDecimalsResult),
      };

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.createDividend).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          objectContaining(dateToBigNumber(mockedParams.maturity)),
          objectContaining(dateToBigNumber(mockedParams.expiry)),
          objectContaining(stringToBytes32(mockedParams.name)),
          objectContaining(txPayableData),
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.createDividend(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.createDividend).once();
      verify(
        mockedMethod.sendTransactionAsync(
          objectContaining(dateToBigNumber(mockedParams.maturity)),
          objectContaining(dateToBigNumber(mockedParams.expiry)),
          objectContaining(stringToBytes32(mockedParams.name)),
          objectContaining(txPayableData),
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

  describe('Create Dividend with Checkpoint', () => {
    test('should createDividendWithCheckpoint', async () => {
      // Owner Address expected
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
      const checkpointId = 2;
      const expectedDecimalsResult = new BigNumber(18);
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

      // Mock security token currentCheckpointId
      const expectedCurrentCheckpointResult = new BigNumber(checkpointId + 1);
      // Mocked method
      const mockedCurrentCheckpointMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedSecurityTokenContract.currentCheckpointId).thenReturn(instance(mockedCurrentCheckpointMethod));
      // Stub the request
      when(mockedCurrentCheckpointMethod.callAsync()).thenResolve(expectedCurrentCheckpointResult);

      const mockedParams = {
        maturity: new Date(2030, 1),
        expiry: new Date(2035, 1),
        name: 'Name',
        checkpointId,
        value: new BigNumber(100),
        txData: {},
        safetyFactor: 10,
      };
      const txPayableData = {
        ...{},
        value: valueToWei(mockedParams.value, expectedDecimalsResult),
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.createDividendWithCheckpoint).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          objectContaining(dateToBigNumber(mockedParams.maturity)),
          objectContaining(dateToBigNumber(mockedParams.expiry)),
          objectContaining(new BigNumber(checkpointId)),
          objectContaining(stringToBytes32(mockedParams.name)),
          objectContaining(txPayableData),
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.createDividendWithCheckpoint(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.createDividendWithCheckpoint).once();
      verify(
        mockedMethod.sendTransactionAsync(
          objectContaining(dateToBigNumber(mockedParams.maturity)),
          objectContaining(dateToBigNumber(mockedParams.expiry)),
          objectContaining(new BigNumber(checkpointId)),
          objectContaining(stringToBytes32(mockedParams.name)),
          objectContaining(txPayableData),
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedCurrentCheckpointMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.currentCheckpointId).once();
      verify(mockedContract.securityToken).twice();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).twice();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).twice();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('Create Dividend with Checkpoint and Exclusions', () => {
    test('should createDividendWithCheckpointAndExclusions', async () => {
      // Owner Address expected
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
      const checkpointId = 2;
      const expectedDecimalsResult = new BigNumber(18);
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

      // Mock security token currentCheckpointId
      const expectedCurrentCheckpointResult = new BigNumber(checkpointId + 1);
      // Mocked method
      const mockedCurrentCheckpointMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedSecurityTokenContract.currentCheckpointId).thenReturn(instance(mockedCurrentCheckpointMethod));
      // Stub the request
      when(mockedCurrentCheckpointMethod.callAsync()).thenResolve(expectedCurrentCheckpointResult);

      const mockedParams = {
        maturity: new Date(2030, 1),
        expiry: new Date(2035, 1),
        name: 'Name',
        checkpointId,
        excluded: ['0x9999999999999999999999999999999999999999', '0x8888888888888888888888888888888888888888'],
        value: new BigNumber(100),
        txData: {},
        safetyFactor: 10,
      };
      const txPayableData = {
        ...{},
        value: valueToWei(mockedParams.value, expectedDecimalsResult),
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.createDividendWithCheckpointAndExclusions).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          objectContaining(dateToBigNumber(mockedParams.maturity)),
          objectContaining(dateToBigNumber(mockedParams.expiry)),
          objectContaining(new BigNumber(checkpointId)),
          mockedParams.excluded,
          objectContaining(stringToBytes32(mockedParams.name)),
          objectContaining(txPayableData),
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.createDividendWithCheckpointAndExclusions(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.createDividendWithCheckpointAndExclusions).once();
      verify(
        mockedMethod.sendTransactionAsync(
          objectContaining(dateToBigNumber(mockedParams.maturity)),
          objectContaining(dateToBigNumber(mockedParams.expiry)),
          objectContaining(new BigNumber(checkpointId)),
          mockedParams.excluded,
          objectContaining(stringToBytes32(mockedParams.name)),
          objectContaining(txPayableData),
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedCurrentCheckpointMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.currentCheckpointId).once();
      verify(mockedContract.securityToken).twice();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).twice();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).twice();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('Create Dividend with Exclusions', () => {
    test('should createDividendWithExclusions', async () => {
      // Owner Address expected
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
      const expectedDecimalsResult = new BigNumber(18);
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
        maturity: new Date(2030, 1),
        expiry: new Date(2035, 1),
        name: 'Name',
        checkpointId: undefined,
        excluded: ['0x9999999999999999999999999999999999999999', '0x8888888888888888888888888888888888888888'],
        value: new BigNumber(100),
        txData: {},
        safetyFactor: 10,
      };
      const txPayableData = {
        ...{},
        value: valueToWei(mockedParams.value, expectedDecimalsResult),
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.createDividendWithExclusions).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          objectContaining(dateToBigNumber(mockedParams.maturity)),
          objectContaining(dateToBigNumber(mockedParams.expiry)),
          mockedParams.excluded,
          objectContaining(stringToBytes32(mockedParams.name)),
          objectContaining(txPayableData),
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.createDividendWithExclusions(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.createDividendWithExclusions).once();
      verify(
        mockedMethod.sendTransactionAsync(
          objectContaining(dateToBigNumber(mockedParams.maturity)),
          objectContaining(dateToBigNumber(mockedParams.expiry)),
          mockedParams.excluded,
          objectContaining(stringToBytes32(mockedParams.name)),
          objectContaining(txPayableData),
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

  describe('SubscribeAsync', () => {
    test('should throw as eventName does not belong to Checkpoint Events', async () => {
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
          `Expected eventName to be one of: 'EtherDividendDeposited', 'EtherDividendClaimed', 'EtherDividendReclaimed', 'EtherDividendClaimFailed', 'EtherDividendWithholdingWithdrawn', 'SetDefaultExcludedAddresses', 'SetWithholding', 'SetWithholdingFixed', 'SetWallet', 'UpdateDividendDates', 'Pause', 'Unpause', encountered: Transfer`,
        ),
      );
    });
  });
});

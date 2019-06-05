// DividendCheckpointWrapper test
import { mock, instance, reset, when, verify, objectContaining } from 'ts-mockito';
import { BigNumber } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import {
  EtherDividendCheckpointContract,
  SecurityTokenContract,
} from '@polymathnetwork/abi-wrappers';
import { getMockedPolyResponse, MockedCallMethod, MockedSendMethod } from '../../../../test_utils/mocked_methods';
import EtherDividendCheckpointWrapper from '../ether_dividend_checkpoint_wrapper';
import ContractFactory from '../../../../factories/contractFactory';
import {
  bytes32ToString,
  dateToBigNumber,
  numberToBigNumber,
  stringToBytes32,
  valueArrayToWeiArray,
  weiToValue,
  valueToWei,
} from '../../../../utils/convert';
import ModuleWrapper from '../../module_wrapper';

describe('DividendCheckpointWrapper', () => {
  // ERC20 Dividend Wrapper is used as contract target here as DividendCheckpoint is abstract
  let target: EtherDividendCheckpointWrapper;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: EtherDividendCheckpointContract;
  let mockedContractFactory: ContractFactory;
  let mockedSecurityTokenContract: SecurityTokenContract;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(EtherDividendCheckpointContract);
    mockedContractFactory = mock(ContractFactory);
    mockedSecurityTokenContract = mock(SecurityTokenContract);

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

  describe('Wallet', () => {
    test('should get the wallet address', async () => {
      // Address expected
      const expectedResult = '0x1234567890123456789012345678901234567890';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.wallet).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.wallet();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.wallet).once();
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
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
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
      verify(mockedPauseMethod.callAsync()).once();
      verify(mockedContract.paused).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('Dividends', () => {
    test('should get dividend info', async () => {
      // Get Decimals
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      const expectedDecimalsResult = new BigNumber(18);
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );

      const dividendIndex = 2;
      const expectedResult = [
        new BigNumber(1),
        new BigNumber(1),
        new BigNumber(1),
        new BigNumber(1),
        new BigNumber(1),
        new BigNumber(1),
        new BigNumber(1),
        false,
        new BigNumber(1),
        new BigNumber(1),
        stringToBytes32('name'),
      ];
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.dividends).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(objectContaining(new BigNumber(dividendIndex)))).thenResolve(expectedResult);

      // Real call
      const result = await target.dividends({ dividendIndex });

      // Result expectation
      expect(new BigNumber(1)).toEqual(expectedResult[0]);
      expect(dateToBigNumber(result.created)).toEqual(expectedResult[1]);
      expect(dateToBigNumber(result.maturity)).toEqual(expectedResult[2]);
      expect(dateToBigNumber(result.expiry)).toEqual(expectedResult[3]);
      expect(valueToWei(result.amount, expectedDecimalsResult)).toEqual(expectedResult[4]);
      expect(valueToWei(result.claimedAmount, expectedDecimalsResult)).toEqual(expectedResult[5]);
      expect(valueToWei(result.totalSupply, expectedDecimalsResult)).toEqual(expectedResult[6]);
      expect(result.reclaimed).toBe(expectedResult[7]);
      expect(valueToWei(result.totalWithheld, expectedDecimalsResult)).toEqual(expectedResult[8]);
      expect(valueToWei(result.totalWithheldWithdrawn, expectedDecimalsResult)).toEqual(expectedResult[9]);
      expect(result.name).toBe(expectedResult[10]);

      // Verifications
      verify(mockedContract.dividends).once();
      verify(mockedMethod.callAsync(objectContaining(new BigNumber(dividendIndex)))).once();
    });
  });

  describe('Excluded', () => {
    test('should get excluded address', async () => {
      const dividendIndex = 2;
      const expectedResult = '0x1111111111111111111111111111111111111111';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.excluded).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(objectContaining(new BigNumber(dividendIndex)))).thenResolve(expectedResult);

      // Real call
      const result = await target.excluded({ dividendIndex });

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.excluded).once();
      verify(mockedMethod.callAsync(objectContaining(new BigNumber(dividendIndex)))).once();
    });
  });

  describe('WithholdingTax', () => {
    test('should get withholdingTax', async () => {
      const investor = '0x1111111111111111111111111111111111111111';
      const expectedResult = new BigNumber(1);
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.withholdingTax).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(investor)).thenResolve(expectedResult);

      // Real call
      const result = await target.withholdingTax({ investor });

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.withholdingTax).once();
      verify(mockedMethod.callAsync(investor)).once();
    });
  });

  describe('ReclaimERC20', () => {
    test('should call to Reclaim ERC20', async () => {
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
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('ReclaimETH', () => {
    test('should call to Reclaim ETH', async () => {
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
      when(mockedContract.reclaimETH).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.sendTransactionAsync(mockedParams.txData, mockedParams.safetyFactor)).thenResolve(
        expectedResult,
      );

      // Real call
      const result = await target.reclaimETH(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.reclaimETH).once();
      verify(mockedMethod.sendTransactionAsync(mockedParams.txData, mockedParams.safetyFactor)).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('Change Wallet', () => {
    test('should change wallet', async () => {
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
        wallet: '0x4444444444444444444444444444444444444444',
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.changeWallet).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(mockedParams.wallet, mockedParams.txData, mockedParams.safetyFactor),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.changeWallet(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.changeWallet).once();
      verify(
        mockedMethod.sendTransactionAsync(mockedParams.wallet, mockedParams.txData, mockedParams.safetyFactor),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('GetDefaultExcluded', () => {
    test('should getDefaultExcluded', async () => {
      const expectedResult = [
        '0x1111111111111111111111111111111111111111',
        '0x2222222222222222222222222222222222222222',
      ];

      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getDefaultExcluded).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getDefaultExcluded();

      // Result expectation
      expect(result).toBe(expectedResult);

      // Verifications
      verify(mockedContract.getDefaultExcluded).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('Create Checkpoint', () => {
    test('should create checkpoint', async () => {
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
      when(mockedContract.createCheckpoint).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.sendTransactionAsync(mockedParams.txData, mockedParams.safetyFactor)).thenResolve(
        expectedResult,
      );

      // Real call
      const result = await target.createCheckpoint(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.createCheckpoint).once();
      verify(mockedMethod.sendTransactionAsync(mockedParams.txData, mockedParams.safetyFactor)).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('Set Default Excluded', () => {
    test('should setDefaultExcluded', async () => {
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
        excluded: ['0x1111111111111111111111111111111111111111', '0x2222222222222222222222222222222222222222'],
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.setDefaultExcluded).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(mockedParams.excluded, mockedParams.txData, mockedParams.safetyFactor),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.setDefaultExcluded(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.setDefaultExcluded).once();
      verify(
        mockedMethod.sendTransactionAsync(mockedParams.excluded, mockedParams.txData, mockedParams.safetyFactor),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('Set WithholdingFixed', () => {
    test('should setWithholdingFixed', async () => {
      // Owner Address expected
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
      const expectedDecimalsPercentageResult = new BigNumber(16);

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
        investors: ['0x1111111111111111111111111111111111111111', '0x2222222222222222222222222222222222222222'],
        withholding: new BigNumber(75),
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.setWithholdingFixed).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.investors,
          objectContaining(valueToWei(mockedParams.withholding, expectedDecimalsPercentageResult)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.setWithholdingFixed(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.setWithholdingFixed).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.investors,
          objectContaining(valueToWei(mockedParams.withholding, expectedDecimalsPercentageResult)),
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

  describe('Set Withholding', () => {
    test('should setWithholding', async () => {
      // Owner Address expected
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
      const expectedDecimalsPercentageResult = new BigNumber(16);

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
        investors: ['0x1111111111111111111111111111111111111111', '0x2222222222222222222222222222222222222222'],
        withholding: [new BigNumber(50), new BigNumber(75)],
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.setWithholding).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.investors,
          objectContaining(valueArrayToWeiArray(mockedParams.withholding, expectedDecimalsPercentageResult)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.setWithholding(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.setWithholding).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.investors,
          objectContaining(valueArrayToWeiArray(mockedParams.withholding, expectedDecimalsPercentageResult)),
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

  describe('Push Dividend Payment to Addresses', () => {
    test('should pushDividendPaymentToAddresses', async () => {
      // Owner Address expected
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';

      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      const expectedDecimalsResult = new BigNumber(18);
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
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));

      // getDividendsData mock
      const pastDate = new Date(2010, 1);
      const futureDate = new Date(2030, 1);
      const name = 'Name';
      const expectedDividendsResult = [
        [dateToBigNumber(pastDate), dateToBigNumber(pastDate)],
        [dateToBigNumber(pastDate), dateToBigNumber(pastDate)],
        [dateToBigNumber(futureDate), dateToBigNumber(futureDate)],
        [new BigNumber(1), new BigNumber(2)],
        [new BigNumber(3), new BigNumber(4)],
        [stringToBytes32(name), stringToBytes32(name)],
      ];
      const mockedDividendsMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getDividendsData).thenReturn(instance(mockedDividendsMethod));
      // Stub the request
      when(mockedDividendsMethod.callAsync()).thenResolve(expectedDividendsResult);

      // getDividendData mock
      const dividendIndex = 1;
      const expectedDividendResult = [
        dateToBigNumber(pastDate),
        dateToBigNumber(pastDate),
        dateToBigNumber(futureDate),
        new BigNumber(1),
        new BigNumber(0),
        stringToBytes32(name),
      ];

      // Mocked method
      const mockedDividendMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getDividendData).thenReturn(instance(mockedDividendMethod));
      // Stub the request
      when(mockedDividendMethod.callAsync(objectContaining(new BigNumber(dividendIndex)))).thenResolve(
        expectedDividendResult,
      );

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const mockedParams = {
        dividendIndex,
        payees: ['0x1111111111111111111111111111111111111111', '0x2222222222222222222222222222222222222222'],
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.pushDividendPaymentToAddresses).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          objectContaining(new BigNumber(mockedParams.dividendIndex)),
          mockedParams.payees,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.pushDividendPaymentToAddresses(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.pushDividendPaymentToAddresses).once();
      verify(
        mockedMethod.sendTransactionAsync(
          objectContaining(new BigNumber(mockedParams.dividendIndex)),
          mockedParams.payees,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.getDividendsData).once();
      verify(mockedDividendsMethod.callAsync()).once();
      verify(mockedContract.getDividendData).once();
      verify(mockedDividendMethod.callAsync(objectContaining(new BigNumber(dividendIndex)))).once();
      verify(mockedContract.securityToken).twice();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).twice();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).twice();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedSecurityTokenContract.decimals).once();
    });
  });

  describe('Push Dividend Payment', () => {
    test('should pushDividendPayment', async () => {
      // Owner Address expected
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';

      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      const expectedDecimalsResult = new BigNumber(18);
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
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));

      // getDividendsData mock
      const pastDate = new Date(2010, 1);
      const futureDate = new Date(2030, 1);
      const name = 'Name';
      const expectedDividendsResult = [
        [dateToBigNumber(pastDate), dateToBigNumber(pastDate)],
        [dateToBigNumber(pastDate), dateToBigNumber(pastDate)],
        [dateToBigNumber(futureDate), dateToBigNumber(futureDate)],
        [new BigNumber(1), new BigNumber(2)],
        [new BigNumber(3), new BigNumber(4)],
        [stringToBytes32(name), stringToBytes32(name)],
      ];
      const mockedDividendsMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getDividendsData).thenReturn(instance(mockedDividendsMethod));
      // Stub the request
      when(mockedDividendsMethod.callAsync()).thenResolve(expectedDividendsResult);

      // getDividendData mock
      const dividendIndex = 1;
      const expectedDividendResult = [
        dateToBigNumber(pastDate),
        dateToBigNumber(pastDate),
        dateToBigNumber(futureDate),
        new BigNumber(1),
        new BigNumber(0),
        stringToBytes32(name),
      ];

      // Mocked method
      const mockedDividendMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getDividendData).thenReturn(instance(mockedDividendMethod));
      // Stub the request
      when(mockedDividendMethod.callAsync(objectContaining(new BigNumber(dividendIndex)))).thenResolve(
        expectedDividendResult,
      );

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const mockedParams = {
        dividendIndex,
        start: new Date(2030, 1),
        iterations: 3,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.pushDividendPayment).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          objectContaining(new BigNumber(mockedParams.dividendIndex)),
          objectContaining(dateToBigNumber(mockedParams.start)),
          objectContaining(numberToBigNumber(mockedParams.iterations)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.pushDividendPayment(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.pushDividendPayment).once();
      verify(
        mockedMethod.sendTransactionAsync(
          objectContaining(new BigNumber(mockedParams.dividendIndex)),
          objectContaining(dateToBigNumber(mockedParams.start)),
          objectContaining(numberToBigNumber(mockedParams.iterations)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.getDividendsData).once();
      verify(mockedDividendsMethod.callAsync()).once();
      verify(mockedContract.getDividendData).once();
      verify(mockedDividendMethod.callAsync(objectContaining(new BigNumber(dividendIndex)))).once();
      verify(mockedContract.securityToken).twice();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).twice();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).twice();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedSecurityTokenContract.decimals).once();
    });
  });

  describe('Pull Dividend Payment', () => {
    test('should pullDividendPayment', async () => {
      // Get Decimals
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      const expectedDecimalsResult = new BigNumber(18);
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));

      // Owner Address expected
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';

      const dividendIndex = 2;

      // getDividendsData mock
      const pastDate = new Date(2010, 1);
      const futureDate = new Date(2030, 1);
      const name = 'Name';

      const expectedDividendsResult = [
        [dateToBigNumber(pastDate), dateToBigNumber(pastDate), dateToBigNumber(pastDate)],
        [dateToBigNumber(pastDate), dateToBigNumber(pastDate), dateToBigNumber(pastDate)],
        [dateToBigNumber(futureDate), dateToBigNumber(futureDate), dateToBigNumber(futureDate)],
        [new BigNumber(1), new BigNumber(2), new BigNumber(3)],
        [new BigNumber(3), new BigNumber(4), new BigNumber(5)],
        [stringToBytes32(name), stringToBytes32(name), stringToBytes32(name)],
      ];
      const mockedDividendsMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getDividendsData).thenReturn(instance(mockedDividendsMethod));
      // Stub the request
      when(mockedDividendsMethod.callAsync()).thenResolve(expectedDividendsResult);

      // getDividendData mock
      const expectedDividendResult = [
        dateToBigNumber(pastDate),
        dateToBigNumber(pastDate),
        dateToBigNumber(futureDate),
        new BigNumber(1),
        new BigNumber(0),
        stringToBytes32(name),
      ];

      // Mocked method
      const mockedDividendMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getDividendData).thenReturn(instance(mockedDividendMethod));
      // Stub the request
      when(mockedDividendMethod.callAsync(objectContaining(new BigNumber(dividendIndex)))).thenResolve(
        expectedDividendResult,
      );

      // Mock Paused
      const expectedPausedResult = false;
      // Mocked method
      const mockedPausedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.paused).thenReturn(instance(mockedPausedMethod));
      // Stub the request
      when(mockedPausedMethod.callAsync()).thenResolve(expectedPausedResult);

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // Mock isClaimed
      const expectedIsClaimedResult = false;
      // Mocked method
      const mockedIsClaimedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.isClaimed).thenReturn(instance(mockedIsClaimedMethod));
      // Stub the request
      when(
        mockedIsClaimedMethod.callAsync(expectedOwnerResult, objectContaining(new BigNumber(dividendIndex))),
      ).thenResolve(expectedIsClaimedResult);

      // Mock isExcluded
      const expectedIsExcludedResult = false;
      // Mocked method
      const mockedIsExcludedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.isExcluded).thenReturn(instance(mockedIsExcludedMethod));
      // Stub the request
      when(
        mockedIsExcludedMethod.callAsync(expectedOwnerResult, objectContaining(new BigNumber(dividendIndex))),
      ).thenResolve(expectedIsExcludedResult);

      const mockedParams = {
        dividendIndex,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.pullDividendPayment).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          objectContaining(new BigNumber(mockedParams.dividendIndex)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.pullDividendPayment(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.pullDividendPayment).once();
      verify(
        mockedMethod.sendTransactionAsync(
          objectContaining(new BigNumber(mockedParams.dividendIndex)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedContract.paused).once();
      verify(mockedPausedMethod.callAsync()).once();
      verify(mockedContract.isExcluded).once();
      verify(
        mockedIsExcludedMethod.callAsync(expectedOwnerResult, objectContaining(new BigNumber(dividendIndex))),
      ).once();
      verify(mockedContract.isClaimed).once();
      verify(
        mockedIsClaimedMethod.callAsync(expectedOwnerResult, objectContaining(new BigNumber(dividendIndex))),
      ).once();
      verify(mockedContract.getDividendsData).once();
      verify(mockedDividendsMethod.callAsync()).once();
      verify(mockedContract.getDividendData).once();
      verify(mockedDividendMethod.callAsync(objectContaining(new BigNumber(dividendIndex)))).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenContract.decimals).once();
    });
  });

  describe('Reclaim Dividend', () => {
    test('should reclaimDividend', async () => {
      // Get Decimals
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      const expectedDecimalsResult = new BigNumber(18);
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );

      // getDividendsData mock
      const pastDate = new Date(2010, 1);
      const futureDate = new Date(2030, 1);
      const name = 'Name';

      const expectedGetDividendsResult = [
        [dateToBigNumber(pastDate), dateToBigNumber(pastDate), dateToBigNumber(pastDate)],
        [dateToBigNumber(pastDate), dateToBigNumber(pastDate), dateToBigNumber(pastDate)],
        [dateToBigNumber(futureDate), dateToBigNumber(futureDate), dateToBigNumber(futureDate)],
        [new BigNumber(1), new BigNumber(2), new BigNumber(3)],
        [new BigNumber(3), new BigNumber(4), new BigNumber(5)],
        [stringToBytes32(name), stringToBytes32(name), stringToBytes32(name)],
      ];
      const mockedGetDividendsMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getDividendsData).thenReturn(instance(mockedGetDividendsMethod));
      // Stub the request
      when(mockedGetDividendsMethod.callAsync()).thenResolve(expectedGetDividendsResult);

      const dividendIndex = 2;
      const expectedDividendsResult = [
        new BigNumber(1),
        new BigNumber(1),
        new BigNumber(1),
        dateToBigNumber(pastDate),
        new BigNumber(1),
        new BigNumber(1),
        new BigNumber(1),
        false,
        new BigNumber(1),
        new BigNumber(1),
        stringToBytes32('name'),
      ];
      // Mocked method
      const mockedDividendsMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.dividends).thenReturn(instance(mockedDividendsMethod));
      // Stub the request
      when(mockedDividendsMethod.callAsync(objectContaining(new BigNumber(dividendIndex)))).thenResolve(
        expectedDividendsResult,
      );

      const mockedParams = {
        dividendIndex: 2,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.reclaimDividend).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          objectContaining(new BigNumber(mockedParams.dividendIndex)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.reclaimDividend(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.reclaimDividend).once();
      verify(
        mockedMethod.sendTransactionAsync(
          objectContaining(new BigNumber(mockedParams.dividendIndex)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedContract.dividends).once();
      verify(mockedDividendsMethod.callAsync(objectContaining(new BigNumber(dividendIndex)))).once();
      verify(mockedContract.getDividendsData).once();
      verify(mockedGetDividendsMethod.callAsync()).once();
    });
  });

  describe('Calculate Dividend', () => {
    test('should calculateDividend', async () => {
      // Get Decimals
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      const expectedDecimalsResult = new BigNumber(18);
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );

      // Mock getDividendsData
      const pastDate = new Date(2010, 1);
      const futureDate = new Date(2030, 1);
      const name = 'Name';
      const expectedDividendsDataResult = [
        [dateToBigNumber(pastDate), dateToBigNumber(pastDate), dateToBigNumber(pastDate)],
        [dateToBigNumber(pastDate), dateToBigNumber(pastDate), dateToBigNumber(pastDate)],
        [dateToBigNumber(futureDate), dateToBigNumber(futureDate), dateToBigNumber(futureDate)],
        [new BigNumber(1), new BigNumber(2), new BigNumber(3)],
        [new BigNumber(3), new BigNumber(4), new BigNumber(5)],
        [stringToBytes32(name), stringToBytes32(name), stringToBytes32(name)],
      ];
      const mockedDividendsDataMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getDividendsData).thenReturn(instance(mockedDividendsDataMethod));
      // Stub the request
      when(mockedDividendsDataMethod.callAsync()).thenResolve(expectedDividendsDataResult);

      const mockedParams = {
        dividendIndex: 2,
        payee: '0x6666666666666666666666666666666666666666',
      };
      const expectedResult = [new BigNumber(3), new BigNumber(2)];
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.calculateDividend).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.callAsync(objectContaining(new BigNumber(mockedParams.dividendIndex)), mockedParams.payee),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.calculateDividend(mockedParams);

      // Result expectation
      expect(result.claim).toEqual(weiToValue(expectedResult[0], expectedDecimalsResult));
      expect(result.withheld).toEqual(weiToValue(expectedResult[1], expectedDecimalsResult));

      // Verifications
      verify(mockedContract.getDividendsData).once();
      verify(mockedDividendsDataMethod.callAsync()).once();
      verify(mockedContract.calculateDividend).once();
      verify(
        mockedMethod.callAsync(objectContaining(new BigNumber(mockedParams.dividendIndex)), mockedParams.payee),
      ).once();
    });
  });

  describe('Get Dividend Index', () => {
    test('should getDividendIndex', async () => {
      const mockedParams = {
        checkpointId: 2,
      };
      const expectedResult = [new BigNumber(3), new BigNumber(2)];
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getDividendIndex).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(objectContaining(new BigNumber(mockedParams.checkpointId)))).thenResolve(
        expectedResult,
      );

      // Real call
      const result = await target.getDividendIndex(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);

      // Verifications
      verify(mockedContract.getDividendIndex).once();
      verify(mockedMethod.callAsync(objectContaining(new BigNumber(mockedParams.checkpointId)))).once();
    });
  });

  describe('Withdraw Withholding', () => {
    test('should withdrawWithholding', async () => {
      // getDividendsData mock
      const pastDate = new Date(2010, 1);
      const futureDate = new Date(2030, 1);
      const name = 'Name';
      const expectedGetDividendsResult = [
        [dateToBigNumber(pastDate), dateToBigNumber(pastDate), dateToBigNumber(pastDate)],
        [dateToBigNumber(pastDate), dateToBigNumber(pastDate), dateToBigNumber(pastDate)],
        [dateToBigNumber(futureDate), dateToBigNumber(futureDate), dateToBigNumber(futureDate)],
        [new BigNumber(1), new BigNumber(2), new BigNumber(3)],
        [new BigNumber(3), new BigNumber(4), new BigNumber(5)],
        [stringToBytes32(name), stringToBytes32(name), stringToBytes32(name)],
      ];
      const mockedGetDividendsMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getDividendsData).thenReturn(instance(mockedGetDividendsMethod));
      // Stub the request
      when(mockedGetDividendsMethod.callAsync()).thenResolve(expectedGetDividendsResult);

      const dividendIndex = 2;

      const mockedParams = {
        dividendIndex,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.withdrawWithholding).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          objectContaining(new BigNumber(mockedParams.dividendIndex)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.withdrawWithholding(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.withdrawWithholding).once();
      verify(
        mockedMethod.sendTransactionAsync(
          objectContaining(new BigNumber(mockedParams.dividendIndex)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedContract.getDividendsData).once();
      verify(mockedGetDividendsMethod.callAsync()).once();
    });
  });

  describe('Update Dividend Dates', () => {
    test('should updateDividendDates', async () => {
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

      // getDividendsData mock
      const pastDate = new Date(2010, 1);
      const futureDate = new Date(2030, 1);
      const name = 'Name';
      const expectedGetDividendsResult = [
        [dateToBigNumber(pastDate), dateToBigNumber(pastDate), dateToBigNumber(pastDate)],
        [dateToBigNumber(pastDate), dateToBigNumber(pastDate), dateToBigNumber(pastDate)],
        [dateToBigNumber(futureDate), dateToBigNumber(futureDate), dateToBigNumber(futureDate)],
        [new BigNumber(1), new BigNumber(2), new BigNumber(3)],
        [new BigNumber(3), new BigNumber(4), new BigNumber(5)],
        [stringToBytes32(name), stringToBytes32(name), stringToBytes32(name)],
      ];
      const mockedGetDividendsMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getDividendsData).thenReturn(instance(mockedGetDividendsMethod));
      // Stub the request
      when(mockedGetDividendsMethod.callAsync()).thenResolve(expectedGetDividendsResult);

      const mockedParams = {
        dividendIndex: 2,
        maturity: new Date(2030, 1),
        expiry: new Date(2035, 1),
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.updateDividendDates).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          objectContaining(new BigNumber(mockedParams.dividendIndex)),
          objectContaining(dateToBigNumber(mockedParams.maturity)),
          objectContaining(dateToBigNumber(mockedParams.expiry)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.updateDividendDates(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.updateDividendDates).once();
      verify(
        mockedMethod.sendTransactionAsync(
          objectContaining(new BigNumber(mockedParams.dividendIndex)),
          objectContaining(dateToBigNumber(mockedParams.maturity)),
          objectContaining(dateToBigNumber(mockedParams.expiry)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.getDividendsData).once();
      verify(mockedGetDividendsMethod.callAsync()).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('GetDividendsData', () => {
    test('should getDividendsData', async () => {
      // Get Decimals
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      const expectedDecimalsResult = new BigNumber(18);
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));

      const pastDate = new Date(2010, 1);
      const futureDate = new Date(2030, 1);
      const name = 'Name';
      const expectedResult = [
        [dateToBigNumber(pastDate), dateToBigNumber(pastDate)],
        [dateToBigNumber(pastDate), dateToBigNumber(pastDate)],
        [dateToBigNumber(futureDate), dateToBigNumber(futureDate)],
        [new BigNumber(1), new BigNumber(2)],
        [new BigNumber(3), new BigNumber(4)],
        [stringToBytes32(name), stringToBytes32(name)],
      ];

      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getDividendsData).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getDividendsData();

      // Result expectation
      expect(result[0].created).toEqual(pastDate);
      expect(result[0].maturity).toEqual(pastDate);
      expect(result[0].expiry).toEqual(futureDate);
      expect(result[0].amount).toEqual(weiToValue(expectedResult[3][0] as BigNumber, expectedDecimalsResult));
      expect(result[0].claimedAmount).toEqual(weiToValue(expectedResult[4][0] as BigNumber, expectedDecimalsResult));
      expect(result[0].name).toEqual(bytes32ToString(stringToBytes32(name)));

      // Verifications
      verify(mockedContract.getDividendsData).once();
      verify(mockedMethod.callAsync()).once();
      verify(mockedContract.securityToken).twice();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).twice();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).twice();
      verify(mockedSecurityTokenContract.decimals).twice();
    });
  });

  describe('getDividendData', () => {
    test('should getDividendData', async () => {
      // Get Decimals
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      const expectedDecimalsResult = new BigNumber(18);
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));

      const pastDate = new Date(2010, 1);
      const futureDate = new Date(2030, 1);
      const name = 'Name';
      const dividendIndex = 2;
      const expectedResult = [
        dateToBigNumber(pastDate),
        dateToBigNumber(pastDate),
        dateToBigNumber(futureDate),
        new BigNumber(1),
        new BigNumber(3),
        stringToBytes32(name),
      ];

      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getDividendData).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(objectContaining(new BigNumber(dividendIndex)))).thenResolve(expectedResult);

      // Real call
      const result = await target.getDividendData({ dividendIndex });

      // Result expectation
      expect(result.created).toEqual(pastDate);
      expect(result.maturity).toEqual(pastDate);
      expect(result.expiry).toEqual(futureDate);
      expect(result.amount).toEqual(weiToValue(expectedResult[3] as BigNumber, expectedDecimalsResult));
      expect(result.claimedAmount).toEqual(weiToValue(expectedResult[4] as BigNumber, expectedDecimalsResult));
      expect(result.name).toEqual(bytes32ToString(stringToBytes32(name)));

      // Verifications
      verify(mockedContract.getDividendData).once();
      verify(mockedMethod.callAsync(objectContaining(new BigNumber(dividendIndex)))).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenContract.decimals).once();
    });
  });

  describe('Get Dividend Progress', () => {
    test('should getDividendProgress', async () => {
      // Get Decimals
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      const expectedDecimalsResult = new BigNumber(18);
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );

      // Mock getDividendsData
      const pastDate = new Date(2010, 1);
      const futureDate = new Date(2030, 1);
      const name = 'Name';
      const expectedDividendsDataResult = [
        [dateToBigNumber(pastDate), dateToBigNumber(pastDate), dateToBigNumber(pastDate)],
        [dateToBigNumber(pastDate), dateToBigNumber(pastDate), dateToBigNumber(pastDate)],
        [dateToBigNumber(futureDate), dateToBigNumber(futureDate), dateToBigNumber(futureDate)],
        [new BigNumber(1), new BigNumber(2), new BigNumber(3)],
        [new BigNumber(3), new BigNumber(4), new BigNumber(5)],
        [stringToBytes32(name), stringToBytes32(name), stringToBytes32(name)],
      ];
      const mockedDividendsDataMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getDividendsData).thenReturn(instance(mockedDividendsDataMethod));
      // Stub the request
      when(mockedDividendsDataMethod.callAsync()).thenResolve(expectedDividendsDataResult);

      const mockedParams = {
        dividendIndex: 2,
      };
      const expectedResult = [
        ['0x1111111111111111111111111111111111111111', '0x2222222222222222222222222222222222222222'],
        [true, true],
        [true, true],
        [new BigNumber(1), new BigNumber(2)],
        [new BigNumber(1), new BigNumber(2)],
        [new BigNumber(1), new BigNumber(2)],
      ];
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getDividendProgress).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(objectContaining(new BigNumber(mockedParams.dividendIndex)))).thenResolve(
        expectedResult,
      );

      // Real call
      const result = await target.getDividendProgress(mockedParams);

      // Result expectation
      expect(result[0].investor).toBe(expectedResult[0][0]);
      expect(result[0].claimed).toBe(expectedResult[1][0]);
      expect(result[0].excluded).toBe(expectedResult[2][0]);
      expect(result[0].withheld).toEqual(weiToValue(expectedResult[3][0] as BigNumber, expectedDecimalsResult));
      expect(result[0].amount).toEqual(weiToValue(expectedResult[4][0] as BigNumber, expectedDecimalsResult));
      expect(result[0].balance).toBe(expectedResult[5][0]);

      // Verifications
      verify(mockedContract.getDividendsData).once();
      verify(mockedDividendsDataMethod.callAsync()).once();
      verify(mockedContract.getDividendProgress).once();
      verify(mockedMethod.callAsync(objectContaining(new BigNumber(mockedParams.dividendIndex)))).once();
    });
  });

  describe('Get Checkpoint Data', () => {
    test('should getCheckpointData', async () => {
      const checkpointId = 2;

      // Mock security token
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      const expectedDecimalsResult = new BigNumber(18);
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));

      // Mock security token currentCheckpointId
      const expectedCurrentCheckpointResult = new BigNumber(checkpointId);
      // Mocked method
      const mockedCurrentCheckpointMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedSecurityTokenContract.currentCheckpointId).thenReturn(instance(mockedCurrentCheckpointMethod));
      // Stub the request
      when(mockedCurrentCheckpointMethod.callAsync()).thenResolve(expectedCurrentCheckpointResult);

      const mockedParams = {
        checkpointId: 2,
      };
      const expectedResult = [
        ['0x1111111111111111111111111111111111111111', '0x2222222222222222222222222222222222222222'],
        [new BigNumber(1), new BigNumber(2)],
        [new BigNumber(1), new BigNumber(2)],
      ];
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getCheckpointData).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(objectContaining(new BigNumber(mockedParams.checkpointId)))).thenResolve(
        expectedResult,
      );

      // Real call
      const result = await target.getCheckpointData(mockedParams);

      // Result expectation
      expect(result[0].investor).toBe(expectedResult[0][0]);
      expect(result[0].balance).toEqual(weiToValue(expectedResult[1][0] as BigNumber, expectedDecimalsResult));
      expect(result[0].withheld).toEqual(weiToValue(expectedResult[2][0] as BigNumber, expectedDecimalsResult));

      // Verifications
      verify(mockedContract.getCheckpointData).once();
      verify(mockedMethod.callAsync(objectContaining(new BigNumber(mockedParams.checkpointId)))).once();
      verify(mockedSecurityTokenContract.currentCheckpointId).once();
      verify(mockedCurrentCheckpointMethod.callAsync()).once();
      verify(mockedContract.securityToken).times(3);
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).times(3);
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).times(3);
      verify(mockedSecurityTokenContract.decimals).twice();
    });
  });

  describe('isClaimed', () => {
    test('should get isClaimed', async () => {
      // Mock getDividendsData
      const pastDate = new Date(2010, 1);
      const futureDate = new Date(2030, 1);
      const name = 'Name';
      const expectedDividendsDataResult = [
        [dateToBigNumber(pastDate), dateToBigNumber(pastDate), dateToBigNumber(pastDate)],
        [dateToBigNumber(pastDate), dateToBigNumber(pastDate), dateToBigNumber(pastDate)],
        [dateToBigNumber(futureDate), dateToBigNumber(futureDate), dateToBigNumber(futureDate)],
        [new BigNumber(1), new BigNumber(2), new BigNumber(3)],
        [new BigNumber(3), new BigNumber(4), new BigNumber(5)],
        [stringToBytes32(name), stringToBytes32(name), stringToBytes32(name)],
      ];
      const mockedDividendsDataMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getDividendsData).thenReturn(instance(mockedDividendsDataMethod));
      // Stub the request
      when(mockedDividendsDataMethod.callAsync()).thenResolve(expectedDividendsDataResult);

      const mockedParams = {
        investor: '0x6666666666666666666666666666666666666666',
        dividendIndex: 2,
      };
      const expectedResult = false;
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.isClaimed).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.callAsync(mockedParams.investor, objectContaining(new BigNumber(mockedParams.dividendIndex))),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.isClaimed(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);

      // Verifications
      verify(mockedContract.getDividendsData).once();
      verify(mockedDividendsDataMethod.callAsync()).once();
      verify(mockedContract.isClaimed).once();
      verify(
        mockedMethod.callAsync(mockedParams.investor, objectContaining(new BigNumber(mockedParams.dividendIndex))),
      ).once();
    });
  });

  describe('isExcluded', () => {
    test('should get isExcluded', async () => {
      // Mock getDividendsData
      const pastDate = new Date(2010, 1);
      const futureDate = new Date(2030, 1);
      const name = 'Name';
      const expectedDividendsDataResult = [
        [dateToBigNumber(pastDate), dateToBigNumber(pastDate), dateToBigNumber(pastDate)],
        [dateToBigNumber(pastDate), dateToBigNumber(pastDate), dateToBigNumber(pastDate)],
        [dateToBigNumber(futureDate), dateToBigNumber(futureDate), dateToBigNumber(futureDate)],
        [new BigNumber(1), new BigNumber(2), new BigNumber(3)],
        [new BigNumber(3), new BigNumber(4), new BigNumber(5)],
        [stringToBytes32(name), stringToBytes32(name), stringToBytes32(name)],
      ];
      const mockedDividendsDataMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getDividendsData).thenReturn(instance(mockedDividendsDataMethod));
      // Stub the request
      when(mockedDividendsDataMethod.callAsync()).thenResolve(expectedDividendsDataResult);

      const mockedParams = {
        investor: '0x6666666666666666666666666666666666666666',
        dividendIndex: 2,
      };
      const expectedResult = false;
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.isExcluded).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.callAsync(mockedParams.investor, objectContaining(new BigNumber(mockedParams.dividendIndex))),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.isExcluded(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);

      // Verifications
      verify(mockedContract.getDividendsData).once();
      verify(mockedDividendsDataMethod.callAsync()).once();
      verify(mockedContract.isExcluded).once();
      verify(
        mockedMethod.callAsync(mockedParams.investor, objectContaining(new BigNumber(mockedParams.dividendIndex))),
      ).once();
    });
  });
});

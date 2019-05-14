// DividendCheckpointWrapper test
import { mock, instance, reset, when, verify, objectContaining } from 'ts-mockito';
import { BigNumber } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ERC20DividendCheckpointContract, SecurityTokenContract } from '@polymathnetwork/abi-wrappers';
import { getMockedPolyResponse, MockedCallMethod, MockedSendMethod } from '../../../../test_utils/mocked_methods';
import ContractWrapper from '../../../contract_wrapper';
import ERC20DividendCheckpointWrapper from '../erc20_dividend_checkpoint_wrapper';
import ContractFactory from '../../../../factories/contractFactory';
import { bytes32ToString, dateToBigNumber, numberToBigNumber, stringToBytes32 } from '../../../../utils/convert';

describe('DividendCheckpointWrapper', () => {
  // ERC20 Dividend Wrapper is used as contract target here as DividendCheckpoint is abstract
  let target: ERC20DividendCheckpointWrapper;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: ERC20DividendCheckpointContract;
  let mockedContractFactory: ContractFactory;
  let mockedSecurityTokenContract: SecurityTokenContract;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(ERC20DividendCheckpointContract);
    mockedContractFactory = mock(ContractFactory);
    mockedSecurityTokenContract = mock(SecurityTokenContract);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new ERC20DividendCheckpointWrapper(
      instance(mockedWrapper),
      myContractPromise,
      instance(mockedContractFactory),
    );
  });

  afterEach(() => {
    reset(mockedWrapper);
    reset(mockedContract);
    reset(mockedSecurityTokenContract);
  });

  describe('Types', () => {
    test('should extend ContractWrapper', async () => {
      expect(target instanceof ContractWrapper).toBe(true);
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
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedPauseMethod.callAsync()).once();
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
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedPauseMethod.callAsync()).once();
    });
  });

  describe('Dividends', () => {
    test('should get dividend info', async () => {
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
      expect(result.amount).toBe(expectedResult[4]);
      expect(result.claimedAmount).toBe(expectedResult[5]);
      expect(result.totalSupply).toBe(expectedResult[6]);
      expect(result.reclaimed).toBe(expectedResult[7]);
      expect(result.totalWithheld).toBe(expectedResult[8]);
      expect(result.totalWithheldWithdrawn).toBe(expectedResult[9]);
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
    });
  });

  describe('Set WithholdingFixed', () => {
    test('should setWithholdingFixed', async () => {
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
          objectContaining(mockedParams.withholding),
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
          objectContaining(mockedParams.withholding),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
    });
  });

  describe('Set Withholding', () => {
    test('should setWithholding', async () => {
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
          objectContaining(mockedParams.withholding),
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
          objectContaining(mockedParams.withholding),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
    });
  });

  describe('Push Dividend Payment to Addresses', () => {
    test('should pushDividendPaymentToAddresses', async () => {
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
    });
  });

  describe('Push Dividend Payment', () => {
    test('should pushDividendPayment', async () => {
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
    });
  });

  describe('getDividendsData', () => {
    test('should getDividendsData', async () => {
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
      expect(result[0].amount).toBe(expectedResult[3][0]);
      expect(result[0].claimedAmount).toBe(expectedResult[4][0]);
      expect(result[0].name).toEqual(bytes32ToString(stringToBytes32(name)));

      // Verifications
      verify(mockedContract.getDividendsData).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('getDividendData', () => {
    test('should getDividendData', async () => {
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
      expect(result.amount).toBe(expectedResult[3]);
      expect(result.claimedAmount).toBe(expectedResult[4]);
      expect(result.name).toEqual(bytes32ToString(stringToBytes32(name)));

      // Verifications
      verify(mockedContract.getDividendData).once();
      verify(mockedMethod.callAsync(objectContaining(new BigNumber(dividendIndex)))).once();
    });
  });
});
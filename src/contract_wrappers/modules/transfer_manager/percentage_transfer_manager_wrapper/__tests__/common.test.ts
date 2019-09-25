// PercentageTransferManager test
import { mock, instance, reset, when, verify, objectContaining } from 'ts-mockito';
import {
  PercentageTransferManagerContract_3_0_0,
  ISecurityTokenContract_3_0_0,
  BigNumber,
  Web3Wrapper,
} from '@polymathnetwork/abi-wrappers';
import ContractFactory from '../../../../../factories/contractFactory';
import { ModuleCommon } from '../../../module_wrapper';
import { getMockedPolyResponse, MockedCallMethod, MockedSendMethod } from '../../../../../test_utils/mocked_methods';
import { valueToWei, weiToValue } from '../../../../../utils/convert';
import { PERCENTAGE_DECIMALS, ContractVersion, Subscribe, GetLogs } from '../../../../../types';
import PercentageTransferManagerCommon from '../common';

describe('PercentageTransferManagerWrapper', () => {
  // we extend the class to be able to instance it, using the 3.0.0 PercentageTransferManager contract since it has all common functionality
  class FakePercentageTransferManager extends PercentageTransferManagerCommon {
    public contract: Promise<PercentageTransferManagerContract_3_0_0>;

    public contractVersion!: ContractVersion;

    public subscribeAsync!: Subscribe

    public getLogsAsync!: GetLogs;

    public constructor(web3Wrapper: Web3Wrapper, contract: Promise<PercentageTransferManagerContract_3_0_0>, contractFactory: ContractFactory) {
      super(web3Wrapper, contract, contractFactory);
      this.contract = contract;
    }
  }

  let target: FakePercentageTransferManager;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: PercentageTransferManagerContract_3_0_0;
  let mockedContractFactory: ContractFactory;
  let mockedSecurityTokenContract: ISecurityTokenContract_3_0_0;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(PercentageTransferManagerContract_3_0_0);
    mockedContractFactory = mock(ContractFactory);
    mockedSecurityTokenContract = mock(ISecurityTokenContract_3_0_0);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new FakePercentageTransferManager(
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
      expect(target instanceof ModuleCommon).toBe(true);
    });
  });

  describe('allowPrimaryIssuance', () => {
    test('should get allowPrimaryIssuance', async () => {
      // Address expected
      const expectedResult = true;
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.allowPrimaryIssuance).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.allowPrimaryIssuance();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.allowPrimaryIssuance).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('maxHolderPercentage', () => {
    test('should get maxHolderPercentage', async () => {
      // Address expected
      const expectedResult = new BigNumber(1);
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.maxHolderPercentage).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.maxHolderPercentage();
      // Result expectation
      expect(result).toEqual(weiToValue(expectedResult, PERCENTAGE_DECIMALS));
      // Verifications
      verify(mockedContract.maxHolderPercentage).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('whitelist', () => {
    test('should get whitelist', async () => {
      const mockedParams = {
        investorAddress: '0x3333333333333333333333333333333333333333',
      };
      // Address expected
      const expectedResult = true;
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.whitelist).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(mockedParams.investorAddress)).thenResolve(expectedResult);

      // Real call
      const result = await target.whitelist(mockedParams);
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.whitelist).once();
      verify(mockedMethod.callAsync(mockedParams.investorAddress)).once();
    });
  });

  describe('verifyTransfer', () => {
    test('should verify Transfer', async () => {
      const statusCode = new BigNumber(2);
      const expectedResult = [statusCode, '0x1111111111111111111111111111111111111111'];
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
      };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.verifyTransfer).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.callAsync(
          mockedParams.from,
          mockedParams.to,
          objectContaining(valueToWei(mockedParams.amount, expectedDecimalsResult)),
          mockedParams.data,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.verifyTransfer(mockedParams);

      // Result expectation
      expect(result.transferResult).toBe(statusCode.toNumber());
      expect(result.address).toBe(expectedResult[1]);
      // Verifications
      verify(mockedContract.verifyTransfer).once();
      verify(
        mockedMethod.callAsync(
          mockedParams.from,
          mockedParams.to,
          objectContaining(valueToWei(mockedParams.amount, expectedDecimalsResult)),
          mockedParams.data,
        ),
      ).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.decimals).once();
    });
  });

  describe('changeHolderPercentage', () => {
    test('should get changeHolderPercentage', async () => {
      // Owner Address expected
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      const expectedPercentageDecimals = new BigNumber(16);
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
        maxHolderPercentage: new BigNumber(1),
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.changeHolderPercentage).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          objectContaining(valueToWei(mockedParams.maxHolderPercentage, expectedPercentageDecimals)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.changeHolderPercentage(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.changeHolderPercentage).once();
      verify(
        mockedMethod.sendTransactionAsync(
          objectContaining(valueToWei(mockedParams.maxHolderPercentage, expectedPercentageDecimals)),
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

  describe('modifyWhitelist', () => {
    test('should modifyWhitelist', async () => {
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
        investor: '0x5555555555555555555555555555555555555555',
        valid: false,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.modifyWhitelist).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.investor,
          mockedParams.valid,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.modifyWhitelist(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.modifyWhitelist).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.investor,
          mockedParams.valid,
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

  describe('modifyWhitelistMulti', () => {
    test('should modifyWhitelistMulti', async () => {
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
        investors: ['0x4444444444444444444444444444444444444444', '0x5555555555555555555555555555555555555555'],
        valids: [false, true],
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.modifyWhitelistMulti).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.investors,
          mockedParams.valids,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.modifyWhitelistMulti(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.modifyWhitelistMulti).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.investors,
          mockedParams.valids,
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

  describe('setAllowPrimaryIssuance', () => {
    test('should setAllowPrimaryIssuance', async () => {
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

      const expectedIssuanceResult = false;
      const mockedIssuanceMethod = mock(MockedCallMethod);
      when(mockedContract.allowPrimaryIssuance).thenReturn(instance(mockedIssuanceMethod));
      when(mockedIssuanceMethod.callAsync()).thenResolve(expectedIssuanceResult);

      const mockedParams = {
        allowPrimaryIssuance: true,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.setAllowPrimaryIssuance).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.allowPrimaryIssuance,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.setAllowPrimaryIssuance(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.setAllowPrimaryIssuance).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.allowPrimaryIssuance,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContract.allowPrimaryIssuance).once();
      verify(mockedIssuanceMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });
});

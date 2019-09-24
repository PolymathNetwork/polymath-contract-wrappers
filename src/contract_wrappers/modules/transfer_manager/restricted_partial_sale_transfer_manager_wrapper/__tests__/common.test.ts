// RestrictedPartialSaleTransferManagerWrapper test
import { mock, instance, reset, when, verify, objectContaining } from 'ts-mockito';
import {
  RestrictedPartialSaleTMContract_3_1_0,
  ISecurityTokenContract_3_0_0,
  BigNumber,
  Web3Wrapper,
} from '@polymathnetwork/abi-wrappers';
import { MockedCallMethod, MockedSendMethod, getMockedPolyResponse } from '../../../../../test_utils/mocked_methods';
import ModuleWrapper from '../../../module_wrapper';
import ContractFactory from '../../../../../factories/contractFactory';
import { parsePermBytes32Value, stringArrayToBytes32Array, valueToWei } from '../../../../../utils/convert';
import { Perm } from '../../../../../types';
import { RestrictedPartialSaleTransferManager_3_1_0 } from '../3.1.0';

describe('RestrictedPartialSaleTransferManagerWrapper', () => {
  let target: RestrictedPartialSaleTransferManager_3_1_0;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: RestrictedPartialSaleTMContract_3_1_0;
  let mockedContractFactory: ContractFactory;
  let mockedSecurityTokenContract: ISecurityTokenContract_3_0_0;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(RestrictedPartialSaleTMContract_3_1_0);
    mockedContractFactory = mock(ContractFactory);
    mockedSecurityTokenContract = mock(ISecurityTokenContract_3_0_0);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new RestrictedPartialSaleTransferManager_3_1_0(
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

  describe('changeExemptWalletList', () => {
    test('should changeExemptWalletList', async () => {
      const mockedParams = {
        wallet: '0x7777777777777777777777777777777777777777',
        exempted: true,
        txData: {},
        safetyFactor: 10,
      };

      const expectedExemptResult = [
        '0x2222222222222222222222222222222222222222',
        '0x2222222222222222222222222222222222222222',
      ];
      const mockedExemptMethod = mock(MockedCallMethod);
      when(mockedContract.getExemptAddresses).thenReturn(instance(mockedExemptMethod));
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
          mockedParams.exempted,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.changeExemptWalletList(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getExemptAddresses).once();
      verify(mockedExemptMethod.callAsync()).once();
      verify(mockedContract.changeExemptWalletList).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.wallet,
          mockedParams.exempted,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
    });
  });

  describe('changeExemptWalletListMulti', () => {
    test('should changeExemptWalletListMulti', async () => {
      const mockedParams = {
        wallets: ['0x7777777777777777777777777777777777777777', '0x2222222222222222222222222222222222222222'],
        exempted: [true, false],
        txData: {},
        safetyFactor: 10,
      };

      const expectedExemptResult = [
        '0x2222222222222222222222222222222222222222',
        '0x3333333333333333333333333333333333333333',
      ];
      const mockedExemptMethod = mock(MockedCallMethod);

      when(mockedContract.getExemptAddresses).thenReturn(instance(mockedExemptMethod));
      when(mockedExemptMethod.callAsync()).thenResolve(expectedExemptResult);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.changeExemptWalletListMulti).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.wallets,
          mockedParams.exempted,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.changeExemptWalletListMulti(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getExemptAddresses).once();
      verify(mockedExemptMethod.callAsync()).once();
      verify(mockedContract.changeExemptWalletListMulti).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.wallets,
          mockedParams.exempted,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
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

  describe('getPermissions', () => {
    test('should call to getPermissions', async () => {
      const expectedResult = stringArrayToBytes32Array([Perm.Admin]);

      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getPermissions).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getPermissions();
      // Result expectation
      expect(result).toEqual(expectedResult.map(parsePermBytes32Value));
      // Verifications
      verify(mockedContract.getPermissions).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('Get Exempt Addresses', () => {
    test('should getExemptAddresses', async () => {
      // Address expected
      const expectedResult = [
        '0x2222222222222222222222222222222222222222',
        '0x3333333333333333333333333333333333333333',
      ];
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getExemptAddresses).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getExemptAddresses();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getExemptAddresses).once();
      verify(mockedMethod.callAsync()).once();
    });
  });
});

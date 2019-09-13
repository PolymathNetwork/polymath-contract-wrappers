// VestingEscrowWallet test
import { mock, instance, reset, when, verify, objectContaining } from 'ts-mockito';
import {
  VestingEscrowWalletContract_3_0_0,
  ISecurityTokenContract_3_0_0,
  Web3Wrapper,
} from '@polymathnetwork/abi-wrappers';
import { getMockedPolyResponse, MockedCallMethod, MockedSendMethod } from '../../../../../test_utils/mocked_methods';
import { VestingEscrowWallet_3_0_0 } from '../3.0.0';
import { stringToBytes32, dateToBigNumber } from '../../../../../utils/convert';
import ContractFactory from '../../../../../factories/contractFactory';

describe('VestingEscrowWalletWrapper', () => {
  let target: VestingEscrowWallet_3_0_0;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: VestingEscrowWalletContract_3_0_0;
  let mockedContractFactory: ContractFactory;
  let mockedSecurityTokenContract: ISecurityTokenContract_3_0_0;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(VestingEscrowWalletContract_3_0_0);
    mockedContractFactory = mock(ContractFactory);
    mockedSecurityTokenContract = mock(ISecurityTokenContract_3_0_0);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new VestingEscrowWallet_3_0_0(instance(mockedWrapper), myContractPromise, instance(mockedContractFactory));
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
});

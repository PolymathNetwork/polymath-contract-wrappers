// GeneralTransferManager test
import { mock, instance, reset, when, verify, objectContaining } from 'ts-mockito';
import { BigNumber } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { GeneralTransferManagerContract, ISecurityTokenContract, PolyTokenEvents } from '@polymathnetwork/abi-wrappers';
import { getMockedPolyResponse, MockedCallMethod, MockedSendMethod } from '../../../../test_utils/mocked_methods';
import GeneralTransferManagerWrapper from '../general_transfer_manager_wrapper';
import ContractFactory from '../../../../factories/contractFactory';
import ModuleWrapper from '../../module_wrapper';
import {
  bigNumberToDate,
  dateToBigNumber,
  numberToBigNumber,
  valueToWei,
  stringToBytes32,
} from '../../../../utils/convert';
import { FlagsType, TransferType, Perm, Partition } from '../../../../types';

describe('GeneralTransferManagerWrapper', () => {
  let target: GeneralTransferManagerWrapper;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: GeneralTransferManagerContract;
  let mockedContractFactory: ContractFactory;
  let mockedSecurityTokenContract: ISecurityTokenContract;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(GeneralTransferManagerContract);
    mockedContractFactory = mock(ContractFactory);
    mockedSecurityTokenContract = mock(ISecurityTokenContract);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new GeneralTransferManagerWrapper(
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

  describe('Nonce Map', () => {
    test('should get nonceMap', async () => {
      // Address expected
      const expectedResult = true;
      const mockedParams = {
        address: '0x3333333333333333333333333333333333333333',
        nonce: 3,
      };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.nonceMap).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.callAsync(mockedParams.address, objectContaining(numberToBigNumber(mockedParams.nonce))),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.nonceMap(mockedParams);
      // Result expectation
      expect(result).toBe(expectedResult);

      // Verifications
      verify(mockedContract.nonceMap).once();
      verify(
        mockedMethod.callAsync(mockedParams.address, objectContaining(numberToBigNumber(mockedParams.nonce))),
      ).once();
    });
  });

  describe('IssuanceAddress', () => {
    test('should get issuanceAddress', async () => {
      // Address expected
      const expectedResult = '0x1111111111111111111111111111111111111111';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.issuanceAddress).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.issuanceAddress();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.issuanceAddress).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('Defaults', () => {
    test('should get defaults', async () => {
      // Address expected
      const expectedResult = [new BigNumber(100), new BigNumber(101)];
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.defaults).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.defaults();
      // Result expectation
      expect(result.canSendAfter).toEqual(bigNumberToDate(expectedResult[0]));
      expect(result.canReceiveAfter).toEqual(bigNumberToDate(expectedResult[1]));
      // Verifications
      verify(mockedContract.defaults).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('Change Defaults', () => {
    test('should change defaults', async () => {
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
        defaultFromTime: new Date(2030, 1),
        defaultToTime: new Date(2031, 1),
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.changeDefaults).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          objectContaining(dateToBigNumber(mockedParams.defaultFromTime)),
          objectContaining(dateToBigNumber(mockedParams.defaultToTime)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.changeDefaults(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.changeDefaults).once();
      verify(
        mockedMethod.sendTransactionAsync(
          objectContaining(dateToBigNumber(mockedParams.defaultFromTime)),
          objectContaining(dateToBigNumber(mockedParams.defaultToTime)),
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

  describe('Change Issuance Address', () => {
    test('should change issuance address', async () => {
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
        issuanceAddress: '0x7777777777777777777777777777777777777777',
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.changeIssuanceAddress).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(mockedParams.issuanceAddress, mockedParams.txData, mockedParams.safetyFactor),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.changeIssuanceAddress(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.changeIssuanceAddress).once();
      verify(
        mockedMethod.sendTransactionAsync(mockedParams.issuanceAddress, mockedParams.txData, mockedParams.safetyFactor),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('Modify KYC', () => {
    test('should modifyKYCData', async () => {
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
        canSendAfter: new Date(2030, 1),
        canReceiveAfter: new Date(2031, 1),
        expiryTime: new Date(2032, 1),
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.modifyKYCData).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.investor,
          objectContaining(dateToBigNumber(mockedParams.canSendAfter)),
          objectContaining(dateToBigNumber(mockedParams.canReceiveAfter)),
          objectContaining(dateToBigNumber(mockedParams.expiryTime)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.modifyKYCData(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.modifyKYCData).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.investor,
          objectContaining(dateToBigNumber(mockedParams.canSendAfter)),
          objectContaining(dateToBigNumber(mockedParams.canReceiveAfter)),
          objectContaining(dateToBigNumber(mockedParams.expiryTime)),
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

  describe('Get KYC', () => {
    test('should getKYCData', async () => {
      const mockedParams = {
        investors: [
          '0x3333333333333333333333333333333333333333',
          '0x4444444444444444444444444444444444444444',
          '0x5555555555555555555555555555555555555555',
        ],
      };
      // Address expected
      const expectedResult = [
        [new BigNumber(100), new BigNumber(101), new BigNumber(102)],
        [new BigNumber(103), new BigNumber(104), new BigNumber(105)],
        [new BigNumber(106), new BigNumber(107), new BigNumber(108)],
      ];
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getKYCData).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(mockedParams.investors)).thenResolve(expectedResult);

      // Real call
      const result = await target.getKYCData(mockedParams);

      // Result expectation
      for (let i = 0; i < 3; i += 1) {
        expect(dateToBigNumber(result[i].canSendAfter)).toEqual(expectedResult[0][i]);
        expect(dateToBigNumber(result[i].canReceiveAfter)).toEqual(expectedResult[1][i]);
        expect(dateToBigNumber(result[i].expiryTime)).toEqual(expectedResult[2][i]);
      }

      // Verifications
      verify(mockedContract.getKYCData).once();
      verify(mockedMethod.callAsync(mockedParams.investors)).once();
    });
  });

  describe('Get All KYC Data', () => {
    test('should get all kyc data', async () => {
      // Address expected
      const expectedResult = [
        [
          '0x3333333333333333333333333333333333333333',
          '0x5555555555555555555555555555555555555555',
          '0x6666666666666666666666666666666666666666',
        ],
        [new BigNumber(100), new BigNumber(101), new BigNumber(102)],
        [new BigNumber(103), new BigNumber(104), new BigNumber(105)],
        [new BigNumber(106), new BigNumber(107), new BigNumber(108)],
      ];
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getAllKYCData).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getAllKYCData();

      for (let i = 0; i < 3; i += 1) {
        expect(result[i].investor).toEqual(expectedResult[0][i]);
        expect(dateToBigNumber(result[i].canSendAfter)).toEqual(expectedResult[1][i]);
        expect(dateToBigNumber(result[i].canReceiveAfter)).toEqual(expectedResult[2][i]);
        expect(dateToBigNumber(result[i].expiryTime)).toEqual(expectedResult[3][i]);
      }

      // Verifications
      verify(mockedContract.getAllKYCData).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('GetInvestorFlag', () => {
    test('should getInvestorFlag', async () => {
      const mockedParams = {
        investor: '0x3333333333333333333333333333333333333333',
        flag: FlagsType.IsAccredited,
      };
      // Address expected
      const expectedResult = true;
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getInvestorFlag).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(mockedParams.investor, mockedParams.flag)).thenResolve(expectedResult);

      // Real call
      const result = await target.getInvestorFlag(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);

      // Verifications
      verify(mockedContract.getInvestorFlag).once();
      verify(mockedMethod.callAsync(mockedParams.investor, mockedParams.flag)).once();
    });
  });

  describe('GetAllInvestorFlags', () => {
    test('should getAllInvestorFlags', async () => {
      // Address expected
      const expectedResult = [['0x3333333333333333333333333333333333333333', '0x4444444444444444444444444444444444444444'], [new BigNumber(2), new BigNumber(2)]];
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getAllInvestorFlags).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getAllInvestorFlags();

      // Result expectation
      for (let i = 0; i < expectedResult[0].length; i += 1) {
        expect(result[i]).toEqual({
          canNotBuyFromSTO: true,
          investor: expectedResult[0][i],
          isAccredited: false,
          isVolRestricted: false,
        });
      }

      // Verifications
      verify(mockedContract.getAllInvestorFlags).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('GetInvestorFlags', () => {
    test('should getInvestorFlags', async () => {
      const mockedParams = {
        investor: '0x3333333333333333333333333333333333333333',
      };
      // Address expected
      const expectedResult = new BigNumber(2);
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getInvestorFlags).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(mockedParams.investor)).thenResolve(expectedResult);

      // Real call
      const result = await target.getInvestorFlags(mockedParams);

      // Result expectation
      expect(result).toEqual({
        canNotBuyFromSTO: true,
        investor: mockedParams.investor,
        isAccredited: false,
        isVolRestricted: false,
      });

      // Verifications
      verify(mockedContract.getInvestorFlags).once();
      verify(mockedMethod.callAsync(mockedParams.investor)).once();
    });
  });

  describe('ModifyKYCDataSigned', () => {
    test('should modifyKYCDataSigned', async () => {
      const mockedParams = {
        investor: '0x5555555555555555555555555555555555555555',
        canSendAfter: new Date(2030, 1),
        canReceiveAfter: new Date(2031, 1),
        expiryTime: new Date(2032, 1),
        validFrom: new Date(2019, 1),
        validTo: new Date(2031, 1),
        nonce: 1,
        signature: '0x5555555555555555555555555555555555555555',
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

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // nonceMap
      const expectedNonceResult = false;
      const mockedNonceMethod = mock(MockedCallMethod);
      when(mockedContract.nonceMap).thenReturn(instance(mockedNonceMethod));
      when(
        mockedNonceMethod.callAsync(mockedParams.investor, objectContaining(numberToBigNumber(mockedParams.nonce))),
      ).thenResolve(expectedNonceResult);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.modifyKYCDataSigned).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.investor,
          objectContaining(dateToBigNumber(mockedParams.canSendAfter)),
          objectContaining(dateToBigNumber(mockedParams.canReceiveAfter)),
          objectContaining(dateToBigNumber(mockedParams.expiryTime)),
          objectContaining(dateToBigNumber(mockedParams.validFrom)),
          objectContaining(dateToBigNumber(mockedParams.validTo)),
          objectContaining(numberToBigNumber(mockedParams.nonce)),
          mockedParams.signature,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.modifyKYCDataSigned(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.nonceMap).once();
      verify(
        mockedNonceMethod.callAsync(mockedParams.investor, objectContaining(numberToBigNumber(mockedParams.nonce))),
      ).once();
      verify(mockedContract.modifyKYCDataSigned).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.investor,
          objectContaining(dateToBigNumber(mockedParams.canSendAfter)),
          objectContaining(dateToBigNumber(mockedParams.canReceiveAfter)),
          objectContaining(dateToBigNumber(mockedParams.expiryTime)),
          objectContaining(dateToBigNumber(mockedParams.validFrom)),
          objectContaining(dateToBigNumber(mockedParams.validTo)),
          objectContaining(numberToBigNumber(mockedParams.nonce)),
          mockedParams.signature,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('ModifyInvestorFlag', () => {
    test('should modifyInvestorFlag', async () => {
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
        flag: FlagsType.IsVolRestricted,
        value: true,
        txData: {},
        safetyFactor: 0,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.modifyInvestorFlag).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.investor,
          mockedParams.flag,
          mockedParams.value,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.modifyInvestorFlag(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.modifyInvestorFlag).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.investor,
          mockedParams.flag,
          mockedParams.value,
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

  describe('ModifyInvestorFlagMulti', () => {
    test('should modifyInvestorFlagMulti', async () => {
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
        flag: [FlagsType.IsVolRestricted, FlagsType.IsVolRestricted],
        value: [true, true],
        txData: {},
        safetyFactor: 0,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.modifyInvestorFlagMulti).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.investors,
          mockedParams.flag,
          mockedParams.value,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.modifyInvestorFlagMulti(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.modifyInvestorFlagMulti).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.investors,
          mockedParams.flag,
          mockedParams.value,
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

  describe('ExecuteTransfer', () => {
    test('should executeTransfer', async () => {
      const value = new BigNumber(100);
      const mockedParams = {
        from: '0x4444444444444444444444444444444444444444',
        to: '0x5555555555555555555555555555555555555555',
        data: '0x5',
        txData: {},
        safetyFactor: 10,
      };

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.executeTransfer).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.from,
          mockedParams.to,
          objectContaining(value),
          mockedParams.data,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.executeTransfer(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.executeTransfer).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.from,
          mockedParams.to,
          objectContaining(value),
          mockedParams.data,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
    });
  });

  describe('VerifyTransfer', () => {
    test('should verifyTransfer', async () => {
      const value = new BigNumber(100);
      const mockedParams = {
        from: '0x4444444444444444444444444444444444444444',
        to: '0x5555555555555555555555555555555555555555',
        data: '0x5',
      };

      // Address expected
      const expectedResult = [new BigNumber(2), '0x4444444444444444444444444444444444444444'];
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.verifyTransfer).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.callAsync(mockedParams.from, mockedParams.to, objectContaining(value), mockedParams.data),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.verifyTransfer(mockedParams);

      // Result expectation
      expect(result).toEqual(expectedResult);

      // Verifications
      verify(mockedContract.verifyTransfer).once();
      verify(
        mockedMethod.callAsync(mockedParams.from, mockedParams.to, objectContaining(value), mockedParams.data),
      ).once();
    });
  });

  describe('ModifyTransferRequirements', () => {
    test('should modifyTransferRequirements', async () => {
      const mockedParams = {
        transferType: TransferType.General,
        fromValidKYC: false,
        toValidKYC: false,
        fromRestricted: false,
        toRestricted: false,
        txData: {},
        safetyFactor: 10,
      };

      // Address expected
      const expectedResult = undefined;
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.modifyTransferRequirements).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.transferType,
          mockedParams.fromValidKYC,
          mockedParams.toValidKYC,
          mockedParams.fromRestricted,
          mockedParams.toRestricted,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.modifyTransferRequirements(mockedParams);

      // Result expectation
      expect(result).toEqual(expectedResult);

      // Verifications
      verify(mockedContract.modifyTransferRequirements).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.transferType,
          mockedParams.fromValidKYC,
          mockedParams.toValidKYC,
          mockedParams.fromRestricted,
          mockedParams.toRestricted,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
    });
  });

  describe('ModifyTransferRequirementsMulti', () => {
    test('should modifyTransferRequirementsMulti', async () => {
      const mockedParams = {
        transferTypes: [TransferType.General, TransferType.Issuance],
        fromValidKYC: [false, true],
        toValidKYC: [false, true],
        fromRestricted: [false, true],
        toRestricted: [false, true],
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

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // Address expected
      const expectedResult = undefined;
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.modifyTransferRequirementsMulti).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.transferTypes,
          mockedParams.fromValidKYC,
          mockedParams.toValidKYC,
          mockedParams.fromRestricted,
          mockedParams.toRestricted,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.modifyTransferRequirementsMulti(mockedParams);

      // Result expectation
      expect(result).toEqual(expectedResult);

      // Verifications
      verify(mockedContract.modifyTransferRequirementsMulti).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.transferTypes,
          mockedParams.fromValidKYC,
          mockedParams.toValidKYC,
          mockedParams.fromRestricted,
          mockedParams.toRestricted,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('ModifyKYCDataMulti', () => {
    test('should modifyKYCDataMulti', async () => {
      const mockedParams = {
        investors: ['0x1111111111111111111111111111111111111111', '0x2222222222222222222222222222222222222222'],
        canSendAfter: [new Date(2019, 6), new Date(2019, 7)],
        canReceiveAfter: [new Date(2020, 6), new Date(2020, 7)],
        expiryTime: [new Date(2021, 6), new Date(2021, 7)],
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

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // Address expected
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.modifyKYCDataMulti).thenReturn(instance(mockedMethod));
      // Stub the request

      const canSendAfter = mockedParams.canSendAfter.map(dateToBigNumber);
      const canReceiveAfter = mockedParams.canReceiveAfter.map(dateToBigNumber);
      const expiryTime = mockedParams.expiryTime.map(dateToBigNumber);

      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.investors,
          objectContaining(canSendAfter),
          objectContaining(canReceiveAfter),
          objectContaining(expiryTime),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.modifyKYCDataMulti(mockedParams);

      // Result expectation
      expect(result).toEqual(expectedResult);

      // Verifications
      verify(mockedContract.modifyKYCDataMulti).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.investors,
          objectContaining(canSendAfter),
          objectContaining(canReceiveAfter),
          objectContaining(expiryTime),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('ModifyKYCDataSignedMulti', () => {
    test('should modifyKYCDataSignedMulti', async () => {
      const mockedParams = {
        investor: ['0x1111111111111111111111111111111111111111', '0x2222222222222222222222222222222222222222'],
        canSendAfter: [new Date(2019, 6), new Date(2019, 7)],
        canReceiveAfter: [new Date(2020, 6), new Date(2020, 7)],
        expiryTime: [new Date(2021, 6), new Date(2021, 7)],
        validFrom: new Date(2019, 6),
        validTo: new Date(2021, 7),
        nonce: 100,
        signature: '0x12',
        txData: {},
        safetyFactor: 10,
      };

      // Address expected
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.modifyKYCDataSignedMulti).thenReturn(instance(mockedMethod));
      // Stub the request

      const canSendAfter = mockedParams.canSendAfter.map(dateToBigNumber);
      const canReceiveAfter = mockedParams.canReceiveAfter.map(dateToBigNumber);
      const expiryTime = mockedParams.expiryTime.map(dateToBigNumber);

      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.investor,
          objectContaining(canSendAfter),
          objectContaining(canReceiveAfter),
          objectContaining(expiryTime),
          objectContaining(dateToBigNumber(mockedParams.validFrom)),
          objectContaining(dateToBigNumber(mockedParams.validTo)),
          objectContaining(new BigNumber(mockedParams.nonce)),
          mockedParams.signature,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.modifyKYCDataSignedMulti(mockedParams);

      // Result expectation
      expect(result).toEqual(expectedResult);

      // Verifications
      verify(mockedContract.modifyKYCDataSignedMulti).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.investor,
          objectContaining(canSendAfter),
          objectContaining(canReceiveAfter),
          objectContaining(expiryTime),
          objectContaining(dateToBigNumber(mockedParams.validFrom)),
          objectContaining(dateToBigNumber(mockedParams.validTo)),
          objectContaining(new BigNumber(mockedParams.nonce)),
          mockedParams.signature,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
    });
  });

  describe('GetAllInvestors', () => {
    test('should getAllInvestors', async () => {
      // Address expected
      const expectedResult = [
        '0x1111111111111111111111111111111111111111',
        '0x2222222222222222222222222222222222222222',
      ];
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getAllInvestors).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getAllInvestors();

      // Result expectation
      expect(result).toBe(expectedResult);

      // Verifications
      verify(mockedContract.getAllInvestors).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('GetInvestors', () => {
    test('should getInvestors', async () => {
      const mockedParams = {
        fromIndex: 2,
        toIndex: 4,
      };
      // Address expected
      const expectedResult = [
        '0x1111111111111111111111111111111111111111',
        '0x2222222222222222222222222222222222222222',
      ];
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getInvestors).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.callAsync(
          objectContaining(new BigNumber(mockedParams.fromIndex)),
          objectContaining(new BigNumber(mockedParams.toIndex)),
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.getInvestors(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);

      // Verifications
      verify(mockedContract.getInvestors).once();
      verify(
        mockedMethod.callAsync(
          objectContaining(new BigNumber(mockedParams.fromIndex)),
          objectContaining(new BigNumber(mockedParams.toIndex)),
        ),
      ).once();
    });
  });

  describe('GetPermissions', () => {
    test('should getPermissions', async () => {
      // Address expected
      const expectedResult = [stringToBytes32(Perm.Admin)];
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getPermissions).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getPermissions();

      // Result expectation
      expect(stringToBytes32(result[0])).toBe(expectedResult[0]);

      // Verifications
      verify(mockedContract.getPermissions).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('GetAddressBytes32', () => {
    test('should getAddressBytes32', async () => {
      // Address expected
      const expectedResult = stringToBytes32('0x123');
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getAddressBytes32).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getAddressBytes32();

      // Result expectation
      expect(stringToBytes32(result)).toBe(expectedResult);

      // Verifications
      verify(mockedContract.getAddressBytes32).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('GetTokensByPartition', () => {
    test('should getTokensByPartition', async () => {
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

      const mockedParams = {
        partition: Partition.Unlocked,
        tokenHolder: "0x2222222222222222222222222222222222222222",
        additionalBalance: new BigNumber(100)
      };
      // Address expected
      const expectedResult = new BigNumber(200);
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getTokensByPartition).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(stringToBytes32(mockedParams.partition), mockedParams.tokenHolder, objectContaining(valueToWei(mockedParams.additionalBalance, expectedDecimalsResult)))).thenResolve(expectedResult);

      // Real call
      const result = await target.getTokensByPartition(mockedParams);

      // Result expectation
      expect(valueToWei(result, expectedDecimalsResult)).toEqual(expectedResult);

      // Verifications
      verify(mockedContract.getTokensByPartition).once();
      verify(mockedMethod.callAsync(stringToBytes32(mockedParams.partition), mockedParams.tokenHolder, objectContaining(valueToWei(mockedParams.additionalBalance, expectedDecimalsResult)))).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.decimals).once();
    });
  });

  describe('SubscribeAsync', () => {
    test('should throw as eventName does not belong to GeneralTransferManager', async () => {
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
          `Expected eventName to be one of: 'ChangeIssuanceAddress', 'ChangeDefaults', 'ModifyKYCData', 'ModifyInvestorFlag', 'ModifyTransferRequirements', 'Pause', 'Unpause', encountered: Transfer`,
        ),
      );
    });
  });
});

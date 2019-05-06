// STOWrapper test
import { mock, instance, reset, when, verify } from 'ts-mockito';
import { BigNumber } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { CappedSTOContract, PolyTokenEvents } from '@polymathnetwork/abi-wrappers';
import { MockedCallMethod } from '../../../../test_utils/mocked_methods';
import ContractWrapper from '../../../contract_wrapper';
import CappedSTOWrapper from '../capped_sto_wrapper';
import ContractFactory from '../../../../factories/contractFactory';
import {FundRaiseType} from '../../../../types';

describe('STOWrapper', () => {
  // Capped STO Wrapper is used as contract target here as STOWrapper is abstract
  let target: CappedSTOWrapper;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: CappedSTOContract;
  let mockedContractFactory: ContractFactory;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(CappedSTOContract);
    mockedContractFactory = mock(ContractFactory);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new CappedSTOWrapper(instance(mockedWrapper), myContractPromise, instance(mockedContractFactory));
  });

  afterEach(() => {
    reset(mockedWrapper);
    reset(mockedContract);
  });

  describe('Types', () => {
    test('should extend ContractWrapper', async () => {
      expect(target instanceof ContractWrapper).toBe(true);
    });
  });

  describe('FundRaiseTypes', () => {
    test('should get the boolean for fundRaiseTypes', async () => {
      // Address expected
      const expectedResult = true;
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.fundRaiseTypes).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(FundRaiseType.StableCoin)).thenResolve(expectedResult);

      // Real call
      const result = await target.fundRaiseTypes({type: FundRaiseType.StableCoin});
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.fundRaiseTypes).once();
      verify(mockedMethod.callAsync(FundRaiseType.StableCoin)).once();
    });
  });

  describe('SubscribeAsync', () => {
    test('should throw as eventName does not belong to FeatureRegistryEvents', async () => {
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
          `Expected eventName to be one of: 'TokenPurchase', 'SetAllowBeneficialInvestments', 'SetFundRaiseTypes', 'Pause', 'Unpause', encountered: Transfer`,
        ),
      );
    });
  });
});

// ModuleFactoryWrapper test
import { mock, instance, reset } from 'ts-mockito';
import {
  ModuleFactoryContract_3_0_0,
  Web3Wrapper,
  EtherDividendCheckpointEvents_3_0_0,
} from '@polymathnetwork/abi-wrappers';
import ContractFactory from '../../../../factories/contractFactory';
import { ModuleFactory_3_0_0 } from '../3.0.0';

describe('ModuleFactoryWrapper', () => {
  let target: ModuleFactory_3_0_0;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: ModuleFactoryContract_3_0_0;
  let mockedContractFactory: ContractFactory;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(ModuleFactoryContract_3_0_0);
    mockedContractFactory = mock(ContractFactory);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new ModuleFactory_3_0_0(instance(mockedWrapper), myContractPromise);
  });

  afterEach(() => {
    reset(mockedWrapper);
    reset(mockedContract);
    reset(mockedContractFactory);
  });

  describe('SubscribeAsync', () => {
    test('should throw as eventName does not belong to ModuleFactoryEvents', async () => {
      // Mocked parameters
      const mockedParams = {
        eventName: EtherDividendCheckpointEvents_3_0_0.EtherDividendDeposited,
        indexFilterValues: {},
        callback: () => {},
        isVerbose: false,
      };

      // Real call
      await expect(target.subscribeAsync(mockedParams)).rejects.toEqual(
        new Error(
          `Expected eventName to be one of: 'OwnershipTransferred', 'ChangeSetupCost', 'ChangeCostType', 'GenerateModuleFromFactory', 'ChangeSTVersionBound', encountered: EtherDividendDeposited`,
        ),
      );
    });
  });
});

// DividendCheckpoint 3.0.0 test
import { mock, instance, reset } from 'ts-mockito';
import { Web3Wrapper, EtherDividendCheckpointContract_3_0_0, BigNumber } from '@polymathnetwork/abi-wrappers';
import ContractFactory from '../../../../../factories/contractFactory';
import DividendCheckpointCommon from '../common';
import { WithDividendCheckpoint_3_0_0 } from '../3.0.0';
import { ContractVersion, Subscribe, GetLogs } from '../../../../../types';

describe('DividendCheckpoint 3.0.0', () => {
  // we extend the class to be able to instance it, using the 3.0.0 EtherDividendCheckpoint contract since it has all common functionality
  class FakeDividendCheckpoint extends DividendCheckpointCommon {
    public contract: Promise<EtherDividendCheckpointContract_3_0_0>;
    
    public contractVersion!: ContractVersion;

    public subscribeAsync!: Subscribe

    public getLogsAsync!: GetLogs;

    public getDecimals = async (): Promise<BigNumber> => {
      return new BigNumber(18);
    };

    public constructor(web3Wrapper: Web3Wrapper, contract: Promise<EtherDividendCheckpointContract_3_0_0>, contractFactory: ContractFactory) {
      super(web3Wrapper, contract, contractFactory);
      this.contract = contract;
    }
  }

  // we empty-extend the mixin to be able to use the class as a type
  class FakeDividendCheckpoint_3_0_0 extends WithDividendCheckpoint_3_0_0(FakeDividendCheckpoint) {}

  let target: FakeDividendCheckpoint_3_0_0;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: EtherDividendCheckpointContract_3_0_0;
  let mockedContractFactory: ContractFactory;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(EtherDividendCheckpointContract_3_0_0);
    mockedContractFactory = mock(ContractFactory);    

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new FakeDividendCheckpoint_3_0_0(instance(mockedWrapper), myContractPromise, instance(mockedContractFactory));
  });

  afterEach(() => {
    reset(mockedWrapper);
    reset(mockedContract);
    reset(mockedContractFactory);    
  });

  describe('Types', () => {
    test('should extend DividendCheckpointCommon', async () => {
      expect(target instanceof DividendCheckpointCommon).toBe(true);
    });
  });
});

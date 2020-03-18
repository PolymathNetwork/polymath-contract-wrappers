import { EtherDividendCheckpointContract_3_0_0, Web3Wrapper } from '@polymathnetwork/abi-wrappers';
import { WithDividendCheckpoint_3_0_0 } from '../dividend_checkpoint_wrapper';
import ContractFactory from '../../../../factories/contractFactory';
import { ContractVersion, Constructor } from '../../../../types';
import EtherDividendCheckpointCommon from './common';

const EtherDividendCheckpointBase_3_0_0 = WithDividendCheckpoint_3_0_0(
  (EtherDividendCheckpointCommon as unknown) as Constructor<EtherDividendCheckpointCommon>,
);

export class EtherDividendCheckpoint_3_0_0 extends EtherDividendCheckpointBase_3_0_0 {
  public contract: Promise<EtherDividendCheckpointContract_3_0_0>;

  public contractVersion = ContractVersion.V3_0_0;

  /**
   * Instantiate EtherDividendCheckpointWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   * @param contractFactory
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<EtherDividendCheckpointContract_3_0_0>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }
}

export function isEtherDividendCheckpoint_3_0_0(
  wrapper: EtherDividendCheckpointCommon,
): wrapper is EtherDividendCheckpoint_3_0_0 {
  return wrapper.contractVersion === ContractVersion.V3_0_0;
}

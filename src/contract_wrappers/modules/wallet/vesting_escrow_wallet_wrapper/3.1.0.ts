import { VestingEscrowWalletContract_3_1_0, Web3Wrapper, BigNumber, PolyResponse } from '@polymathnetwork/abi-wrappers';
import assert from '../../../../utils/assert';
import ContractFactory from '../../../../factories/contractFactory';
import { ErrorCode, ContractVersion, TxParams, Perm, Constructor } from '../../../../types';
import { weiToValue, stringToBytes32, dateToBigNumber } from '../../../../utils/convert';
import VestingEscrowWalletCommon from './common';
import { WithModule_3_0_0 } from '../../module_wrapper';

/**
 * @param beneficiary Address of the beneficiary for whom it is modified
 * @param templateName Name of the template was used for schedule creation
 * @param startTime Start time of the created vesting schedule
 */
interface ModifyScheduleParams extends TxParams {
  beneficiary: string;
  templateName: string;
  startTime: Date;
}

// RETURN TYPES

interface Template {
  numberOfTokens: BigNumber;
  duration: number;
  frequency: number;
  index: number;
}

// uses 3.0.0 Module contract
const VestingEscrowWalletBase_3_1_0 = WithModule_3_0_0((VestingEscrowWalletCommon as unknown) as Constructor<
  VestingEscrowWalletCommon
>);

/**
 * This class includes the functionality related to interacting with the Vesting Escrow Wallet contract.
 */
export class VestingEscrowWallet_3_1_0 extends VestingEscrowWalletBase_3_1_0 {
  public contract: Promise<VestingEscrowWalletContract_3_1_0>;

  public contractVersion = ContractVersion.V3_1_0;

  /**
   * Instantiate VestingEscrowWalletWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   * @param contractFactory
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<VestingEscrowWalletContract_3_1_0>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }

  /**
   * Modifies a vesting schedule for a beneficiary address
   */
  public modifySchedule = async (params: ModifyScheduleParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    this.checkSchedule(params.beneficiary);
    assert.assert(params.startTime.getTime() >= Date.now(), ErrorCode.TooEarly, 'Date in the past');
    return (await this.contract).modifySchedule.sendTransactionAsync(
      params.beneficiary,
      stringToBytes32(params.templateName),
      dateToBigNumber(params.startTime),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Returns a list of templates for a given template name
   * @param templateName Name of the template
   * @return List of templates
   */
  public templates = async (templateName: string): Promise<Template> => {
    const templates = await (await this.contract).templates.callAsync(stringToBytes32(templateName));
    const result: Template = {
      numberOfTokens: templates[0],
      duration: templates[1].toNumber(),
      frequency: templates[2].toNumber(),
      index: templates[3].toNumber(),
    };
    return result;
  };

  /**
   * Returns the schedule count per template
   * @param templateName Name of the template
   * @return count of schedules
   */
  public getSchedulesCountByTemplate = async (templateName: string): Promise<number> => {
    assert.assert(templateName !== '', ErrorCode.InvalidData, 'Invalid name');
    const schedulesCount = await (await this.contract).getSchedulesCountByTemplate.callAsync(
      stringToBytes32(templateName),
    );
    return schedulesCount.toNumber();
  };

  /**
   * Returns the list of all beneficiary
   * @return List of addresses
   */
  public getAllBeneficiaries = async (): Promise<string[]> => {
    const result = await (await this.contract).getAllBeneficiaries.callAsync();
    return result;
  };

  /**
   * Returns the tokens quantity that can be withdrawn from the contract at a moment
   * @param beneficiary Address of the beneficiary
   * @return availableTokens Tokens amount that are available to withdraw
   */
  public getAvailableTokens = async (beneficiary: string): Promise<BigNumber> => {
    assert.isNonZeroETHAddressHex('beneficiary', beneficiary);
    const result = await (await this.contract).getAvailableTokens.callAsync(beneficiary);
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    return weiToValue(result, decimals);
  };
}

export function isVestingEscrowWallet_3_1_0(wrapper: VestingEscrowWalletCommon): wrapper is VestingEscrowWallet_3_1_0 {
  return wrapper.contractVersion === ContractVersion.V3_1_0;
}

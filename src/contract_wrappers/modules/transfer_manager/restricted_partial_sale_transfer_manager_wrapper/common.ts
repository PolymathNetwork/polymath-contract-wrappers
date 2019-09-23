import {
  RestrictedPartialSaleTMContract_3_1_0,
  Web3Wrapper,
  BigNumber,
} from '@polymathnetwork/abi-wrappers';
import {
  parsePermBytes32Value,
  parseTransferResult,
  valueToWei,
} from '../../../../utils/convert';
import ContractFactory from '../../../../factories/contractFactory';
import {
  ErrorCode,
  Perm,
  TxParams,
} from '../../../../types';
import ModuleWrapper from '../../module_wrapper';
import assert from '../../../../utils/assert';

/**
 * @param wallet Ethereum wallet/contract address that need to be exempted
 * @param exempted Boolean value used to add (i.e true) or remove (i.e false) from the list
 */

export namespace RestrictedPartialSaleTransferManagerTransactionParams {
  export interface ChangeExemptWalletList extends ChangeExemptWalletListParams {}
}

/**
 * @param wallet Ethereum wallet/contract address that need to be exempted
 * @param exempted Boolean value used to add (i.e true) or remove (i.e false) from the list
 */
interface ChangeExemptWalletListParams extends TxParams {
  wallet: string;
  exempted: boolean;
}


/**
 * @param wallets Ethereum wallet/contract addresses that need to be exempted
 * @param exempted Boolean values used to add (i.e true) or remove (i.e false) from the list
 */
interface ChangeExemptWalletListMultiParams extends TxParams {
  wallets: string[];
  exempted: boolean[];
}

/**
 * @param from Address of the sender
 * @param to Address of the receiver
 * @param amount
 * @param data
 */
interface VerifyTransferParams {
  from: string;
  to: string;
  amount: BigNumber;
  data: string;
}

/**
 * This class includes the functionality related to interacting with the General Transfer Manager contract.
 */
export default class RestrictedPartialSaleTransferManagerCommon extends ModuleWrapper {
  public contract: Promise<RestrictedPartialSaleTMContract_3_1_0>;

  /**
   * Instantiate RestrictedPartialSaleTMWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   * @param contractFactory
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<RestrictedPartialSaleTMContract_3_1_0>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }

  /**
   *  Unpause the module
   */
  public unpause = async (params: TxParams) => {
    assert.assert(await this.paused(), ErrorCode.PreconditionRequired, 'Controller not currently paused');
    assert.assert(
      await this.isCallerTheSecurityTokenOwner(params.txData),
      ErrorCode.Unauthorized,
      'Sender is not owner',
    );
    return (await this.contract).unpause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  /**
   *  Check if module paused
   *  @return boolean value
   */
  public paused = async (): Promise<boolean> => {
    return (await this.contract).paused.callAsync();
  };

  /**
   *  Pause the module
   */
  public pause = async (params: TxParams) => {
    assert.assert(!(await this.paused()), ErrorCode.ContractPaused, 'Controller currently paused');
    assert.assert(
      await this.isCallerTheSecurityTokenOwner(params.txData),
      ErrorCode.Unauthorized,
      'Sender is not owner',
    );
    return (await this.contract).pause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  /**
   * Used to verify the transfer transaction (View)
   * @return boolean transfer result, address
   */
  public verifyTransfer = async (params: VerifyTransferParams) => {
    assert.isETHAddressHex('from', params.from);
    assert.isETHAddressHex('to', params.to);
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    const result = await (await this.contract).verifyTransfer.callAsync(
      params.from,
      params.to,
      valueToWei(params.amount, decimals),
      params.data,
    );
    const transferResult = parseTransferResult(result[0]);
    return {
      transferResult,
      address: result[1],
    };
  };

  /**
   * Use to return the list of exempted addresses
   */
  public getExemptAddresses = async (): Promise<string[]> => {
    return (await this.contract).getExemptAddresses.callAsync();
  };

  /**
   * Return the permissions flags that are associated with restricted partial sale transfer manager
   */
  public getPermissions = async (): Promise<Perm[]> => {
    const permissions = await (await this.contract).getPermissions.callAsync();
    return permissions.map(parsePermBytes32Value);
  };

  /**
   * Add/Remove wallet address from the exempt list
   */
  public changeExemptWalletList = async (params: ChangeExemptWalletListParams) => {
    assert.isNonZeroETHAddressHex('wallet', params.wallet);
    assert.assert(
      !(await this.getExemptAddresses()).includes(params.wallet) === params.exempted,
      ErrorCode.PreconditionRequired,
      'There will be no change to exempt list',
    );
    return (await this.contract).changeExemptWalletList.sendTransactionAsync(
      params.wallet,
      params.exempted,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Add/Remove multiple wallet address from the exempt list
   */
  public changeExemptWalletListMulti = async (params: ChangeExemptWalletListMultiParams) => {
    assert.areValidArrayLengths(
      [params.wallets, params.exempted],
      'Change exempt wallet argument arrays length mismatch',
    );
    const exemptedAddresses = await this.getExemptAddresses();
    for (let i = 0; i < params.wallets.length; i += 1) {
      assert.isNonZeroETHAddressHex('Wallet', params.wallets[i]);
      assert.assert(
        !exemptedAddresses.includes(params.wallets[i]) === params.exempted[i],
        ErrorCode.PreconditionRequired,
        'There will be no change to exempt list',
      );
    }
    return (await this.contract).changeExemptWalletListMulti.sendTransactionAsync(
      params.wallets,
      params.exempted,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * This function returns the signature of configure function
   */
  public getInitFunction = async (): Promise<string> => {
    return (await this.contract).getInitFunction.callAsync();
  };
}
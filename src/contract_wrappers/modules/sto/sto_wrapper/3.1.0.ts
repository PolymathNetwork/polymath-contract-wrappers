import { PolyResponse } from '@polymathnetwork/abi-wrappers';
import STOCommon from './common';
import { TxParams, STOBaseContract_3_1_0, ErrorCode, Constructor } from '../../../../types';
import assert from '../../../../utils/assert';
import { WithModule_3_0_0 } from '../../module_wrapper';

/**
 * @param tokenContract address of the ERC20 token to reclaim
 */
export interface ReclaimERC20Params extends TxParams {
  tokenContract: string;
}

export interface MixinSTO_3_1_0 {
  preMintAllowed: () => Promise<boolean>;
  
  isFinalized: () => Promise<boolean>;

  getTreasuryWallet: () => Promise<string>;

  pause: (params: TxParams) => Promise<PolyResponse>;

  finalize: (params: TxParams) => Promise<PolyResponse>;

  reclaimERC20: (params: ReclaimERC20Params) => Promise<PolyResponse>;

  allowPreMinting: (params: TxParams) => Promise<PolyResponse>;

  revokePreMintFlag: (params: TxParams) => Promise<PolyResponse>;
}

export const WithSTO_3_1_0 = <T extends Constructor<STOCommon>>(Base: T): Constructor<MixinSTO_3_1_0> & T => {
  abstract class Extended extends Base {
    public contract!: Promise<STOBaseContract_3_1_0>;    

    /**
     * Check if pre minting is allowed
     * @return boolean whether pre minting is enabled or not
     */
    public preMintAllowed = async (): Promise<boolean> => {
      return (await this.contract).preMintAllowed.callAsync();
    };

    /**
     *  Check if the STO is finalized
     *  @return boolean status of finalized
     */
    public isFinalized = async (): Promise<boolean> => {
      return (await this.contract).isFinalized.callAsync();
    };

    /**
     * Ethereum account address to receive unsold tokens
     * @return wallet address
     */
    public getTreasuryWallet = async (): Promise<string> => {
      return (await this.contract).getTreasuryWallet.callAsync();
    };

    /**
     *  Pause the module
     */
    public pause = async (params: TxParams) => {
      assert.assert(!(await this.isFinalized()), ErrorCode.PreconditionRequired, 'STO already finalized');
      assert.assert(!(await this.paused()), ErrorCode.PreconditionRequired, 'Contract already paused');
      
      assert.assert(
        await this.isCallerTheSecurityTokenOwner(params.txData),
        ErrorCode.Unauthorized,
        'The caller must be the ST owner',
      );
      return (await this.contract).pause.sendTransactionAsync(params.txData, params.safetyFactor);
    };

    /**
     * Finalizes the STO and mint remaining tokens to reserve address
     * Reserve address must be whitelisted to successfully finalize
     */
    public finalize = async (params: TxParams) => {
      assert.assert(
        await this.isCallerTheSecurityTokenOwner(params.txData),
        ErrorCode.Unauthorized,
        'The caller must be the ST owner',
      );
      assert.assert(!(await this.isFinalized()), ErrorCode.PreconditionRequired, 'STO is already finalized');
      // we can't execute mint to validate the method
      return (await this.contract).finalize.sendTransactionAsync(params.txData, params.safetyFactor);
    };

    /**
     * Reclaims ERC20 tokens
     */
    public reclaimERC20 = async (params: ReclaimERC20Params): Promise<PolyResponse> => {
      const contract = await this.contract;
      assert.assert(
        await this.isCallerTheSecurityTokenOwner(params.txData),
        ErrorCode.Unauthorized,
        'The caller must be the ST owner',
      );
      const stAddress = await contract.securityToken.callAsync();

      if (stAddress === params.tokenContract) {
        assert.assert((await this.isFinalized()), ErrorCode.PreconditionRequired, 'STO should be finalized to be able to reclaim minted tokens');
      }
      assert.isNonZeroETHAddressHex('tokenContract', params.tokenContract);
      return (await this.contract).reclaimERC20.sendTransactionAsync(
        params.tokenContract,
        params.txData,
        params.safetyFactor,
      );
    }

    /**
     * Enable tokens to be minted as soon as the STO starts
     */
    public allowPreMinting = async (params: TxParams) => {
      assert.isFutureDate(await this.startTime(), 'STO already started');
      return (await this.contract).allowPreMinting.sendTransactionAsync(params.txData, params.safetyFactor);
    };

    /**
     * Disable pre minting
     */
    public revokePreMintFlag = async (params: TxParams) => {
      assert.isFutureDate(await this.startTime(), 'STO already started');
      return (await this.contract).revokePreMintFlag.sendTransactionAsync(params.txData, params.safetyFactor);
    };
  }

  // even though this is a 3.1.0 contract, it still inherits from the 3.0.0 module contract
  return WithModule_3_0_0(Extended);
}
import {
  PolyResponse,
  Web3Wrapper,
  BigNumber,
  providerUtils,
  Provider,
  BlacklistTransferManagerContract_3_0_0,
  CappedSTOContract_3_0_0,
  CountTransferManagerContract_3_0_0,
  ERC20DetailedContract_3_0_0,
  ERC20DividendCheckpointContract_3_0_0,
  EtherDividendCheckpointContract_3_0_0,
  FeatureRegistryContract_3_0_0,
  GeneralPermissionManagerContract_3_0_0,
  GeneralTransferManagerContract_3_0_0,
  ISecurityTokenContract_3_0_0,
  ISecurityTokenRegistryContract_3_0_0,
  LockUpTransferManagerContract_3_0_0,
  ManualApprovalTransferManagerContract_3_0_0,
  ModuleContract_3_0_0,
  ModuleFactoryContract_3_0_0,
  ModuleRegistryContract_3_0_0,
  PercentageTransferManagerContract_3_0_0,
  PolymathRegistryContract_3_0_0,
  PolyTokenContract_3_0_0,
  PolyTokenFaucetContract_3_0_0,
  USDTieredSTOContract_3_0_0,
  VolumeRestrictionTMContract_3_0_0,
  VestingEscrowWalletContract_3_0_0,
  USDTieredSTOContract_3_1_0,
  CappedSTOContract_3_1_0,
  GeneralPermissionManagerContract_3_1_0,
  GeneralTransferManagerContract_3_1_0,
  RestrictedPartialSaleTMContract_3_1_0,
  VestingEscrowWalletContract_3_1_0,
  AdvancedPLCRVotingCheckpointContract_3_1_0,
} from '@polymathnetwork/abi-wrappers';
import PolymathRegistryWrapper from './contract_wrappers/registries/polymath_registry_wrapper';
import SecurityTokenRegistryWrapper from './contract_wrappers/registries/security_token_registry_wrapper';
import PolyTokenWrapper from './contract_wrappers/tokens/poly_token_wrapper';
import ModuleRegistryWrapper from './contract_wrappers/registries/module_registry_wrapper';
import TokenWrapperFactory from './factories/tokenWrapperFactory';
import ModuleWrapperFactory from './factories/moduleWrapperFactory';
import FeatureRegistryWrapper from './contract_wrappers/registries/feature_registry_wrapper';
import ERC20 from './contract_wrappers/tokens/erc20_wrapper';
import assert from './utils/assert';
import PolyTokenFaucetWrapper from './contract_wrappers/tokens/poly_token_faucet_wrapper';
import ContractFactory from './factories/contractFactory';
import { ErrorCode } from './types';
import { PolymathError } from './PolymathError';

/**
 * @param provider The web3 provider
 * @param polymathRegistry The PolymathRegistry contract address '0x...'
 */
export interface ApiConstructorParams {
  provider: Provider;
  polymathRegistryAddress?: string;
  defaultGasPrice?: BigNumber;
}

/**
 * @param address (optional) Account address
 */
export interface GetBalanceParams {
  address?: string;
}

export interface GetTokensParams {
  amount: BigNumber;
  address?: string;
}

export interface GetERC20WrapperParams {
  address: string;
}

/**
 * The PolymathAPI class contains smart contract wrappers helpful to interact with Polymath ecosystem.
 */
export class PolymathAPI {
  /**
   * An instance of the PolymathRegistryWrapper class containing methods
   * for interacting with PolymathRegistry smart contract.
   */
  public polymathRegistry: PolymathRegistryWrapper;

  /**
   * An instance of the SecurityTokenRegistryWrapper class containing methods
   * for interacting with SecurityTokenRegistry smart contract.
   */
  public securityTokenRegistry: SecurityTokenRegistryWrapper;

  /**
   * An instance of the PolyTokenWrapper class containing methods
   * for interacting with PolyToken smart contract.
   */
  public polyToken: PolyTokenWrapper;

  /**
   * An instance of the ModuleRegistryWrapper class containing methods
   * for interacting with ModuleRegistry smart contract.
   */
  public moduleRegistry: ModuleRegistryWrapper;

  /**
   * An instance of the FeatureRegistryWrapper class containing methods
   * for interacting with FeatureRegistry smart contract.
   */
  public featureRegistry: FeatureRegistryWrapper;

  /**
   * An instance of the TokenWrapperFactory class to get
   * TokenWrapper instances to interact with SecurityToken or ERC20 smart contracts
   */
  public tokenFactory: TokenWrapperFactory;

  /**
   * An instance of the ModuleWrapperFactory class to get
   * different module wrapper instances to interact with SecurityToken smart contracts
   */
  public moduleFactory: ModuleWrapperFactory;

  /**
   * An instance of the PolyTokenFaucetWrapper class containing methods
   * for interacting with PolyTokenFaucet smart contract.
   */
  public polyTokenFaucet: PolyTokenFaucetWrapper;

  public readonly web3Wrapper: Web3Wrapper;

  public contractFactory: ContractFactory;

  /**
   * Instantiates a new PolymathAPI instance.
   * @return  An instance of the PolymathAPI class.
   */
  public constructor(params: ApiConstructorParams) {
    providerUtils.standardizeOrThrow(params.provider);
    if (params.polymathRegistryAddress !== undefined) {
      assert.isNonZeroETHAddressHex('polymathRegistryAddress', params.polymathRegistryAddress);
    }

    this.web3Wrapper = new Web3Wrapper(params.provider, {
      gasPrice: params.defaultGasPrice,
    });

    const abiArray = [
      /* 3.0.0 */
      // Registries
      FeatureRegistryContract_3_0_0.ABI(),
      ModuleRegistryContract_3_0_0.ABI(),
      PolymathRegistryContract_3_0_0.ABI(),
      ISecurityTokenRegistryContract_3_0_0.ABI(),
      // Modules
      ModuleFactoryContract_3_0_0.ABI(),
      ModuleContract_3_0_0.ABI(),
      // Checkpoint
      ERC20DividendCheckpointContract_3_0_0.ABI(),
      EtherDividendCheckpointContract_3_0_0.ABI(),
      // Permission
      GeneralPermissionManagerContract_3_0_0.ABI(),
      // STO
      CappedSTOContract_3_0_0.ABI(),
      USDTieredSTOContract_3_0_0.ABI(),
      // Transfer
      CountTransferManagerContract_3_0_0.ABI(),
      GeneralTransferManagerContract_3_0_0.ABI(),
      ManualApprovalTransferManagerContract_3_0_0.ABI(),
      PercentageTransferManagerContract_3_0_0.ABI(),
      LockUpTransferManagerContract_3_0_0.ABI(),
      BlacklistTransferManagerContract_3_0_0.ABI(),
      VolumeRestrictionTMContract_3_0_0.ABI(),
      // Tokens
      ERC20DetailedContract_3_0_0.ABI(),
      PolyTokenContract_3_0_0.ABI(),
      PolyTokenFaucetContract_3_0_0.ABI(),
      ISecurityTokenContract_3_0_0.ABI(),
      // Wallet
      VestingEscrowWalletContract_3_0_0.ABI(),

      /* 3.1.0 */
      // Permission
      GeneralPermissionManagerContract_3_1_0.ABI(),
      // STO
      CappedSTOContract_3_1_0.ABI(),
      USDTieredSTOContract_3_1_0.ABI(),
      // Transfer
      GeneralTransferManagerContract_3_1_0.ABI(),
      RestrictedPartialSaleTMContract_3_1_0.ABI(),
      // Wallet
      VestingEscrowWalletContract_3_1_0.ABI(),
      // Checkpoint
      AdvancedPLCRVotingCheckpointContract_3_1_0.ABI(),
    ];

    abiArray.forEach((abi): void => {
      this.web3Wrapper.abiDecoder.addABI(abi);
    });

    this.contractFactory = new ContractFactory(this.web3Wrapper, abiArray, params.polymathRegistryAddress);

    this.polymathRegistry = new PolymathRegistryWrapper(
      this.web3Wrapper,
      this.contractFactory.getPolymathRegistryContract(),
    );

    this.securityTokenRegistry = new SecurityTokenRegistryWrapper(
      this.web3Wrapper,
      this.contractFactory.getSecurityTokenRegistryContract(),
      this.contractFactory,
    );

    this.polyToken = new PolyTokenWrapper(this.web3Wrapper, this.contractFactory.getPolyTokenContract());

    this.moduleRegistry = new ModuleRegistryWrapper(
      this.web3Wrapper,
      this.contractFactory.getModuleRegistryContract(),
      this.contractFactory,
    );

    this.featureRegistry = new FeatureRegistryWrapper(
      this.web3Wrapper,
      this.contractFactory.getFeatureRegistryContract(),
    );

    this.tokenFactory = new TokenWrapperFactory(this.web3Wrapper, this.securityTokenRegistry, this.contractFactory);

    this.moduleFactory = new ModuleWrapperFactory(this.web3Wrapper, this.contractFactory);

    this.polyTokenFaucet = new PolyTokenFaucetWrapper(
      this.web3Wrapper,
      this.contractFactory.getPolyTokenFaucetContract(),
    );
  }

  public getPolyTokens = async (params: GetTokensParams): Promise<PolyResponse> => {
    const networkId = await this.web3Wrapper.getNetworkIdAsync();
    if (networkId === 1) {
      throw new PolymathError({ message: 'Only for testnet', code: ErrorCode.PreconditionRequired });
    }
    const address = params.address !== undefined ? params.address : await this.getAccount();
    assert.isETHAddressHex('address', address);

    return this.polyTokenFaucet.getTokens({
      amount: params.amount,
      recipient: address,
    });
  };

  /**
   * Get a wrapped token from an address
   * @return TokenWrapper ERC20
   */
  public getERC20TokenWrapper = async (params: GetERC20WrapperParams): Promise<ERC20> => {
    return this.tokenFactory.getERC20TokenInstanceFromAddress(params.address);
  };

  /**
   * Get the account currently used by PolymathAPI
   * @return Address string
   */
  public getAccount = async (): Promise<string> => {
    return (await this.web3Wrapper.getAvailableAddressesAsync())[0];
  };

  /**
   * Get the ETH balance
   * @return Balance BigNumber
   */
  public getBalance = async (params: GetBalanceParams): Promise<BigNumber> => {
    const addr = params.address !== undefined ? params.address : await this.getAccount();
    assert.isETHAddressHex('address', addr);
    return this.web3Wrapper.getBalanceInWeiAsync(addr);
  };

  /**
   * Is it Testnet network?
   */
  public isTestnet = async (): Promise<boolean> => {
    return (await this.web3Wrapper.getNetworkIdAsync()) !== 1;
  };
}

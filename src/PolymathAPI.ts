import {
  PolyResponse,
  Web3Wrapper,
  BigNumber,
  providerUtils,
  Provider,
  BlacklistTransferManagerContract,
  CappedSTOContract,
  CountTransferManagerContract,
  ERC20DetailedContract,
  ERC20DividendCheckpointContract,
  EtherDividendCheckpointContract,
  FeatureRegistryContract,
  GeneralPermissionManagerContract,
  GeneralTransferManagerContract,
  ISecurityTokenContract,
  ISecurityTokenRegistryContract,
  LockUpTransferManagerContract,
  ManualApprovalTransferManagerContract,
  ModuleContract,
  ModuleFactoryContract,
  ModuleRegistryContract,
  PercentageTransferManagerContract,
  PolymathRegistryContract,
  PolyTokenContract,
  PolyTokenFaucetContract,
  USDTieredSTOContract,
  VolumeRestrictionTMContract,
  RestrictedPartialSaleTMContract,
  VestingEscrowWalletContract
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
  private polyTokenFaucet: PolyTokenFaucetWrapper;

  private readonly web3Wrapper: Web3Wrapper;

  private contractFactory: ContractFactory;

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
      // Registries
      FeatureRegistryContract.ABI(),
      ModuleRegistryContract.ABI(),
      PolymathRegistryContract.ABI(),
      ISecurityTokenRegistryContract.ABI(),
      // Modules
      ModuleFactoryContract.ABI(),
      ModuleContract.ABI(),
      // Checkpoint
      ERC20DividendCheckpointContract.ABI(),
      EtherDividendCheckpointContract.ABI(),
      // Permission
      GeneralPermissionManagerContract.ABI(),
      // STO
      CappedSTOContract.ABI(),
      USDTieredSTOContract.ABI(),
      // Transfer
      CountTransferManagerContract.ABI(),
      GeneralTransferManagerContract.ABI(),
      ManualApprovalTransferManagerContract.ABI(),
      PercentageTransferManagerContract.ABI(),
      LockUpTransferManagerContract.ABI(),
      BlacklistTransferManagerContract.ABI(),
      VolumeRestrictionTMContract.ABI(),
      RestrictedPartialSaleTMContract.ABI(),
      // Tokens
      ERC20DetailedContract.ABI(),
      PolyTokenContract.ABI(),
      PolyTokenFaucetContract.ABI(),
      ISecurityTokenContract.ABI(),
      // Wallet
      VestingEscrowWalletContract.ABI(),
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

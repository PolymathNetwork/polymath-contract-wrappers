import { BigNumber } from '@0x/utils';
import { Provider } from 'ethereum-types';
export { PolyResponse } from '@polymathnetwork/abi-wrappers';
export { PolymathRegistryWrapper } from './contract_wrappers/polymath_registry_wrapper';
export { SecurityTokenWrapper } from './contract_wrappers/security_token_wrapper';
export { SecurityTokenRegistryWrapper } from './contract_wrappers/security_token_registry_wrapper';
export { PolyTokenWrapper } from './contract_wrappers/poly_token_wrapper';
export { ModuleRegistryWrapper } from './contract_wrappers/module_registry_wrapper';
export { CappedSTOWrapper } from './contract_wrappers/capped_sto_wrapper';
export { CappedSTOFactoryWrapper } from './contract_wrappers/capped_sto_factory_wrapper';
export { ModuleFactoryWrapper } from './contract_wrappers/module_factory_wrapper';
export { USDTieredSTOWrapper } from './contract_wrappers/usd_tiered_sto_wrapper';
export { USDTieredSTOFactoryWrapper } from './contract_wrappers/usd_tiered_sto_factory_wrapper';

export interface IApiConstructor {
    dataProvider: Provider,
    polymathRegistryAddress?: IContractAddresses
}

/**
 * @param polymathRegistry The PolymathRegistry contract address '0x...'
 */
export interface IContractAddresses {
    polymathRegistry: string;
}

/**
 * @param networkId The id of the underlying ethereum network your provider is connected to.
 * @param gasPrice Gas price to use with every transaction
 * @param contractAddresses The address of all contracts to use. Defaults to the known addresses based on networkId.
 */
export interface IContractWrappersConfig {
    networkId: number;
    gasPrice?: BigNumber;
    contractAddresses?: IContractAddresses;
}

export interface IFundRaiseTypes {
    index: number;
}

export interface IFundsRaised {
    index: number;
}

/**
 * @param moduleType is the module type to look for
 * @param securityToken is the address of SecurityToken
 */
export interface IModulesByTypeAndToken {
    moduleType: number;
    securityToken: string;
}

export interface IBalanceOf {
    address?: string;
}

/**
 * @param owner The address which owns the tokens
 */
export interface IAllowance {
    owner: string;
}

/**
 * @param spender The address which will spend the funds
 * @param value The amount of tokens to be spent
 */
export interface IApprove {
    spender: string;
    value: BigNumber;
}

/**
 * @param contractName is the key for the contract address mapping
 */
export interface IGetAddress {
    contractName: string;
}

/**
 * @param securityToken is the address of the security token.
 */
export interface ISecurityTokenData {
    securityToken: string;
}

/**
 * @param ownerAddress is the address which owns the list of tickers
 */
export interface ITokensByOwner {
    ownerAddress: string;
}

/**
 * @param tokenName is the ticker symbol
 */
export interface ITickerDetails {
    tokenName: string;
}

/**
 * @param ticker is unique token ticker
 * @param tokenName is the name of the token
 */
export interface IRegisterTicker {
    ticker: string;
    tokenName: string;
}

/**
 * @param newOwner is the address of the new owner of the ticker
 * @param ticker is the ticker symbol
 */
export interface ITransferTickerOwnership {
    newOwner: string;
    ticker: string;
}

/**
 * @param name is the name of the token
 * @param ticker is the ticker symbol of the security token
 * @param details is the off-chain details of the token
 * @param divisible is whether or not the token is divisible
 */
export interface IGenerateSecurityToken {
    name: string;
    ticker: string;
    details: string;
    divisible: boolean;
}

/**
 * @param type type of the module
 */
export interface IModulesByType {
    type: number;
}

export interface IAddModule {
    moduleFactory: string;
    data: string;
    maxCost: BigNumber;
    budget: BigNumber;
}

/**
 * @param module address of the module
 */
export interface IModule {
    module: string;
}

/**
 * @param from sender of transfer
 * @param to receiver of transfer
 * @param value value of transfer
 * @param data data to indicate validation
 */
export interface IVerifyTransfer {
    from: string;
    to: string;
    value: BigNumber;
    data: string;
}

export interface ITiers {
    index: BigNumber;
}

export interface ITokensMintedByTier {
    tier: BigNumber;
}

/**
 * @param fundRaiseType Currency key
 * @param amount Value to convert to USD
 */
export interface IConvertToUSD {
    fundRaiseType: number;
    amount: BigNumber;
}

/**
 * @param fundRaiseType The fund raising currency (e.g. ETH, POLY, SC) to calculate sold tokens for
 */
export interface ITokensSoldFor {
    fundRaiseType: number;
}

export interface IStableCoinsRaised {
    index: string;
}

/**
 * @param investors Array of investor addresses to modify
 * @param accredited Array of bools specifying accreditation status
 */
export interface IChangeAccredited {
    investors: string[];
    accredited: boolean[];
}

/**
 * @param investors Array of investor addresses to modify
 * @param nonAccreditedLimit Array of uints specifying non-accredited limits
 */
export interface IChangeNonAccreditedLimit {
    investors: string[];
    nonAccreditedLimit: BigNumber[];
}

/**
 * @param startTime start time of sto
 * @param endTime end time of sto
 */
export interface IModifyTimes {
    startTime: BigNumber;
    endTime: BigNumber;
}

/**
 * @param nonAccreditedLimitUSD max non accredited invets limit
 * @param minimumInvestmentUSD overall minimum investment limit
 */
export interface IModifyLimits {
    nonAccreditedLimitUSD: BigNumber;
    minimumInvestmentUSD: BigNumber;
}

/**
 * @param fundRaiseTypes Array of fund raise types to allow
 */
export interface IModifyFunding {
    fundRaiseTypes: number[];
}

/**
 * @param wallet Address of wallet where funds are sent
 * @param reserveWallet Address of wallet where unsold tokens are sent
 * @param usdTokens Address of usd tokens
 */
export interface IModifyAddresses {
    wallet: string;
    reserveWallet: string;
    usdToken: string[];
}

/**
 * @param ratePerTier Array of rates per tier
 * @param ratePerTierDiscountPoly Array of discounted poly rates per tier
 * @param tokensPerTierTotal Array of total tokens per tier
 * @param tokensPerTierDiscountPoly Array of discounted tokens per tier
 */
export interface IModifyTiers {
    ratePerTier: BigNumber[];
    ratePerTierDiscountPoly: BigNumber[];
    tokensPerTierTotal: BigNumber[];
    tokensPerTierDiscountPoly: BigNumber[];
}

export enum NetworkId {
    Mainnet = 1,
    Kovan = 42,
    Local = 15,
}

/**
 * @param nameKey is the key for the feature status mapping
 */
export interface IGetFeatureStatus {
    nameKey: string;
}

/**
 * @param nameKey is the key for the feature status mapping
 * @param newStatus is the new feature status
 */
export interface ISetFeatureStatus {
    nameKey: string;
    newStatus: boolean;
}
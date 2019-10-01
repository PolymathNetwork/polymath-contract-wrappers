import {
  BigNumber,
  ModuleFactoryContract_3_0_0,
  TxData,
  Web3Wrapper,
  PolyResponse,
} from '@polymathnetwork/abi-wrappers';
import semver from 'semver';
import assert from '../../../utils/assert';
import ContractWrapper from '../../contract_wrapper';
import {
  BoundType,
  FULL_DECIMALS,
  ModuleType,
  TxParams,
  ErrorCode,
} from '../../../types';
import {
  bytes32ArrayToStringArray,
  bytes32ToString,
  parseModuleTypeValue,
  stringArrayToBytes32Array,
  stringToBytes32,
  weiToValue,
} from '../../../utils/convert';
import functionsUtils from '../../../utils/functions_utils';

/**
 * @param setupCost Cost to setup module
 */
interface ChangeSetupCostParams extends TxParams {
  setupCost: BigNumber;
}

/**
 * @param isCostInPoly Boolean if cost is in poly
 */
interface ChangeCostAndTypeParams extends ChangeSetupCostParams {
  isCostInPoly: boolean;
}

/**
 * @param title New title
 */
interface ChangeTitleParams extends TxParams {
  title: string;
}

/**
 * @param description New description
 */
interface ChangeDescriptionParams extends TxParams {
  description: string;
}

/**
 * @param name New name
 */
interface ChangeNameParams extends TxParams {
  name: string;
}

/**
 * @param tag New tag
 */
interface ChangeTagsParams extends TxParams {
  tags: string[];
}

/**
 * @param boundType Type of STVersionBound
 * @param newVersion New version
 */
interface ChangeSTVersionBoundsParams extends TxParams {
  boundType: BoundType;
  newVersion: number[];
}

/**
 * This class includes the functionality related to interacting with the ModuleFactory contract.
 */
export default abstract class ModuleFactoryCommon extends ContractWrapper {
  public contract: Promise<ModuleFactoryContract_3_0_0>;

  /**
   * Instantiate ModuleFactoryWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(web3Wrapper: Web3Wrapper, contract: Promise<ModuleFactoryContract_3_0_0>) {
    super(web3Wrapper, contract);
    this.contract = contract;
  }

  /**
   * Get the owner of the Module Factory
   * @return owner address
   */
  public owner = async (): Promise<string> => {
    return (await this.contract).owner.callAsync();
  };

  /**
   * Get the name of the Module
   * @return name
   */
  public name = async (): Promise<string> => {
    const name = await (await this.contract).name.callAsync();
    return bytes32ToString(name);
  };

  /**
   * Get the title of the Module
   * @return title
   */
  public title = async (): Promise<string> => {
    return (await this.contract).title.callAsync();
  };

  /**
   * Get isCostInPoly
   * @return boolean
   */
  public isCostInPoly = async (): Promise<boolean> => {
    return (await this.contract).isCostInPoly.callAsync();
  };

  /**
   * Get the description of the Module
   * @return description string
   */
  public description = async (): Promise<string> => {
    return (await this.contract).description.callAsync();
  };

  /**
   * Get the version of the Module
   * @return version string
   */
  public version = async (): Promise<string> => {
    return (await this.contract).version.callAsync();
  };

  /**
   * Get the types
   * @return list of module types
   */
  public getTypes = async (): Promise<ModuleType[]> => {
    return (await (await this.contract).getTypes.callAsync()).map(type => {
      return parseModuleTypeValue(new BigNumber(type));
    });
  };

  /**
   * Get the tags
   * @return tags list
   */
  public getTags = async (): Promise<string[]> => {
    return bytes32ArrayToStringArray(await (await this.contract).getTags.callAsync());
  };

  /**
   * Change the setupCost
   */
  public changeSetupCost = async (params: ChangeSetupCostParams): Promise<PolyResponse> => {
    await this.checkOnlyOwner(params.txData);
    return (await this.contract).changeSetupCost.sendTransactionAsync(
      params.setupCost,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Change the cost and type
   */
  public changeCostAndType = async (params: ChangeCostAndTypeParams): Promise<PolyResponse> => {
    await this.checkOnlyOwner(params.txData);
    return (await this.contract).changeCostAndType.sendTransactionAsync(
      params.setupCost,
      params.isCostInPoly,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Change the title
   */
  public changeTitle = async (params: ChangeTitleParams): Promise<PolyResponse> => {
    await this.checkOnlyOwner(params.txData);
    assert.assert(params.title.length > 0, ErrorCode.InvalidData, 'Invalid title');
    return (await this.contract).changeTitle.sendTransactionAsync(params.title, params.txData, params.safetyFactor);
  };

  /**
   * Change the description
   */
  public changeDescription = async (params: ChangeDescriptionParams): Promise<PolyResponse> => {
    await this.checkOnlyOwner(params.txData);
    assert.assert(params.description.length > 0, ErrorCode.InvalidData, 'Invalid description');
    return (await this.contract).changeDescription.sendTransactionAsync(
      params.description,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Change the name
   */
  public changeName = async (params: ChangeNameParams): Promise<PolyResponse> => {
    await this.checkOnlyOwner(params.txData);
    assert.assert(params.name.length > 0, ErrorCode.InvalidData, 'Invalid name');
    return (await this.contract).changeName.sendTransactionAsync(
      stringToBytes32(params.name),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Change the tags
   */
  public changeTags = async (params: ChangeTagsParams): Promise<PolyResponse> => {
    await this.checkOnlyOwner(params.txData);
    assert.assert(params.tags.length > 0, ErrorCode.InvalidData, 'Invalid, must provide one or more tags');
    return (await this.contract).changeTags.sendTransactionAsync(
      stringArrayToBytes32Array(params.tags),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Change the ST VersionBounds
   */
  public changeSTVersionBounds = async (params: ChangeSTVersionBoundsParams): Promise<PolyResponse> => {
    await this.checkOnlyOwner(params.txData);
    assert.assert(
      params.boundType === BoundType.LowerBound || params.boundType === BoundType.UpperBound,
      ErrorCode.InvalidBound,
      'Invalid bound type',
    );
    assert.assert(
      params.newVersion.length === 3,
      ErrorCode.InvalidVersion,
      'Invalid version, number array must have 3 elements',
    );
    const currentBound =
      BoundType.LowerBound === params.boundType
        ? await this.getLowerSTVersionBounds()
        : await this.getUpperSTVersionBounds();
    const currentBoundVer = currentBound.join('.');
    const newBoundVer = params.newVersion.join('.');
    if (params.boundType === BoundType.LowerBound) {
      assert.assert(
        semver.lte(newBoundVer, currentBoundVer),
        ErrorCode.InvalidBound,
        'New Lower ST Bounds must be less than or equal to current',
      );
    } else {
      assert.assert(
        semver.gte(newBoundVer, currentBoundVer),
        ErrorCode.InvalidBound,
        'New Upper ST Bounds must be greater than or equal to current',
      );
    }
    return (await this.contract).changeSTVersionBounds.sendTransactionAsync(
      params.boundType,
      params.newVersion,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Get setup cost
   * @return setupCost value
   */
  public setupCost = async (): Promise<BigNumber> => {
    const value = await (await this.contract).setupCost.callAsync();
    return weiToValue(value, FULL_DECIMALS);
  };

  /**
   * Get upper ST version bounds
   * @return upper bounds list
   */
  public getUpperSTVersionBounds = async (): Promise<BigNumber[]> => {
    return (await (await this.contract).getUpperSTVersionBounds.callAsync()).map(v => new BigNumber(v));
  };

  /**
   * Get lower ST version bounds
   * @return lower bounds list
   */
  public getLowerSTVersionBounds = async (): Promise<BigNumber[]> => {
    return (await (await this.contract).getLowerSTVersionBounds.callAsync()).map(v => new BigNumber(v));
  };

  /**
   * Get setup cost in poly
   * @return cost in poly
   */
  public setupCostInPoly = async (): Promise<BigNumber> => {
    const value = await (await this.contract).setupCostInPoly.callAsync();
    return weiToValue(value, FULL_DECIMALS);
  };

  public checkOnlyOwner = async (txData: Partial<TxData> | undefined) => {
    assert.assert(
      functionsUtils.checksumAddressComparision(await this.owner(), await this.getCallerAddress(txData)),
      ErrorCode.Unauthorized,
      'Msg sender must be owner',
    );
  };
}

export function isModuleFactory(wrapper: ContractWrapper): wrapper is ModuleFactoryCommon {
  return wrapper instanceof ModuleFactoryCommon;
};

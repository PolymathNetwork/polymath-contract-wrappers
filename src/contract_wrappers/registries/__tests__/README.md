## @polymathnetwork/contract-wrappers

# Contract Wrapper Mock Testing

## Introduction

The contract-wrappers project is a layer of middleware that exists between the polymath core solidity smart contract project and end user dapps.

The purpose of the project is to facilitate an easier interface to interact with the smart contracts. This allows the solidity developers to program the contracts in a manner which saves gas, and uses arguments and function executions on the blockchain with minimal friction and more scalability.

The project therefore allows end user dapps to communicate with the smart contracts with strongly typed interfaces in typescript, and need only provide an ethereum node provider to connect to the blockchain.

Apart from internal processing and conversions to interface with smart contract arguments, the project also creates assertions of the state of the smart contracts.

The assertions check the smart contracts to see whether certain conditions (generally solidity requires) were met by the smart contract before we try to execute transactions on the contract.

Checking assertions is beneficial to the end user for two reasons. First off, there are potential gas savings for reverted transactions. More importantly, it provides the ability to give more robust feedback to the user when there are logical errors in the execution of contract functions.

Assertions help us with assuring we have both the correct argument requirements and situational requirements. In the first case, assertions make sure we have non zero Ethereum addresses passed in, or dates passed in that are in the future or past.

Situational assertions assure for example that a contract is not paused or frozen before trying to execute. It assures if we wish to change the state of a blockchain variable, we are not wasting gas changing the state to the same value or changing a value that does not exist.

## Why must we test with mocks?

This project acts as middleware between smart contract code and the end user dapp. We need not test or know about the end user's code, it is their responsibility to test the apps they build on top of the ecosystem.

The smart contract code we are interacting with has its own suite of testing code. The middleware does not care about the internal workings of the smart contract code, apart from asserting that the code requirements are met before transacting with functions on the blockchain.

In order to test that the conversions, assertions, and other functionalities of the middleware in this project are working, we use mocks. This is because as mentioned, we do not need to care about what the actual smart contract returns, only what we expect it to return.

Mocks are helpful to us as we are able to "expect" what we will receive from our smart contracts via our generated contract artifacts. These mocks allow us to not have to care about maintaining an ethereum provider or the returned result of an ethereum smart contract function.

The mock testing framework we are using is `ts-mockito`.

## Types of wrapper functions and their test requirements

At a basic level, the interaction with blockchain functions can be either a getter or a setter. That being a call to the contract to get the value of a certain condition, or a call that will change the condition of the contract.

**"Getters"**

In the wrappers this is reflected by two different types of call. In the "getter" situation we use callAsync to make an asynchronous call and get us the information stored in the blockchain.

```
 public getFeatureStatus = async (params: GetFeatureStatusParams) => {
    return (await this.contract).getFeatureStatus.callAsync(params.nameKey);
  };
```

**"Setters"**

In the "setter" situation we use sendTransactionAsync to make an asynchronous call to a function that will change the blockchain state and consume gas in the EVM in the process. These functions require more middleware in general.

The reason we see more middleware code required here is because the purpose of this project is to check that certain conditions are met before we call sendTransactionAsync, which is reflected below by assert code.

```
public setFeatureStatus = async (params: SetFeatureStatusParams) => {
    assert.assert(
      (await this.owner()) === (await this.web3Wrapper.getAvailableAddressesAsync())[0],
      'Msg sender must be owner',
    );
    const currentStatus = await this.getFeatureStatus({ nameKey: params.nameKey });
    assert.assert(currentStatus !== params.newStatus, 'FeatureStatus must change');
    return (await this.contract).setFeatureStatus.sendTransactionAsync(
      params.nameKey,
      params.newStatus,
      params.txData,
      params.safetyFactor,
    );
  };
```

We can notice a few things about the above code. Our first assertion, is making sure that the owner of the contract matches with our active address in the web3 wrapper.

The second assertion checks that we are not calling this function for no reason, in that the feature status above must change. The smart contract code requires these conditions, and by checking in advance we will get an error before even calling out to the smart contract.

So, before we ever call this sendTransactionAsync code, we need to meet several requirements. Now the thing about these requirements is that they are external to the code, in order to use this code and test we must assume the required conditions. This is where we need our mocks.

The mocks in this case will be used in several cases. First off, we will "mock" the wrappers contract itself for an expected return from this.owner(). 

Depending on our test, we will want the owner address to either be equal to or differ from what the web3wrapper's active address is. This means that we will also need to mock an expected value back from web3 wrapper.

Lastly, we also need to know what the current result of getFeatureStatus is. Very similar to how we mocked the owner, we will also need to mock the return of getFeatureStatus to make sure it meets the conditional needs of our tests.

In other cases, the contract might depend on other contracts, such as a factory or securitytokenregistry, in which case these contracts will need to be mocked for their functionalities to return the correct values required.

If all the assertions pass based on the result from the mock, we are ready to make a "real call". This means we will call the function we wish to test on our target wrapper, and depend on the mocks returning the necessary parameters within. 

Once the real call successfully is made (which requires mock information in tests), we can validate that the functions of our smart contracts were called, were called a certain number of times, or not at all.

## Test Setup - Module Registry Tests

**Before all tests**

We use a beforeAll declaration to indicate how we will set up our wrapper test. Globally, we declare our target as our wrapper, declare a mockedWrapper for our Web3Wrapper & provider, and declare a mocked contract of contract-artifacts type the wrapper's contract and as well any contracts that are directly dependent on it.

Inside our beforeAll declaration we do our mock setup. We create a mocked wrapper of the Web3Wrapper, and a mocked contract of any contracts from `abi-wrappers` we need to interact with.

We then create a target wrapper, later on we will be using it to make a "real call". To sum up, we will have the smart contract function returns mocked, and the real call from the wrapper will use these values to test its inner middleware code.

To create the target wrapper, we create a new wrapper in this face from an instance of the mocked web3 wrapper and a promise resolving in an instance of our mocked contract

```
 // Declare PolyMathRegistryWrapper object
  let target: ModuleRegistryWrapper;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: ModuleRegistryContract;
  let mockedContractFactory: ContractFactory;
  let mockedModuleFactoryContract: ModuleFactoryContract;
  let mockedFeatureRegistryContract: FeatureRegistryContract;

  beforeAll(() => {
      mockedWrapper = mock(Web3Wrapper);
      mockedContract = mock(ModuleRegistryContract);
      mockedContractFactory = mock(ContractFactory);
      mockedModuleFactoryContract = mock(ModuleFactoryContract);
      mockedFeatureRegistryContract = mock(FeatureRegistryContract);
  
      const myContractPromise = Promise.resolve(instance(mockedContract));
      target = new ModuleRegistryWrapper(instance(mockedWrapper), myContractPromise, instance(mockedContractFactory));
    });
```

**After all tests**

We require a reset of mocks after/between each test so that the return values we set on the mocks do not persist to other tests that likely have a different situtation and setup

```
  afterEach(() => {
    reset(mockedWrapper);
    reset(mockedContract);
    reset(mockedModuleFactoryContract);
    reset(mockedFeatureRegistryContract);
  });
```

## CallAsync Test Feature Registry

A mock unit test from the FeatureRegistry is the following:

```
describe('GetFeatureStatus', () => {
    test('should get the feature status for the given name key', async () => {
      // Address expected
      const expectedResult = true;
      // Contract requested
      const featureName = Features.CustomModulesAllowed.toString();
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getFeatureStatus).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(featureName)).thenResolve(expectedResult);

      // Real call
      const result = await target.getFeatureStatus({ nameKey: featureName });
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getFeatureStatus).once();
      verify(mockedMethod.callAsync(featureName)).once();
    });
```

From a high level, what we are doing here is getting the feature status from the FeatureRegistry. We describe first the goal of the test suite.

Each test must be marked with its purpose after the test(... declaration.

In this example, we are expecting that when we call getFeatureStatus in the wrapper with an argument of CustomModulesAllowed feature type, we will receive true- meaning the status of the CustomModulesAllowed type is true.

Our expected result is true, and our feature name is CustomModulesAllowed

We must then mock the method, meaning that we call mock(MockedCallMethod). This is the manner in which we create a programmable mock method that will be used in place of the actual function when the real call is made.

The actual function we are calling here on the mocked contract is getFeatureStatus. So when we call:

```      when(mockedContract.getFeatureStatus).thenReturn(instance(mockedMethod));```

Here we are telling our mocked contract that when getFeatureStatus is called, it should return an instance of this mocked method instead.

Next we need to tell the mocked method what to do when call async is called

```      when(mockedMethod.callAsync(featureName)).thenResolve(expectedResult);```

This means that when we callAsync on that instance of method, the resolution back from the smart contract method will be our expected result, as opposed to an actual call back from a smart contract.

We then make the real call, so that the wrapper is called and executes all of its code, with the only difference from a live environment that there is a fake provider and we ourselves are getting an expectedResult in return

```  const result = await target.getFeatureStatus({ nameKey: featureName });```

This call should be successful if we have setup our mocks correctly. Afterwards we are going to validate that the smart contract function calls we expected were in fact called, as well as the expected mock behaviour was also called.

```
      verify(mockedContract.getFeatureStatus).once();
      verify(mockedMethod.callAsync(featureName)).once();
```

When these verify functions pass the point is that we have a successful test which calls code once. This is why the `afterAll` code is important, as one thing it does is clear this function call count (once) for the next test. 

This code becomes important as it is the building block later on for our assertions. Assertions periodically will use callAsync methods from the wrapper to validate their own conditions on the blockchain before trying to send a transaction and possibly reverting.

This meaning that the code above will need to be in part reused each time that the wrapper needs to call to that contract. 

## SendTransactionAsync Test Module Registry

Here we are going to shift back to Module Registry, focusing on the register module functionality. We have tested already the feature registry that its getFeatureStatus callAsync is working as expected. But now we need to setup the same mock so we can test another function that asserts this.

The test we will be looking at line by line is:
```
 test('should successfully call to registerModule', async () => {
```

First, we are going to create an expected owner. 

```
const expectedOwnerResult = '0x0123456789012345678901234567890123456789';
```

This will be important afterwards as we will need it to check ownership requirements and also to setup a mock for our web3 wrapper.

Note that in a previous step we setup a beforeAll that creates a mock contract for each important smart contract this wrapper will need. In this case the contracts are ModuleRegistryContract, ModuleFactoryContract, FeatureRegistryContract and the ContractFactory.

Next, lets bring in some familiar code, so that we can setup the correct return from the feature registry.

``` 
when(mockedContractFactory.getFeatureRegistryContract()).thenResolve(instance(mockedFeatureRegistryContract));
         const mockedGetFeatureStatusMethod = mock(MockedCallMethod);
         const currentFeatureStatus = true;
         when(mockedFeatureRegistryContract.getFeatureStatus).thenReturn(instance(mockedGetFeatureStatusMethod));
         when(mockedGetFeatureStatusMethod.callAsync(Features.CustomModulesAllowed)).thenResolve(currentFeatureStatus);
```

A new concept here is using the contract factory to create a FeatureRegistry contract. We need this to setup that our mockedFeatureRegistryContract will have some mock returns.

We create a new mockedGetFeatureStatusMethod, and we will return an instance of this when the mockedFeatureRegistryContract is used.

As before, when we call on this method callAsync with the Features.CustomModulesAllowed feature, we will resolve the current feature status.

This satisfies the assertion in the module registry wrapper which calls `(await this.featureRegistryContract()).getFeatureStatus.callAsync(Features.CustomModulesAllowed))`

Lets go ahead with the next piece, we need to use a moduleFactory contract related to the wrapper, and get it's owner

```
      const moduleFactoryAddress = '0x3333333333333333333333333333333333333333';
      when(mockedContractFactory.getModuleFactoryContract(moduleFactoryAddress)).thenResolve(
        instance(mockedModuleFactoryContract),
      );
      const mockedModuleFactoryOwnerMethod = mock(MockedCallMethod);
      when(mockedModuleFactoryOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedModuleFactoryContract.owner).thenReturn(instance(mockedModuleFactoryOwnerMethod));

```

Here we can see that the module factory address is setup first. As we did previously, when we need to get the ModuleFactoryContract promise, we set it up to resolve the mockedModuleFactoryContract.

With the mockedModuleFactoryContract setup, we want to call owner on that contract, and get an instance of our mockedModuleFactoryOwnerMethod in return. In the last lines you can see how that's setup to resolve the expected ModuleFactory owner we are looking for.

The next thing we need to satisfy the assertions the wrapper is looking for is the getTypes method from the moduleFactoryContract

```
      const mockedGetTypesMethod = mock(MockedCallMethod);
      const types = [new BigNumber(1), new BigNumber(2)];
      when(mockedModuleFactoryContract.getTypes).thenReturn(instance(mockedGetTypesMethod));
      when(mockedGetTypesMethod.callAsync()).thenResolve(types);
```

Here we can see that we create a new mockedGetTypesMethod, when it is called we will want it to resolve the types, in this case an array of bignumber.

On the third line, we see that therefore when we call to the moduleFactory contract we setup previously, for getTypes, we will get this as a return.

We will afterwards need to know that the contract is not paused so that the wrapper assertion can pass.

```
      const expectedPausedResult = false;
      const mockedPausedMethod = mock(MockedCallMethod);
      when(mockedContract.isPaused).thenReturn(instance(mockedPausedMethod));
      when(mockedPausedMethod.callAsync()).thenResolve(expectedPausedResult);
```

Here we are using the mockedContract, the same ModuleRegistryContract. We want to expect the pause coming back will be false.

So when we call isPaused in the real call, the mockedPauseMethod will resolve to the expected result, false as it is not paused.

Then we will need to know about the contract owner, and the code is very similar to mock the owner of the contract

```
const mockedContractOwnerMethod = mock(MockedCallMethod);
      when(mockedContractOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedContract.owner).thenReturn(instance(mockedContractOwnerMethod));
```

Earlier we declared the expectedOwnerResult, which will be the active address we are using. So here, we setup the mockedContractOwnerMethod as a typical mocked call method as usual.

Then when we need the owner, it will give us the mocked expectedOwnerResult.

We have talked about the expected active address, this also needs to be mocked. Remember that we have a mocked web3 wrapper/provider. This will need to be set up in the next line.

``` 
when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);
```

Here we can clearly see that when the mockedWrapper tries to access provider info, we will get the same expectedOwnerResult as always.

Next we need to setup 

```
const mockedGetModulesMethod = mock(MockedCallMethod);
         when(mockedContract.getModulesByType).thenReturn(instance(mockedGetModulesMethod));
         const allModulesTypes = [
           ModuleType.PermissionManager,
           ModuleType.STO,
           ModuleType.Burn,
           ModuleType.Dividends,
           ModuleType.TransferManager,
         ];
         const expectedAlreadyRegisteredResult = [
           '0x1111111111111111111111111111111111111111',
           '0x2222222222222222222222222222222222222222',
         ];
   
         allModulesTypes.map(async type => {
           when(mockedGetModulesMethod.callAsync(type)).thenResolve(expectedAlreadyRegisteredResult);
         });
```

What we are doing here is setting up a mocked get modules method. When we call on our active contract .getModulesByType, we will want to get our mocked method.

However here we need a bit more complex of a setup, as the wrapper will iterate through several different module types. So the first 2 consts we setup, are the types we are looking for and the result we will expect back here. The important for this specific setup is that we don't find duplicates- we want to register the module.

When we call `allModulesTypes.map...` we are iterating through each, as for each different argument we need to expect a different result.

This means that everytime we call to our mockedGetModulesMethods.callAsync(... with a different type, we need to specify to our mock method how to behave differently, although in this case the result is all the same for test purposes.

The end result is a mock setup for getModules that covers all the types the wrapper might throw at it.

We will then declare some mocked params that we will end passing to our real call.

```
const mockedParams = {
           moduleFactory: '0x3333333333333333333333333333333333333333',
           txData: {},
           safetyFactor: 10,
         };
```

This argument is necessary for sendTransaction later on.

Now we are going to setup the mock of the actual function we are working on.

```
const expectedResult = getMockedPolyResponse();
         const mockedMethod = mock(MockedSendMethod);
         when(mockedContract.registerModule).thenReturn(instance(mockedMethod));
         when(
           mockedMethod.sendTransactionAsync(mockedParams.moduleFactory, mockedParams.txData, mockedParams.safetyFactor),
         ).thenResolve(expectedResult);
```

The expected result is a successful and resolved promise, our mockedPolyResponse.

We create a new mockedMethod for our sendTransactionAsync. We can see here that we setup on line 3 when the mocked contract calls to register module, it will return an instance of our mockedMethod.

When the mocked method has send transaction async called, it will do so with similar arguments as the final real call. Usually these arguments are the same, but not in cases where the real call has different arguments from the smart contract call we are mocking here.

When the sendTransactionAsync is called on our mocked method (registerModule) we will resolve with our expected result, a successful promised our mockedPolyResponse.

We will then make the real call

```
const result = await target.registerModule(mockedParams);
```

And expect that the result is the same as the mocked result we created earlier , our mockedPolyResponse
```
      expect(result).toBe(expectedResult);
```

Great, if we have gotten to this point it means our test successfully ran. Now we need to verify what we just did.

```
      verify(mockedContract.registerModule).once();
      verify(
        mockedMethod.sendTransactionAsync(mockedParams.moduleFactory, mockedParams.txData, mockedParams.safetyFactor),
      ).once();
      verify(mockedContract.getModulesByType).times(5);
      verify(mockedModuleFactoryContract.owner).once();
      verify(mockedModuleFactoryContract.getTypes).once();
      verify(mockedFeatureRegistryContract.getFeatureStatus).once();
      verify(mockedContract.owner).once();
      verify(mockedContract.isPaused).once();
```

Here we are verifying first that our wrapper called registerModule function, and our mocked contract had its smart contract function registerModule called with our mocked params.

Then we can check that our other mocked contract calls were made (we can check each one for callAsync, but that wasn't added here, not sure if it needs to be added to every test again)

We verify that the getModulesByType was called 5 times, for each of the 5 types.

We verify that the mockedModuleFactory was called once for its owner, and once for getTypes.

We verify that the featureRegistryContract was called once for getFeature status.

Finally, we verify that we checked the mocked contract for owner address and isPaused status, once each.

Please note that for *every* when statement there is a verify statement checking it.

## Conclusion

The tests are quite verbose and require some more simplification. In general they are long as to test a function with assertions we need to use mocks to give that function something to assert on in the first place.

For future tests, we need to first test each function in the wrappers. Next we need to create derivations of each test, which check that errors/ assertions work as they should, meaning there are 2+ tests that must be drafted for each assertion.

Tests that test the same function in different assertions combos should be in the same describes declaration.

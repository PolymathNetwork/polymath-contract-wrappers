## @polymathnetwork/contract-wrappers

Version 3.0.0 of the Polymath-Core Ethereum Smart Contracts

Smart TS wrappers for Polymath smart contracts.

## Installation

**Install**

```bash
npm install @polymathnetwork/contract-wrappers --save
```

**Import**

```javascript
import { PolymathAPI } from '@polymathnetwork/contract-wrappers';
```

If your project is in [TypeScript](https://www.typescriptlang.org/), add the following to your `tsconfig.json`:

```json
"compilerOptions": {
    "typeRoots": ["node_modules/@0x/typescript-typings/types", "node_modules/@types"],
}
```

## Documentation
This project uses typedoc documentation style.

You can access these docs by cloning this repo and opening `docs/index.html` in the browser.

## Contributing

We strongly recommend that the community help us make improvements and determine the future direction of the protocol. To report bugs within this package, please create an issue in this repository.

Commits should follow the [conventional commits](https://www.conventionalcommits.org) standard. You can use `yarn commit` which will launch [commitizen](https://github.com/commitizen/cz-cli) to help you format commit messages in the correct manner

### A note on breaking changes

*Anything* that forcefully changes the way the client interacts with the package is considered a breaking change and should be described in the `BREAKING CHANGE` section of the corresponding commit.  This includes (but is not limited to):

- Renaming a public function/class/interface/type
- Deleting a public function/class/interface/type
- Changing a public function's argument list in a way that the user needs to rewrite existing calls to it
- Changing a public function's return type

Whatever is written under `BREAKING CHANGES` is literally what will go into the changelog, so please be clear on the messages. For example, if I change the return type of a function called  `foo` in class `Bar`, the `BREAKING CHANGE` section of my commit should say something like

```
change return type of the `Bar` class's `foo` function from `string` to `number`
```

### Install dependencies

If you don't have yarn workspaces enabled (Yarn < v1.0) - enable them:

```bash
yarn config set workspaces-experimental true
```

Then install dependencies

```bash
yarn install
```

### Build

To build this package and all other monorepo packages that it depends on, run the following from the monorepo root directory:

```bash
yarn build
```

or continuously rebuild on change:

```bash
yarn watch
```

### Clean

```bash
yarn clean
```

### Lint

```bash
yarn lint
```

### Testing

This project uses Jest to do unit testing on the contract wrappers.

```bash
yarn jest
```

## Deployment

This package has automatic publishing and versioning via [semantic-release](https://github.com/semantic-release/semantic-release) and forceful use of [conventional commits](https://www.conventionalcommits.org) 

## Sandbox

We provide a sandbox dev server to manually play with the package in the browser

To boot it up:

```
yarn start
```

This will generate a git-ignored sandbox.ts file you can edit locally
to start playing around with the code

## Starting up- Code Examples

In order to setup the Polymath API included in these contract wrappers, you must first establish a blockchain provider.

Ethereum providers are important in both reading and writing from an Ethereum RPC Node.

The API must be provided with the network id you would like to use, or RPC Node. The provider may exist on a node, on the browser as an injected provider (like Metamask), or both.

In order to configure the provider use the following code samples to set up the Project. Follow one of the following examples to set this up in your sandbox, dapp or node server, dependent on the situation.

For cases (1) and (2) you will need to set up an Injected Web3 Provider (Metamask). An example of doing so is below. More info on new and legacy metamask providers here: [Metamask Medium Post](https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8)

```javascript
async function getInjectedProviderIfExists(): Promise<Provider> {
  // New Metamask Version
  let injectedProviderIfExists = (window as any).ethereum;
  if (injectedProviderIfExists !== undefined) {
    if (injectedProviderIfExists.enable !== undefined) {
      try {
        await injectedProviderIfExists.enable();
      } catch (err) {
        // Error with Enabling Metamask
      }
    }
  } else {
    // Legacy Metamask Version
    const injectedWeb3IfExists = (window as any).web3;
    if (injectedWeb3IfExists !== undefined && injectedWeb3IfExists.currentProvider !== undefined) {
      injectedProviderIfExists = injectedWeb3IfExists.currentProvider;
    } else {
      // Error with legacy metamask
    }
  }
  return injectedProviderIfExists;
}
```
*Setting up Polymath API for 4 different cases*

(1) Using Injected Provider (Metamask) to read from the blockchain and publish transactions on the blockchain.

```javascript
const injectedProviderIfExists = await getInjectedProviderIfExists();
// Setup API
const params: ApiConstructorParams = {
  provider: new MetamaskSubprovider(injectedProviderIfExists),
  polymathRegistryAddress: '<Deployed Polymath Registry Address>',
};
const polymathAPI = new PolymathAPI(params);
```

(2) Using a Redundant Provider on node to read from the blokchain and Injected Provider (Metamask) to publish transactions.

```javascript
// Instantiate a provider engine
const providerEngine = new Web3ProviderEngine();

const injectedProviderIfExists = await getInjectedProviderIfExists();
providerEngine.addProvider(new MetamaskSubprovider(injectedProviderIfExists));

// Add Redundant Subprovider
providerEngine.addProvider(new RedundantSubprovider([new RPCSubprovider('<http://examplenoderpc:port>')]));
providerEngine.start();

// Setup API
const params: ApiConstructorParams = {
  provider: providerEngine,
  polymathRegistryAddress: '<Deployed Polymath Registry Address>',
};
const polymathAPI = new PolymathAPI(params);
```

(3) Using a Redundant Provider on a node to read from the blockchain and publish transactions on an unlocked blockchain node (No Private Key Required).

```javascript
// Instantiate Provider Engine
const providerEngine = new Web3ProviderEngine();
providerEngine.addProvider(new RedundantSubprovider([new RPCSubprovider('<http://examplenoderpc:port>')]));
providerEngine.start();

// Setup API
const params: ApiConstructorParams = {
  provider: providerEngine,
  polymathRegistryAddress: '<Deployed Polymath Registry Address>',
};
const polymathAPI = new PolymathAPI(params);
```

(4) Using a PrivateKeyWalletSubProvider to sign transactions being published on a normal blockchain node, and using Redundant Provider to read from blockchain.

```javascript
// Instantiate Provider Engine
const providerEngine = new Web3ProviderEngine();
providerEngine.addProvider(new PrivateKeyWalletSubprovider('<Private Key Here>'));
providerEngine.addProvider(new RedundantSubprovider([new RPCSubprovider('<http://examplenoderpc:port>')]));
providerEngine.start();

// Setup API
const params: ApiConstructorParams = {
  provider: providerEngine,
  polymathRegistryAddress: '<Deployed Polymath Registry Address>',
};
const polymathAPI = new PolymathAPI(params);
```

### Module code examples
In the `/examples` directory there are several examples to help developers understand how to use the API within the sandbox.

These examples demonstrate the use of the project's PolymathAPI to get data and publish transactions with Polymath's smart contracts. Register a ticker, generate a new security token and then you can add a module.

When a security token has a module successfully attached, the examples demonstrate how one can work with sto creation, transfer restrictions, permissioning, and directly with the security token. 

The sandbox code included in the examples demonstrates how to subscribe to events fired from the smart contracts. It also demonstrates how to better catch issues when they happen, during token transfers for instance.

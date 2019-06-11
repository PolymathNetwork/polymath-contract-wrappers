## @polymathnetwork/contract-wrappers

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

## Contributing

We strongly recommend that the community help us make improvements and determine the future direction of the protocol. To report bugs within this package, please create an issue in this repository.

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

** Pending, should run a prepublish script on CI or use Semantic Releases**

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

(1) Using Injected Provider (Metamask) to read from the blockchain and publish transactions on the blockchain.

```javascript
  // Setup Metamask
  let injectedProviderIfExists = (window as any).ethereum;
  if (injectedProviderIfExists !== undefined) {
    if (injectedProviderIfExists.enable !== undefined) {
      try {
        await injectedProviderIfExists.enable();
      } catch (err) {
        // Issue enabling new metamask
      }
    }
  } else {
    const injectedWeb3IfExists = (window as any).web3;
    if (injectedWeb3IfExists !== undefined && injectedWeb3IfExists.currentProvider !== undefined) {
      injectedProviderIfExists = injectedWeb3IfExists.currentProvider;
    }
  }

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

  // Setup Metamask
  let injectedProviderIfExists = (window as any).ethereum;

  if (injectedProviderIfExists !== undefined) {
    if (injectedProviderIfExists.enable !== undefined) {
      try {
        await injectedProviderIfExists.enable();
      } catch (err) {
        // Issue enabling new metamask
      }
    }
  } else {
    const injectedWeb3IfExists = (window as any).web3;
    if (injectedWeb3IfExists !== undefined && injectedWeb3IfExists.currentProvider !== undefined) {
      injectedProviderIfExists = injectedWeb3IfExists.currentProvider;
    }
  }
  if (injectedProviderIfExists !== undefined) {
    providerEngine.addProvider(new MetamaskSubprovider(injectedProviderIfExists));
  }

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
  providerEngine.addProvider(
    new PrivateKeyWalletSubprovider('<Private Key Here>'),
  );
  providerEngine.addProvider(new RedundantSubprovider([new RPCSubprovider('<http://examplenoderpc:port>')]));
  providerEngine.start();

  // Setup API
  const params: ApiConstructorParams = {
    provider: providerEngine,
    polymathRegistryAddress: '<Deployed Polymath Registry Address>',
  };
  const polymathAPI = new PolymathAPI(params);

```

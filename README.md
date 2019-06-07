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

In order to configure the provider use the following code samples to set up the Project. Follow the following examples to set this up in your sandbox, dapp or node server.

1. Using Injected Provider to read from the blockchain and publish transactions on the blockchain.

2. Using a Redundant Provider on node to read from the blokchain and Injected Provider to publish transactions.

3. Using a Redundant Provider on a node to read from the blockchain and publish transactions on an unlocked blockchain node.

4. Using a PrivateKeyWalletSubProvider in place of a Redundant Provider to read from the blockchain and sign transactions being published.

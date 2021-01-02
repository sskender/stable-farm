# Nonprofit decentralized autonomous organization (npo-dao)

Proof of concept for running a nonprofit type of organization on Ethereum blockchain.

### Quickstart

#### Running:

#### Contracts development:

- Run ganache: `http://localhost:8545` -> this is defined in [truffle configuration](ethereum/truffle-config.js)
- Run truffle console: `truffle console`
- In truffle console: `compile`, `test` and `migrate`
- Or use npm scripts for that:
  - `npm run solhint`
  - `npm run prettier`
  - `npm run compile`
  - `npm run test`
  - `npm run migrate`
  - `npm run console`
- Interact with contract in truffle console:
  - `npm run console`
  - ```javascript
    let instance = await DaoToken.deployed();
    let tokenAddress = instance.address;
    let accounts = await web3.eth.getAccounts();
    ```
- Interact with contract using contract ABI json and Web3 library

#### Web development:

- Change [Web3 provider URI](client/src/providers/web3.js) (default provider is ganache `http://localhost:8545`)
- Replace contract ABI json after [build](#contract-development) from [build folder](ethereum/) to [client/src/providers/abi folder](client/src/providers/abi)
- Replace contract addresses after deployment in [vue store](client/src/store/index.js)
- `cd client`
- `npm run serve`

### Sources:

#### Ethereum development:

- [Ganache](https://www.trufflesuite.com/ganache)
- [Truffle](https://www.trufflesuite.com/docs/truffle/quickstart)
- [Truffle console interact](https://www.trufflesuite.com/docs/truffle/getting-started/interacting-with-your-contracts)

#### Token:

- [ERC777](https://www.erc777.org/)
- [ERC777 Implementation](https://github.com/0xjac/ERC777)
- [ERC777 OpenZeppelin Docs](https://docs.openzeppelin.com/contracts/2.x/api/token/erc777#ERC777)
- [EIP-777: ERC777 Token Standard](https://eips.ethereum.org/EIPS/eip-777)

#### Web3:

- [Getting started](https://web3js.readthedocs.io/en/v1.2.1/getting-started.html)
- [Contract interaction](https://web3js.readthedocs.io/en/v1.2.1/web3-eth-contract.html)
- [ABI (Application Binary Interface)](https://web3js.readthedocs.io/en/v1.2.11/web3-eth-abi.html)

#### Vue.js:

- [Installation](https://cli.vuejs.org/guide/installation.html)
- [Official docs](https://vuejs.org/v2/guide/installation.html)
- [Vuex](https://vuex.vuejs.org/)

#### Inspired by:

- [Maker DAO](https://github.com/makerdao)
- [Pool balancer management](https://github.com/balancer-labs/pool-management-vue)
- [OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-contracts)
- [Chainlink](https://github.com/smartcontractkit/chainlink)
- [Proof-of-humanity](https://github.com/Proof-Of-Humanity)
- [1inch-token](https://github.com/ajsantander/1inch-token-distribution)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

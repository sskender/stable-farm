# Nonprofit decentralized autonomous organization (npo-dao)

Proof of concept for running a nonprofit organization on Ethereum blockchain.

### Quickstart

#### Running:

#### Contract development:

- Run ganache: `http://localhost:7545` -> this is defined in [truffle configuration](ethereum/truffle-config.js)
- Run truffle console: `truffle console`
- In truffle console: `compile`, `test` and `migrate`
- Or use npm scripts for that:
  - `npm run solhint`
  - `npm run prettier`
  - `npm run compile`
  - `npm run test`
  - `npm run migrate`
  - `npm run console`
- Interact with contract using ContractABI.json and Web3

#### Web development:

- Set [Web3 provider URI](client/src/providers/web3.js) (default provider is `http://localhost:7545`)
- Replace contract ABI after build from [build](ethereum/) to [client/src/providers/abi](client/src/providers/abi)
- Replace contract address after deployment in [contract provider file](client/src/providers)
- `cd client`
- `npm run serve`

### Sources:

#### Ethereum development:

- [Truffle](https://www.trufflesuite.com/docs/truffle/quickstart)
- [Ganache](https://www.trufflesuite.com/ganache)

#### Token:

- [ERC777](https://www.erc777.org/)
- [ERC777 Implementation](https://github.com/0xjac/ERC777)
- [ERC777 OpenZeppelin Docs](https://docs.openzeppelin.com/contracts/2.x/api/token/erc777#ERC777)
- [EIP-777: ERC777 Token Standard](https://eips.ethereum.org/EIPS/eip-777)

#### Web3:

- [Getting started](https://web3js.readthedocs.io/en/v1.2.1/getting-started.html)
- [Contract interaction](https://web3js.readthedocs.io/en/v1.2.1/web3-eth-contract.html)
- [ABI (Application Binary Interface)](https://web3js.readthedocs.io/en/v1.2.11/web3-eth-abi.html)

#### Vue.js

- [Installation](https://cli.vuejs.org/guide/installation.html)
- [Official docs](https://vuejs.org/v2/guide/installation.html)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

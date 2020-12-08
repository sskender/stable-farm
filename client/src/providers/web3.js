import Web3 from "web3";

const mainnet = "http://localhost:7545";
const web3 = new Web3(new Web3.providers.HttpProvider(mainnet));

export default web3;

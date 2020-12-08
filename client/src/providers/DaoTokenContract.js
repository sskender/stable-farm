import web3 from "./web3";
import DaoToken from "./abi/DaoToken.json";

const contractAddress = "0xebc303f547DB6c9f18355E247871f3563E1E86d4";
const DaoTokenContract = new web3.eth.Contract(DaoToken.abi, contractAddress);

export default DaoTokenContract;


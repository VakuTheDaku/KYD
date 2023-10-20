const contractABI = require("./Contract.json");
const YOUR_CONTRACT_ADDRESS = "0xCfB74e640d2C9A38803E64eF98A3F2F9e89f49d2";
import { ethers } from "ethers"
const getContract = (window) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    let contract = new ethers.Contract(
        YOUR_CONTRACT_ADDRESS,
        contractABI,
        signer
    );
    return contract;
};

export default getContract
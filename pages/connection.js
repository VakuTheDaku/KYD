const contractABI = require("./Contract.json");
const YOUR_CONTRACT_ADDRESS = "0xA9e71dC950A7bb6eF64314b14F23b5a79ce7F468";
import { ethers } from "ethers"
const getContract = (window) => {
    if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        let contract = new ethers.Contract(
            YOUR_CONTRACT_ADDRESS,
            contractABI,
            signer
        );
        return contract;
    }
};

export default getContract
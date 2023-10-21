const contractABI = require("./ReviewContract.json");
const YOUR_CONTRACT_ADDRESS = "0x8Beac94f77050A6827f3dA722D87D1bA2BC08ce7";
import { ethers } from "ethers"
const getReviewContract = (window) => {
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

export default getReviewContract
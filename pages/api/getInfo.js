import axios from "axios";
import { ethers } from "ethers";
let ARB_RPC = process.env.ARB_RPC;
const provider = new ethers.providers.JsonRpcProvider(ARB_RPC);
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(403).json({ success: false, message: "Unsupported Request" })
    }
    const { bet, exchange, leverage, amount } = req.body
    if (bet === undefined || bet === null || !exchange || !leverage || !amount) {
        return res.status(400).json({ success: false, message: "Missing required parameters" })
    }
    const coins = {
        "BTC": {
            address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
            decimals: 1e8
        },
        "ETH": {
            address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
            decimals: 1e18
        }
    }
    if (exchange === 'GMX') {
        try {
            const price = await axios.get("https://api.gmx.io/prices")
                .then(function (response) {
                    return { 'BTC': response.data["0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f"] / 1e30, 'ETH': response.data["0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"] / 1e30 };
                })
                .catch(function (error) {
                    console.error('Error:', error);
                    throw new Error('Couldnt fetch data')
                });

            const maxLiquidity = await axios.get("https://api.gmx.io/tokens")
                .then(function (response) {
                    // Handle successful response
                    if (bet === 1)
                        return { 'BTC': ((response.data[1].data.maxGlobalLongSize - response.data[1].data.guaranteedUsd) / 1e30), 'ETH': ((response.data[2].data.maxGlobalLongSize - response.data[2].data.guaranteedUsd) / 1e30) }
                    else
                        return { 'BTC': ((response.data[1].data.maxGlobalShortSize - response.data[1].data.globalShortSize) / 1e30), 'ETH': ((response.data[2].data.maxGlobalShortSize - response.data[2].data.globalShortSize) / 1e30) };
                })
                .catch(function (error) {
                    console.error('Error:', error);
                    throw new Error('Couldnt fetch data')
                });

            const fundingRate = await axios.get("https://api.gmx.io/tokens")
                .then(function (response) {
                    // Handle successful response
                    if (bet === 1)
                        return { 'BTC': ((response.data[1].data.fundingRate) / 1e4), 'ETH': ((response.data[2].data.fundingRate) / 1e4) }
                    else
                        return { 'BTC': ((response.data[5].data.fundingRate) / 1e4), 'ETH': ((response.data[5].data.fundingRate) / 1e4) }
                })
                .catch(function (error) {
                    console.error('Error:', error);
                    throw new Error('Couldnt fetch data')
                })


            if (bet === 1 && maxLiquidity && price && fundingRate && leverage && amount) {
                let openFees;
                let closeFees;
                let executionFee;
                let size = amount * leverage;
                let BPS_DIVIDER = 10000;

                const GMXREADER = "0x2b43c90D1B727cEe1Df34925bcd5Ace52Ec37694";
                const GMXVAULT = "0x489ee077994B6658eAfA855C308275EAd8097C4A";
                const USDC = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
                const BTC = "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f";
                const ETH = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1";
                let contract = new ethers.Contract(GMXREADER, ['function getAmountOut(address,address,address,uint256) view returns (uint256, uint256)'], provider);
                let ethtx = await contract.getAmountOut(GMXVAULT, USDC, ETH, size * 1e6 / leverage);
                let btctx = await contract.getAmountOut(GMXVAULT, USDC, BTC, size * 1e6 / leverage);
                const swapFees = { 'BTC': JSON.parse(btctx[1]) * price['BTC'] / 1e18, 'ETH': JSON.parse(ethtx[1]) * price['ETH'] / 1e18 }
                console.log('swapFees: ', swapFees);
                const amountOut = { 'BTC': JSON.parse(btctx[0]) * price['BTC'] / coins['BTC'].decimals, 'ETH': JSON.parse(ethtx[0]) * price['ETH'] / coins['ETH'].decimals }
                console.log('swap amount out: ', amountOut);

                const sizeAfterFees = { 'BTC': (amountOut['BTC'] - (amountOut['BTC'] * leverage * 10 / BPS_DIVIDER)) * leverage, 'ETH': (amountOut['ETH'] - (amountOut['ETH'] * leverage * 10 / BPS_DIVIDER)) * leverage }
                openFees = closeFees = { 'BTC': sizeAfterFees['BTC'] * 10 / BPS_DIVIDER, 'ETH': sizeAfterFees['ETH'] * 10 / BPS_DIVIDER }
                console.log('sizeAfterAllFees: $', sizeAfterFees);
                console.log('closeFees: $', closeFees);
                console.log('openFees: $', openFees);

                const GMXPOSITIONROUTER = "0xb87a436B93fFE9D75c5cFA7bAcFff96430b09868";
                contract = new ethers.Contract(GMXPOSITIONROUTER, ['function minExecutionFee() view returns (uint256)'], provider);
                let tx = await contract.minExecutionFee();
                let executionFeeInEth = (JSON.parse(tx) / 1e18) + 0.00003;
                executionFee = { 'BTC': executionFeeInEth * price['BTC'], 'ETH': executionFeeInEth * price['ETH'] }
                console.log('executionFee: $', executionFee);
                let fees = {
                    price, maxLiquidity, fundingRate, executionFee, openFees, closeFees, sizeAfterFees
                }
                return res.status(200).json({ success: true, data: fees })
            }
            else if (bet === 0 && maxLiquidity && price && fundingRate && leverage && amount) {
                let sizeAfterFees;
                let openFees;
                let closeFees;
                let swapFees = 0;
                let executionFee;

                let size = amount * leverage;
                let BPS_DIVIDER = 10000;

                sizeAfterFees = { 'BTC': ((amount) - (size * 10 / BPS_DIVIDER)) * leverage, 'ETH': ((amount) - (size * 10 / BPS_DIVIDER)) * leverage }
                openFees = closeFees = { 'BTC': sizeAfterFees['BTC'] * 10 / BPS_DIVIDER, 'ETH': sizeAfterFees['ETH'] * 10 / BPS_DIVIDER }
                console.log('sizeAfterAllFees: $', sizeAfterFees);
                console.log('closeFees: $', closeFees);
                console.log('openFees: $', openFees);

                const GMXPOSITIONROUTER = "0xb87a436B93fFE9D75c5cFA7bAcFff96430b09868";
                const contract = new ethers.Contract(GMXPOSITIONROUTER, ['function minExecutionFee() view returns (uint256)'], provider);
                const tx = await contract.minExecutionFee();
                let executionFeeInEth = (JSON.parse(tx) / 1e18) + 0.00003;
                executionFee = { 'BTC': executionFeeInEth * price['BTC'], 'ETH': executionFeeInEth * price['ETH'] };
                console.log('executionFee: $', executionFee);
                let fees = {
                    price, maxLiquidity, fundingRate, executionFee, openFees, closeFees, sizeAfterFees
                }
                return res.status(200).json({ success: true, data: fees })
            }
        }
        catch (err) {
            return res.status(400).json({ success: false, message: err.message })
        }
    }
}
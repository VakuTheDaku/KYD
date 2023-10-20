import PriceBox from "@/components/PriceBox"
import SwitchButton from "@/components/Switch"
import Switch from "@/components/Switch"
import { Tab, Tabs } from "@nextui-org/react"
import axios from "axios"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { getGMXFees } from "@/utils/getGMXData"
import FeesBox from "@/components/FeesBox"
import { EvmPriceServiceConnection } from "@pythnetwork/pyth-evm-js"

export default function Derivatives() {
    const [amount, setAmount] = useState(1000)
    const [leverage, setLeverage] = useState(10)
    const [color, setColor] = useState("success")
    const [price, setPrice] = useState()
    const [bet, setBet] = useState(1)
    const [coin, setCoin] = useState({
        name: "BTC",
        address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f"
    })
    const [maxLiquidity, setMaxLiquidity] = useState()
    const [fundingRate, setFundingRate] = useState()
    const [fees, setFees] = useState({})
    let ARB_RPC = "https://arb-mainnet.g.alchemy.com/v2/OBoyPdhJhmm0DrJTUGZzs0Urxh408Z53";
    const provider = new ethers.providers.JsonRpcProvider(ARB_RPC);
    const protocols = [{
        name: "dydx",

    },
    {
        name: "GMX"
    }]

    const coins = [{
        name: "BTC",
        address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f"
    },
    {
        name: "ETH",
        address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"
    }]
    async function getGMXFees({ bet }) {
        if (bet === 0 && coin && maxLiquidity && price && fundingRate && leverage && amount) {
            let sizeAfterFees;
            let openFees;
            let closeFees;
            let swapFees;
            let executionFee;
            let size = amount * leverage;
            let BPS_DIVIDER = 10000;

            const GMXREADER = "0x2b43c90D1B727cEe1Df34925bcd5Ace52Ec37694";
            const GMXVAULT = "0x489ee077994B6658eAfA855C308275EAd8097C4A";
            const USDC = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
            const BTC = "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f";
            const ETH = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1";
            let contract = new ethers.Contract(GMXREADER, ['function getAmountOut(address,address,address,uint256) view returns (uint256, uint256)'], provider);
            let tx = await contract.getAmountOut(GMXVAULT, USDC, coin.address, size * 1e6 / leverage);
            swapFees = JSON.parse(tx[1]) * price / 1e18;
            console.log('swapFees: ', swapFees);
            let amountOut = JSON.parse(tx[0]) * price / 1e18;
            console.log('swap amount out: ', amountOut);

            let collateralAfterSwapAndOpeningFees =
                (size * 1e6 / leverage) - (swapFees * 1e6 / BPS_DIVIDER) - (size * 1e6 * 10 / BPS_DIVIDER);
            sizeAfterFees = (collateralAfterSwapAndOpeningFees / 100) * leverage / BPS_DIVIDER;
            openFees = closeFees = sizeAfterFees * 10 / BPS_DIVIDER
            console.log('sizeAfterAllFees: $', sizeAfterFees);
            console.log('closeFees: $', closeFees);
            console.log('openFees: $', openFees);

            const GMXPOSITIONROUTER = "0xb87a436B93fFE9D75c5cFA7bAcFff96430b09868";
            contract = new ethers.Contract(GMXPOSITIONROUTER, ['function minExecutionFee() view returns (uint256)'], provider);
            tx = await contract.minExecutionFee();
            let executionFeeInEth = (JSON.parse(tx) / 1e18) + 0.00003;
            executionFee = executionFeeInEth * price;
            console.log('executionFee: $', executionFee);
            let fees = {
                'Price': price, 'Max Liquidity' : maxLiquidity, 'Funding Rate': fundingRate, 'Execution Fee': executionFee, 'Opening Fees': openFees, 'Closing Fees': closeFees, 'Size After Fees': sizeAfterFees
            }
            return fees
        }
        else if (bet === 1 && coin && maxLiquidity && price && fundingRate && leverage && amount) {
            let sizeAfterFees;
            let openFees;
            let closeFees;
            let swapFees = 0;
            let executionFee;

            let size = amount * leverage;
            let BPS_DIVIDER = 10000;

            sizeAfterFees = ((size * 1e6 / leverage) - (size * 1e6 * 10 / BPS_DIVIDER)) / BPS_DIVIDER
            openFees = closeFees = sizeAfterFees * 10 / BPS_DIVIDER
            console.log('sizeAfterAllFees: $', sizeAfterFees);
            console.log('closeFees: $', closeFees);
            console.log('openFees: $', openFees);

            const GMXPOSITIONROUTER = "0xb87a436B93fFE9D75c5cFA7bAcFff96430b09868";
            const contract = new ethers.Contract(GMXPOSITIONROUTER, ['function minExecutionFee() view returns (uint256)'], provider);
            const tx = await contract.minExecutionFee();
            let executionFeeInEth = (JSON.parse(tx) / 1e18) + 0.00003;
            executionFee = executionFeeInEth * price;
            console.log('executionFee: $', executionFee);
            let fees = {
                'Price': price, 'Max Liquidity' : maxLiquidity, 'Funding Rate': fundingRate, 'Execution Fee': executionFee, 'Opening Fees': openFees, 'Closing Fees': closeFees, 'Size After Fees': sizeAfterFees
            }
            return fees
        }
    }
    async function fixFees() {
        setFees({})
        const fees = await getGMXFees({ bet })
        setFees({ ...fees })
    }
    useEffect(() => {
        let ethPrice;
        axios.get("https://api.gmx.io/prices")
            .then(function (response) {
                // Handle successful response
                ethPrice = response.data["0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"] / 1e30
                setPrice(coin.name === "BTC" ? response.data["0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f"] / 1e30 : response.data["0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"] / 1e30);
            })
            .catch(function (error) {
                // Handle error
                console.error('Error:', error);
            });

        axios.get("https://api.gmx.io/tokens")
            .then(function (response) {
                // Handle successful response
                if (coin.name === "BTC")
                    setMaxLiquidity(bet === 1 ? ((response.data[1].data.maxGlobalLongSize - response.data[1].data.guaranteedUsd) / 1e30) : ((response.data[1].data.maxGlobalShortSize - response.data[1].data.globalShortSize) / 1e30));
                else
                    setMaxLiquidity(bet === 1 ? ((response.data[2].data.maxGlobalLongSize - response.data[2].data.guaranteedUsd) / 1e30) : ((response.data[2].data.maxGlobalShortSize - response.data[2].data.globalShortSize) / 1e30));
            })
            .catch(function (error) {
                // Handle error
                console.error('Error:', error);
            });

        axios.get("https://api.gmx.io/tokens")
            .then(function (response) {
                // Handle successful response
                if (coin.name === "BTC")
                    setFundingRate(bet === 1 ? ((response.data[1].data.fundingRate) / 1e4) : ((response.data[5].data.fundingRate) / 1e4));
                else
                    setFundingRate(bet === 1 ? ((response.data[2].data.fundingRate) / 1e4) : ((response.data[5].data.fundingRate) / 1e4));
            })
            .catch(function (error) {
                console.error('Error:', error);
                return res.status(400).json({ success: false, message: "Couldn't fetch data" })
            })

        async function cap() {
            const connection = new EvmPriceServiceConnection(
                "https://hermes-beta.pyth.network"
            ); // See Hermes endpoints section below for other endpoints

            const priceIds = [
                // You can find the ids of prices at https://pyth.network/developers/price-feed-ids#pyth-evm-testnet
                "0xf9c0172ba10dfa4d19088d94f5bf61d3b54d5bd7483a322a982e1373ee8ea31b", // BTC/USD price id in testnet
                "0xca80ba6dc32e08d06f1aa886011eed1d77c77be9eb761cc10d72b7d0a2fd57a6", // ETH/USD price id in testnet
            ];

            const priceFeeds = await connection.getLatestPriceFeeds(priceIds);
            console.log("BTC", priceFeeds[0].getPriceNoOlderThan(60)?.price / 1e8);
            console.log("ETH", priceFeeds[1].getPriceNoOlderThan(60)?.price / 1e8);

            const CAP_READER = "0x1213c30CAb1b126C5A3A0644c483a45AFde80ce7";
            let contract = new ethers.Contract(CAP_READER, ['function getCapLiquidityBTCandETH() view returns (uint256,uint256)'], provider);
            let tx = await contract.getCapLiquidityBTCandETH();
            console.log('max liq BTC: ', JSON.parse(tx[0]) / 1e6);
            console.log('max liq ETH: ', JSON.parse(tx[1]) / 1e6);

            contract = new ethers.Contract(CAP_READER, ['function getAllCapFunding(uint256) view returns (int256[] memory)'], provider);
            tx = await contract.getAllCapFunding(2);
            console.log('BTC Funding: %', -JSON.parse(tx[0]) / 1e20, "/hr");
            console.log('ETH Funding: %', -JSON.parse(tx[1]) / 1e20, "/hr");

            const MARKET_STORE = "0x328416146a3caa51BfD3f3e25C6F08784f03E276";
            contract = new ethers.Contract(MARKET_STORE, ['function get(string) view returns (string,string,address,uint256,uint256,uint256,uint256,uint256,uint256,uint256,bytes32,bool,bool)'], provider);
            tx = await contract.get("ETH-USD");// "ETH-USD";

            let leverage = 10;
            let size = 100 * leverage;
            let BPS_DIVIDER = 10000;
            console.log('opening fees: ', size * JSON.parse(tx[6]) / BPS_DIVIDER);
            console.log('max leverage: ', JSON.parse(tx[4]));
        }

        cap()

    }, [coin, bet])

    useEffect(() => {
        if (price && bet !== undefined || null) {
            fixFees()
        }
    }, [price, bet, amount, leverage])
    return (
        <div className="bg-black min-h-screen pt-2">
            <div className="flex w-full flex-col justify-center items-center gap-4">
                <Tabs fullWidth size="lg" className="w-full flex items-center justify-center px-72" variant="underlined" aria-label="Options" color={color} onSelectionChange={(selectedKey) => {
                    if (selectedKey === "Short") {
                        setBet(0)
                        setColor("danger")
                    }
                    else {
                        setBet(1)
                        setColor("success")
                    }
                }
                }>
                    <Tab
                        key="Long"
                        title={
                            <div className="flex items-center space-x-2">
                                <span>Long</span>
                            </div>
                        }
                        className="grid gap-3 w-[60%] place-items-center"
                    >
                    </Tab>
                    <Tab
                        key="Short"
                        title={
                            <div className="flex items-center space-x-2">
                                <span>Short</span>
                            </div>
                        }
                        className="grid gap-3 w-[60%] place-items-center"
                    >
                    </Tab>
                </Tabs>
                <Tabs aria-label="Options" color="primary" variant="bordered" onSelectionChange={(selectedKey) => {
                    console.log("selected", selectedKey)
                    setCoin(coins.find((coin) => coin.name === selectedKey))
                }
                }>
                    {
                        coins.map((coin) => {
                            return (
                                <Tab
                                    key={coin.name}
                                    title={
                                        <div className="flex items-center space-x-2">

                                            <span>{coin.name}</span>
                                        </div>
                                    }
                                    className="grid gap-3 w-[60%]"
                                >
                                    <div className="grid place-items-center">
                                        <PriceBox amount={amount} setAmount={setAmount} leverage={leverage} setLeverage={setLeverage} price={price} maxLiquidity={maxLiquidity} fundingRate={fundingRate} />
                                    </div>
                                    <div className="grid grid-cols-2 w-full">
                                        <div className="col-span-1 w-full">
                                            <FeesBox name={"GMX"} chain={"Arbitrum"} fees={...fees} />
                                        </div>
                                        <div className="col-span-1">

                                        </div>
                                    </div>
                                </Tab>
                            )
                        })
                    }
                </Tabs>
            </div>
        </div>
    )
}
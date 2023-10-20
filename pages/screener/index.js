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
        address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
        decimals : 1e8
    },
    {
        name: "ETH",
        address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
        decimals : 1e18
    }]
   
    async function fixFees() {
        setFees({})
        const fees = await getGMXFees({ bet })
        setFees({ ...fees })
    }
    useEffect(() => {
        let ethPrice;
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

        // cap()

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
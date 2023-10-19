import PriceBox from "@/components/PriceBox"
import SwitchButton from "@/components/Switch"
import Switch from "@/components/Switch"
import Title from "@/components/Title"
import { Tab, Tabs } from "@nextui-org/react"
import axios from "axios"
import { useEffect, useState } from "react"
import { ethers } from "ethers"

export default function Derivatives() {
    const [price, setPrice] = useState()
    const [bet, setBet] = useState(1)
    const [coin, setCoin] = useState()
    const [maxLiquidity, setMaxLiquidity] = useState()
    const [fundingRate, setFundingRate] = useState()
    let ARB_RPC = "https://arb-mainnet.g.alchemy.com/v2/OBoyPdhJhmm0DrJTUGZzs0Urxh408Z53";
    const provider = new ethers.providers.JsonRpcProvider(ARB_RPC);
    const protocols = [{
        name: "dydx",

    },
    {
        name: "GMX"
    }]

    const coins = [{
        name: "BTC"
    },
    {
        name: "ETH"
    }]
    useEffect(() => {
        let ethPrice;
        axios.get("https://api.gmx.io/prices")
            .then(function (response) {
                // Handle successful response
                ethPrice = response.data["0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"] / 1e30
                setPrice(coin === "BTC" ? response.data["0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f"] / 1e30 : response.data["0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"] / 1e30);
            })
            .catch(function (error) {
                // Handle error
                console.error('Error:', error);
            });

        axios.get("https://api.gmx.io/tokens")
            .then(function (response) {
                // Handle successful response
                if (coin === "BTC")
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
                if (coin === "BTC")
                    setFundingRate(bet === 1 ? ((response.data[1].data.fundingRate) / 1e4) : ((response.data[5].data.fundingRate) / 1e4));
                else
                    setFundingRate(bet === 1 ? ((response.data[2].data.fundingRate) / 1e4) : ((response.data[5].data.fundingRate) / 1e4));
            })
            .catch(function (error) {
                console.error('Error:', error);
                return res.status(400).json({ success: false, message: "Couldn't fetch data" })
            });
        async function getLongFees() {
            let sizeAfterFees;
            let openFees;
            let closeFees;
            let swapFees;
            let executionFee;

            let leverage = 50;
            let size = 10000 * leverage;
            let BPS_DIVIDER = 10000;

            const GMXREADER = "0x2b43c90D1B727cEe1Df34925bcd5Ace52Ec37694";
            const GMXVAULT = "0x489ee077994B6658eAfA855C308275EAd8097C4A";
            const USDC = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
            const BTC = "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f";
            const ETH = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1";
            let contract = new ethers.Contract(GMXREADER, ['function getAmountOut(address,address,address,uint256) view returns (uint256, uint256)'], provider);
            let tx = await contract.getAmountOut(GMXVAULT, USDC, ETH, size * 1e6 / leverage);
            swapFees = JSON.parse(tx[1]) * ethPrice / 1e18;
            console.log('swapFees: ', swapFees);
            let amountOut = JSON.parse(tx[0]) * ethPrice/1e18;
            console.log('swap amount out: ', amountOut);

            
            sizeAfterFees =  ((amountOut * 1e6) - (amountOut * leverage * 1e6 *  10 / BPS_DIVIDER)) * leverage /1e6

            openFees = closeFees = sizeAfterFees  *  10 / BPS_DIVIDER;

            console.log('sizeAfterAllFees: $', sizeAfterFees);
            console.log('closeFees: $', closeFees);
            console.log('openFees: $', openFees);
        }
        getLongFees()


        async function getShortFees() {
            // short fees == same for btc + eth
            let sizeAfterFees;
            let openFees;
            let closeFees;
            let swapFees = 0;
            let executionFee;

            let leverage = 10;
            let size = 1000;
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
            executionFee = executionFeeInEth * ethPrice;
            console.log('executionFee: $', executionFee);
        }

        // getShortFees()
    }, [coin, bet])

return (
    <div className="bg-black min-h-screen pt-8">
        <div className="flex w-full flex-col justify-center items-center">
            <SwitchButton />
            <Tabs aria-label="Options" color="primary" variant="bordered" onSelectionChange={(selectedKey) => {
                console.log("selected", selectedKey)
                setCoin(selectedKey)
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
                            >
                                <PriceBox name={coin.name} price={price} maxLiquidity={maxLiquidity} fundingRate={fundingRate} />
                            </Tab>
                        )
                    })
                }
            </Tabs>
        </div>
    </div>
)
}
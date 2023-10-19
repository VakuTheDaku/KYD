import PriceBox from "@/components/PriceBox"
import SwitchButton from "@/components/Switch"
import Switch from "@/components/Switch"
import Title from "@/components/Title"
import { Tab, Tabs } from "@nextui-org/react"
import axios from "axios"
import { useEffect, useState } from "react"

export default function Derivatives() {
    const [price, setPrice] = useState()
    const [bet, setBet] = useState(1)
    const [coin, setCoin] = useState()
    const [maxLiquidity, setMaxLiquidity] = useState()
    const [fundingRate, setFundingRate] = useState()
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
        axios.get("https://api.gmx.io/prices")
            .then(function (response) {
                // Handle successful response
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
            });
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
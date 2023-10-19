import PriceBox from "@/components/PriceBox"
import Title from "@/components/Title"
import { Tab, Tabs } from "@nextui-org/react"
import axios from "axios"
import { useEffect, useState } from "react"

export default function Derivatives() {
    const [btcPrice, setBtcPrice] = useState()
    const [ethPrice, setEthPrice] = useState()
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
                setBtcPrice(response.data["0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f"] / 1e30);
                setEthPrice(response.data["0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"] / 1e30);
            })
            .catch(function (error) {
                console.error('Error:', error);
            });
    }, [])
    return (
        <div className="bg-black min-h-screen pt-8">
            <div className="flex w-full flex-col justify-center items-center">
                <Tabs aria-label="Options" color="primary" variant="bordered">
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
                                    <PriceBox name={coin.name} price={coin.name === "BTC" ? btcPrice : ethPrice} />
                                </Tab>
                            )
                        })
                    }

                </Tabs>
            </div>
        </div>
    )
}
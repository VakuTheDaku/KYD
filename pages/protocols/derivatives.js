import Title from "@/components/Heading"
import { Tab, Tabs } from "@nextui-org/react"
import axios from "axios"
import { useEffect } from "react"

export default function Derivatives() {
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
        // axios.get("https://api.gmx.io/prices")
        //     .then(function (response) {
        //         // Handle successful response
        //         console.log('BTC:', (response.data["0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f"]) / 1e30);
        //         console.log('ETH:', response.data["0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"] / 1e30);
        //     })
        //     .catch(function (error) {
        //         // Handle error
        //         console.error('Error:', error);
        //         return res.status(400).json({ success: false, message: "Couldn't fetch data" })
        //     });

        axios.get("https://api.gmx.io/tokens")
            .then(function (response) {
                // Handle successful response
                console.log('BTC long max liquidity:', (response.data[1].data.maxGlobalLongSize - response.data[1].data.guaranteedUsd)/1e30);
                console.log('BTC short max liquidity:', (response.data[1].data.maxGlobalShortSize - response.data[1].data.globalShortSize)/1e30);
                
                console.log('ETH  long max liquidity:', (response.data[2].data.maxGlobalLongSize - response.data[2].data.guaranteedUsd)/1e30);
                console.log('ETH  short max liquidity:', (response.data[2].data.maxGlobalShortSize - response.data[2].data.globalShortSize)/1e30);
            })
            .catch(function (error) {
                // Handle error
                console.error('Error:', error);
                return res.status(400).json({ success: false, message: "Couldn't fetch data" })
            });
    }, [])
    return (
        <div className="bg-black min-h-screen">
            <Title/>
            <div className="flex w-full flex-col">
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
                                </Tab>
                            )
                        })
                    }

                </Tabs>
            </div>
        </div>
    )
}
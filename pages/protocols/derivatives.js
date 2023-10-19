import Title from "@/components/Title"
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
        axios.get("https://api.gmx.io/prices")
            .then(function (response) {
                // Handle successful response
                console.log('BTC:', (response.data["0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f"]) / 1e30);
                console.log('ETH:', response.data["0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"] / 1e30);
            })
            .catch(function (error) {
                // Handle error
                console.error('Error:', error);
                return res.status(400).json({ success: false, message: "Couldn't fetch data" })
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
                                    <div className="w-full nobar overflow-x-auto">
                                        {/* table header  */}
                                        <div className="w-full min-w-[25rem] mt-8 mb-4 text-xs text-white text-opacity-50 flex justify-between">
                                            <span className="min-w-[20%]">Name</span>
                                            <span className="min-w-[20%]">1d change</span>
                                            <span className="min-w-[20%]">1m change</span>
                                            <span className="min-w-[20%]">TVL</span>
                                            <span className="min-w-[20%]">Mcap/TVL</span>
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
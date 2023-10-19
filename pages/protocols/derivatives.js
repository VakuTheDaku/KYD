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
                console.log('Data:', response.data)
            })
            .catch(function (error) {
                // Handle error
                console.error('Error:', error);
                return res.status(400).json({ success: false, message: "Couldn't fetch data" })
            });
    }, [])
    return (
        <div className="bg-black min-h-screen">
            <div className="flex w-full flex-col">
                <Tabs aria-label="Options" color="primary" variant="bordered">
                    <Tab
                        key="photos"
                        title={
                            <div className="flex items-center space-x-2">

                                <span>Photos</span>
                            </div>
                        }
                    />
                </Tabs>
            </div>
        </div>
    )
}
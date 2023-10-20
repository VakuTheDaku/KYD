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
    const [trigger, setTrigger] = useState(0)
    const [amount, setAmount] = useState(1000)
    const [leverage, setLeverage] = useState(10)
    const [color, setColor] = useState("success")
    const [bet, setBet] = useState(1)
    const [fees, setFees] = useState({})
    const [coin, setCoin] = useState({
        name: "BTC",
        address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f"
    })

    const protocols = [
        {
            name: "GMX",
            link: "https://app.gmx.io/#/trade"
        },
        {
            name: 'CAP',
            link: "https://www.cap.io/trade/BTC-USD"
        },
        {
            name: 'DYDX',
            link: "https://trade.dydx.exchange/trade/BTC-USD"
        }]

    const coins = [{
        name: "BTC",
        address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
        decimals: 1e8
    },
    {
        name: "ETH",
        address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
        decimals: 1e18
    }]

    async function fixFees() {
        const data = []
        for (const protocol of protocols) {
            const result = (await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getInfo`, { bet, amount, exchange: protocol.name, leverage })).data
            data.push(result.data)
            console.log("data", data)
        }
        setFees(data)
    }

    useEffect(() => {
        if (bet !== undefined || null) {
            setFees({})
            fixFees()
        }
    }, [bet, trigger])
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
                                    className="grid gap-3 w-[80%]"
                                >
                                    <div className="grid place-items-center">
                                        <PriceBox amount={amount} setAmount={setAmount} leverage={leverage} setLeverage={setLeverage} trigger={trigger} setTrigger={setTrigger} />
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 w-full">
                                        <div className="col-span-1 w-full">
                                            <FeesBox name={"GMX"} chain={"Arbitrum"} fees={fees[0]} selectedCoin={coin.name} link={protocols.find((item)=>item.name==='GMX').link} logo={"/GMX.svg"} chainLogo={"/Arbitrum.svg"}/>

                                        </div>
                                        <div className="col-span-1">
                                            <FeesBox name={"CAP"} chain={"Arbitrum"} fees={fees[1]} selectedCoin={coin.name} link={protocols.find((item)=>item.name==='CAP').link} logo={"/Cap.jpg"} chainLogo={"/Arbitrum.svg"}/>
                                        </div>
                                        <div className="col-span-1">
                                            <FeesBox name={"DYDX"} chain={"Ethereum"} fees={fees[2]} selectedCoin={coin.name} link={protocols.find((item)=>item.name==='DYDX').link} logo={"/dydx.svg"} chainLogo={"/Ethereum.svg"}/>
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
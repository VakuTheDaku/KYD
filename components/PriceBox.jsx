import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image, Input} from "@nextui-org/react";

export default function PriceBox({ amount, setAmount, leverage, setLeverage, price, fundingRate, maxLiquidity }) {
    return (
        <Card className="max-w-[400px]">
            <CardHeader className="flex gap-3">
                <div className="">{name}</div>
            </CardHeader>
            <Divider />
            <CardBody>
                <Input
                    type="number"
                    label="Collateral"
                    placeholder={amount}
                    labelPlacement="outside"
                    onChange={(e)=>setAmount(e.target.value)}
                    startContent={
                        <div className="pointer-events-none flex items-center">
                            <span className="text-small text-primary">$</span>
                        </div>
                    }
                />
                <Input
                    type="number"
                    label="Leverage"
                    placeholder={leverage}
                    labelPlacement="outside"
                    onChange={(e)=>setLeverage(e.target.value)}
                    startContent={
                        <div className="pointer-events-none flex items-center">
                            <span className="text-small text-primary">x</span>
                        </div>
                    }
                />
                {/* <Input
                    type="text"
                    label="Funding Rate"
                    disabled
                    placeholder={fundingRate}
                    labelPlacement="outside"
                    startContent={
                        <div className="pointer-events-none flex items-center">
                            <span className="text-small text-primary">%</span>
                        </div>
                    }
                    endContent={
                        <div className="pointer-events-none flex items-center">
                            <span className="text-small">/hr</span>
                        </div>
                    }
                /> */}
            </CardBody>
        </Card>
    )
}
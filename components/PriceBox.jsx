import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image, Input} from "@nextui-org/react";

export default function PriceBox({ name, price, fundingRate, maxLiquidity }) {
    return (
        <Card className="max-w-[400px]">
            <CardHeader className="flex gap-3">
                <div className="">{name}</div>
            </CardHeader>
            <Divider />
            <CardBody>
                <Input
                    type="number"
                    label="Price"
                    disabled
                    placeholder={parseFloat(price?.toFixed(2)).toLocaleString('en-US')}
                    labelPlacement="outside"
                    startContent={
                        <div className="pointer-events-none flex items-center">
                            <span className="text-small text-primary">$</span>
                        </div>
                    }
                />
                <Input
                    type="text"
                    label="Max Liquidity"
                    disabled
                    placeholder={parseFloat(maxLiquidity?.toFixed(2)).toLocaleString('en-US')}
                    labelPlacement="outside"
                    startContent={
                        <div className="pointer-events-none flex items-center">
                            <span className="text-small text-primary">$</span>
                        </div>
                    }
                />
                <Input
                    type="text"
                    label="Funding Rate"
                    disabled
                    placeholder={fundingRate}
                    labelPlacement="outside"
                    startContent={
                        <div className="pointer-events-none flex items-center">
                            <span className="text-small text-primary">$</span>
                        </div>
                    }
                    endContent={
                        <div className="pointer-events-none flex items-center">
                            <span className="text-small">/hr</span>
                        </div>
                    }
                />
            </CardBody>
        </Card>
    )
}
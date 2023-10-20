import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image, Input, Button } from "@nextui-org/react";

export default function PriceBox({ amount, setAmount, leverage, setLeverage, trigger, setTrigger}) {
    return (
        <Card className="w-fit">
            <CardBody className="grid gap-4">
                <div className="flex gap-4">
                <Input
                    type="number"
                    label="Collateral"
                    placeholder={amount}
                    labelPlacement="outside"
                    onChange={(e) => setAmount(e.target.value)}
                    startContent={
                        <div className="pointer-events-none flex items-center">
                            <span className="text-small text-primary">$</span>
                        </div>
                    }
                />
                <Divider orientation="vertical"/>
                <Input
                    type="number"
                    label="Leverage"
                    placeholder={leverage}
                    labelPlacement="outside"
                    onChange={(e) => setLeverage(e.target.value)}
                    startContent={
                        <div className="pointer-events-none flex items-center">
                            <span className="text-small text-primary">x</span>
                        </div>
                    }
                />
                </div>
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
                <Button variant="bordered" color="primary" onClick={() => setTrigger(!trigger)}>Go</Button>
            </CardBody>
        </Card>
    )
}
import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image, Input} from "@nextui-org/react";

export default function PriceBox({ name, price }) {
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
            </CardBody>
            <Divider />
            <CardFooter>

            </CardFooter>
        </Card>
    )
}
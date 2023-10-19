import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image, Input, Button, Spinner } from "@nextui-org/react";

export default function FeesBox({ name, chain, fees }) {

    return (
        <Card className="max-w-[400px]">
            <CardHeader className="grid gap-3">
                <Input
                    type="text"
                    label="EXCHANGE"
                    placeholder={name}
                    labelPlacement="outside"
                    startContent={
                        <div className="grid place-items-center">
                            <Image src="/GMX.svg" className="w-5 h-5" alt="gmx" />
                        </div>
                    }
                />
                <Input
                    type="text"
                    label="CHAIN"
                    placeholder={chain}
                    labelPlacement="outside"
                    startContent={
                        <div className="grid place-items-center">
                            <Image src="/Arbitrum.svg" className="w-5 h-5" alt="gmx" />
                        </div>
                    }
                />
            </CardHeader>
            <Divider />
            <CardBody>
                <div className="grid">
                    {
                        Object.keys(fees).length > 0 ?
                            Object.keys(fees).map(function (key, index) {
                                let value = fees[key];
                                return (
                                    <div className={`${index % 2 === 0 ? 'bg-white bg-opacity-5' : ''} rounded-md px-2 py-2 w-full grid grid-cols-2`} key={index}>
                                        <div className="col-span-1 text-opacity-60 text-white">{key}</div>
                                        <div className="col-span-1 flex justify-end items-end">{value.toFixed(4)}</div>
                                    </div>
                                )
                            })
                            :
                            <Spinner />
                    }
                </div>

            </CardBody>
            <Divider />
            <CardFooter className="flex w-full items-center justify-center">
                <Link
                    isExternal
                    href="https://github.com/nextui-org/nextui"
                >
                    <Button color="primary" variant="bordered">
                        Go to GMX
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    )
}
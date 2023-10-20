import getContract from "@/pages/connection";
import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image, Input, Button, Spinner } from "@nextui-org/react";
import { ethers } from "ethers";
import { useRouter } from "next/router";

export default function FeesBox({ name, chain, fees, selectedCoin, link, logo, chainLogo  }) {
    const router = useRouter()
    async function writeVisitedUrl({ navigatedToUrl }) {
        if (window.ethereum) {
            window.ethereum.enable().then(async function (accounts) {
                console.log("accounts", accounts)
                const walletAddress = accounts[0];
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const adrss = await signer.getAddress()
                const messageToSign = "Please sign this message and support us before u go to the exchange."
                try {
                    const signature = await signer.signMessage(messageToSign);
                    const recoveredAddress = ethers.utils.verifyMessage(messageToSign, signature);
                    if (adrss !== recoveredAddress) {
                        throw new Error('Transaction verification failed')
                    }
                    const tx = await getContract(window).addNavigationData(navigatedToUrl, adrss, { gasLimit: 200000 });
                    await tx.wait();
                    console.log('Navigation data added successfully.');
                    router.push(link)
                } catch (error) {
                    router.push(link)
                    console.error('Error adding navigation data:', error);
                }
            }
            )
        }
    }
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
                            <Image src={logo} className="w-5 h-5" alt="logo" />
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
                            <Image src={chainLogo} className="w-5 h-5" alt="logo" />
                        </div>
                    }
                />
            </CardHeader>
            <Divider />
            <CardBody>
                <div className="grid">
                    {
                        fees && Object.keys(fees).length > 0 ?
                            Object.keys(fees).map(function (key, index) {
                                let value = fees[key][selectedCoin];
                                return (
                                    <div className={`${index % 2 === 0 ? 'bg-white bg-opacity-5' : ''} rounded-md px-2 py-2 w-full grid grid-cols-2`} key={index}>
                                        <div className="col-span-1 text-opacity-60 text-white">{key}</div>
                                        <div className="col-span-1 flex justify-end items-end gap-1">
                                            <div className="flex justify-start text-primary">{key !== 'fundingRate' ? key !== 'maxLeverage' && '$' : '%'}</div>
                                            <div className="flex justify-end items-end text-opacity-90">{value && (key === 'fundingRate' ? `${value.toFixed(4)} /hr` : value.toLocaleString('en-US', {
                                                minimumFractionDigits: 2
                                            }))}
                                            </div>
                                        </div>
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

                <Button color="primary" variant="bordered" onClick={async () => {
                    try {
                        await writeVisitedUrl({ navigatedToUrl: link })

                    }
                    catch (err) {
                        console.log(err)
                        router.push(link)
                    }
                }}>
                    Go to {name}
                </Button>

            </CardFooter>
        </Card>
    )
}
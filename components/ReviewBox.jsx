import { useRouter } from "next/router";
import { Card, CardHeader, CardBody, CardFooter, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Input, Divider } from "@nextui-org/react";
import React, { useState } from "react";
import getReviewContract from "@/pages/reviewConn";
import { ethers } from "ethers";

export default function ReviewBox() {
    const router = useRouter()
    const [selectedKey, setSelectedKey] = useState("GMX");
    const [rating, setRating] = useState(0);
    const [grevience, setGreviece] = useState()
    const handleStarClick = (newRating) => {
        setRating(newRating);
    };

    async function submitForm() {
        if (selectedKey && rating !== undefined && rating !== null && grevience) {
            if (window.ethereum) {
                window.ethereum.enable().then(async function (accounts) {
                    console.log("accounts", accounts)
                    const walletAddress = accounts[0];
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const signer = provider.getSigner();
                    const adrss = await signer.getAddress()
                    const selected = selectedKey['currentKey']
                    console.log(selected, rating, grevience)
                    try {
                        const tx = await getReviewContract(window).rateDex(selected, rating, grevience, { gasLimit: 200000 });
                        await tx.wait();
                        console.log('Grevience has been logged');
                    } catch (error) {
                        console.error('Error adding grevience', error);
                    }
                }
                )
            }
        }
    }

    return (
        <div className="w-1/4">
            <Card className="text-white w-full">
                <CardHeader className="flex items-center justify-center">
                    <div className="flex items-center justify-center">
                        <div className="text-bold text-xl ">
                            REVIEW DEXES NOW
                        </div>
                    </div>
                </CardHeader>
                <CardBody>
                    <div className="flex gap-4 items-center justify-between">
                        <div className="grid place-items-center">
                            SELECT DEX
                        </div>
                        <Dropdown className="text-white">
                            <DropdownTrigger>
                                <Button
                                    variant="bordered"
                                    className="capitalize"
                                    color="primary"
                                >
                                    <div className="text-white">{selectedKey}</div>
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu

                                variant="flat"
                                closeOnSelect={false}
                                disallowEmptySelection
                                selectionMode="single"
                                selectedKeys={selectedKey}
                                onSelectionChange={(key)=>{
                                    setSelectedKey(key)
                                }}
                            >
                                <DropdownItem key="GMX" value={"GMX"}>GMX</DropdownItem>
                                <DropdownItem key="DYDX" value={"DYDX"}>DYDX</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <div className="flex gap-4 items-center justify-between">
                        <div className="grid place-items-center">
                            RATING
                        </div>
                        <div className="star-rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={star <= rating ? 'star-filled' : 'star-empty'}
                                    onClick={() => handleStarClick(star)}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                    </div>
                    <Divider />
                    <div className="mt-10">
                        <Input
                            key="outside"
                            type="text"
                            label="Grevience"
                            labelPlacement="outside"
                            description="Mention in short words about your experience"
                            onChange={(e) => setGreviece(e.target.value)}
                        />
                    </div>
                </CardBody>
                <CardFooter className="place-content-center">
                    <Button variant="flat" color="primary" onClick={() => submitForm()}>
                        Submit
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button } from "@nextui-org/react";
import { ethers } from "ethers";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
export default function Navigationbar() {
    const router = useRouter()
    const path = router.pathname
    const NavbarItems = [{
        name: "Home",
        link: "/"
    },
    {
        name: "About",
        link: "/about"
    },
    {
        name: "Screener",
        link: "/screener"
    },
    {
        name: "News",
        link: "/news"
    },
    {
        name: "Contracts",
        link: "/contracts"
    },
    ]

    const [provider, setProvider] = useState(null);
    const [address, setAddress] = useState(null)
    const connectToMetaMask = async () => {
        if (window.ethereum) {
            try {
                const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
                await ethProvider.send('eth_requestAccounts', []);
                setProvider(ethProvider);
            } catch (error) {
                console.error(error);
            }
        } else {
            console.log('MetaMask not detected. Please install MetaMask.');
        }
    };
    console.log("/path", path)
    useEffect(() => {
        if (provider) {
            // Get the current account from the provider
            const getCurrentAccount = async () => {
                const accounts = await provider.listAccounts();
                setAddress(accounts[0] || '');
            };

            getCurrentAccount();

            // Listen for changes in the account (e.g., user switches accounts in MetaMask)
            provider.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) {
                    setAddress(accounts[0]);
                } else {
                    setAddress('');
                }
            });
        }
    }, [provider]);
    return (
        <Navbar className="bg-black" isBordered>
            <NavbarBrand>

                <div className="text-4xl text-white font-semibold text-center">
                    PERP <span className="text-[#006FEE]">SCREENER</span>
                </div>

            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4 text-white" justify="center">
                {
                    NavbarItems.map((item, index) =>
                        <NavbarItem isActive={path === item.link} key={index}>
                            <Link color="foreground" href={item.link}>
                                {item.name}
                            </Link>
                        </NavbarItem>
                    )
                }
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem>
                    <Button as={Link} color="primary" href="#" variant="flat" onClick={() => {
                        if (!provider)
                            connectToMetaMask()
                    }}>
                        {provider && address ? address.slice(0, 8) + '....' + address.slice(-3) : 'Sign in with Wallet'}
                    </Button>
                </NavbarItem>
            </NavbarContent>
        </Navbar>

    )
}
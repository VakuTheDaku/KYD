import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Button } from "@nextui-org/react";
import Link from "next/link";
export default function Navigationbar() {
    return (
        <Navbar className="bg-black" isBordered>
            <NavbarBrand>

                <div className="text-4xl text-white font-semibold text-center">
                    PERP <span className="text-[#006FEE]">SCREENER</span>
                </div>

            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4 text-white" justify="center">
                <NavbarItem>
                    <Link color="foreground" href="#">
                        Home
                    </Link>
                </NavbarItem>
                <NavbarItem isActive>
                    <Link href="#" aria-current="page">
                        About
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color="foreground" href="#">
                        Screener
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem>
                    <Button as={Link} color="primary" href="#" variant="flat">
                        Sign in with Wallet
                    </Button>
                </NavbarItem>
            </NavbarContent>
        </Navbar>

    )
}
import Navigationbar from "./Navbar";

export default function Layout({ children }) {
    return (
        <>
            <Navigationbar />
            <main>{children}</main>
        </>
    )
}
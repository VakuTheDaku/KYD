import { Titan_One } from "next/font/google";
import Title from "./Heading";
import { Children } from "react/cjs/react.production.min";

export default function Layout({ children }) {
    return (
        <>
            <Title />
            <Children />
        </>
    )
}
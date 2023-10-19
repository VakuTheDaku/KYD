import Title from "./Title";

export default function Layout({ children }) {
    return (
        <>
            <Title />
            <main>{children}</main>
        </>
    )
}
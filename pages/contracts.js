import { Code } from "@nextui-org/react"

export default function Contracts() {
    const code = `contract NavigationVerifier {
        struct NavigationData {
            address walletAddress;
            string navigatedToUrl;
        }
        mapping(address => NavigationData) public navigationHistory;
        function addNavigationData(string memory _navigatedToUrl, address sender)
            public
        {
            require(bytes(_navigatedToUrl).length > 0, "URL must not be empty");
            // Verify the signature
            require(msg.sender == sender, "Invalid signature");
            // Store the navigation data
            navigationHistory[msg.sender] = NavigationData(
                msg.sender,
                _navigatedToUrl
            );
        }
    }`
    return (
        <div className='bg-black min-h-screen'>
            <div className=" text-white font-bold pl-40 uppercase pt-10">
                Navigation Sign Contract :
            </div>
            <div className="grid place-items-center gap-1">

                {code.split('\n').map((line, index) =>
                    <Code color="primary" key={index} className="min-w-[40%]">
                        {line}
                    </Code>)}
            </div>
        </div>
    )
}
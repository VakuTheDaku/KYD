import { Code, Snippet } from "@nextui-org/react"

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
            <div className="grid place-items-center gap-2">
                <div className=" text-white font-bold uppercase pt-10">
                    Navigation Sign Contract :
                </div>
                <Snippet color="primary">

                    {code.split('\n').map((line, index) =>
                        <span key={index}>
                            {line}
                        </span>)}
                </Snippet>
            </div>
        </div>
    )
}
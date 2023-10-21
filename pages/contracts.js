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
    const reviewCode =
        `
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.0;

    contract DexRating {
        address public creator;
        mapping(address => bool) public isAdmin;

        constructor() {
            creator = msg.sender;
            isAdmin[msg.sender] = true;
        }

        modifier onlyCreator() {
            require(msg.sender == creator, "Only the creator can call this function");
            _;
        }

        modifier onlyAdmin() {
            require(isAdmin[msg.sender], "Only admin wallets can call this function");
            _;
        }

        struct Review {
            address user;
            uint8 rating; // Rating out of 5
            string grievance;
            uint256 timestamp;
        }

        struct Dex {
            string name;
            uint256 totalRatings;
            uint256 totalRatingScore;
            mapping(address => Review) userReviews;
        }

        mapping(string => Dex) public dexList;

        event NewReview(address indexed user, string indexed dexName, uint8 rating, string grievance, uint256 timestamp);

        function createAdminWallet(address _adminWallet) public onlyCreator {
            isAdmin[_adminWallet] = true;
        }

        function addDex(string memory _name) public onlyAdmin {
            require(bytes(_name).length > 0, "Dex name should not be empty");
            require(bytes(dexList[_name].name).length == 0, "DEX with this name already exists");
            dexList[_name].name = _name;
        }

        function rateDex(string memory _dexName, uint8 _rating, string memory _grievance) public {
            require(_rating >= 1 && _rating <= 5, "Rating should be between 1 and 5");
            require(bytes(_grievance).length > 0, "Grievance should not be empty");

            Dex storage userDex = dexList[_dexName];
            require(bytes(userDex.name).length > 0, "DEX not found");

            Review storage review = userDex.userReviews[msg.sender];
            require(review.timestamp == 0, "You've already reviewed this DEX");

            review.user = msg.sender;
            review.rating = _rating;
            review.grievance = _grievance;
            review.timestamp = block.timestamp;

            userDex.totalRatings += 1;
            userDex.totalRatingScore += _rating;

            emit NewReview(msg.sender, _dexName, _rating, _grievance, block.timestamp);
        }

        function getDexRating(string memory _dexName) public view returns (uint256 totalRatings, uint256 averageRating) {
            Dex storage userDex = dexList[_dexName];
            totalRatings = userDex.totalRatings;
            averageRating = totalRatings > 0 ? (userDex.totalRatingScore / totalRatings) : 0;
        }
    }
    `
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
            <div className="grid place-items-center gap-2">
                <div className=" text-white font-bold uppercase pt-10">
                    Review Dex Contract :
                </div>
                <Snippet color="primary">

                    {reviewCode.split('\n').map((line, index) =>
                        <span key={index}>
                            {line}
                        </span>)}
                </Snippet>
            </div>
        </div>
    )
}
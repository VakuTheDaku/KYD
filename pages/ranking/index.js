import { Badge, Spinner } from "@nextui-org/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import getReviewContract from "../reviewConn";
import DexTable from "@/components/DexTable";
import { toNumber } from "bignumber"
export default function Ranking() {
  const exchanges = ["GMX", "DYDX"]
  const [ranking, setRanking] = useState([])
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.enable().then(async function (accounts) {
        console.log("accounts", accounts)
        const walletAddress = accounts[0];
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const adrss = await signer.getAddress()
        try {
          const data = []
          for (const exchange of exchanges) {
            const ratings = await getReviewContract(window).getDexRating(exchange, { gasLimit: 200000 });
            const res = { name: exchange, totalRatings: ratings[0].toNumber(), averageRating: ratings[1].toNumber() }
            data.push(res)
            console.log(`Total Ratings: ${ratings[0]}`);
            console.log(`Average Rating: ${ratings[1]}`);
            console.log('Grevience has been logged');
          }
          setRanking(data)
        } catch (error) {
          console.error('Error fetching', error);
        }
      }
      )
    }
  }, [])
  return (
    <div className="bg-black pt-10 text-white grid place-items-center gap-2">
      {
        ranking ?
          <DexTable data={ranking} />
          :
          <Spinner size="lg" />
      }

      <div className="mt-2 w-1/2 place-content-baseline">
        <span className="text-danger">* </span>Disclaimer:
        This rating system is based on the customers reviews done through our smart contract.
        We will be creating a bigger and better ranking system by analysing much more data.
        We will be using AI and Blockchain too to analyse.
        We are preparing a grand ranking system.
      </div>
    </div>
  );
}

import { Accordion, AccordionItem } from "@nextui-org/react";

export default function About() {
  const aboutus = [
    {
      title: 'Our Aim',
      description: 'Our objective is to identify and rank perpetual decentralized exchanges based on a set of criteria that are crucial for traders and investors in the crypto space.'
    },
    {
      title: 'Our Financial Model',
      description: 'When visiting a link to a dex from our platform, if the user signs the transaction, we can claim a small amount of profit from the dex they visited. Next source is through Donations'
    },
    {
      title: 'Trust and Transparency',
      description: 'No one can pay our platform for promotions. Our addresses where we accept donations will be public and our smart contracts visible.'
    },
    {
      title: 'Future Plans',
      description: 'Reputation based ranking system for dexes and more ai analysis on various dexes and prices to produce the best results for our costumers'
    },
    {
      title: 'Blockchain - Avalanche',
      description: 'Avalanche is designed to be highly scalable, capable of processing thousands of transactions per second.  Avalanche aims to be a blockchain interoperability platform, meaning it can connect with various other blockchains and networks, allowing assets and data to move seamlessly across different chains. This is valuable in a multi-chain ecosystem where different blockchains serve different purposes.'
    }
  ]
  return (
    <div className="bg-black pt-10 text-white grid place-items-center ">
      <div className="w-1/2">
      <Accordion>
        {
          aboutus.map((item, index) => {
            return (
              <AccordionItem key={index} aria-label={item.title} title={item.title}>
                {item.description}
              </AccordionItem>
            )
          })
        }
      </Accordion>
      </div>
    </div>
  );
}

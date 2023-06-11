// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ethers } from 'ethers'

import RaffleABI from 'abi/raffleABI.json'

let lastUpdate = 0;
const interval = 1000 * 30;
let logs: any

type Data = any

export default async function historyHandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { address } = req.query;
  const provider = new ethers.providers.AlchemyProvider(process.env.CHAIN, process.env.ALCHEMY_API_KEY);
  const contract = new ethers.Contract(`${process.env.RAFFLE_CONTRACT_ADDRESS}`, RaffleABI, provider);

  const currentTime = (new Date()).getTime();
  if (lastUpdate + interval < currentTime) {
    logs = await contract.queryFilter(contract.filters.EntrySold(
      null,
      null,
      null,
      null
    ), -10000).catch((e) => {
      console.log(e.message);

      return []
    })

    lastUpdate = currentTime;
  }

  res.status(200).json({
    logs: logs
      .filter((log: any) => log.args.buyer.toLowerCase() === (address as string || '').toLowerCase())
      .map(({ blockNumber, transactionHash, args: { entriesCount, raffleId, price } } : any) => ({
        blockNumber,
        raffleId,
        entriesCount,
        price,
        transactionHash
      }))
  })
}

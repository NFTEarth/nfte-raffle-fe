// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ethers } from 'ethers'

import RaffleABI from 'abi/raffleABI.json'

let lastRaffleUpdate = 0;
const raffleInterval = 1000 * 10;
let entries: any

type Data = any

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { id } = req.query;
  const provider = new ethers.providers.AlchemyProvider(process.env.CHAIN, process.env.ALCHEMY_API_KEY);
  const contract = new ethers.Contract(`${process.env.RAFFLE_CONTRACT_ADDRESS}`, RaffleABI, provider);

  const currentTime = (new Date()).getTime();
  if (lastRaffleUpdate + raffleInterval < currentTime) {
    entries = await contract.getEntries(id).catch(() => [])

    lastRaffleUpdate = currentTime;
  }

  res.status(200).json({
    entries: entries?.map(([currentEntryIndex, participant]: any) => ({
      currentEntryIndex,
      participant
    })),
    total: entries[entries.length - 1]?.currentEntryIndex || -1 + 1
  })
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ethers } from 'ethers'
import RaffleABI from 'abi/raffleABI.json'

type Data = any

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { id, address } = req.query;
  const provider = new ethers.providers.AlchemyProvider(process.env.CHAIN, process.env.ALCHEMY_API_KEY);
  const contract = new ethers.Contract(`${process.env.RAFFLE_CONTRACT_ADDRESS}`, RaffleABI, provider);

  const stats = await contract.rafflesParticipantsStats(id, address)
    .then(([amountPaid, entriesCount, refunded]: any[]) => ({
      amountPaid,
      entriesCount,
      refunded
    }))
    .catch(() => ({
      amountPaid: {
        'type': 'BigNumber',
        'hex': '0x0'
      },
      entriesCount: 0,
      refunded: false
    }))

  res.status(200).json({
    stats
  })
}

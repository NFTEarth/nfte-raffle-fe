// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ethers } from 'ethers'

import RaffleABI from 'abi/raffleABI.json'

const sdk = require('api')('@reservoirprotocol/v3.0#dun2q9vlij245g9');

sdk.auth(process.env.RESERVOIR_API_KEY);
sdk.server('https://api.reservoir.tools');

const interval = 1000 * 10;
let raffle: any = {};

type Data = any

const raffleHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { id } = req.query;
  const provider = new ethers.providers.AlchemyProvider(process.env.CHAIN, process.env.ALCHEMY_API_KEY);
  const contract = new ethers.Contract(`${process.env.RAFFLE_CONTRACT_ADDRESS}`, RaffleABI, provider);

  const currentTime = (new Date()).getTime();
  if (!raffle[id as string] || raffle[id as string].lastUpdate + interval < currentTime) {
    const raffleData = await contract.raffles(id).catch(() => null)

    const prizes = await contract.getPrizes(id)
      .then((response: any) => response
        .map(([winnersCount, cumulativeWinnersCount, prizeType, prizeTier, prizeAddress, prizeId, prizeAmount] : any[]) => ({
        winnersCount,
        cumulativeWinnersCount,
        prizeType,
        prizeTier,
        prizeAddress,
        prizeId,
        prizeAmount
      })))
      .catch(() => [])
    const pricing = await contract.getPricingOptions(id)
      .then((response: any) => response
        .map(([entriesCount, price]: any[]) => ({
          entriesCount,
          price
        })))
      .catch(() => [])

    const tokensIds = prizes
      .filter((p: any) => p.prizeType === 0)
      .map((p: any) => `${p.prizeAddress}:${p.prizeId.toNumber()}`);

    const tokens = await sdk.getTokensV6({
      tokens: tokensIds,
      includeLastSale: 'true',
      accept: '*/*'
    })
      .then((response: any) => (response?.data?.tokens || []))
      .catch((err: Error) => {
        console.error(err)
        return [];
      });

    raffle[id as string] = {
      ...raffleData,
      prizes,
      tokens,
      pricing
    }

    raffle[id as string].lastUpdate = currentTime;
  }

  res.status(200).json(raffle[id as string])
}

export default raffleHandler;

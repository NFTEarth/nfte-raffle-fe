// import { constants } from 'ethers'
import { mainnet, arbitrum } from 'wagmi/chains'
import {Chain} from "@wagmi/chains"

//CONFIGURABLE: The default export controls the supported chains for the marketplace. Removing
// or adding chains will result in adding more or less chains to the marketplace.
// They are an extension of the wagmi chain objects

export interface MarketChain extends Chain {
  iconUrl: string
}

export const DefaultChain: MarketChain = {
  ...mainnet,
  iconUrl: `/images/currency/0x6c0c4816098e13cacfc7ed68da3e89d0066e8893.png`,
}

export default [
  DefaultChain,
  {
    ...arbitrum,
    iconUrl: `/images/currency/0x6c0c4816098e13cacfc7ed68da3e89d0066e8893.png`,
  }
] as MarketChain[]

import supportedChains, { DefaultChain } from 'utils/chains'
import { useContext } from 'react'
import { ChainContext } from 'context/ChainContextProvider'

export default () => {
  const { chain } = useContext(ChainContext)

  //Fallback to supported wallet chain
  const supportedChain = supportedChains.find(
    (supportedChain) => supportedChain.id === chain?.id
  )

  return supportedChain || DefaultChain
}

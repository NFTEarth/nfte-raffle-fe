import {FC, useEffect, useState} from "react";
import {Flex, Text, Box, Button, Input} from "components/primitives";
import { ethers } from "ethers";
import {useAccount, useContractWrite, useNetwork, useSwitchNetwork} from "wagmi";
import NFTERaffleAbi from "../../abi/raffleABI.json";

type EntryBoxProps = {
  index: number;
  maxPerWallet: number;
  setHash: any;
  setError: any;
  setLoading: any;
  pricing: any;
}

const EntryBox : FC<EntryBoxProps> = (props) => {
  const {
    index,
    maxPerWallet,
    pricing,
    setHash,
    setError,
    setLoading
  } = props;
  const { address } = useAccount();
  const { chain: activeChain } = useNetwork()
  const { switchNetworkAsync } = useSwitchNetwork();
  const { entriesCount = 0, price = { type: 'BigNumber', hex: '0x0' } } = pricing || {}
  const [buyAmount, setBuyAmount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(ethers.utils.parseUnits(ethers.BigNumber.from(price.hex).toString(), 'wei'));

  const { writeAsync: enterRaffles, data: raffleEntryData, isLoading, error } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: '0xcf05AE9105e39228a9Ada35eCFEF83054Ce10507',
    abi: NFTERaffleAbi,
    functionName: 'enterRaffles',
    args: [new Array(buyAmount).fill([process.env.ACTIVE_RAFFLE_ID, index])],
    overrides: {
      from: address,
      value: totalPrice,
    }
  })

  useEffect(() => {
    setError(error);
    setLoading(isLoading);
    setHash(raffleEntryData?.hash);
  }, [raffleEntryData, isLoading, error])

  const handleSetAmount = (newAmount: number) => {
    if ((newAmount * entriesCount) > maxPerWallet) {
      newAmount = maxPerWallet / entriesCount;
    }

    if (newAmount < 1) {
      newAmount = 1;
    }

    setTotalPrice(ethers.utils.parseUnits(ethers.BigNumber.from(price.hex).toString(), 'wei').mul(buyAmount))
    setBuyAmount(newAmount);
  }

  const doHandleEntry = async () => {
    if (switchNetworkAsync && activeChain?.id !== 42161) {
      const chain = await switchNetworkAsync(42161)
      if (chain.id !== 42161) {
        return false
      }
    }

    enterRaffles()
  }

  return (
    <Flex css={{ flex: 1, p: 2, borderRadius: 16, backgroundColor: '#2A3136' }}>
      <Flex css={{ flex: 1, p: 16, gap: 5, gridColumn: 'span 1 / span 1' }} direction="column" align="center">
        <Text style="h4">{entriesCount}</Text>
        <Text style="h4">ENTRIES</Text>
        <Flex css={{ gap: 10, my: 10 }}>
          <Button
            size="small"
            color="secondary"
            css={{
              minWidth: '3rem',
              justifyContent: 'center'
            }}
            onClick={() => handleSetAmount(buyAmount - 1)}
          >-</Button>
          <Input
            value={buyAmount}
            onChange={(e) => setBuyAmount(parseInt(e.target.value))}
            css={{
              width: 30,
              textAlign: 'center'
            }}
          />
          <Button
            color="secondary"
            size="small"
            css={{
              minWidth: '3rem',
              justifyContent: 'center'
            }}
            onClick={() => handleSetAmount(buyAmount + 1)}
          >+</Button>
        </Flex>
        <Button
          disabled={!address || maxPerWallet < entriesCount}
          css={{
            width: '100%',
            justifyContent: 'center'
          }}
          onClick={doHandleEntry}
        >{ethers.utils.formatEther(totalPrice)}</Button>
      </Flex>
    </Flex>
  )
};

export default EntryBox;
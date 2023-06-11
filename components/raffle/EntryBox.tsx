import {FC, useEffect, useState} from "react";
import {Flex, Text, Box, Button, Input} from "components/primitives";
import { ethers } from "ethers";
import {useAccount, useContractWrite, useNetwork, usePrepareContractWrite, useSwitchNetwork} from "wagmi";
import NFTERaffleAbi from "../../abi/raffleABI.json";

type EntryBoxProps = {
  index: number;
  maxPerWallet: number;
  pricing: any;
  handleEntry: any;
}

const EntryBox : FC<EntryBoxProps> = (props) => {
  const {
    index,
    maxPerWallet,
    pricing,
    handleEntry,
  } = props;
  const { address } = useAccount();
  const { entriesCount = 0, price = { type: 'BigNumber', hex: '0x0' } } = pricing || {}
  const [amount, setAmount] = useState(1);
  const [total, setTotal] = useState(ethers.utils.parseUnits(ethers.BigNumber.from(price.hex).toString(), 'wei'));

  const handleSetAmount = (newAmount: number) => {
    if ((newAmount * entriesCount) > maxPerWallet) {
      newAmount = Math.round(maxPerWallet / entriesCount);
    }

    if (newAmount < 1) {
      newAmount = 1;
    }

    setTotal(ethers.utils.parseUnits(ethers.BigNumber.from(price.hex).toString(), 'wei').mul(newAmount))
    setAmount(newAmount);
  }

  const doHandleEntry = async () => {
    handleEntry({
      index,
      amount,
      total
    })
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
            onClick={() => handleSetAmount(amount - 1)}
          >-</Button>
          <Input
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value))}
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
            onClick={() => handleSetAmount(amount + 1)}
          >+</Button>
        </Flex>
        <Button
          disabled={!address || maxPerWallet < entriesCount}
          css={{
            width: '100%',
            justifyContent: 'center'
          }}
          onClick={doHandleEntry}
        >{ethers.utils.formatEther(total)}</Button>
      </Flex>
    </Flex>
  )
};

export default EntryBox;
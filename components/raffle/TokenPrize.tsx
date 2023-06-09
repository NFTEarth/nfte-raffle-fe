import {Box, Flex, FormatCryptoCurrency, Text} from "../primitives";
import Image from "next/image";
import {ethers} from "ethers";

type TokenPrizeProps = {
  prizes: any
}

const TokenPrize = ({prizes} : TokenPrizeProps) => {
  const prize = prizes.find((p: any) => p.prizeTier == 2)
  const { cumulativeWinnersCount, prizeAmount } = prize || {}
  const prizeAmountWei = ethers.utils.parseUnits(ethers.BigNumber.from(prizeAmount?.hex || '0').toString(), 'wei')

  if (!prize) {
    return null;
  }

  return (
    <Box css={{ backgroundColor: 'orange', borderRadius: 20, p: 2, height: 'fit-content' }}>
      <Flex direction="row" align="center" css={{ px: 20, py: 10 }} justify="between">
        <Text style="h4">{`${cumulativeWinnersCount}x (${ethers.utils.formatEther(prizeAmountWei).replace(/\.0$/, '')}) NFTE Tokens to Be Won`}</Text>
      </Flex>
      <Box css={{ borderRadius: 20, backgroundColor: '#222', padding: 20 }}>
        <Flex direction="row" align="center" css={{ mt: '$2', gap: 30 }}>
          <Flex>
            <Image src="/nftearth-icon-new.png" width={72} height={72} alt="NFTE Token"/>
          </Flex>
          <Flex justify="between" css={{ flex: 1 }}>
            <Text style="h4">{`${ethers.utils.formatEther(prizeAmountWei).replace(/\\.0$/, '')} NFTE`}</Text>
          </Flex>
          <Flex>

          </Flex>
        </Flex>
      </Box>
    </Box>
  )
}

export default TokenPrize;
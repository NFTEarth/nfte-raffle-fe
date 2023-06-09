import React, { FC } from 'react'
import { constants } from 'ethers'
import { styled } from 'stitches.config'
import { StyledComponent } from '@stitches/react/types/styled-component'

type Props = {
  address: string
  chainId?: number
} & Parameters<StyledComponent>['0']

const StyledImg = styled('img', {})

const CryptoCurrencyIcon: FC<Props> = (
  {
    address = constants.AddressZero,
    chainId,
    css,
  }
) => {
  return (
    <StyledImg
      src={`/images/currency/${address}.png`}
      css={css}
    />
  )
}

export default CryptoCurrencyIcon

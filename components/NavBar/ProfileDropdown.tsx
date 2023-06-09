import { FC } from 'react'
import { Dropdown, DropdownMenuItem } from 'components/primitives/Dropdown'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { Avatar } from 'components/primitives/Avatar'
import { useAccount, useBalance, useDisconnect } from 'wagmi'
import {
  Box,
  Button,
  Flex,
  Text,
} from 'components/primitives'
import Link from 'next/link'
import {  faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useENSResolver } from 'hooks'
import {formatBN, formatNumber} from "utils/numbers";

export const ProfileDropdown: FC = () => {
  const { address } = useAccount()
  const { data: ethBalance } = useBalance({ chainId: 1, address })
  const { data: maticBalance } = useBalance({ chainId: 137, address })
  const { data: opBalance } = useBalance({ chainId: 10, address })
  const { data: arbBalance } = useBalance({ chainId: 42161, address })
  const { data: zkEVMBalance } = useBalance({ chainId: 1101, address })
  const { disconnect } = useDisconnect()
  const {
    name: ensName,
    avatar: ensAvatar,
    shortAddress,
    shortName: shortEnsName,
  } = useENSResolver(address)

  const trigger = (
    <Button
      css={{
        justifyContent: 'center',
      }}
      aria-label="Profile"
      corners="circle"
      type="button"
      color="gray3"
    >
      {ensAvatar ? (
        <Avatar size="medium" src={ensAvatar} />
      ) : (
        <Jazzicon diameter={44} seed={jsNumberForAddress(address as string)} />
      )}
    </Button>
  )

  const children = (
    <>
      <DropdownMenuItem>
        <Box style={{ flex: 1 }}>
          <Flex justify="between" align="center" css={{ width: '100%' }}>
            <Text style="body1">
              {shortEnsName ? shortEnsName : shortAddress}
            </Text>
          </Flex>
        </Box>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => disconnect()}>
        <Flex
          justify="between"
          align="center"
          css={{
            cursor: 'pointer',
          }}
        >
          <Text style="body1">Logout</Text>
          <Box css={{ color: '$gray10' }}>
            <FontAwesomeIcon icon={faRightFromBracket} width={16} height={16} />
          </Box>
        </Flex>
      </DropdownMenuItem>
    </>
  )

  return (
    <Dropdown
      trigger={trigger}
      children={children}
      contentProps={{ style: { width: '264px', marginTop: '8px' } }}
    />
  )
}

import { useRef } from 'react'
import {Box, Flex, Text} from '../primitives'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import { ConnectWalletButton } from 'components/ConnectWalletButton'
import NavItem from './NavItem'
import ThemeSwitcher from './ThemeSwitcher'
import HamburgerMenu from './HamburgerMenu'
import { useTheme } from 'next-themes'
import { useMediaQuery } from 'react-responsive'
import { useMounted } from '../../hooks'
import {useAccount, useBalance} from 'wagmi'
import { ProfileDropdown } from './ProfileDropdown'
import {formatBN} from "../../utils/numbers";

export const NAVBAR_HEIGHT = 81
export const NAVBAR_HEIGHT_MOBILE = 77

const Navbar = () => {
  const { theme } = useTheme()
  const { address, isConnected } = useAccount()
  const isMobile = useMediaQuery({ query: '(max-width: 960px)' })
  const isMounted = useMounted()
  const { data: balance } = useBalance({
    address,
    token: '0xb261104a83887ae92392fb5ce5899fcfe5481456'
  })

  const router = useRouter()

  if (!isMounted) {
    return null
  }

  return isMobile ? (
    <Flex
      css={{
        height: NAVBAR_HEIGHT_MOBILE,
        px: '$4',
        width: '100%',
        borderBottom: '1px solid $gray4',
        zIndex: 999,
        background: '$slate1',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
      }}
      align="center"
      justify="between"
    >
      <Box css={{ flex: 1 }}>
        <Flex align="center">
          <Link href="/">
            <Box css={{ width: 34, cursor: 'pointer' }}>
              <Image
                src="/nftearth-icon-new.png"
                width={34}
                height={34}
                alt="NFTEarth Logo"
              />
            </Box>
          </Link>
        </Flex>
      </Box>
      <Flex align="center" css={{ gap: '$3' }}>
        <HamburgerMenu key={`${router.asPath}-hamburger`} />
      </Flex>
    </Flex>
  ) : (
    <Flex
      css={{
        height: NAVBAR_HEIGHT,
        px: '$5',
        width: '100%',
        maxWidth: 1920,
        mx: 'auto',
        borderBottom: '1px solid $gray4',
        zIndex: 999,
        background:
          theme == 'dark'
            ? 'radial-gradient(circle at 24.1% 68.8%, rgb(50, 50, 50) 0%, $neutralBg 99.4%);'
            : '$neutralBg',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
      }}
      align="center"
      justify="between"
    >
      <Box css={{ flex: 1 }}>
        <Flex align="center">
          <Link href="/">
            <Box
              css={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10
              }}
            >
              <img
                src="/nftearth-icon-new.png"
                width={34}
                height={34}
                alt="NFTEarth Logo"
              />
              <Text style={"h5"}>NFTEarth Raffle</Text>
            </Box>
          </Link>
          <Box css={{ flex: 1, px: '$3', width: '100%' }}>

          </Box>
          <Flex align="center" css={{ gap: '$4', mr: '$3' }}>
            <Flex style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <img
                src={`/nftearth-icon-new.png`}
                style={{
                  height: 17,
                  width: 17
                }}
              />
              <Text>{`${formatBN(balance?.value || 0, 4, balance?.decimals)}`}</Text>
            </Flex>
          </Flex>
        </Flex>
      </Box>
      <Flex css={{ gap: '$3' }} justify="end" align="center">
        <ThemeSwitcher />
        {isConnected ? (
          <ProfileDropdown />
        ) : (
          <Box css={{ maxWidth: '185px' }}>
            <ConnectWalletButton />
          </Box>
        )}
      </Flex>
    </Flex>
  )
}

export default Navbar

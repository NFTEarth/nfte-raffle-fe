import {
  Box,
  Button,
  Flex,
  FormatCryptoCurrency,
  Text,
} from 'components/primitives'
import { Avatar } from 'components/primitives/Avatar'
import * as RadixDialog from '@radix-ui/react-dialog'
import {
  faBars,
  faXmark,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDiscord, faTwitter } from '@fortawesome/free-brands-svg-icons'
import Link from 'next/link'
import Image from 'next/image'
import { useAccount, useBalance, useDisconnect } from 'wagmi'
import { ConnectWalletButton } from 'components/ConnectWalletButton'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { FullscreenModal } from 'components/FullscreenModal'
import { useENSResolver } from 'hooks'
import ThemeSwitcher from 'components/NavBar/ThemeSwitcher'
import {formatBN, formatNumber} from "../../utils/numbers";

const HamburgerMenu = () => {
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({
    address,
    token: '0xb261104a83887ae92392fb5ce5899fcfe5481456'
  })
  const {
    avatar: ensAvatar,
    shortAddress,
    shortName: shortEnsName,
  } = useENSResolver(address)
  const { disconnect } = useDisconnect()

  const trigger = (
    <Button
      css={{ justifyContent: 'center', width: '44px', height: '44px' }}
      type="button"
      size="small"
      color="gray3"
    >
      <FontAwesomeIcon icon={faBars} width={16} height={16} />
    </Button>
  )

  return (
    <FullscreenModal trigger={trigger}>
      {' '}
      <Flex
        css={{
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        <Flex
          css={{
            py: '$space$4',
            px: '$space$4',
            width: '100%',
            borderBottom: '1px solid $gray4',
          }}
          align="center"
          justify="between"
        >
          <Link href="/">
            <Box css={{ width: 34, cursor: 'pointer' }}>
              <img
                src="/nftearth-icon.png"
                width={34}
                height={34}
                alt="NFTEarth Logo"
              />
            </Box>
          </Link>
          <RadixDialog.Close>
            <Flex
              css={{
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                alignItems: 'center',
                borderRadius: '$lg',
                backgroundColor: '$gray3',
                color: '$gray12',
                '&:hover': {
                  backgroundColor: '$gray4',
                },
              }}
            >
              <FontAwesomeIcon icon={faXmark} width={16} height={16} />
            </Flex>
          </RadixDialog.Close>
        </Flex>
        <div className="my-2 px-4">
          <ThemeSwitcher />
        </div>
        {isConnected ? (
          <Flex
            css={{
              flexDirection: 'column',
              justifyContent: 'flex-start',
              height: '100%',
              py: '$space$5',
              px: '$space$4',
            }}
          >
            <Flex
              css={{
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                pb: '$4',
              }}
            >
              <Flex css={{ alignItems: 'center' }}>
                {ensAvatar ? (
                  <Avatar size="medium" src={ensAvatar} />
                ) : (
                  <Jazzicon
                    diameter={36}
                    seed={jsNumberForAddress(address as string)}
                  />
                )}
                <Text style="subtitle1" css={{ ml: '$2' }}>
                  {shortEnsName ? shortEnsName : shortAddress}
                </Text>
              </Flex>
            </Flex>
            <Text
              as="a"
              href="/portfolio"
              style="subtitle1"
              css={{
                borderBottom: '1px solid $gray4',
                cursor: 'pointer',
                pb: '$4',
                pt: '24px',
              }}
            >
              Portfolio
            </Text>
            <Flex
              css={{
                justifyContent: 'space-between',
                cursor: 'pointer',
                alignItems: 'center',
                borderBottom: '1px solid $gray4',
              }}
              onClick={() => disconnect()}
            >
              <Text
                style="subtitle1"
                css={{
                  pb: '$4',
                  pt: '24px',
                }}
              >
                Logout
              </Text>
              <Box css={{ color: '$gray10' }}>
                <FontAwesomeIcon
                  icon={faRightFromBracket}
                  width={16}
                  height={16}
                />
              </Box>
            </Flex>
          </Flex>
        ) : (
          <Flex
            direction="column"
            justify="between"
            css={{
              height: '100%',
              pb: '$5',
              px: '$4',
            }}
          >
            <Flex direction="column">
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
            <Box>
              <ConnectWalletButton />
            </Box>
          </Flex>
        )}
        <Flex
          css={{
            pt: '24px',
            pb: '$5',
            px: '$4',
            gap: '$4',
            width: '100%',
            borderTop: '1px solid $gray4',
          }}
          align="center"
        >
          <a
            aria-label="Twitter"
            href="https://twitter.com/NFTEarth_L2"
            target="_blank"
            style={{
              marginLeft: 'auto',
            }}
          >
            <Button
              css={{ justifyContent: 'center', width: '44px', height: '44px' }}
              type="button"
              size="small"
              color="gray3"
              aria-label="Twitter"
            >
              <FontAwesomeIcon icon={faTwitter} width={20} height={20} />
            </Button>
          </a>
          <a
            aria-label="Discord"
            href="https://discord.gg/56a7u3wDkX"
            target="_blank"
            style={{
              marginRight: 'auto',
            }}
          >
            <Button
              css={{ justifyContent: 'center', width: '44px', height: '44px' }}
              type="button"
              size="small"
              color="gray3"
              aria-label="Discord"
            >
              <FontAwesomeIcon icon={faDiscord} width={20} height={20} />
            </Button>
          </a>
        </Flex>
      </Flex>
    </FullscreenModal>
  )
}

export default HamburgerMenu

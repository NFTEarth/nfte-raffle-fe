import {useEffect, useRef, useState} from "react";
import Image from 'next/image'
import { ethers } from 'ethers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faClose} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import {faTwitter} from "@fortawesome/free-brands-svg-icons";
import {
  useAccount,
  useContractWrite,
  useWaitForTransaction
} from "wagmi";
import * as Dialog from '@radix-ui/react-dialog'
import Layout from "components/Layout";
import ProgressBar from "components/ProgressBar";
import GrandPrize from "components/raffle/GrandPrize";
import NFTPrizes from "components/raffle/NFTPrizes";
import {Box, Grid, Text, Flex, Button} from 'components/primitives'
import { AnimatedOverlay, AnimatedContent } from "components/primitives/Dialog";

import useRaffle from "hooks/useRaffle";
import useRaffleEntries from "hooks/useRaffleEntries";

import NFTERaffleAbi from 'abi/raffleABI.json'
import useRaffleStats from "../hooks/useRaffleStats";
import EntryBox from "../components/raffle/EntryBox";
import TokenPrize from "../components/raffle/TokenPrize";


export default function Home() {
  const { address } = useAccount();
  const entryRef = useRef<HTMLDivElement | null>();
  const raffleData = useRaffle(process.env.ACTIVE_RAFFLE_ID as string)
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>()
  const { total = 0 } = useRaffleEntries(process.env.ACTIVE_RAFFLE_ID as string) || {}
  const {
    amountPaid = {
      'type': 'BigNumber',
      'hex': '0x0'
    },
    entriesCount = 0,
    refunded = false
  } = useRaffleStats(process.env.ACTIVE_RAFFLE_ID as string, address) || {}
  const {
    owner,
    status,
    isMinimumEntriesFixed,
    cutoffTime,
    drawnAt,
    minimumEntries = 0,
    maximumEntriesPerParticipant = 0,
    feeTokenAddress,
    protocolFeeBp,
    claimableFees,
    pricing = [],
    prizes = [],
    tokens = []
  } = raffleData || {};

  const [error, setError] = useState<any | undefined>()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { isLoading: isLoadingTransaction, isSuccess = true, data: txData } = useWaitForTransaction({
    hash: txHash,
  })

  useEffect(() => {
    setOpen(!!error || isLoading || isLoadingTransaction || isSuccess);
  }, [error, isLoading, isLoadingTransaction, isSuccess])

  const tweetText = `I just joined $NFTE #Raffle on @NFTEarth_L2!\n\n🎉 LFG #NFTE is #BetterThanBlue 🎉\n\n`


  return (
    <Layout>
      <Box
        css={{
          height: '100%',
        }}
      >
        <Box
          css={{
            p: 24,
            height: '100%',
            '@bp800': {
              p: '$6',
            },
          }}
        >
          <Flex css={{ mb: '100px', gap: 50, flex: 1 }} direction="column" align="center">
            <Flex
              direction="row"
              align="center"
              css={{
                gap: '0.5rem',
                flexWrap: 'wrap',
                textAlign: 'center'
              }}>
              <Text style="h3">{`Only `}</Text>
              <Text style="h3" css={{ color: '$primary9' }}>{minimumEntries - total}</Text>
              <Text style="h3">{` entries until the raffle starts`}</Text>
            </Flex>
            <Flex direction="column" css={{
              width: '100%',
              '@bp800': {
                width: '50%'
              }
            }}>
              <Flex justify="end">
                <Text style="body2">{`${total}/${minimumEntries}`}</Text>
              </Flex>
              <ProgressBar percentage={(total / minimumEntries) * 100} />
            </Flex>
            <Flex css={{
              flex: 1,
              gap: 20,
              flexDirection: 'column',
              '@bp800': {
                flexDirection: 'row',
              },
            }}>
              <Flex>
                <GrandPrize prizes={prizes} tokens={tokens}/>
              </Flex>
              <Flex direction="column" css={{ gap: 20, flex: 1, height: 'fit-content', minHeight: 200}}>
                <NFTPrizes prizes={prizes} tokens={tokens}/>
                <TokenPrize prizes={prizes}/>
              </Flex>
            </Flex>
          </Flex>
          <Flex align="center" css={{ flex: 1, gap: 20  }} direction="column">
            <Flex css={{ flex: 1, textAlign: 'center' }} justify="center" direction="column">
              <Text style="h3">Feeling lucky?</Text>
            </Flex>
            <Flex css={{ flex: 1, textAlign: 'center' }} justify="center">
              <Button onClick={() => {
                entryRef.current?.scrollIntoView()
              }}>Enter Now</Button>
            </Flex>
            <Flex
              direction="row"
              align="center"
              css={{
                mt: '$6',
                gap: '0.5rem',
                flexWrap: 'wrap',
                textAlign: 'center'
              }}>
              <Text style="h5">{`You can buy up to `}</Text>
              <Text style="h5" css={{ color: '$primary9' }}>{maximumEntriesPerParticipant - entriesCount}</Text>
              <Text style="h5">{` entries until the raffle starts`}</Text>
            </Flex>
            <Flex direction="column" css={{
              width: '100%',
              '@bp800': {
                width: '50%'
              }
            }}>
              <Flex justify="end">
                <Text style="body2">{`${entriesCount}/${maximumEntriesPerParticipant}`}</Text>
              </Flex>
              <ProgressBar percentage={(entriesCount / maximumEntriesPerParticipant) * 100} />
            </Flex>
          </Flex>
          <Flex ref={r => entryRef.current = r} align="center" justify="center" css={{ flex: 1 }}>
            <Grid
              css={{
                flex: 1,
                maxWidth: 580,
                mt: 50,
                gap: 10,
                gridTemplateColumns: 'repeat(2, 1fr)'
              }}
            >
              {pricing.map((price: any, i: number) => (
                <EntryBox
                  key={`raffle-entry-${i}`}
                  index={i}
                  setError={setError}
                  setHash={setTxHash}
                  setLoading={setIsLoading}
                  maxPerWallet={maximumEntriesPerParticipant - entriesCount}
                  pricing={price}
                />
              ))}
            </Grid>
          </Flex>
        </Box>
      </Box>
      <Dialog.Root modal={true} open={open}>
        <Dialog.Portal>
          <AnimatedOverlay
            style={{
              position: 'fixed',
              zIndex: 1000,
              inset: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: '20px',
            }}
          />
          <AnimatedContent style={{
            outline: 'unset',
            position: 'fixed',
            zIndex: 1000,
            transform: 'translate(-50%, 120%)',
          }}>
            <Flex
              justify="between"
              css={{
                pt: '$5',
                background: '$gray7',
                padding: '$5',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '20px',
                '@bp600': {
                  flexDirection: 'column',
                  gap: '20px',
                },
              }}
            >
              {!!error && (
                <Dialog.Close asChild>
                  <button
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 15
                    }}
                    onClick={() => setOpen(!open)}
                    className="IconButton"
                    aria-label="Close"
                  >
                    <FontAwesomeIcon icon={faClose} size="xl" />
                  </button>
                </Dialog.Close>
              )}
              {isLoading && (
                <Text style="h6">Please confirm in your wallet</Text>
              )}
              {isLoadingTransaction && (
                <Text style="h6">Processing your entry...</Text>
              )}
              {!!error && (
                <Text style="h6" css={{ color: 'red' }}>{(error as any)?.reason || error?.data?.message || error?.message}</Text>
              )}
              {isSuccess && (
                <>
                  <Text style="h6" css={{ color: 'green' }}>Raffle Entry Success !</Text>
                  <Link
                    rel="noreferrer noopener"
                    target="_blank"
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(`https://nftearth.exchange/claim`)}&hashtags=&via=&related=&original_referer=${encodeURIComponent('https://nftearth.exchange')}`}>
                    <Button>
                      {`Tweet your airdrop win!`}
                      <FontAwesomeIcon style={{ marginLeft: 5 }} icon={faTwitter}/>
                    </Button>
                  </Link>
                </>
              )}
            </Flex>
          </AnimatedContent>
        </Dialog.Portal>
      </Dialog.Root>
    </Layout>
  )
}

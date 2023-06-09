import { Inter } from '@next/font/google'
import type { AppContext, AppProps } from 'next/app'
import { default as NextApp } from 'next/app'
import { ThemeProvider, useTheme } from 'next-themes'
import { darkTheme, globalReset } from 'stitches.config'
import { ConnectKitProvider, getDefaultClient } from 'connectkit'
import { WagmiConfig, createClient, configureChains } from 'wagmi'
import * as Tooltip from '@radix-ui/react-tooltip'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { FC } from 'react'
import ToastContextProvider from 'context/ToastContextProvider'
import supportedChains from 'utils/chains'
import ChainContextProvider from 'context/ChainContextProvider'
import Head from "next/head";

//CONFIGURABLE: Use nextjs to load your own custom font: https://nextjs.org/docs/basic-features/font-optimization
const inter = Inter({
  subsets: ['latin'],
})

const { chains, provider } = configureChains(supportedChains, [
  alchemyProvider({
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_OPTIMISM_ID as string,
    priority: 0
  }),
  publicProvider({
    priority: 1
  }),
], {
  stallTimeout: 10_000
})

const { connectors } = getDefaultClient({
  appName: 'NFTEarth Exchange',
  appIcon: 'https://nftearth.exchange/nftearth-icon-new.png',
  walletConnectOptions: {
    projectId: '5dd18f61f54044c53f0e1ea9d1829b08',
    version: "2"
  },
  stallTimeout: 10_000,
  chains,
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors: connectors,
  provider,
})

//CONFIGURABLE: Here you can override any of the theme tokens provided by RK: https://docs.reservoir.tools/docs/reservoir-kit-theming-and-customization
const reservoirKitThemeOverrides = {
  headlineFont: inter.style.fontFamily,
  font: inter.style.fontFamily,
  buttonTextColor: '#000',
  buttonTextHoverColor: '#000',
  primaryColor: '#4B7C5F',
  primaryHoverColor: '#7AFFA9',
}

function AppWrapper(props: AppProps & { baseUrl: string }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      value={{
        dark: darkTheme.className,
        light: 'light',
      }}
    >
      <WagmiConfig client={wagmiClient}>
        <ChainContextProvider>
          <MyApp {...props} />
        </ChainContextProvider>
      </WagmiConfig>
    </ThemeProvider>
  )
}

function MyApp({
                 Component,
                 pageProps,
               }: AppProps & { baseUrl: string }) {
  globalReset()

  const { theme } = useTheme()

  const FunctionalComponent = Component as FC

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>NFTEarth</title>
      </Head>
      <Tooltip.Provider>
        <ConnectKitProvider
          mode={theme == 'dark' ? 'dark' : 'light'}
          options={{ initialChainId: 0 }}
        >
          <ToastContextProvider>
            <FunctionalComponent {...pageProps} />
          </ToastContextProvider>
        </ConnectKitProvider>
      </Tooltip.Provider>
    </>
  )
}

AppWrapper.getInitialProps = async (appContext: AppContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await NextApp.getInitialProps(appContext)

  return { ...appProps }
}

export default AppWrapper

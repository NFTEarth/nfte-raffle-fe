import { Box } from 'components/primitives'
import { FC, ReactNode } from 'react'
import Navbar from './NavBar'
import { useTheme } from 'next-themes'

type Props = {
  children: ReactNode
}

const Layout: FC<Props> = ({ children }) => {
  const { theme } = useTheme()

  return (
    <>
      <Box
        css={{
          background:
            theme == 'light'
              ? 'radial-gradient(circle at 24.1% 68.8%, rgb(220, 220, 220) 0%, $neutralBg 95.4%);'
              : '$neutralBg',
          height: '100%',
          minHeight: '100vh',
          pt: 80,
        }}
      >
        <Box css={{ maxWidth: 1920, mx: 'auto' }}>
          <Navbar />
          <main>{children}</main>
        </Box>
      </Box>
    </>
  )
}

export default Layout

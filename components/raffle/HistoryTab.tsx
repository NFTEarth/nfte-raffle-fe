import {FC} from "react";
import { Flex,Text, TableCell, TableRow, HeaderRow, FormatCryptoCurrency} from "components/primitives";
import {useTheme} from "next-themes";
import {useMediaQuery} from "react-responsive";

const desktopTemplateColumns = '1fr repeat(3, .5fr)'
const mobileTemplateColumns = '1fr repeat(2, .5fr)'

const HistoryTab = (props: any) => {
  const { entries = [], isValidating } = props;
  return (
    <Flex css={{ my: 20 }}>
      <Flex
        direction="column"
        css={{ width: '100%', maxHeight: 300, overflowY: 'auto', pb: '$2' }}
      >
        <TableHeading />
        {entries.map((entry: any, i: number) => {
          return (
            <ListingTableRow
              key={`entry-${i}`}
              entry={entry}
            />
          )
        })}
      </Flex>
      {isValidating && (
        <Flex align="center" justify="center" css={{ py: '$5' }}>
          Loading...
        </Flex>
      )}
    </Flex>
  )
};

type ListingTableRowProps = {
  entry: any
}

const ListingTableRow: FC<ListingTableRowProps> = ({
                                                     entry
                                                   }) => {
  const isSmallDevice = useMediaQuery({ maxWidth: 900 })
  const { theme } = useTheme()

  return (
    <TableRow
      key={entry}
      css={{
        gridTemplateColumns: isSmallDevice ? mobileTemplateColumns : desktopTemplateColumns,
        borderBottomColor: theme === 'light'
          ? '$primary11'
          : '$primary6',
      }}
    >
      <TableCell css={{ pl: '$2', py: '$3' }}>
        <FormatCryptoCurrency
          amount={entry?.price?.amount?.native}
          logoHeight={14}
          textStyle={'subtitle2'}
          maximumFractionDigits={4}
        />
      </TableCell>
      {!isSmallDevice && (
        <TableCell css={{ pl: '$2', py: '$3' }}>
          <Text style="subtitle2">
            {entry?.quantityRemaining}
          </Text>
        </TableCell>
      )}
      <TableCell css={{ pl: '$2', py: '$3' }}>
        <Text style="subtitle2"></Text>
      </TableCell>
      <TableCell css={{ pl: '$2', py: '$3' }}>
        <Text style="subtitle2"></Text>
      </TableCell>
      <TableCell css={{ pl: '$2', py: '$3' }}>
        <Flex align="center" justify="end">

        </Flex>
      </TableCell>
    </TableRow>
  )
}


const TableHeading = () => {
  const { theme } = useTheme()
  const isSmallDevice = useMediaQuery({ maxWidth: 900 })
  const headings = isSmallDevice ? ['Raffle No.', 'Result', 'Date'] : ['Raffle No.', 'Total Entries Bought', 'Result', 'Date']
  return (
    <HeaderRow
      css={{
        display: 'grid',
        gridTemplateColumns: isSmallDevice ? mobileTemplateColumns : desktopTemplateColumns,
        position: 'sticky',
        top: 0,
        backgroundColor: theme === 'light'
          ? '$primary10'
          : '$primary5',
      }}
    >
      {headings.map((heading) => (
        <TableCell
          key={heading}
          css={{ pl: '$2', py: '$1', border: '1px solid $primary2' }}
        >
          <Text as={'div'} style="subtitle3">
            {heading}
          </Text>
        </TableCell>
      ))}
    </HeaderRow>
  )
}


export default HistoryTab;
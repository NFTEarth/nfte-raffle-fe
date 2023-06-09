import useSWR from 'swr'

const fetcher = (url: string) =>
  fetch(url)
    .then((r) => r.json())

function useRaffleEntries(id: string) {
  const {data, error} = useSWR(`/api/raffle/entries?id=${id}`, fetcher)

  return error ? null : data;
}

export default useRaffleEntries;

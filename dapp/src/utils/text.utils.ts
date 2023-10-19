export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
}

export const formatIpfsLink = (url: string) => {
  if (url?.startsWith('ipfs://')) return url?.replace('ipfs://', 'https://ipfs.io/ipfs/')
  return url
}

export const formatAddress = (address: string) => {
  return `${address?.slice(0, 6)}...${address?.slice(-4)}`
}
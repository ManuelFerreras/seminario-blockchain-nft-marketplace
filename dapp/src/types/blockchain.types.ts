export type addressType = `0x${string}`

export type Listing = {
  price: number
  seller: string
  tokenAddress: string
  tokenId: number
}
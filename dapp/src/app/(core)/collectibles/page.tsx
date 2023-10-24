"use client";
import styles from './page.module.css'

import { useAccount, useContractReads } from 'wagmi'
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import useMarketplace from '@/hooks/useMarketplace';
import ListingCard from '@/components/ListingCard/ListingCard';
import { Listing, addressType } from '@/types/blockchain.types';
import Header from '@/components/Header/Header';
import { nftsAbi } from '@/constants/abis.constants';

export default function Collectibles() {
  const [nfts, setNfts] = useState<any>()
  const [nftListings, setNftListings] = useState<any>()
  const { getNftsBalance, getNftsData } = useMarketplace()
  const { data } = getNftsBalance()
  const { address, isConnecting, isReconnecting } = useAccount()

  const { data: nftsData } = getNftsData(nfts)

  const formatContractRead = (id: number) => {
    const nftContract = {
      address: process.env.NEXT_PUBLIC_NFTS_ADDRESS,
      abi: nftsAbi,
    }

    return {
      ...nftContract,
      functionName: 'tokenOfOwnerByIndex',
      args: [address, id]
    }
  }

  useEffect(() => {
    if (!data) return
    const contractReads = []

    const nftsBalance = Number(BigInt(data as string).toString())
    for (let i = 0; i < nftsBalance; i++) {
      contractReads.push(formatContractRead(i))
    }

    setNfts({
      contracts: contractReads
    })
  }, [data])

  useEffect(() => {
    const Listings: Listing[] = []

    nftsData?.forEach((nft: any) => {
      console.debug(nft)
      if (nft.status !== 'success') return

      const listing = {
        price: 0,
        seller: address as addressType,
        tokenId: Number(BigInt(nft?.result as string).toString()),
        tokenAddress: process.env.NEXT_PUBLIC_NFTS_ADDRESS as addressType
      }
      Listings.push(listing)
    })

    setNftListings(Listings)
  }, [nftsData])

  useEffect(() => {
    console.debug(nftListings)
  }, [nftListings])

  useEffect(() => {
    if (!address && !isConnecting && !isReconnecting) {
      redirect('/connect')
    }
  }, [address, isConnecting, isReconnecting])

  return (
    <>
      <Header />

      <main className={styles.main}>
        <div className={styles.listingsTable}>
          {
            Array.isArray(nftListings) && nftListings.map((listing: Listing, index: number) => <ListingCard listing={listing} key={index} />)
          }
        </div>
      </main>
    </>
  )
}

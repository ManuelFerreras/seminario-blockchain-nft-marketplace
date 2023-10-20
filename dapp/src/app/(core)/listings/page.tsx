"use client";
import styles from './page.module.css'

import { useAccount } from 'wagmi'
import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import useMarketplace from '@/hooks/useMarketplace';
import ListingCard from '@/components/ListingCard/ListingCard';
import { Listing } from '@/types/blockchain.types';
import Header from '@/components/Header/Header';

export default function Listings() {
  const { getMarkeplaceListings } = useMarketplace()
  const { data } = getMarkeplaceListings()
  const { address, isConnecting, isReconnecting } = useAccount()


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
            Array.isArray(data) && data.map((listing: Listing, index: number) => <ListingCard listed={true} listing={listing} key={index} />)
          }
        </div>
      </main>
    </>
  )
}

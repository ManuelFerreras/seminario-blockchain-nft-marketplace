"use client";
import Image from 'next/image'
import styles from './page.module.css'

import { sepolia, useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

import connectImage from '../../../../public/connectImg.png'
import metamaskImage from '../../../../public/metamask.png'
import { useEffect } from 'react';
import { redirect } from 'next/navigation';

export default function Home() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
    chainId: sepolia.id
  })

  const tryConnection = async () => {
    if (!isConnected) {
      connect()
    }
  }

  useEffect(() => {
    if (address) {
      redirect('/listings')
    }
  }, [address])

  return (
    <main className={styles.main}>
      <div className={styles.left}>
        <Image src={connectImage} width={500} height={500} alt='Nft' className={styles.connectImg} />
      </div>

      <div className={styles.right}>
        <h1 className={styles.title}>NFTs Marketplace</h1>
        <h2 className={styles.subtitle}>Welcome!</h2>
        <h2 className={styles.legend}>Buy and Sell NFTs by Connecting with your Wallet</h2>
        <button onClick={() => tryConnection()} className={styles.connectButton}><div className={styles.buttonIconContainer}><Image src={metamaskImage} width={24} height={24} alt='Nft' className={styles.metamaskImg} /></div> Connect your Wallet</button>
      </div>
    </main>
  )
}

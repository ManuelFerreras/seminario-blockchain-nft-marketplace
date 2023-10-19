import Image from 'next/image';
import React from 'react';
import styles from './UserCard.module.css';
import { chainToNetwork } from '@/constants/blockchain.constants';
import { copyToClipboard, formatAddress } from '@/utils/text.utils';
import { useAccount, useDisconnect, useNetwork } from 'wagmi';

import metamaskIcon from '@/assets/img/metamask.png'
import copyIcon from '@/assets/img/copyIcon.svg'
import turnOffIcon from '@/assets/img/turnOffIcon.svg'
import { addressType } from '@/types/blockchain.types';

const UserCard = () => {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const { disconnect } = useDisconnect()

  return (
    <div className={styles.userCard}>
      <div className={styles.userCardLeft}>
        <Image src={metamaskIcon} width={40} height={40} alt='Metamask' className={styles.metamaskIcon} />

        <div>
          <p className={styles.chainLegend}>{chainToNetwork[chain?.id ?? 1]} <div className={styles.connectedDot} /></p>
          <p className={styles.addressLegend}>{formatAddress(address as addressType)}</p>
        </div>
      </div>

      <div className={styles.userCardRight}>
        <button onClick={() => copyToClipboard(address ?? '')} className={`${styles.userCardButton} ${styles.userCardButtonCopy}`}><Image src={copyIcon} width={16} height={16} alt='Icon' /></button>

        <button onClick={() => disconnect()} className={styles.userCardButton}><Image src={turnOffIcon} width={16} height={16} alt='Icon' /></button>
      </div>
    </div>
  )
};

export default UserCard;

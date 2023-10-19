import React, { useEffect, useState } from 'react';
import styles from './ListingCard.module.css';
import useMarketplace from '@/hooks/useMarketplace';
import Image from 'next/image';
import notFound from '@/assets/img/notFound.svg'
import copyIcon from '@/assets/img/copy.svg'
import { copyToClipboard, formatAddress, formatIpfsLink } from '@/utils/text.utils';
import { ListingCardProps } from '@/interfaces/blockchain.interfaces';
import { addressType } from '@/types/blockchain.types';

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const { getNftMetadata } = useMarketplace()
  const { data } = getNftMetadata(listing.tokenAddress as addressType, listing.tokenId)
  const [metadata, setMetadata] = useState<any>(null)

  useEffect(() => {
    if (typeof data !== 'string') return
    let metadataUrl = formatIpfsLink(data)

    const fetchMetadata = async (url: string) => {
      const res = await fetch(url)
      const json = await res.json()
      setMetadata(json)
    }

    fetchMetadata(metadataUrl)
  }, [data])

  return (
    <div className={styles.card}>
      <button title='Copy Contract Address' onClick={() => copyToClipboard(listing?.tokenAddress)} className={styles.copyContractButton}><Image src={copyIcon} alt='copy' width={24} height={24} /></button>
      <Image src={formatIpfsLink(metadata?.image) ?? notFound} alt={'NFT'} width={248} height={248} className={styles.nftImage} />
      
      <p className={styles.nftName}>{metadata?.name} #{BigInt(listing.tokenId).toString()}</p>

      <div className={styles.cardData}>
        <div className={styles.dataColumn}>
          <p className={styles.dataTitle}>Seller</p>
          <p className={styles.dataValue}>{formatAddress(listing.seller)}</p>
        </div>

        <div className={styles.dataColumn}>
          <p className={styles.dataTitle}>Price</p>
          <p className={styles.dataValue}>{BigInt(listing.price).toString()}</p>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;

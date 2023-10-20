
import { Listing, addressType } from '@/types/blockchain.types';
import { useAccount, useWaitForTransaction } from 'wagmi';
import styles from './ListingActionButtons.module.css';
import useMarketplace from '@/hooks/useMarketplace';
import { useEffect, useState } from 'react';

type Props = {
  listing: Listing;
  listed: boolean;
};

const ListingActionButtons = ({ listing, listed }: Props) => {
  const [approved, setApproved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buyingNft, setBuyingNft] = useState(false);
  const { address } = useAccount();
  const { cancelNft, buyNft, updateNft, approveNft, approveToken, listNft } = useMarketplace();

  const cancelNftInteraction = cancelNft(listing);
  const buyNftInteraction = buyNft(listing);
  const updateNftInteraction = updateNft();
  const approveNftInteraction = approveNft(listing?.tokenAddress as addressType);
  const approveTokenInteraction = approveToken();
  const listNftInteraction = listNft();

  const cancelNftClick = () => {
    cancelNftInteraction.write();
  }

  const approveTokenClick = async () => {
    setBuyingNft(true);
    await approveTokenInteraction.writeAsync({
      args: [process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS, listing.price],
    });
  }

  const buyNftClick = async () => {
    await buyNftInteraction.writeAsync({
      args: [listing.tokenAddress, listing.tokenId]
    });
  }

  const approveNftClick = async () => {
    setBuyingNft(true);
    await approveNftInteraction.writeAsync({
      args: [process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS, listing.tokenId],
    });
  }

  const listNftClick = async () => {
    setBuyingNft(true);
    const price = askPriceByAlert();

    await listNftInteraction.writeAsync({
      args: [listing.tokenAddress, listing.tokenId, price]
    });
  }

  const updateNftClick = async () => {
    const price = askPriceByAlert();

    await updateNftInteraction.writeAsync({
      args: [listing.tokenAddress, listing.tokenId, price]
    });
  }

  const askPriceByAlert = () => {
    const askPrice = prompt('Enter ask price');
    return askPrice ?? 0;
  }

  useEffect(() => {
    if (updateNftInteraction.waitTransaction.isSuccess && buyingNft) {
      setApproved(false);
      setBuyingNft(false);
    } else if (updateNftInteraction.waitTransaction.isError) {
      setBuyingNft(false);
      setApproved(false);
    }
  }, [updateNftInteraction.waitTransaction.isSuccess, updateNftInteraction.waitTransaction.isError]);

  useEffect(() => {
    if (listNftInteraction.waitTransaction.isSuccess && buyingNft) {
      setApproved(false);
      setBuyingNft(false);
    } else if (listNftInteraction.waitTransaction.isError) {
      setBuyingNft(false);
      setApproved(false);
    }
  }, [listNftInteraction.waitTransaction.isSuccess, listNftInteraction.waitTransaction.isError]);

  useEffect(() => {
    if (approveNftInteraction.waitTransaction.isSuccess && !approved) {
      setApproved(true);
      listNftClick();
    } else if (approveNftInteraction.waitTransaction.isError) {
      setBuyingNft(false);
      setApproved(false);
    }
  }, [approveNftInteraction.waitTransaction.isSuccess, approveNftInteraction.waitTransaction.isError]);

  useEffect(() => {
    if (buyNftInteraction.waitTransaction.isSuccess && buyingNft) {
      setApproved(false);
      setBuyingNft(false);
    } else if (buyNftInteraction.waitTransaction.isError) {
      setBuyingNft(false);
      setApproved(false);
    }
  }, [buyNftInteraction.waitTransaction.isSuccess, buyNftInteraction.waitTransaction.isError]);

  useEffect(() => {
    if (approveTokenInteraction.waitTransaction.isSuccess && !approved) {
      setApproved(true);
      buyNftClick();
    } else if (approveTokenInteraction.waitTransaction.isError) {
      setBuyingNft(false);
      setApproved(false);
    }
  }, [approveTokenInteraction.waitTransaction.isSuccess, approveTokenInteraction.waitTransaction.isError]);

  useEffect(() => {
    setLoading(cancelNftInteraction.isLoading || buyNftInteraction.isLoading || updateNftInteraction.isLoading || approveNftInteraction.isLoading || approveTokenInteraction.isLoading || buyingNft);
  }, [cancelNftInteraction.isLoading, buyNftInteraction.isLoading, updateNftInteraction.isLoading, approveNftInteraction.isLoading, approveTokenInteraction.isLoading, buyingNft]);

  if (listing.seller === address) {
    if (!listed || listing?.price <= 0) {
      return <button onClick={() => approveNftClick()} disabled={loading} className={`${styles.actionButton} ${styles.listButton} ${loading ? styles.loadingButton : ''}`}>List</button>;
    } else {
      return (
        <div className={styles.actionButtonsContainer}>
          <button disabled={loading} className={`${styles.actionButton} ${styles.updateListingButton} ${loading ? styles.loadingButton : ''}`} onClick={() => updateNftClick()}>Update Listing</button>
          <button disabled={loading} className={`${styles.actionButton} ${styles.cancelListingButton} ${loading ? styles.loadingButton : ''}`} onClick={() => cancelNftClick()}>Cancel Listing</button>
        </div>
      );
    }
  } else {
    return <button onClick={() => approveTokenClick()} disabled={loading} className={`${styles.actionButton} ${styles.buyListingButton} ${loading ? styles.loadingButton : ''}`}>Buy</button>;
  }
};

export default ListingActionButtons;

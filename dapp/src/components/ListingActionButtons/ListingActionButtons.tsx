
import { Listing } from '@/types/blockchain.types';
import { useAccount } from 'wagmi';
import styles from './ListingActionButtons.module.css';

type Props = {
  listing: Listing;
  listed: boolean;
};

const ListingActionButtons = ({ listing, listed }: Props) => {
  const { address } = useAccount();

  if (listing.seller === address) {
    if (!listed) {
      return <button className={`${styles.actionButton} ${styles.listButton}`}>List</button>;
    } else {
      return (
        <div className={styles.actionButtonsContainer}>
          <button className={`${styles.actionButton} ${styles.updateListingButton}`}>Update Listing</button>
          <button className={`${styles.actionButton} ${styles.cancelListingButton}`}>Cancel Listing</button>
        </div>
      );
    }
  } else {
    return <button className={`${styles.actionButton} ${styles.buyListingButton}`}>Buy</button>;
  }
};

export default ListingActionButtons;

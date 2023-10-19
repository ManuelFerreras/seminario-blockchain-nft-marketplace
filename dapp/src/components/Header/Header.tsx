import { redirect } from 'next/navigation';
import React from 'react';
import styles from './Header.module.css';
import UserCard from '../UserCard/UserCard';

const Header: React.FC = () => {
  const redirectTo = (path: string) => {
    console.debug(path)
    redirect(path); 
  }

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <h1 className={styles.headerLogo}>NFT Marketplace</h1>
      </div>

      <nav className={styles.headerNav}>
        <a className={styles.headerLink} onClick={() => redirectTo('/listings')}>Listings</a>
        <a className={styles.headerLink} onClick={() => redirectTo('/collectibles')}>Collectibles</a>
      </nav>

      <UserCard />
    </header>
  );
};

export default Header;

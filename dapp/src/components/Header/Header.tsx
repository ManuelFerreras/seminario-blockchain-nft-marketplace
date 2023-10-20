import React from 'react';
import styles from './Header.module.css';
import UserCard from '../UserCard/UserCard';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <h1 className={styles.headerLogo}>NFT Marketplace</h1>
      </div>

      <nav className={styles.headerNav}>
        <Link className={styles.headerLink} href={'/listings'}>Listings</Link>
        <Link className={styles.headerLink} href={'/collectibles'}>Collectibles</Link>
      </nav>

      <UserCard />
    </header>
  );
};

export default Header;

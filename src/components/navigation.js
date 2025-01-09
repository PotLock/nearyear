import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useContext } from 'react';

import { NearContext } from '@/wallets/near';
import NearLogo from '/public/near-logo.svg';

export const Navigation = () => {
  const { signedAccountId, wallet } = useContext(NearContext);
  const [action, setAction] = useState(() => { });
  const [label, setLabel] = useState('Loading...');

  useEffect(() => {
    if (!wallet) return;

    if (signedAccountId) {
      setAction(() => wallet.signOut);
      setLabel(`Disconnect ${signedAccountId}`);
    } else {
      setAction(() => wallet.signIn);
      setLabel('Connect wallet');
    }
  }, [signedAccountId, wallet]);

  return (
    <nav style={{ backgroundColor: '#ffffff', color: '#333', padding: '10px 20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: '#333' }}>
          <span style={{ fontSize: '1.5em' }}>🏆</span>
          <span style={{ marginLeft: '10px', fontWeight: 'bold', fontSize: '1.2em' }}>NEAR YEAR</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link href="/vote" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            Vote
            <span style={{ marginLeft: '5px', backgroundColor: '#ffcc00', borderRadius: '10px', padding: '2px 8px', fontSize: '0.8em' }}>Soon</span>
          </Link>
          <Link href="/nomination"  style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            Nominate w List
            {/* <span style={{ marginLeft: '5px', backgroundColor: '#ffcc00', borderRadius: '10px', padding: '2px 8px', fontSize: '0.8em' }}>Soon</span> */}
          </Link>
          <Link href="https://alpha.potlock.org/register" target="_blank" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>
            Create Project
          </Link>
          <button style={{ backgroundColor: '#e0e0e0', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }} onClick={action}>
            {label}
          </button>
        </div>
      </div>
    </nav>
  );
};
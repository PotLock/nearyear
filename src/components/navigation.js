import { useEffect, useState, useContext } from 'react';
import { NearContext } from '@/wallets/near';
import Link from 'next/link';
import { FaBars, FaTimes } from 'react-icons/fa';

export const Navigation = () => {
  const { signedAccountId, wallet } = useContext(NearContext);
  const [action, setAction] = useState(() => { });
  const [label, setLabel] = useState('Loading...');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!wallet) return;

    if (signedAccountId) {
      setAction(() => wallet.signOut);
      setLabel(`Sign out ${signedAccountId}`);
    } else {
      setAction(() => wallet.signIn);
      setLabel('Login');
    }
  }, [signedAccountId, wallet]);

  return (
    <nav style={{ position: 'sticky', top: 0, backgroundColor: '#ffffff', color: '#333', padding: '10px 20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', zIndex: 1000 }}>
      <div id="desktop-menu" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: '#333' }}>
          <span style={{ fontSize: '1.5em' }}>🏆</span>
          <span style={{ marginLeft: '10px', fontWeight: 'bold', fontSize: '1.2em' }}>NEAR YEAR</span>
        </Link>
        <div id="desktop-menu" className="hidden md:flex items-center gap-5">
          <Link href="/vote" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>
            Vote <span style={{ marginLeft: '5px', backgroundColor: '#ffcc00', borderRadius: '10px', padding: '2px 8px', fontSize: '0.8em' }}>Soon</span>
          </Link>
          <Link href="/nomination" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>
            Nominate w List
          </Link>
          <Link href="https://alpha.potlock.org/register" target="_blank" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>
            Create Project
          </Link>
          <button style={{ backgroundColor: '#e0e0e0', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }} onClick={action}>
            {label}
          </button>
        </div>
        <button 
          onClick={() => setMenuOpen(!menuOpen)} 
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5em' }} 
          className="mobile-menu-button block md:hidden"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      {menuOpen && (
        <div className="mobile-menu" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: '10px', borderTop: '1px solid #ccc' }}>
          <Link href="/vote" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold', padding: '10px 0', borderBottom: '1px solid #ccc', width: '100%', textAlign: 'center' }}>
            Vote <span style={{ marginLeft: '5px', backgroundColor: '#ffcc00', borderRadius: '10px', padding: '2px 8px', fontSize: '0.8em' }}>Soon</span>
          </Link>
          <Link href="/nomination" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold', padding: '10px 0', borderBottom: '1px solid #ccc', width: '100%', textAlign: 'center' }}>
            Nominate w List
          </Link>
          <Link href="https://alpha.potlock.org/register" target="_blank" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold', padding: '10px 0', borderBottom: '1px solid #ccc', width: '100%', textAlign: 'center' }}>
            Create Project
          </Link>
          <button style={{ backgroundColor: '#e0e0e0', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', width: '100%', textAlign: 'center' }} onClick={action}>
            {label}
          </button>
        </div>
      )}
    </nav>
  );
};
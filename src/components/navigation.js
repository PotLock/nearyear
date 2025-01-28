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
    <nav className="sticky top-0 bg-white text-gray-800 p-4 shadow-md z-50">
      <div className="flex justify-between items-center">
        <Link href="/" className="flex items-center text-gray-800 no-underline whitespace-nowrap">
          <span className="text-2xl">🏆</span>
          <span className="ml-2 font-bold text-lg">NEAR YEAR</span>
        </Link>
        <div className="hidden md:flex items-center gap-5 flex-grow justify-center">
          <Link href="/vote" className="text-gray-800 font-bold no-underline">
            Vote
          </Link>
          <Link href="https://shard.dog/nearyear" target="_blank" className="text-gray-800 font-bold no-underline">
            Voter NFT
          </Link>
          <Link href="/nomination" className="text-gray-800 font-bold no-underline">
            Nominate
          </Link>
          <Link href="/register" className="text-gray-800 font-bold no-underline">
            Create Project
          </Link>
        </div>
        <button className="bg-gray-200 border-none px-4 py-2 rounded cursor-pointer" onClick={action}>
          {label}
        </button>
      </div>
      {menuOpen && (
        <div className="flex flex-col items-center gap-2 mt-2 border-t border-gray-300">
          <Link href="/vote" className="text-gray-800 font-bold no-underline py-2 border-b border-gray-300 w-full text-center">
            Vote
          </Link>
          <Link href="https://shard.dog/nearyear" target="_blank" className="text-gray-800 font-bold no-underline py-2 border-b border-gray-300 w-full text-center">
            Voter Registration
          </Link>
          <Link href="/nomination" className="text-gray-800 font-bold no-underline py-2 border-b border-gray-300 w-full text-center">
            Nominate w List
          </Link>
          <Link href="https://alpha.potlock.org/register" target="_blank" className="text-gray-800 font-bold no-underline py-2 border-b border-gray-300 w-full text-center">
            Create Project
          </Link>
          <button className="bg-gray-200 border-none px-4 py-2 rounded cursor-pointer w-full text-center" onClick={action}>
            {label}
          </button>
        </div>
      )}
    </nav>
  );
};
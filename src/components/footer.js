import Link from 'next/link';
import { FaGithub, FaTwitter } from 'react-icons/fa';

export const Footer = () => {
  return (
    <footer className="w-full flex justify-between items-center p-4 bg-gray-100">
      <div className="flex justify-start gap-2">
        <a href="https://github.com/potlock/nearyear" target="_blank" rel="noopener noreferrer" className="m-1">
          <FaGithub size={20} />
        </a>
        <a href="https://x.com/potlock_" target="_blank" rel="noopener noreferrer" className="m-1">
          <FaTwitter size={20} />
        </a>
      </div>
      <div className="text-center m-2">
        <p>Built with ❤️ by <a href="https://potlock.org" target="_blank" rel="noopener noreferrer" className="underline">🫕 POTLOCK</a></p>
      </div>
      <div className="flex justify-end gap-2">
        <Link href="https://alpha.potlock.org/register" target="_blank" className="m-1">Create Project</Link>
        <Link href="/vote" className="m-1">Vote</Link>
        <Link href="/nomination" className="m-1">Nominees</Link>
        <Link href="/#categories" className="m-1">Categories</Link>
      </div>
    </footer>
  );
}; 
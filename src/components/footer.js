import Link from 'next/link';
import { FaGithub, FaTwitter } from 'react-icons/fa';

export const Footer = () => {
  return (
    <footer className="w-full flex flex-col md:flex-row justify-between items-center p-4 bg-gray-100 footer">
      <div className="flex justify-center md:justify-start gap-2 mb-2 md:mb-0">
        <a href="https://github.com/potlock/nearyear" target="_blank" rel="noopener noreferrer" className="m-1 no-underline">
          <FaGithub size={20} />
        </a>
        <a href="https://x.com/potlock_" target="_blank" rel="noopener noreferrer" className="m-1 no-underline">
          <FaTwitter size={20} />
        </a>
      </div>
      <div className="text-center m-2">
        <p>Built with ❤️ by <a href="https://potlock.org" target="_blank" rel="noopener noreferrer" className="no-underline">🫕 POTLOCK</a></p>
      </div>
      <div className="flex justify-center md:justify-end gap-2">
        <Link href="https://alpha.potlock.org/register" target="_blank" className="m-1 no-underline">Create Project</Link>
        <Link href="/vote" className="m-1 no-underline">Vote</Link>
        <Link href="/nomination" className="m-1 no-underline">Nominees</Link>
        <Link href="/#categories" className="m-1 no-underline">Categories</Link>
      </div>
    </footer>
  );
}; 
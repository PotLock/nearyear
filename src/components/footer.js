import styles from '@/styles/app.module.css';
import Link from 'next/link';
import { FaGithub, FaTwitter } from 'react-icons/fa';

export const Footer = () => {
  return (
    <footer className={styles.footer} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', flexWrap: 'wrap' }}>
      <div style={{ flex: '1', display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
        <a href="https://github.com/potlock/nearyear" target="_blank" rel="noopener noreferrer" style={{ margin: '5px' }}>
          <FaGithub size={20} />
        </a>
        <a href="https://x.com/potlock_" target="_blank" rel="noopener noreferrer" style={{ margin: '5px' }}>
          <FaTwitter size={20} />
        </a>
      </div>
      <div style={{ flex: '1', textAlign: 'center', margin: '10px 0' }}>
        <p>Built with ❤️ by <a href="https://potlock.org" target="_blank" rel="noopener noreferrer">🫕 POTLOCK</a></p>
      </div>
      <div style={{ flex: '1', display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        <Link href="https://alpha.potlock.org/register" target="_blank" style={{ margin: '5px' }}>Create Project</Link>
        <Link href="/vote" style={{ margin: '5px' }}>Vote</Link>
        <Link href="/nomination" style={{ margin: '5px' }}>Nominees</Link>
        <Link href="/#categories" style={{ margin: '5px' }}>Categories</Link>
      </div>
    </footer>
  );
}; 
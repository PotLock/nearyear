import { CategoryList } from '@/components/categoryList';
import styles from '@/styles/app.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <CategoryList />
    </main>
  );
}
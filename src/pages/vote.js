import { CategoryList } from '@/components/categoryList';
import styles from '@/styles/app.module.css';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <main className={styles.main}>
      <CategoryList />
      <Footer />
    </main>
  );
}
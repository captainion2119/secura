import Image from 'next/image';
import styles from '@/styles/Home.module.css';

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <Image src="/images/logo.png" width={44} height={44} alt="Logo" />
        <h1 className={styles.sidebarTitle}>Secura</h1>
      </div>

      <nav className={styles.sidebarMenu}>
        <div className={styles.sidebarMenuItem}> Audit</div>
        <div className={`${styles.sidebarMenuItem} ${styles.selected}`}> CyberSense</div>
        <div className={styles.sidebarMenuItem}> Pentest Report</div>
        <div className={styles.sidebarMenuItem}> Settings</div>
      </nav>

      <div className={styles.sidebarDivider}></div>

      <div className={styles.labelContainer}>
        <div className={styles.labelSection}>
          Label <span className={styles.plusIcon}></span>
        </div>
        <div className={styles.labelList}>
          <div className={styles.labelItem}> Published</div>
          <div className={styles.labelItem}> Today's Scheduled</div>
          <div className={styles.labelItem}> Bookmarks</div>
        </div>
      </div>
    </aside>
  );
}

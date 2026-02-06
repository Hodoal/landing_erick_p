import styles from './Header.module.css'

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <span className={styles.logoText}>Erick</span>
          <span className={styles.logoSubtext}>Ads</span>
        </div>
      </div>
    </header>
  )
}

export default Header

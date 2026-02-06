import styles from './Footer.module.css'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p className={styles.footerText}>ERICKADS.AI</p>
      <p className={styles.footerCopyright}>2026 © Todos los derechos reservados</p>
    </footer>
  )
}

export default Footer

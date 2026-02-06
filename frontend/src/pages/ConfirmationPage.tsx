import { useEffect } from 'react'
// @ts-ignore - canvas-confetti doesn't have type definitions
import confetti from 'canvas-confetti'
import styles from './ConfirmationPage.module.css'


const ConfirmationPage = () => {
  // appointmentData disponible si se necesita: const { appointmentData } = useLocation().state || {}

  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0)
    
    // Trigger confetti animation
    const duration = 1500
    const animationEnd = Date.now() + duration
    
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 0,
    }
    
    const confettiAnimation = () => {
      const timeLeft = animationEnd - Date.now()
      
      if (timeLeft <= 0) {
        return
      }
      
      confetti({
        ...defaults,
        particleCount: 50,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
      })
      
      requestAnimationFrame(confettiAnimation)
    }
    
    confettiAnimation()
  }, [])

  return (
    <div className={styles.confirmationPage}>
      <div className={styles.background}>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.logoSection}>
              <div className={styles.logo}>
                <span className={styles.logoText}>Erick</span>
                <span className={styles.logoSubtext}>Ads</span>
              </div>
            </div>

            <h1 className={styles.title}>
              <span className={styles.greenText}>YA ESTÁS UN PASO MÁS ADELANTE</span>
            </h1>

            <p className={styles.subtitle}>
              de instalar un sistema que atraerá y{' '}
              <span className={styles.highlight}>convertirá clientes de forma automatizada.</span>
            </p>

            <div className={styles.videoSection}>
              <div className={styles.videoPlaceholder}>
                <iframe
                  className={styles.youtubeVideo}
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&loop=1&playlist=dQw4w9WgXcQ"
                  title="Video de agradecimiento"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            <div className={styles.whatsappCard}>
              <div className={styles.whatsappIcon}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </div>
              
              <div className={styles.whatsappContent}>
                <h2 className={styles.whatsappTitle}>REVISA TU WHATSAPP</h2>
                <p className={styles.whatsappText}>
                  Revisa tu WhatsApp para confirmar tu asesoría personalizada por <span className={styles.zoom}>Zoom</span> con
                  nuestro equipo. También <span className={styles.bold}>te llamaremos</span> para asegurarte de que todo esté
                  listo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationPage

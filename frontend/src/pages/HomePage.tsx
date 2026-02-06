import { useState, useEffect, useRef } from 'react'
import ReactPlayer from 'react-player'
import { FaEye } from 'react-icons/fa'
import styles from './HomePage.module.css'
import FormWizard from '../components/FormWizard.tsx'
import Footer from '../components/Footer.tsx'
import { FormData } from '../types'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const [viewerCount, setViewerCount] = useState(155)
  const [showTopBanner, setShowTopBanner] = useState(true)
  const [hasScrolledToForm, setHasScrolledToForm] = useState(false)
  const playerRef = useRef<ReactPlayer>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Simular contador de personas viendo
    const interval = setInterval(() => {
      setViewerCount((prev) => prev + Math.floor(Math.random() * 3) - 1)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Ocultar topBanner al hacer scroll
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setShowTopBanner(scrollTop < 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleProgress = (state: { played: number }) => {
    // Hacer scroll al formulario al 50% del video
    console.log('Video progress:', state.played)
    if (state.played >= 0.5 && !hasScrolledToForm) {
      console.log('Scrolling to form...')
      setHasScrolledToForm(true)
      // Hacer scroll al formulario que ya está visible
      setTimeout(() => {
        if (formRef.current) {
          formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 300)
    }
  }

  const handleFormComplete = (data: FormData) => {
    // Navegar a la página de agendamiento
    console.log('Navigating to schedule with data:', data)
    navigate('/schedule', { state: { formData: data } })
  }

  return (
    <div className={styles.homePage}>
      <div 
        className={styles.topBanner}
        style={{
          opacity: showTopBanner ? 1 : 0,
          transform: showTopBanner ? 'translateY(0)' : 'translateY(-100%)'
        }}
      >
        <p>
          Reduce tus costos con sistemas de <span className={styles.highlight}>Inteligencia Artificial</span> este 2026
        </p>
      </div>

      <div className={styles.container}>
        <div className={styles.heroSection}>
          <h1 className={styles.mainHeading}>
            <span className={styles.greenText}>INSTALAMOS EN TU EMPRESA </span>
            <span className={styles.whiteText}>UN SISTEMA DE ADQUISICIÓN Y </span>
            <span className={`${styles.whiteText}`}>CONVERSIÓN QUE REDUCE HASTA UN 30% TU COSTO EN </span>
            <span className={`${styles.whiteText} ${styles.lineBreak}`}>PUBLICIDAD, Y AUTOMATIZA </span>
            <span className={styles.greenText}>HASTA EL 40% DE TU OPERACIÓN..</span>
          </h1>  

          <div className={styles.stepSection}>
            <h2 className={styles.stepTitle}>
              <span className={styles.stepLabel}>PASO 1:</span> MIRA EL VIDEO
            </h2>

            <div className={styles.videoContainer}>
              <ReactPlayer
                ref={playerRef}
                url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" // Reemplazar con tu video
                width="100%"
                height="100%"
                playing
                controls
                onProgress={handleProgress}
                progressInterval={500}
                className={styles.videoPlayer}
              />
            </div>

            <div className={styles.viewerCount}>
              <FaEye className={styles.viewerIcon} />
              <span className={styles.viewerNumber}>{viewerCount}</span>
              <span className={styles.viewerText}>Personas viendo ahora.</span>
            </div>
          </div>

          <div className={styles.stepTwo}>
            <h2 className={styles.stepTwoTitle}>
              <span className={styles.stepLabel}>PASO 2:</span> Agenda tu llamada de consultoría
            </h2>
            <p className={styles.stepTwoSubtitle}>
              (APLICA SOLO PARA NEGOCIOS QUE QUIEREN AUTOMATIZAR CON IA)
            </p>
          </div>

          {/* Formulario siempre visible */}
          <div ref={formRef} className={styles.formSection}>
            <FormWizard onComplete={handleFormComplete} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default HomePage

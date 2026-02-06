import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { IoTime, IoCalendar } from 'react-icons/io5'
import styles from './SchedulePage.module.css'
import Calendar from '../components/Calendar.tsx'
import Footer from '../components/Footer.tsx'
import { FormData, AppointmentData } from '../types'
import { calendarApi } from '../services/api'

const SchedulePage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const formData = location.state?.formData as FormData
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [timezone, setTimezone] = useState<string>('GMT+0:00 (UTC)')
  const [loading, setLoading] = useState(false)
  const progress = 80

  // Detectar zona horaria automáticamente
  useEffect(() => {
    // Scroll al top de la página
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const detectTimezone = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/')
        const data = await response.json()
        const offset = data.utc_offset || '+00:00'
        const timezoneName = data.timezone || 'UTC'
        // Formatear como GMT±X:XX (ZONA)
        const gmtFormat = `GMT${offset} (${timezoneName})`
        setTimezone(gmtFormat)
      } catch (error) {
        console.error('Error detecting timezone:', error)
        // Default a GMT+0:00 (UTC)
        setTimezone('GMT+0:00 (UTC)')
      }
    }
    detectTimezone()
  }, [])

  const handleSubmit = async () => {
    // Validar fecha y hora
    if (!selectedDate) {
      alert('Por favor selecciona una fecha')
      return
    }
    
    if (!selectedTime) {
      alert('Por favor selecciona una hora')
      return
    }
    
    // Validar formData
    if (!formData) {
      alert('Error: Datos del formulario no encontrados. Por favor completa el formulario nuevamente.')
      navigate('/')
      return
    }

    setLoading(true)
    
    try {
      const appointmentData: AppointmentData = {
        ...formData,
        fecha: selectedDate.toISOString(),
        hora: selectedTime,
        zonaHoraria: timezone,
      }

      console.log('Agendando cita:', appointmentData)
      
      const result = await calendarApi.createAppointment(appointmentData)
      
      navigate('/confirmation', { 
        state: { 
          appointmentData,
          meetingLink: result.meetingLink 
        } 
      })
    } catch (error: any) {
      console.error('Error al agendar:', error)
      console.error('Error details:', error.response?.data || error.message)
      const errorMessage = error.response?.data?.error || 'Error al agendar la reunión. Por favor intenta nuevamente.'
      alert(errorMessage)
      setLoading(false)
    }
  }

  return (
    <div className={styles.pageContainer}>
      {/* Logo en la esquina superior */}
      <div className={styles.logoHeader}>
        <span className={styles.logoText}>Erick<span className={styles.logoAds}>Ads</span></span>
      </div>

      {/* Título principal grande */}
      <h1 className={styles.mainTitle}>ESTE ES EL ULTIMO PASO</h1>

      {/* Barra de progreso */}
      <div className={styles.progressBarContainer}>
        <div className={styles.progressBar} style={{ width: `${progress}%` }}>
          <span className={styles.progressText}>{progress}% PARA FINALIZAR</span>
        </div>
      </div>

      {/* Subtitulo */}
      <p className={styles.subtitle}>
        Ya has pasado satisfactoriamente todos los filtros, verdaderamente tienes un potencial <span className={styles.highlightGreen}>GIGANTE</span> para automatizar <span className={styles.highlightGreen}>TU EMPRESA</span>
      </p>

      {/* Tarjeta principal blanca */}
      <div className={styles.whiteCard}>
        <div className={styles.cardLayout}>
          {/* Columna izquierda - Información */}
          <div className={styles.leftColumn}>
            <div className={styles.cardInfo}>
              <h2 className={styles.cardTitle}>ErickAds.ai - LATAM</h2>
              <div className={styles.infoRow}>
                <span className={styles.infoItem}>
                  <IoTime size={18} /> 75 Min
                </span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoItem}>
                  <IoCalendar size={18} /> Lun, 2 De Feb De 2026
                </span>
              </div>
            </div>

            <div className={styles.descriptionSection}>
              <h3 className={styles.descTitle}>Llamada Estratégica para Impulsar tu Sistema de Adquisición Automatizado</h3>
              <p className={styles.descText}>
                En esta sesión 1 a 1 analizaremos tu situación actual, tus objetivos de crecimiento y descubriremos oportunidades para implementar un sistema de adquisición y conversión basado en AI
              </p>
              <p className={styles.descText}>
                Este espacio es 100% personalizado con enfoque estratégico para que tomes la mejor decisión sobre tu futuro profesional
              </p>
            </div>
          </div>

          {/* Columna derecha - Calendario y horarios */}
          <div className={styles.rightColumn}>
            <h3 className={styles.calendarTitle}>Selecciona la Fecha & Hora</h3>
            
            <Calendar
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              selectedTime={selectedTime}
              onSelectTime={setSelectedTime}
            />

            {/* Zona horaria */}
            <div className={styles.timezoneSection}>
              <label className={styles.timezoneLabel}>Zona horaria</label>
              <div className={styles.timezoneWrapper}>
                <select
                  className={styles.timezoneSelect}
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                >
                  <option value="GMT+0:00 (UTC)">GMT+0:00 (UTC)</option>
                  <option value="GMT-5:00 (America/Bogota)">GMT-5:00 (America/Bogota)</option>
                  <option value="GMT-4:00 (America/New_York)">GMT-4:00 (America/New_York)</option>
                  <option value="GMT-3:00 (America/Argentina)">GMT-3:00 (America/Argentina)</option>
                  <option value="GMT-6:00 (America/Mexico_City)">GMT-6:00 (America/Mexico_City)</option>
                </select>
              </div>
            </div>

            {/* Botón de agendar - solo aparece cuando fecha y hora están seleccionadas */}
            {selectedDate && selectedTime && (
              <div className={styles.scheduleButtonSection}>
                <button 
                  className={styles.scheduleButton}
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? 'Agendando...' : 'Agendar Llamada'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default SchedulePage

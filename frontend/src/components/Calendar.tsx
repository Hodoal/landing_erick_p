import { useState, useEffect } from 'react'
import styles from './Calendar.module.css'
import { calendarApi } from '../services/api'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns'
import { es } from 'date-fns/locale'

interface CalendarProps {
  selectedDate: Date | null
  onSelectDate: (date: Date) => void
  selectedTime: string
  onSelectTime: (time: string) => void
}

const Calendar = ({ selectedDate, onSelectDate, selectedTime, onSelectTime }: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [loading, setLoading] = useState(false)
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Horarios disponibles por defecto
  const defaultTimeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM']

  useEffect(() => {
    if (selectedDate) {
      loadAvailableSlots(selectedDate)
    }
  }, [selectedDate])

  const loadAvailableSlots = async (date: Date) => {
    setLoading(true)
    setError(null)
    try {
      console.log('[INFO] Loading slots for date:', date.toISOString())
      const slots = await calendarApi.getAvailableSlots(date.toISOString())
      console.log('[INFO] Received slots:', slots)
      
      if (slots && slots.length > 0) {
        // Convertir objetos slot a strings de hora
        const timeStrings = slots.map((slot: any) => {
          if (typeof slot === 'string') return slot
          return slot.time || ''
        }).filter(Boolean)
        setAvailableSlots(timeStrings)
      } else {
        setAvailableSlots(defaultTimeSlots)
      }
    } catch (error: any) {
      console.error('[ERROR] Error loading slots:', error)
      setError(error.message || 'Error al cargar horarios disponibles')
      setAvailableSlots(defaultTimeSlots)
    } finally {
      setLoading(false)
    }
  }

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const handleDateClick = (date: Date) => {
    // Solo permitir fechas futuras
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (date < today) return

    onSelectDate(date)
  }

  const handleTimeClick = (time: string) => {
    onSelectTime(time)
  }

  // Días de la semana en formato corto
  const weekDays = ['Dom.', 'Lun.', 'Mar.', 'Mié.', 'Jue.', 'Vie.', 'Sáb.']

  // Obtener el primer día del mes y rellenar con días vacíos
  const firstDayOfMonth = monthStart.getDay()
  const emptyDays = Array(firstDayOfMonth).fill(null)

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.calendarHeader}>
        <button className={styles.navButton} onClick={handlePrevMonth} aria-label="Mes anterior">
          ‹
        </button>
        <h3 className={styles.monthTitle}>
          {format(currentMonth, 'MMMM yyyy', { locale: es })}
        </h3>
        <button className={styles.navButton} onClick={handleNextMonth} aria-label="Mes siguiente">
          ›
        </button>
      </div>

      <div className={styles.calendarContent}>
        {/* Calendario de días */}
        <div className={styles.calendarSection}>
          <div className={styles.weekDays}>
            {weekDays.map((day) => (
              <div key={day} className={styles.weekDay}>
                {day}
              </div>
            ))}
          </div>

          <div className={styles.daysGrid}>
            {emptyDays.map((_, index) => (
              <div key={`empty-${index}`} className={styles.emptyDay} />
            ))}
            {daysInMonth.map((day) => {
              const isPast = day < new Date() && !isToday(day)
              const isSelected = selectedDate && isSameDay(day, selectedDate)
              const isTodayDay = isToday(day)

              return (
                <button
                  key={day.toISOString()}
                  className={`${styles.day} ${
                    isSelected ? styles.selectedDay : ''
                  } ${isTodayDay ? styles.today : ''} ${isPast ? styles.pastDay : ''}`}
                  onClick={() => handleDateClick(day)}
                  disabled={isPast}
                >
                  {format(day, 'd')}
                </button>
              )
            })}
          </div>
        </div>

        {/* Horarios disponibles a la derecha */}
        <div className={styles.timeSlotsSection}>
          {loading ? (
            <div className={styles.loading}>Cargando horarios...</div>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : (
            <div className={styles.timeSlotsContainer}>
              {(availableSlots.length > 0 ? availableSlots : defaultTimeSlots).map((time) => (
                <button
                  key={time}
                  className={`${styles.timeSlot} ${
                    selectedTime === time ? styles.selectedTime : ''
                  }`}
                  onClick={() => handleTimeClick(time)}
                  disabled={!selectedDate}
                >
                  {time}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Calendar

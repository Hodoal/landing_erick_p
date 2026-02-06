/**
 * Google Analytics Service
 * Envío de eventos desde el frontend usando gtag
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    dataLayer?: any[]
  }
}

class AnalyticsService {
  private isEnabled: boolean = false

  constructor() {
    this.isEnabled = typeof window !== 'undefined' && typeof window.gtag === 'function'
    if (!this.isEnabled) {
      console.warn('[Analytics] gtag no está disponible')
    }
  }

  /**
   * Enviar evento genérico a GA4
   */
  sendEvent(eventName: string, params?: Record<string, any>) {
    if (!this.isEnabled || !window.gtag) {
      console.log('[Analytics] Event (disabled):', eventName, params)
      return
    }

    try {
      window.gtag('event', eventName, params)
      console.log('[Analytics] Event sent:', eventName, params)
    } catch (error) {
      console.error('[Analytics] Error sending event:', error)
    }
  }

  /**
   * Usuario ve la página de inicio
   */
  trackPageView(pageName: string) {
    this.sendEvent('page_view', {
      page_title: pageName,
      page_location: window.location.href,
    })
  }

  /**
   * Usuario inicia el formulario
   */
  trackFormStart() {
    this.sendEvent('form_start', {
      form_type: 'lead_qualification',
    })
  }

  /**
   * Usuario completa una pregunta del formulario
   */
  trackFormProgress(questionNumber: number, totalQuestions: number) {
    this.sendEvent('form_progress', {
      question_number: questionNumber,
      total_questions: totalQuestions,
      progress_percentage: Math.round((questionNumber / totalQuestions) * 100),
    })
  }

  /**
   * Usuario completa el formulario
   */
  trackFormComplete(leadData: any) {
    this.sendEvent('form_complete', {
      form_type: 'lead_qualification',
      ingreso_mensual: leadData.ingresoMensual,
      tomador_decision: leadData.tomadorDecision,
      plazo_implementacion: leadData.plazoImplementacion,
    })
  }

  /**
   * Usuario ve el calendario
   */
  trackCalendarView() {
    this.sendEvent('calendar_view', {
      page: 'schedule',
    })
  }

  /**
   * Usuario selecciona una fecha
   */
  trackDateSelection(date: string) {
    this.sendEvent('date_selected', {
      selected_date: date,
    })
  }

  /**
   * Usuario selecciona un horario
   */
  trackTimeSelection(time: string, date: string) {
    this.sendEvent('time_selected', {
      selected_time: time,
      selected_date: date,
    })
  }

  /**
   * Usuario confirma la cita (CONVERSIÓN)
   */
  trackAppointmentBooked(appointmentData: {
    date: string
    time: string
    calificado: boolean
    meetingLink: string
  }) {
    this.sendEvent('appointment_booked', {
      appointment_date: appointmentData.date,
      appointment_time: appointmentData.time,
      calificado: appointmentData.calificado,
      method: 'google_meet',
      value: appointmentData.calificado ? 100 : 50, // Valor monetario estimado
      currency: 'USD',
    })
  }

  /**
   * Usuario llega a la página de confirmación
   */
  trackConfirmationView(calificado: boolean) {
    this.sendEvent('confirmation_view', {
      calificado: calificado,
      success: true,
    })
  }

  /**
   * Error en el proceso
   */
  trackError(errorType: string, errorMessage: string, context?: string) {
    this.sendEvent('error_occurred', {
      error_type: errorType,
      error_message: errorMessage,
      context: context || 'unknown',
    })
  }

  /**
   * Click en video
   */
  trackVideoPlay() {
    this.sendEvent('video_play', {
      video_type: 'landing_presentation',
    })
  }

  /**
   * Video alcanza 50%
   */
  trackVideoProgress(percentage: number) {
    this.sendEvent('video_progress', {
      video_percentage: percentage,
    })
  }

  /**
   * Click en CTA
   */
  trackCTAClick(ctaName: string, location: string) {
    this.sendEvent('cta_click', {
      cta_name: ctaName,
      cta_location: location,
    })
  }
}

export default new AnalyticsService()

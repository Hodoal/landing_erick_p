/**
 * Google Analytics Service - Backend
 * Envío de eventos server-side usando Measurement Protocol API
 */

interface GAEvent {
  name: string
  params?: Record<string, any>
}

interface GAPayload {
  client_id: string
  user_id?: string
  events: GAEvent[]
}

class AnalyticsService {
  private measurementId: string
  private apiSecret: string
  private isEnabled: boolean = false

  constructor() {
    this.measurementId = process.env.GA_MEASUREMENT_ID || ''
    this.apiSecret = process.env.GA_API_SECRET || ''
    this.isEnabled = !!(this.measurementId && this.apiSecret)

    if (!this.isEnabled) {
      console.warn('[Analytics] GA4 Measurement Protocol not configured')
      console.warn('[Analytics] Set GA_MEASUREMENT_ID and GA_API_SECRET in .env')
    } else {
      console.log('[Analytics] GA4 Measurement Protocol enabled')
    }
  }

  /**
   * Generar client_id único para identificar sesión/usuario
   */
  private generateClientId(): string {
    return `${Date.now()}.${Math.random().toString(36).substring(2, 15)}`
  }

  /**
   * Enviar evento a GA4 Measurement Protocol
   */
  private async sendEvent(
    clientId: string,
    eventName: string,
    params?: Record<string, any>
  ): Promise<boolean> {
    if (!this.isEnabled) {
      console.log('[Analytics] Event (disabled):', eventName, params)
      return false
    }

    const url = `https://www.google-analytics.com/mp/collect?measurement_id=${this.measurementId}&api_secret=${this.apiSecret}`

    const payload: GAPayload = {
      client_id: clientId,
      events: [
        {
          name: eventName,
          params: {
            ...params,
            engagement_time_msec: '100',
          },
        },
      ],
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        console.log(`[Analytics] Event sent: ${eventName}`, params)
        return true
      } else {
        console.error(`[Analytics] Error sending event: ${response.status}`)
        return false
      }
    } catch (error: any) {
      console.error('[Analytics] Error sending event:', error.message)
      return false
    }
  }

  /**
   * Track: Cita agendada (CONVERSIÓN PRINCIPAL)
   */
  async trackAppointmentBooked(
    clientId: string,
    appointmentData: {
      leadEmail: string
      appointmentDate: Date
      calificado: boolean
      meetingLink: string
    }
  ) {
    return this.sendEvent(clientId, 'appointment_booked', {
      appointment_date: appointmentData.appointmentDate.toISOString(),
      calificado: appointmentData.calificado,
      method: 'google_meet',
      value: appointmentData.calificado ? 100 : 50,
      currency: 'USD',
    })
  }

  /**
   * Track: Lead calificado
   */
  async trackLeadQualified(
    clientId: string,
    leadData: {
      calificado: boolean
      score?: number
      ingresoMensual?: string
    }
  ) {
    return this.sendEvent(clientId, 'lead_qualified', {
      calificado: leadData.calificado,
      score: leadData.score || 0,
      ingreso_mensual: leadData.ingresoMensual,
    })
  }

  /**
   * Track: Email enviado
   */
  async trackEmailSent(
    clientId: string,
    emailType: 'confirmation' | 'organizer',
    success: boolean
  ) {
    return this.sendEvent(clientId, 'email_sent', {
      email_type: emailType,
      success: success,
    })
  }

  /**
   * Track: Datos guardados en Sheets
   */
  async trackSheetsSaved(clientId: string, success: boolean) {
    return this.sendEvent(clientId, 'sheets_saved', {
      success: success,
    })
  }

  /**
   * Track: Evento creado en Calendar
   */
  async trackCalendarEventCreated(clientId: string, success: boolean) {
    return this.sendEvent(clientId, 'calendar_event_created', {
      success: success,
    })
  }

  /**
   * Track: Error en el servidor
   */
  async trackServerError(
    clientId: string,
    errorType: string,
    errorMessage: string
  ) {
    return this.sendEvent(clientId, 'server_error', {
      error_type: errorType,
      error_message: errorMessage,
    })
  }

  /**
   * Obtener client_id del request (desde cookie _ga o generar nuevo)
   */
  getClientId(req: any): string {
    // Intentar obtener de cookie _ga
    const gaCookie = req.cookies?._ga
    if (gaCookie) {
      // Cookie _ga tiene formato: GA1.2.123456789.1234567890
      const parts = gaCookie.split('.')
      if (parts.length >= 4) {
        return `${parts[2]}.${parts[3]}`
      }
    }

    // Si no existe, generar uno nuevo
    return this.generateClientId()
  }
}

export default new AnalyticsService()

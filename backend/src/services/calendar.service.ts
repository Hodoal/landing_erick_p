import { google } from 'googleapis'
import fs from 'fs'
import path from 'path'

const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json')
const TOKEN_PATH = path.join(process.cwd(), 'token.json')

// Scopes requeridos para Google Calendar
const SCOPES = ['https://www.googleapis.com/auth/calendar']

export class GoogleCalendarService {
  private oauth2Client: any

  constructor() {
    this.initializeClient()
  }

  private initializeClient() {
    // Si tienes credenciales desde variables de entorno
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
      this.oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      )
    } else if (fs.existsSync(CREDENTIALS_PATH)) {
      // Si tienes archivo credentials.json
      const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8'))
      const { client_id, client_secret, redirect_uris } = credentials.installed || credentials.web
      
      this.oauth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]
      )
    } else {
      console.warn('⚠️  Google Calendar credentials not found. Calendar features will be limited.')
      return
    }

    // Cargar token si existe
    if (fs.existsSync(TOKEN_PATH)) {
      const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'))
      this.oauth2Client.setCredentials(token)
    }
  }

  async getAvailableSlots(date: Date): Promise<any[]> {
    if (!this.oauth2Client) {
      console.warn('[WARNING] Google Calendar client not available - returning default slots')
      // Retornar slots simulados si no hay configuración
      return this.getDefaultSlots()
    }

    try {
      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client })
      
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)
      
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)

      console.log(`[INFO] Fetching calendar events for ${date.toISOString()}`)
      
      // Añadir timeout de 5 segundos para evitar bloqueos
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Google Calendar API timeout')), 5000)
      )
      
      const listPromise = calendar.events.list({
        calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
        timeMin: startOfDay.toISOString(),
        timeMax: endOfDay.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      })

      const response = await Promise.race([listPromise, timeoutPromise])
      
      const busySlots = (response as any).data?.items || []
      console.log(`[INFO] Found ${busySlots.length} busy slots for ${date.toDateString()}`)
      
      // Generar slots disponibles
      const availableSlots = this.generateAvailableSlots(date, busySlots)
      console.log(`[INFO] Generated ${availableSlots.length} available slots`)
      
      return availableSlots
    } catch (error) {
      console.error('[ERROR] Error fetching calendar slots:', error)
      console.warn('[WARNING] Returning default slots due to error')
      return this.getDefaultSlots()
    }
  }

  async createEvent(eventData: {
    summary: string
    description: string
    startTime: Date
    endTime: Date
    attendees: string[]
  }): Promise<any> {
    if (!this.oauth2Client) {
      console.warn('Calendar not configured. Event not created.')
      return { htmlLink: 'https://meet.google.com/xxx-xxxx-xxx' }
    }

    try {
      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client })

      const event = {
        summary: eventData.summary,
        description: eventData.description,
        start: {
          dateTime: eventData.startTime.toISOString(),
          timeZone: process.env.MEETING_TIMEZONE || 'America/Bogota',
        },
        end: {
          dateTime: eventData.endTime.toISOString(),
          timeZone: process.env.MEETING_TIMEZONE || 'America/Bogota',
        },
        attendees: eventData.attendees.map(email => ({ email })),
        conferenceData: {
          createRequest: {
            requestId: `meet-${Date.now()}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' },
          },
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 30 },
          ],
        },
      }

      const response = await calendar.events.insert({
        calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
        requestBody: event,
        conferenceDataVersion: 1,
        sendUpdates: 'all',
      })

      return response.data
    } catch (error) {
      console.error('Error creating calendar event:', error)
      throw error
    }
  }

  private generateAvailableSlots(date: Date, busySlots: any[]): any[] {
    // Horarios de trabajo: 9 AM - 6 PM
    const workHours = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
    const slots = []

    console.log(`[INFO] Generating slots for date: ${date.toDateString()}`)
    console.log(`[INFO] Number of busy slots to check: ${busySlots.length}`)

    for (const hour of workHours) {
      const slotStart = new Date(date)
      slotStart.setHours(hour, 0, 0, 0)

      const slotEnd = new Date(date)
      slotEnd.setHours(hour + 1, 0, 0, 0)

      // Verificar si el slot está ocupado
      const isBooked = busySlots.some((event: any) => {
        const eventStart = new Date(event.start.dateTime || event.start.date)
        const eventEnd = new Date(event.end.dateTime || event.end.date)
        const overlaps = slotStart < eventEnd && slotEnd > eventStart
        
        if (overlaps) {
          console.log(`[INFO] Slot ${hour}:00 is booked by event: ${event.summary}`)
        }
        
        return overlaps
      })

      if (!isBooked) {
        slots.push({
          time: slotStart.toLocaleTimeString('es', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          }),
          available: true,
        })
      }
    }

    return slots
  }

  private getDefaultSlots(): any[] {
    return [
      { time: '12:00 PM', available: true },
      { time: '1:00 PM', available: true },
      { time: '2:00 PM', available: true },
      { time: '3:00 PM', available: true },
      { time: '4:00 PM', available: true },
      { time: '5:00 PM', available: true },
    ]
  }

  getAuthUrl(): string {
    if (!this.oauth2Client) {
      throw new Error('OAuth2 client not initialized')
    }
    
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    })
  }

  async setCredentials(code: string): Promise<void> {
    if (!this.oauth2Client) {
      throw new Error('OAuth2 client not initialized')
    }

    const { tokens } = await this.oauth2Client.getToken(code)
    this.oauth2Client.setCredentials(tokens)
    
    // Guardar token
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens))
  }
}

export default new GoogleCalendarService()

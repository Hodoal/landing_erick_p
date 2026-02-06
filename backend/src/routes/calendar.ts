import { Router } from 'express'
import calendarService from '../services/calendar.service.js'
import emailService from '../services/email.service.js'
import { createOrUpdateExcel } from '../utils/excel.js'
import { appendLeadToSheets } from '../services/sheets.service.js'
import { qualifyLead } from '../utils/qualification.js'

const router = Router()

// Obtener slots disponibles
router.get('/slots', async (req, res) => {
  try {
    const { date } = req.query
    
    if (!date) {
      return res.status(400).json({
        success: false,
        error: 'Date parameter is required',
      })
    }

    console.log(`[INFO] GET /api/calendar/slots - Date: ${date}`)
    
    const parsedDate = new Date(date as string)
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format',
      })
    }

    const slots = await calendarService.getAvailableSlots(parsedDate)
    
    console.log(`[SUCCESS] Slots retrieved: ${slots.length} slots for ${date}`)
    
    res.json({
      success: true,
      data: slots,
    })
  } catch (error: any) {
    console.error(`[ERROR] Error fetching slots:`, error.message || error)
    res.status(500).json({
      success: false,
      error: error.message || 'Error fetching available slots',
    })
  }
})

// Crear evento en el calendario
router.post('/appointment', async (req, res) => {
  try {
    const appointmentData = req.body
    
    // Validar datos requeridos
    if (!appointmentData.nombre || !appointmentData.email || !appointmentData.fecha || !appointmentData.hora) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      })
    }

    // Calcular si el lead califica
    const calificado = qualifyLead(appointmentData)

    // Parsear fecha y hora
    const startTime = new Date(appointmentData.fecha)
    const [time, period] = appointmentData.hora.split(' ')
    let [hours, minutes] = time.split(':').map(Number)
    
    if (period === 'PM' && hours !== 12) hours += 12
    if (period === 'AM' && hours === 12) hours = 0
    
    startTime.setHours(hours, minutes || 0, 0, 0)

    // Calcular hora de fin (75 minutos después)
    const duration = parseInt(process.env.MEETING_DURATION || '75')
    const endTime = new Date(startTime.getTime() + duration * 60000)

    // Crear evento en Google Calendar
    let meetingLink = 'https://meet.google.com/xxx-xxxx-xxx'
    
    try {
      const event = await calendarService.createEvent({
        summary: `Consultoría - ${appointmentData.nombre} ${appointmentData.apellido}`,
        description: `
          Llamada estratégica con ${appointmentData.nombre} ${appointmentData.apellido}
          
          Email: ${appointmentData.email}
          WhatsApp: ${appointmentData.whatsapp}
          Instagram: ${appointmentData.instagram}
          
          Ingreso Mensual: ${appointmentData.ingresoMensual}
          Mayor Desafío: ${appointmentData.mayorDesafio}
          
          Estado: ${calificado ? 'CALIFICADO ✅' : 'NO CALIFICADO ❌'}
        `,
        startTime,
        endTime,
        attendees: [appointmentData.email],
      })

      meetingLink = event.hangoutLink || event.htmlLink || meetingLink
    } catch (error) {
      console.error('[WARNING] Error creating calendar event:', error)
      // No interrumpir el flujo - continuar sin Google Calendar
    }

    // Guardar en Excel
    await createOrUpdateExcel({
      ...appointmentData,
      calificado,
      fechaRegistro: new Date(),
      fechaReunion: startTime,
      horaReunion: appointmentData.hora,
    })

    // Guardar en Google Sheets
    await appendLeadToSheets({
      ...appointmentData,
      calificado,
      fechaRegistro: new Date(),
      fechaReunion: startTime,
      horaReunion: appointmentData.hora,
    })

    // Enviar emails (opcional - no interrumpir si falla)
    Promise.all([
      emailService.sendAppointmentConfirmation(
        appointmentData.email,
        appointmentData.nombre,
        startTime,
        meetingLink
      ).catch((error) => {
        console.error('[WARNING] Error sending confirmation email:', error)
      }),
      emailService.sendOrganizerNotification(
        { ...appointmentData, calificado },
        startTime,
        meetingLink
      ).catch((error) => {
        console.error('[WARNING] Error sending organizer email:', error)
      }),
    ]).catch(() => {
      // Ignorar errores de email
    })

    res.json({
      success: true,
      data: {
        meetingLink,
        calificado,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      },
    })
  } catch (error: any) {
    console.error('[ERROR] Error creating appointment:', error)
    console.error('[ERROR] Stack:', error.stack)
    res.status(500).json({
      success: false,
      error: error.message || 'Error creating appointment',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    })
  }
})

// Ruta para autenticación OAuth (si es necesario)
router.get('/auth', (req, res) => {
  try {
    const authUrl = calendarService.getAuthUrl()
    res.redirect(authUrl)
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// Callback de OAuth
router.get('/auth/callback', async (req, res) => {
  try {
    const { code } = req.query
    
    if (!code) {
      return res.status(400).send('Authorization code not found')
    }

    await calendarService.setCredentials(code as string)
    res.send('Authorization successful! You can close this window.')
  } catch (error: any) {
    console.error('Error in OAuth callback:', error)
    res.status(500).send('Authorization failed')
  }
})

export default router

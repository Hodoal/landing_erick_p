import nodemailer from 'nodemailer'

export interface EmailData {
  to: string
  subject: string
  html: string
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null

  constructor() {
    this.initializeTransporter()
  }

  private initializeTransporter() {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.warn('⚠️  Email credentials not configured. Email features will be disabled.')
      return
    }

    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
  }

  async sendEmail(data: EmailData): Promise<boolean> {
    if (!this.transporter) {
      console.warn('Email not sent - transporter not configured')
      return false
    }

    try {
      await this.transporter.sendMail({
        from: `"${process.env.ORGANIZER_NAME || 'ErickAds'}" <${process.env.EMAIL_USER}>`,
        to: data.to,
        subject: data.subject,
        html: data.html,
      })
      console.log(`[SUCCESS] Email sent to ${data.to}`)
      return true
    } catch (error) {
      console.error('Error sending email:', error)
      return false
    }
  }

  async sendAppointmentConfirmation(
    recipientEmail: string,
    recipientName: string,
    appointmentDate: Date,
    meetingLink: string
  ): Promise<boolean> {
    const formattedDate = appointmentDate.toLocaleString('es', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: process.env.MEETING_TIMEZONE || 'America/Bogota',
    })

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .email-wrapper { background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #29B529 0%, #39ff14 100%); color: #000; padding: 40px 30px; text-align: center; }
          .header h1 { font-size: 28px; margin-bottom: 10px; }
          .header p { font-size: 14px; opacity: 0.9; }
          .content { padding: 40px 30px; }
          .greeting { font-size: 16px; margin-bottom: 20px; }
          .greeting strong { color: #29B529; }
          .meeting-box { background: #f8f9fa; border-left: 4px solid #29B529; padding: 20px; margin: 25px 0; border-radius: 5px; }
          .meeting-box h3 { color: #29B529; margin-bottom: 15px; font-size: 16px; }
          .meeting-detail { margin: 10px 0; display: flex; align-items: center; }
          .meeting-detail strong { min-width: 120px; color: #000; }
          .button-container { text-align: center; margin: 30px 0; }
          .button { display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #29B529 0%, #39ff14 100%); color: #000; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; transition: transform 0.3s; box-shadow: 0 4px 15px rgba(41, 181, 41, 0.3); }
          .button:hover { transform: translateY(-2px); }
          .what-to-expect { margin: 30px 0; }
          .what-to-expect h3 { color: #29B529; margin-bottom: 15px; font-size: 16px; }
          .what-to-expect ul { margin-left: 20px; }
          .what-to-expect li { margin: 8px 0; }
          .important { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { background: #0a0a0a; color: #29B529; padding: 20px; text-align: center; font-size: 12px; }
          .divider { height: 1px; background: #e0e0e0; margin: 30px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="email-wrapper">
            <div class="header">
              <h1>¡Reunión Confirmada! 🎉</h1>
              <p>Tu consultoría estratégica está programada</p>
            </div>
            
            <div class="content">
              <p class="greeting">Hola <strong>${recipientName}</strong>,</p>
              
              <p>Nos complace confirmar que tu llamada estratégica con <strong>ErickAds.ai</strong> ha sido agendada exitosamente. ¡Estamos emocionados de trabajar contigo!</p>
              
              <div class="meeting-box">
                <h3>📅 Detalles de tu Reunión</h3>
                <div class="meeting-detail">
                  <strong>Fecha:</strong>
                  <span>${formattedDate}</span>
                </div>
                <div class="meeting-detail">
                  <strong>Duración:</strong>
                  <span>75 minutos</span>
                </div>
                <div class="meeting-detail">
                  <strong>Formato:</strong>
                  <span>Videollamada (Google Meet)</span>
                </div>
              </div>
              
              <div class="button-container">
                <a href="${meetingLink}" class="button">UNIRSE A LA REUNIÓN</a>
              </div>
              
              <div class="what-to-expect">
                <h3>🎯 ¿Qué esperar de esta llamada?</h3>
                <p>En esta sesión 1 a 1 analizaremos:</p>
                <ul>
                  <li>Tu situación actual y objetivos de crecimiento</li>
                  <li>Oportunidades de automatización con IA</li>
                  <li>Sistema de adquisición y conversión personalizado</li>
                  <li>Plan estratégico para reducir costos en publicidad</li>
                  <li>Próximos pasos si existe oportunidad de trabajo</li>
                </ul>
              </div>
              
              <div class="important">
                <strong>⚠️ Importante:</strong> Te llamaremos por WhatsApp/llamada telefónica para confirmar tu asistencia. Si tienes algún inconveniente, avísanos lo antes posible.
              </div>
              
              <div class="divider"></div>
              
              <p style="margin-bottom: 10px;">Si tienes preguntas antes de la reunión o necesitas reprogramar, no dudes en contactarnos.</p>
              
              <p style="margin: 20px 0; font-style: italic;">¡Nos vemos pronto!</p>
              
              <p>
                Saludos,<br>
                <strong style="color: #29B529;">Equipo ErickAds.ai</strong><br>
                Transformando empresas con automatización e IA
              </p>
            </div>
            
            <div class="footer">
              <p>© 2026 ErickAds.ai - Todos los derechos reservados</p>
              <p style="margin-top: 10px; opacity: 0.8;">Este es un correo de confirmación automático. Por favor no responde a este correo.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `

    return this.sendEmail({
      to: recipientEmail,
      subject: '✅ Confirmación de Reunión - ErickAds.ai - ' + formattedDate.split(',')[0],
      html,
    })
  }

  async sendOrganizerNotification(
    leadData: any,
    appointmentDate: Date,
    meetingLink: string
  ): Promise<boolean> {
    const formattedDate = appointmentDate.toLocaleString('es', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: process.env.MEETING_TIMEZONE || 'America/Bogota',
    })

    const qualificationStatus = leadData.calificado ? 
      '<span style="color: #00aa00; font-weight: bold; font-size: 18px;">✅ CALIFICADO</span>' : 
      '<span style="color: #cc0000; font-weight: bold; font-size: 18px;">⚠️ NO CALIFICADO</span>'

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; }
          .container { max-width: 700px; margin: 0 auto; padding: 20px; }
          .email-wrapper { background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { background: #0a0a0a; color: #29B529; padding: 30px; text-align: center; border-bottom: 3px solid #29B529; }
          .header h1 { font-size: 24px; margin-bottom: 5px; }
          .header p { font-size: 13px; opacity: 0.9; }
          .content { padding: 30px; }
          .section-title { color: #29B529; font-size: 14px; font-weight: bold; text-transform: uppercase; margin-top: 20px; margin-bottom: 12px; border-bottom: 2px solid #29B529; padding-bottom: 8px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0; }
          .info-box { background: #f8f9fa; border-left: 3px solid #29B529; padding: 12px; border-radius: 4px; }
          .info-box .label { font-weight: bold; color: #000; font-size: 12px; text-transform: uppercase; display: block; margin-bottom: 5px; }
          .info-box .value { color: #333; }
          .status-box { background: #fff8e1; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; text-align: center; }
          .status-label { font-size: 12px; font-weight: bold; color: #666; margin-bottom: 8px; text-transform: uppercase; }
          .qualification { margin: 10px 0; }
          .meeting-details { background: #f0f7ff; border-left: 4px solid #29B529; padding: 15px; border-radius: 4px; margin: 20px 0; }
          .meeting-details strong { color: #29B529; }
          .footer { background: #0a0a0a; color: #29B529; padding: 15px; text-align: center; font-size: 11px; }
          .button-link { color: #29B529; text-decoration: none; font-weight: bold; }
          .full-width { grid-column: 1 / -1; }
          .score { background: #e8f5e9; border-left: 4px solid #29B529; padding: 12px; border-radius: 4px; margin: 10px 0; }
          .score strong { color: #29B529; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="email-wrapper">
            <div class="header">
              <h1>📅 Nueva Reunión Agendada</h1>
              <p>Verificación de Lead y Detalles de Agenda</p>
            </div>
            
            <div class="content">
              <div class="status-box">
                <div class="status-label">Estado del Lead:</div>
                <div class="qualification">${qualificationStatus}</div>
              </div>
              
              <div class="section-title">📋 Información del Contacto</div>
              <div class="info-grid">
                <div class="info-box">
                  <span class="label">Nombre Completo</span>
                  <span class="value">${leadData.nombre} ${leadData.apellido}</span>
                </div>
                <div class="info-box">
                  <span class="label">Email</span>
                  <span class="value"><a href="mailto:${leadData.email}" class="button-link">${leadData.email}</a></span>
                </div>
                <div class="info-box">
                  <span class="label">WhatsApp</span>
                  <span class="value">${leadData.whatsapp}</span>
                </div>
                <div class="info-box">
                  <span class="label">Instagram</span>
                  <span class="value">${leadData.instagram}</span>
                </div>
              </div>
              
              <div class="section-title">💼 Información Profesional</div>
              <div class="info-grid">
                <div class="info-box">
                  <span class="label">Ingreso Mensual</span>
                  <span class="value">${leadData.ingresoMensual}</span>
                </div>
                <div class="info-box">
                  <span class="label">Tomador de Decisión</span>
                  <span class="value">${leadData.tomadorDecision}</span>
                </div>
                <div class="info-box full-width">
                  <span class="label">Mayor Desafío</span>
                  <span class="value">${leadData.mayorDesafio}</span>
                </div>
                <div class="info-box">
                  <span class="label">Plazo Implementación</span>
                  <span class="value">${leadData.plazoImplementacion}</span>
                </div>
                <div class="info-box">
                  <span class="label">Dispuesto a Invertir</span>
                  <span class="value">${leadData.dispuestoInvertir}</span>
                </div>
              </div>
              
              <div class="section-title">📊 Análisis de Calificación</div>
              <div class="score">
                <strong>Inversión Publicitaria:</strong> ${leadData.inversionPublicidad}
              </div>
              <div class="score">
                <strong>Ha Invertido Anteriormente:</strong> ${leadData.inversionPublicidad === 'Sí, actualmente' ? 'Sí' : 'No'}
              </div>
              <div class="score">
                <strong>Otros Decisores:</strong> ${leadData.otrosDecisores}
              </div>
              <div class="score">
                <strong>Acepta Términos:</strong> ${leadData.aceptaTerminos ? 'Sí ✅' : 'No ❌'}
              </div>
              
              <div class="meeting-details">
                <strong>📅 Detalles de la Reunión:</strong><br>
                <strong>Fecha:</strong> ${formattedDate}<br>
                <strong>Duración:</strong> 75 minutos<br>
                <strong>Link:</strong> <a href="${meetingLink}" class="button-link">Unirse a la reunión</a>
              </div>
              
              <p style="margin-top: 20px; font-size: 12px; color: #666;">
                <strong>Nota:</strong> Este correo contiene toda la información del lead. Asegúrate de revisar el estado de calificación antes de la llamada y prepara tu estrategia según el perfil del prospecto.
              </p>
            </div>
            
            <div class="footer">
              <p>© 2026 ErickAds.ai - Sistema de Agendamiento Automático</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `

    const organizerEmail = process.env.ORGANIZER_EMAIL
    if (!organizerEmail) {
      console.warn('[WARNING] Organizer email not configured')
      return false
    }

    return this.sendEmail({
      to: organizerEmail,
      subject: `${leadData.calificado ? '🎯 CALIFICADO' : '⚠️ NO CALIFICADO'} - ${leadData.nombre} ${leadData.apellido} - ${formattedDate.split(',')[0]}`,
      html,
    })
  }
}

export default new EmailService()

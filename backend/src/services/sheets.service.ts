import { google } from 'googleapis'
import { LeadData } from '../utils/excel.js'
import { getGoogleAuthClient } from './google-auth.service.js'

const sheets = google.sheets('v4')

export const appendLeadToSheets = async (leadData: LeadData): Promise<boolean> => {
  try {
    console.log('[INFO] Starting Google Sheets append...')
    
    const SHEETS_ID = process.env.GOOGLE_SHEETS_ID

    if (!SHEETS_ID) {
      console.warn('[WARNING] Google Sheets ID not configured in .env')
      return false
    }
    console.log('[INFO] Google Sheets ID:', SHEETS_ID)

    const authClient = await getGoogleAuthClient()
    if (!authClient) {
      console.error('[ERROR] Failed to get Google auth client - appendLeadToSheets cancelled')
      return false
    }
    console.log('[INFO] Auth client obtained successfully')

    // Preparar datos para Sheets
    const row = [
      new Date().toISOString(),
      leadData.nombre,
      leadData.apellido,
      leadData.whatsapp,
      leadData.email,
      leadData.instagram,
      leadData.ingresoActual || '-',
      leadData.ingresoMensual,
      leadData.tomadorDecision,
      leadData.plazoImplementacion,
      leadData.inversionPublicidad,
      leadData.mayorDesafio,
      leadData.dispuestoInvertir,
      leadData.confirmaContacto,
      leadData.otrosDecisores,
      leadData.aceptaTerminos ? 'Sí' : 'No',
      leadData.calificado ? 'Calificado' : 'No calificado',
    ]
    
    console.log('[INFO] Row data prepared with', row.length, 'columns')
    console.log('[DEBUG] Row data:', row)

    // Añadir fila a la hoja
    console.log('[INFO] Calling Google Sheets API to append row...')
    const response = await sheets.spreadsheets.values.append(
      {
        auth: authClient as any,
        spreadsheetId: SHEETS_ID,
        range: 'A:Q',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [row],
        },
      },
      {}
    )

    console.log('[INFO] Google Sheets API response:', response.status, response.statusText)
    console.log(`[SUCCESS] Lead saved to Google Sheets: ${leadData.email}`)
    return true
  } catch (error) {
    console.error('[ERROR] Error saving to Google Sheets:', error)
    if (error instanceof Error) {
      console.error('[ERROR] Error message:', error.message)
      console.error('[ERROR] Error stack:', error.stack)
    }
    return false
  }
}

export const initSheetsHeaders = async (): Promise<void> => {
  try {
    console.log('[INFO] Initializing Google Sheets headers...')
    
    const SHEETS_ID = process.env.GOOGLE_SHEETS_ID

    if (!SHEETS_ID) {
      console.warn('[WARNING] Google Sheets ID not configured in .env')
      return
    }
    console.log('[INFO] Google Sheets ID:', SHEETS_ID)

    const authClient = await getGoogleAuthClient()
    if (!authClient) {
      console.error('[ERROR] Failed to get Google auth client - headers not initialized')
      return
    }
    console.log('[INFO] Auth client obtained for header initialization')

    // Try to check if sheet exists and has headers
    try {
      console.log('[INFO] Checking if headers already exist...')
      const response = await sheets.spreadsheets.values.get(
        {
          auth: authClient as any,
          spreadsheetId: SHEETS_ID,
          range: 'A1:Q1',
        },
        {}
      )

      console.log('[INFO] Headers check response:', response.status)

      // Si no hay datos, crear headers
      if (!response.data.values || response.data.values.length === 0) {
        console.log('[INFO] No headers found, creating them...')
        
        const headers = [
          'Fecha Registro',
          'Nombre',
          'Apellido',
          'WhatsApp',
          'Email',
          'Instagram',
          'Ingreso Actual',
          'Ingreso Mensual',
          'Tomador de Decisión',
          'Plazo Implementación',
          'Inversión Publicidad',
          'Mayor Desafío',
          'Dispuesto a Invertir',
          'Confirma Contacto',
          'Otros Decisores',
          'Acepta Términos',
          'Calificación',
        ]

        const updateResponse = await sheets.spreadsheets.values.update(
          {
            auth: authClient as any,
            spreadsheetId: SHEETS_ID,
            range: 'A1:Q1',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
              values: [headers],
            },
          },
          {}
        )

        console.log('[SUCCESS] Google Sheets headers initialized, response:', updateResponse.status)
      } else {
        console.log('[INFO] Headers already exist:', response.data.values?.[0])
      }
    } catch (checkError: any) {
      console.warn('[WARNING] Could not verify headers (sheet might not exist yet):', checkError.message)
      console.log('[INFO] Sheets will accept data appends to create rows as needed')
    }
  } catch (error) {
    console.error('[ERROR] Error initializing Sheets headers:', error)
    if (error instanceof Error) {
      console.error('[ERROR] Error message:', error.message)
    }
  }
}

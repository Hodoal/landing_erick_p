import { Router } from 'express'
import { createOrUpdateExcel } from '../utils/excel.js'
import { qualifyLead } from '../utils/qualification.js'
import { appendLeadToSheets } from '../services/sheets.service.js'

const router = Router()

// Crear lead
router.post('/', async (req, res) => {
  try {
    const leadData = req.body
    
    // Validar datos básicos
    if (!leadData.nombre || !leadData.email) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      })
    }

    // Calificar lead
    const calificado = qualifyLead(leadData)

    const processedLead = {
      ...leadData,
      calificado,
      fechaRegistro: new Date(),
    }

    // Guardar en Excel
    await createOrUpdateExcel(processedLead)

    // Guardar en Google Sheets
    await appendLeadToSheets(processedLead)

    res.json({
      success: true,
      data: {
        calificado,
        message: calificado ? 'Lead calificado exitosamente' : 'Lead registrado',
      },
    })
  } catch (error: any) {
    console.error('Error creating lead:', error)
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// Calificar lead
router.post('/qualify', async (req, res) => {
  try {
    const leadData = req.body
    const calificado = qualifyLead(leadData)

    res.json({
      success: true,
      data: { calificado },
    })
  } catch (error: any) {
    console.error('Error qualifying lead:', error)
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

export default router

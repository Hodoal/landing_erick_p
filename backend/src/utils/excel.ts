import ExcelJS from 'exceljs'
import fs from 'fs'
import path from 'path'

const EXCEL_DIR = process.env.EXCEL_EXPORT_PATH || './exports'
const EXCEL_FILE = path.join(EXCEL_DIR, 'leads.xlsx')

export interface LeadData {
  nombre: string
  apellido: string
  whatsapp: string
  email: string
  instagram: string
  ingresoActual?: string
  ingresoMensual: string
  tomadorDecision: string
  plazoImplementacion: string
  inversionPublicidad: string
  mayorDesafio: string
  dispuestoInvertir: string
  confirmaContacto: string
  otrosDecisores: string
  aceptaTerminos: boolean
  calificado: boolean
  fechaRegistro: Date
  fechaReunion?: Date
  horaReunion?: string
}

export const setupExcelDirectory = () => {
  if (!fs.existsSync(EXCEL_DIR)) {
    fs.mkdirSync(EXCEL_DIR, { recursive: true })
    console.log(`[INFO] Created Excel directory: ${EXCEL_DIR}`)
  }
}

export const createOrUpdateExcel = async (leadData: LeadData): Promise<void> => {
  try {
    let workbook: ExcelJS.Workbook

    // Configurar columnas por defecto
    const columns = [
      { header: 'Fecha Registro', key: 'fechaRegistro', width: 20 },
      { header: 'Calificado', key: 'calificado', width: 12 },
      { header: 'Nombre', key: 'nombre', width: 20 },
      { header: 'Apellido', key: 'apellido', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'WhatsApp', key: 'whatsapp', width: 20 },
      { header: 'Instagram', key: 'instagram', width: 20 },
      { header: 'Ingreso Actual', key: 'ingresoActual', width: 20 },
      { header: 'Ingreso Mensual', key: 'ingresoMensual', width: 25 },
      { header: 'Tomador Decisión', key: 'tomadorDecision', width: 20 },
      { header: 'Plazo Implementación', key: 'plazoImplementacion', width: 20 },
      { header: 'Inversión Publicidad', key: 'inversionPublicidad', width: 20 },
      { header: 'Mayor Desafío', key: 'mayorDesafio', width: 30 },
      { header: 'Dispuesto Invertir', key: 'dispuestoInvertir', width: 20 },
      { header: 'Confirma Contacto', key: 'confirmaContacto', width: 40 },
      { header: 'Otros Decisores', key: 'otrosDecisores', width: 30 },
      { header: 'Acepta Términos', key: 'aceptaTerminos', width: 15 },
      { header: 'Fecha Reunión', key: 'fechaReunion', width: 20 },
      { header: 'Hora Reunión', key: 'horaReunion', width: 15 },
    ]

    // Verificar si el archivo existe
    if (fs.existsSync(EXCEL_FILE)) {
      workbook = new ExcelJS.Workbook()
      await workbook.xlsx.readFile(EXCEL_FILE)
    } else {
      workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Leads')

      // Configurar columnas solo para nuevo archivo
      worksheet.columns = columns

      // Estilizar encabezado
      const headerRow = worksheet.getRow(1)
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } }
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF00FF00' },
      }
      headerRow.alignment = { vertical: 'middle', horizontal: 'center' }
    }

    const worksheet = workbook.getWorksheet('Leads') || workbook.addWorksheet('Leads')

    // Agregar nueva fila usando valores directos (sin usar keys)
    const newRow = worksheet.addRow([
      leadData.fechaRegistro.toLocaleString('es'),
      leadData.calificado ? 'CALIFICA' : 'NO CALIFICA',
      leadData.nombre,
      leadData.apellido,
      leadData.email,
      leadData.whatsapp,
      leadData.instagram,
      leadData.ingresoActual || '',
      leadData.ingresoMensual,
      leadData.tomadorDecision,
      leadData.plazoImplementacion,
      leadData.inversionPublicidad,
      leadData.mayorDesafio,
      leadData.dispuestoInvertir,
      leadData.confirmaContacto,
      leadData.otrosDecisores,
      leadData.aceptaTerminos ? 'Sí' : 'No',
      leadData.fechaReunion ? leadData.fechaReunion.toLocaleDateString('es') : '',
      leadData.horaReunion || '',
    ])

    // Colorear la celda de calificación (columna 2 = calificado)
    const calificadoCell = newRow.getCell(2)
    if (leadData.calificado) {
      calificadoCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF90EE90' },
      }
      calificadoCell.font = { bold: true, color: { argb: 'FF006400' } }
    } else {
      calificadoCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFCCCC' },
      }
      calificadoCell.font = { bold: true, color: { argb: 'FF8B0000' } }
    }

    // Guardar archivo
    await workbook.xlsx.writeFile(EXCEL_FILE)
    console.log(`[SUCCESS] Lead saved to Excel: ${leadData.email}`)
  } catch (error) {
    console.error('Error writing to Excel:', error)
    throw error
  }
}

export const getAllLeads = async (): Promise<LeadData[]> => {
  try {
    if (!fs.existsSync(EXCEL_FILE)) {
      return []
    }

    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.readFile(EXCEL_FILE)
    const worksheet = workbook.getWorksheet('Leads')

    if (!worksheet) {
      return []
    }

    const leads: LeadData[] = []

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return // Skip header

      const leadData: any = {}
      row.eachCell((cell, colNumber) => {
        const column = worksheet.getColumn(colNumber)
        if (column.key) {
          leadData[column.key] = cell.value
        }
      })

      leads.push(leadData as LeadData)
    })

    return leads
  } catch (error) {
    console.error('Error reading Excel:', error)
    return []
  }
}

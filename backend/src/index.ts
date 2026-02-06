import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import * as path from 'path'
import calendarRouter from './routes/calendar.js'
import leadsRouter from './routes/leads.js'
import authRouter from './routes/auth.js'
import { setupExcelDirectory } from './utils/excel.js'
import { initSheetsHeaders } from './services/sheets.service.js'

// Load environment variables from .env file
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Setup directories
setupExcelDirectory()

// Routes
app.use('/api/auth', authRouter)
app.use('/api/calendar', calendarRouter)
app.use('/api/leads', leadsRouter)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  })
})

app.listen(PORT, async () => {
  console.log(`[SUCCESS] Server running on http://localhost:${PORT}`)
  console.log(`[INFO] Excel exports will be saved to: ${process.env.EXCEL_EXPORT_PATH || './exports'}`)
  
  // Initialize Google Sheets headers after server is running
  console.log('[INFO] Initializing Google Sheets connection...')
  await initSheetsHeaders()
})

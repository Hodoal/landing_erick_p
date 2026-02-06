import { Router, Request, Response } from 'express'
import { getAuthorizationUrl, handleAuthorizationCode } from '../services/google-auth.service.js'

const router = Router()

/**
 * GET /api/auth/authorize
 * Retorna la URL de autorización de Google
 */
router.get('/authorize', (req: Request, res: Response) => {
  try {
    const authUrl = getAuthorizationUrl()
    
    if (!authUrl) {
      return res.status(500).json({
        success: false,
        error: 'Could not generate authorization URL',
      })
    }

    console.log('[INFO] Authorization URL generated')
    res.json({
      success: true,
      authUrl,
    })
  } catch (error) {
    console.error('[ERROR] Error in authorize endpoint:', error)
    res.status(500).json({
      success: false,
      error: (error as Error).message,
    })
  }
})

/**
 * GET /api/auth/callback
 * Maneja el callback de autorización de Google
 */
router.get('/callback', async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string

    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Authorization code not provided',
      })
    }

    const success = await handleAuthorizationCode(code)

    if (success) {
      console.log('[SUCCESS] Google authorization completed')
      return res.json({
        success: true,
        message: 'Authorization successful. You can now close this window.',
      })
    } else {
      return res.status(500).json({
        success: false,
        error: 'Failed to handle authorization code',
      })
    }
  } catch (error) {
    console.error('[ERROR] Error in callback endpoint:', error)
    res.status(500).json({
      success: false,
      error: (error as Error).message,
    })
  }
})

export default router

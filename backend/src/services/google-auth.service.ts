import { google } from 'googleapis'
import * as fs from 'fs'
import * as path from 'path'

const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/spreadsheets',
]

const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json')
const TOKEN_PATH = path.join(process.cwd(), 'token.json')

interface Credentials {
  installed: {
    client_id: string
    client_secret: string
    redirect_uris: string[]
  }
}

/**
 * Load or create token for Google API
 */
export const loadSavedCredentialsIfExist = (): any => {
  try {
    if (fs.existsSync(TOKEN_PATH)) {
      const content = fs.readFileSync(TOKEN_PATH, 'utf8')
      const credentials = JSON.parse(content)
      
      // Check if it's an OAuth2 token (has access_token and refresh_token)
      // or a Service Account (has client_email)
      if (credentials.access_token || credentials.refresh_token) {
        // This is an OAuth2 token, return it directly
        console.log('[INFO] Found OAuth2 credentials in token.json')
        const oauth2Client = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID || '',
          process.env.GOOGLE_CLIENT_SECRET || '',
          process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/callback'
        )
        oauth2Client.setCredentials(credentials)
        return oauth2Client
      } else {
        // Try to load as Service Account or other format
        return google.auth.fromJSON(credentials)
      }
    }
  } catch (err) {
    // Ignore errors loading credentials - we'll try other methods
    console.log('[DEBUG] Could not load credentials from token.json, will try credentials.json')
  }
  return null
}

/**
 * Save the token for future use
 */
export const saveCredentials = (client: any) => {
  if (client.credentials) {
    const payload = JSON.stringify(client.credentials)
    fs.writeFileSync(TOKEN_PATH, payload)
  }
}

/**
 * Get authenticated Google client
 */
export const getGoogleAuthClient = async (): Promise<any> => {
  try {
    console.log('[INFO] Getting Google auth client...')
    
    // Try to load saved credentials
    let auth = loadSavedCredentialsIfExist()
    if (auth) {
      console.log('[INFO] Found saved credentials in token.json')
      
      // For OAuth2Client, check and refresh if needed
      if (auth instanceof google.auth.OAuth2) {
        if ((auth as any).isTokenExpiring && (auth as any).isTokenExpiring()) {
          console.log('[INFO] Token is expiring, refreshing...')
          try {
            const { credentials } = await (auth as any).refreshAccessToken()
            auth.setCredentials(credentials)
            saveCredentials(auth)
            console.log('[SUCCESS] Token refreshed successfully')
          } catch (refreshError) {
            console.error('[ERROR] Error refreshing token:', refreshError)
          }
        }
      }
      
      return auth
    }

    console.log('[WARNING] No saved credentials found, attempting to load from credentials.json')
    
    // Load credentials from file
    if (!fs.existsSync(CREDENTIALS_PATH)) {
      console.warn('[WARNING] credentials.json not found at:', CREDENTIALS_PATH)
      return null
    }

    const content = fs.readFileSync(CREDENTIALS_PATH, 'utf8')
    const credentials: Credentials = JSON.parse(content)
    const { client_id, client_secret, redirect_uris } = credentials.installed

    const oauth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    )

    // Try to set token if exists
    if (fs.existsSync(TOKEN_PATH)) {
      const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'))
      console.log('[INFO] Setting credentials from token.json')
      oauth2Client.setCredentials(token)
      
      // Check if token needs refresh
      if ((oauth2Client as any).isTokenExpiring && (oauth2Client as any).isTokenExpiring()) {
        console.log('[INFO] Token is expiring, refreshing...')
        try {
          const { credentials: newCredentials } = await (oauth2Client as any).refreshAccessToken()
          oauth2Client.setCredentials(newCredentials)
          saveCredentials(oauth2Client)
          console.log('[SUCCESS] Token refreshed successfully')
        } catch (refreshError) {
          console.error('[ERROR] Error refreshing token:', refreshError)
        }
      }
    } else {
      console.warn('[WARNING] token.json not found - user needs to authorize first')
    }

    return oauth2Client
  } catch (error) {
    console.error('[ERROR] Error getting Google auth client:', error)
    return null
  }
}

/**
 * Get authorization URL for user
 */
export const getAuthorizationUrl = () => {
  try {
    if (!fs.existsSync(CREDENTIALS_PATH)) {
      console.error('[ERROR] credentials.json not found')
      return null
    }

    const content = fs.readFileSync(CREDENTIALS_PATH, 'utf8')
    const credentials: Credentials = JSON.parse(content)
    const { client_id, client_secret, redirect_uris } = credentials.installed

    const oauth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    )

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    })

    return authUrl
  } catch (error) {
    console.error('[ERROR] Error generating auth URL:', error)
    return null
  }
}

/**
 * Handle authorization code callback
 */
export const handleAuthorizationCode = async (code: string) => {
  try {
    if (!fs.existsSync(CREDENTIALS_PATH)) {
      console.error('[ERROR] credentials.json not found')
      return false
    }

    const content = fs.readFileSync(CREDENTIALS_PATH, 'utf8')
    const credentials: Credentials = JSON.parse(content)
    const { client_id, client_secret, redirect_uris } = credentials.installed

    const oauth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    )

    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)
    saveCredentials(oauth2Client)

    console.log('[SUCCESS] Authorization successful, credentials saved')
    return true
  } catch (error) {
    console.error('[ERROR] Error handling authorization code:', error)
    return false
  }
}

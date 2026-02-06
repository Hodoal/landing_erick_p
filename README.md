# 🎯 ErickAds Landing Page - Sistema Completo

Landing page profesional en React con integración de Google Calendar, exportación a Excel, sistema de calificación de leads y **correos automáticos profesionales**.

## ✨ Características Principales

- ✅ **3 páginas responsivas** con diseño moderno
- 🎥 **Reproductor de video** con modal automático
- 📝 **Formulario inteligente** pregunta por pregunta
- 📅 **Integración Google Calendar** para agendar reuniones
- 📧 **Sistema de correos profesionales** (usuario + admin)
- 📊 **Exportación a Excel** con datos estructurados
- 🗂️ **Google Sheets** para almacenamiento en la nube
- 🤖 **Calificación automática** de leads
- 🔐 **OAuth2** seguro con Google
- 🎨 **Diseño profesional** con marca verde ErickAds
- 📊 **Exportación automática a Excel** con sistema de calificación
- 📧 **Envío de emails** de confirmación automáticos
- 🎯 **Sistema de calificación de leads** basado en criterios
- 📱 **Diseño responsive** optimizado para móviles
- 🎨 **Paleta de colores personalizada** (verde neón y oscuro)

## 📁 Estructura del Proyecto

```
landing_erick_p/
├── frontend/               # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   ├── pages/         # Páginas de la aplicación
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utilidades y validaciones
│   └── package.json
├── backend/               # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── routes/       # Rutas de la API
│   │   ├── services/     # Servicios (Calendar, Email)
│   │   └── utils/        # Utilidades (Excel, Calificación)
│   ├── exports/          # Archivos Excel generados
│   └── package.json
└── package.json          # Workspace root
```

## 🛠️ Instalación

### Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Cuenta de Google (para Calendar API)
- Cuenta de email (Gmail recomendado)

### 1. Instalar Dependencias

```bash
# Desde la raíz del proyecto
npm run install:all
```

O manualmente:

```bash
# Instalar dependencias del frontend
cd frontend
npm install

# Instalar dependencias del backend
cd ../backend
npm install
```

### 2. Configurar Variables de Entorno

#### Backend (.env)

```bash
cd backend
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:

```env
PORT=3000
FRONTEND_URL=http://localhost:5173

# Google Calendar API
GOOGLE_CLIENT_ID=tu_client_id
GOOGLE_CLIENT_SECRET=tu_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/calendar/auth/callback
GOOGLE_CALENDAR_ID=primary

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu-email@gmail.com
EMAIL_PASSWORD=tu-app-password

# Organizador
ORGANIZER_EMAIL=organizador@ejemplo.com
ORGANIZER_NAME=Erick Ads

# Configuración
EXCEL_EXPORT_PATH=./exports
MEETING_DURATION=75
MEETING_TIMEZONE=America/Bogota
```

#### Frontend (.env)

```bash
cd frontend
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:3000/api
```

### 3. Configurar Google Calendar API

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto
3. Habilita la **Google Calendar API**
4. Crea credenciales OAuth 2.0
5. Descarga el archivo `credentials.json` y colócalo en la carpeta `backend/`
6. Ejecuta la autenticación inicial:

```bash
# Desde backend
npm run dev

# Abre en el navegador:
http://localhost:3000/api/calendar/auth
```

### 4. Configurar Email (Gmail)

1. Habilita la autenticación de 2 factores en tu cuenta de Gmail
2. Genera una "Contraseña de aplicación":
   - Ve a tu cuenta de Google
   - Seguridad → Contraseñas de aplicaciones
   - Genera una nueva contraseña
3. Usa esta contraseña en `EMAIL_PASSWORD`

## 🚀 Ejecución

### Desarrollo

```bash
# Desde la raíz del proyecto (ejecuta frontend y backend simultáneamente)
npm run dev
```

O ejecuta cada uno por separado:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

La aplicación estará disponible en:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

### Producción

```bash
# Build frontend
npm run build:frontend

# Build backend
npm run build:backend

# Start backend
cd backend
npm start
```

## 📊 Sistema de Calificación de Leads

Los leads se califican automáticamente basándose en un sistema de puntos:

- **Ingreso Mensual** (30 puntos):
  - Más de $30,000 USD: 30 pts
  - $10,000 - $30,000 USD: 25 pts
  - $3,000 - $10,000 USD: 20 pts
  - $1,000 - $3,000 USD: 10 pts
  - $500 - $1,000 USD: 5 pts

- **Tomador de Decisión** (25 puntos):
  - Sí: 25 pts
  - Lo consulto con socios: 15 pts

- **Plazo de Implementación** (20 puntos):
  - Inmediatamente: 20 pts
  - 30 días: 15 pts
  - 60-90 días: 10 pts

- **Inversión en Publicidad** (15 puntos):
  - Sí, actualmente: 15 pts
  - Sí, en el pasado: 10 pts

- **Disposición a Invertir** (10 puntos):
  - Sí: 10 pts
  - Depende del plan: 5 pts

**Un lead califica si obtiene 60 puntos o más de 100.**

## 📝 Flujo de la Aplicación

1. **Página Principal** (`/`)
   - Video con reproducción automática
   - Modal aparece al 50% del video
   - Formulario wizard con preguntas secuenciales

2. **Página de Agendamiento** (`/schedule`)
   - Calendario interactivo
   - Selección de fecha y hora
   - Integración con Google Calendar

3. **Página de Confirmación** (`/confirmation`)
   - Confirmación de la reunión
   - Recordatorio de WhatsApp
   - Link de la reunión

## 📧 Sistema de Correos Profesionales ✨ **NUEVO**

El sistema envía dos emails automáticamente con diseño profesional:

### Email 1: Confirmación al Cliente
```
Asunto: ✅ Confirmación de Reunión - ErickAds.ai - [Fecha]

Contenido:
• Saludo personalizado
• Confirmación de la reunión agendada
• Detalles (fecha, hora, duración)
• Botón "UNIRSE A LA REUNIÓN" (verde #29B529)
• Sección "¿Qué esperar?" con agenda
• Aviso importante: confirmación por WhatsApp
• Footer con info de ErickAds
```

### Email 2: Notificación al Organizador
```
Asunto: [CALIFICADO/NO CALIFICADO] - [Nombre] - [Fecha]

Contenido:
• Estado: ✅ CALIFICADO o ⚠️ NO CALIFICADO
• Datos de contacto (nombre, email, WhatsApp, Instagram)
• Información profesional (ingreso, decisor, plazo)
• Mayor desafío del negocio
• Análisis de calificación detallado
• Link para unirse a la reunión
```

### Configuración de Emails

#### Paso 1: Generar App Password en Gmail

1. Ve a [myaccount.google.com](https://myaccount.google.com)
2. Seguridad → Verificación en dos pasos (habilita si no está activa)
3. Vuelve a Seguridad → Contraseñas de aplicaciones
4. Selecciona Mail y tu dispositivo
5. Google te dará una contraseña de 16 caracteres

#### Paso 2: Configurar en .env

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=erickadsai@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # Contraseña de 16 caracteres

ORGANIZER_EMAIL=erickadsai@gmail.com
ORGANIZER_NAME=Erick Ads
```

#### Paso 3: Reiniciar Backend

```bash
cd backend
npm run dev
```

### Características de los Emails

✨ **Diseño Profesional**
- Gradientes con colores de marca (#29B529 → #39ff14)
- Responsive para todos los clientes de email
- CSS inline para compatibilidad máxima
- Emojis para mejor experiencia

🎯 **Contenido Estratégico**
- Para usuario: Confirmación clara + CTA
- Para admin: Información completa del lead
- Calificación automática mostrada

📊 **Información Completa**
- Detalles de reunión
- Datos del contacto
- Link de Google Meet
- Análisis de lead

Para más detalles, ver [EMAIL_SETUP.md](./EMAIL_SETUP.md)

## 🧪 Testing del Sistema

Para hacer pruebas completas del sistema incluyendo emails, ver [TESTING_GUIDE.md](./TESTING_GUIDE.md)

## 📧 Emails no se envían?

1. Verifica que usaste **App Password** (no contraseña de cuenta)
2. Verifica que la autenticación de 2 factores esté **activa**
3. Revisa que `EMAIL_USER` y `EMAIL_PASSWORD` sean **correctos**
4. Revisa los logs del backend para errores específicos
5. Reinicia el servidor backend después de cambiar `.env`

## 📄 Licencia



Los datos se exportan automáticamente a `backend/exports/leads.xlsx` con:

- Información completa del lead
- Estado de calificación (CALIFICA / NO CALIFICA)
- Colores visuales (verde para calificado, rojo para no calificado)
- Fecha y hora de la reunión

## 🎨 Personalización

### Cambiar Paleta de Colores

Edita `frontend/src/index.css`:

```css
:root {
  --color-primary-green: #00ff00;
  --color-dark-green: #0a4a0a;
  --color-bright-green: #39ff14;
  /* ... */
}
```

### Cambiar Video

Edita `frontend/src/pages/HomePage.tsx`:

```tsx
<ReactPlayer
  url="TU_URL_DE_VIDEO_AQUI"
  // ...
/>
```

## 🔧 Scripts Disponibles

### Root

- `npm run install:all` - Instalar todas las dependencias
- `npm run dev` - Ejecutar frontend y backend en desarrollo
- `npm run build:frontend` - Build del frontend
- `npm run build:backend` - Build del backend

### Frontend

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build para producción
- `npm run preview` - Preview del build

### Backend

- `npm run dev` - Servidor de desarrollo con hot-reload
- `npm run build` - Compilar TypeScript
- `npm start` - Ejecutar versión compilada

## 🐛 Troubleshooting

### Google Calendar no funciona

1. Verifica que las credenciales estén configuradas correctamente
2. Ejecuta `http://localhost:3000/api/calendar/auth` para autenticarte
3. Verifica que el archivo `token.json` se haya creado en `backend/`

### Los emails no se envían

1. Verifica que uses una "Contraseña de aplicación" de Gmail
2. Verifica que la autenticación de 2 factores esté habilitada
3. Revisa los logs del servidor para errores específicos

### Error al crear Excel

1. Verifica que la carpeta `backend/exports` exista
2. Verifica permisos de escritura en esa carpeta

## 📄 Licencia

Este proyecto es privado y confidencial.

## 👨‍💻 Soporte

Para soporte técnico, contacta al equipo de desarrollo.

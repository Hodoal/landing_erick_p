# 📊 Configuración de Google Analytics 4 - Guía Completa

## ✅ Integración Implementada

El sistema de Google Analytics 4 está **completamente integrado** en:

### Frontend (gtag.js)
- ✅ Script de Analytics en `index.html`
- ✅ Servicio de analytics (`analytics.service.ts`)
- ✅ Eventos enviados desde todas las páginas
- ✅ Tracking de conversiones

### Backend (Measurement Protocol API)
- ✅ Servicio de analytics server-side
- ✅ Envío de eventos críticos (appointment_booked, email_sent, etc.)
- ✅ Tracking de métricas de servidor
- ✅ Sincronización con frontend mediante client_id

---

## 🚀 Configuración Paso a Paso

### Paso 1: Crear Propiedad en Google Analytics 4

1. **Ir a Google Analytics**
   - Abre [analytics.google.com](https://analytics.google.com)
   - Haz clic en "Admin" (engranaje abajo a la izquierda)

2. **Crear Nueva Propiedad**
   - En la columna "Propiedad", haz clic en "Crear propiedad"
   - Nombre: `ErickAds Landing Page`
   - Zona horaria: `(GMT-05:00) America/Bogota`
   - Moneda: `USD - Dólar estadounidense`
   - Click "Siguiente"

3. **Detalles del Negocio**
   - Categoría: `Publicidad / Marketing`
   - Tamaño: Selecciona el apropiado
   - Objetivo: `Generar leads`
   - Click "Crear"

4. **Aceptar términos** y continuar

5. **Configurar Flujo de Datos**
   - Selecciona "Web"
   - URL del sitio: Tu dominio (ej: `https://erickads.ai`)
   - Nombre del flujo: `Landing Page - Producción`
   - Click "Crear flujo"

6. **Copiar el Measurement ID**
   - Verás un ID tipo `G-XXXXXXXXXX`
   - **Cópialo** - lo necesitarás en el siguiente paso

---

### Paso 2: Crear API Secret (Para Backend)

1. **Ir a Admin → Flujos de Datos**
   - Click en tu flujo de datos web

2. **Measurement Protocol API secrets**
   - Scroll hacia abajo
   - Click en "Measurement Protocol API secrets"

3. **Crear Nuevo Secret**
   - Click "Crear"
   - Nombre: `Backend Server`
   - Click "Crear"

4. **Copiar el Secret**
   - Verás un valor tipo `abc123def456ghi789`
   - **Cópialo** - lo necesitarás en el siguiente paso

---

### Paso 3: Configurar Variables de Entorno

#### Frontend

Edita `/frontend/.env`:

```bash
VITE_API_URL=http://localhost:3000/api

# Google Analytics 4
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX  # 👈 Reemplaza con tu Measurement ID
```

#### Frontend - index.html

Edita `/frontend/index.html` y reemplaza `G-XXXXXXXXXX` con tu Measurement ID:

```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', {  // 👈 Reemplaza aquí también
    'anonymize_ip': true,
    'cookie_flags': 'SameSite=None;Secure'
  });
</script>
```

#### Backend

Edita `/backend/.env`:

```bash
# Google Analytics 4 (Measurement Protocol)
GA_MEASUREMENT_ID=G-XXXXXXXXXX      # 👈 Tu Measurement ID
GA_API_SECRET=abc123def456ghi789    # 👈 Tu API Secret
```

---

### Paso 4: Reiniciar Aplicaciones

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

---

## 📊 Eventos Implementados

### Frontend (Usuario)

| Evento | Cuándo se Envía | Parámetros |
|--------|-----------------|------------|
| `page_view` | Al cargar cualquier página | page_title, page_location |
| `form_start` | Usuario inicia el formulario | form_type |
| `form_progress` | Usuario completa una pregunta | question_number, progress_percentage |
| `form_complete` | Usuario completa el formulario | ingreso_mensual, tomador_decision |
| `calendar_view` | Usuario ve el calendario | page |
| `date_selected` | Usuario selecciona una fecha | selected_date |
| `time_selected` | Usuario selecciona un horario | selected_time, selected_date |
| `appointment_booked` | **CONVERSIÓN** - Cita confirmada | appointment_date, calificado, value |
| `confirmation_view` | Usuario ve página de confirmación | calificado, success |
| `video_play` | Usuario reproduce video | video_type |
| `video_progress` | Video alcanza % específico | video_percentage |
| `cta_click` | Click en botón CTA | cta_name, cta_location |
| `error_occurred` | Ocurre un error | error_type, error_message |

### Backend (Servidor)

| Evento | Cuándo se Envía | Parámetros |
|--------|-----------------|------------|
| `appointment_booked` | Cita creada en backend | appointment_date, calificado, value |
| `lead_qualified` | Lead evaluado | calificado, score, ingreso_mensual |
| `email_sent` | Email enviado | email_type, success |
| `sheets_saved` | Datos guardados en Sheets | success |
| `calendar_event_created` | Evento creado en Calendar | success |
| `server_error` | Error en servidor | error_type, error_message |

---

## 🎯 Configurar Conversiones en GA4

### Marcar `appointment_booked` como Conversión

1. **Ir a Admin → Eventos**
   - Columna "Propiedad" → Eventos

2. **Buscar `appointment_booked`**
   - Espera unos minutos si acabas de configurar
   - Haz una prueba para que aparezca

3. **Marcar como Conversión**
   - Toggle "Marcar como conversión" a **ON**

4. **Repetir para otros eventos importantes** (opcional):
   - `form_complete`
   - `lead_qualified`

---

## 🧪 Probar la Integración

### Verificar Eventos en Tiempo Real

1. **Ir a Informes → Tiempo Real**
   - En GA4, click en "Informes" (izquierda)
   - Click en "Tiempo real"

2. **Hacer una Prueba**
   - Abre tu landing page
   - Completa el formulario
   - Agenda una cita

3. **Verificar Eventos**
   - Deberías ver en "Tiempo Real":
     - `page_view`
     - `form_start`
     - `form_complete`
     - `calendar_view`
     - `appointment_booked` ✅

### Usar DebugView (Más Detallado)

1. **Habilitar Modo Debug**
   - En tu navegador, abre las DevTools (F12)
   - Console, escribe:
   ```js
   gtag('config', 'G-XXXXXXXXXX', { 'debug_mode': true })
   ```

2. **Ir a DebugView**
   - GA4 → Admin → DebugView
   - Haz pruebas en tu sitio
   - Verás eventos con todos los parámetros

---

## 📈 Informes Útiles

### Informe de Conversiones

```
Informes → Engagement → Conversiones
```

- Verás cuántas citas se agendaron
- Tasa de conversión
- Valor total generado

### Informe de Eventos

```
Informes → Engagement → Eventos
```

- Todos los eventos enviados
- Frecuencia de cada evento
- Usuarios únicos por evento

### Exploración Personalizada

```
Explorar → Crear una nueva exploración
```

- Crear funnel de conversión:
  1. `page_view` (Landing)
  2. `form_start`
  3. `form_complete`
  4. `calendar_view`
  5. `appointment_booked`

---

## 🔒 Privacidad y GDPR

### Configuración Implementada

✅ **IP Anonymization**: `anonymize_ip: true`  
✅ **Cookie Flags**: `SameSite=None;Secure`  
✅ **No PII Enviado**: No se envían emails ni nombres completos

### Agregar Banner de Cookies (Opcional pero Recomendado)

Para cumplimiento completo, considera agregar un banner de consentimiento:

- [Cookiebot](https://www.cookiebot.com/)
- [OneTrust](https://www.onetrust.com/)
- [Cookie Consent by Osano](https://www.osano.com/)

O implementar uno propio que detenga gtag hasta que el usuario acepte.

---

## 🚀 Producción

### Frontend

Asegúrate de actualizar el Measurement ID en:

1. `/frontend/.env`:
   ```env
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

2. `/frontend/index.html`:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   ```

### Backend

Configura variables de entorno en tu servidor:

```bash
# Heroku
heroku config:set GA_MEASUREMENT_ID=G-XXXXXXXXXX
heroku config:set GA_API_SECRET=abc123def456ghi789

# Vercel
vercel env add GA_MEASUREMENT_ID
vercel env add GA_API_SECRET

# AWS / Otros
# Usar Secrets Manager o configuración de entorno
```

---

## 🐛 Troubleshooting

### Eventos no aparecen en GA4

1. **Verifica Measurement ID**
   - Asegúrate de que coincida en .env y index.html

2. **Revisa la Consola del Navegador**
   - Deberías ver logs: `[Analytics] Event sent: ...`

3. **Espera un poco**
   - Tiempo Real puede tardar 1-2 minutos
   - Informes regulares tardan 24-48 horas

### Backend no envía eventos

1. **Verifica Variables de Entorno**
   ```bash
   # En backend, ejecuta:
   echo $GA_MEASUREMENT_ID
   echo $GA_API_SECRET
   ```

2. **Revisa Logs del Backend**
   - Deberías ver: `[Analytics] GA4 Measurement Protocol enabled`
   - Y luego: `[Analytics] Event sent: appointment_booked`

3. **Verifica API Secret**
   - Admin → Flujos de datos → Measurement Protocol API secrets
   - Confirma que el secret es correcto

### Conversiones no aparecen

1. **Marca el evento como conversión**
   - Admin → Eventos → Toggle "Marcar como conversión"

2. **Espera 24 horas**
   - Las conversiones históricas no se retroactivan

---

## 📚 Recursos Adicionales

- [Documentación GA4](https://support.google.com/analytics/answer/10089681)
- [Measurement Protocol API](https://developers.google.com/analytics/devguides/collection/protocol/ga4)
- [gtag.js Reference](https://developers.google.com/analytics/devguides/collection/gtagjs)
- [DebugView](https://support.google.com/analytics/answer/7201382)

---

## ✅ Checklist de Configuración

- [ ] Propiedad GA4 creada
- [ ] Measurement ID obtenido (G-XXXXXXXXXX)
- [ ] API Secret creado
- [ ] Frontend `.env` actualizado
- [ ] Frontend `index.html` actualizado con Measurement ID
- [ ] Backend `.env` actualizado
- [ ] Aplicaciones reiniciadas
- [ ] Prueba realizada y eventos visibles en Tiempo Real
- [ ] `appointment_booked` marcado como conversión
- [ ] DebugView verificado

---

*Última actualización: 2026*  
*Sistema de Analytics completamente funcional* ✅

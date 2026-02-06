# 📧 Sistema de Correos Electrónicos - Configuración y Guía

## Descripción General

El sistema de correos está completamente implementado con dos templates profesionales:

### 1. **Correo al Usuario** 🎉
- **Asunto**: `✅ Confirmación de Reunión - ErickAds.ai - [Fecha]`
- **Contenido**: 
  - Confirmación de la reunión agendada
  - Detalles de fecha, hora y duración
  - Botón directo para unirse a Google Meet
  - Sección "¿Qué esperar?" con agenda de la llamada
  - Aviso importante sobre confirmación por WhatsApp
  - Diseño profesional con colores de marca (#29B529 green)

### 2. **Correo al Organizador** 👨‍💼
- **Asunto**: `[CALIFICADO/NO CALIFICADO] - [Nombre] - [Fecha]`
- **Contenido**:
  - Estado de calificación del lead (✅ CALIFICADO o ⚠️ NO CALIFICADO)
  - Información de contacto (nombre, email, WhatsApp, Instagram)
  - Información profesional (ingreso, tomador de decisión, plazo)
  - Análisis de calificación detallado
  - Detalles de la reunión con link directo
  - Contexto estratégico para prepararse

---

## 🔧 Configuración Requerida

### Variables de Entorno (.env)

```env
# Configuración de SMTP Gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=erickadsai@gmail.com
EMAIL_PASSWORD=tu-app-password  # ⚠️ CAMBIAR CON APP PASSWORD

# Información del Organizador
ORGANIZER_EMAIL=erickadsai@gmail.com
ORGANIZER_NAME=Erick Ads

# Configuración de Reunión
MEETING_DURATION=75              # En minutos
MEETING_TIMEZONE=America/Bogota  # Zona horaria
```

---

## 🚀 Paso a Paso: Configurar Gmail SMTP

### Opción A: Usando Contraseña de Aplicación (RECOMENDADO)

1. **Abre tu cuenta Google**
   - Ve a [myaccount.google.com](https://myaccount.google.com)
   - Haz clic en "Seguridad" en el menú izquierdo

2. **Habilita Verificación en Dos Pasos**
   - En "Cómo inicias sesión en Google", busca "Verificación en 2 pasos"
   - Sigue el proceso para habilitar

3. **Crea una Contraseña de Aplicación**
   - Vuelve a "Seguridad"
   - Busca "Contraseñas de aplicaciones" (solo aparece si tienes 2FA activo)
   - Selecciona "Mail" y "Mac" (o tu dispositivo)
   - Google te generará una contraseña de 16 caracteres

4. **Usa esa Contraseña en el .env**
   ```env
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
   ```

### Opción B: Menos Segura (No Recomendada)

1. Ve a [myaccount.google.com/lesssecureapps](https://myaccount.google.com/lesssecureapps)
2. Activa "Permitir acceso a aplicaciones menos seguras"
3. Usa tu contraseña normal en `EMAIL_PASSWORD`

---

## 📧 Flujo de Ejecución

Cuando un usuario agenda una cita:

```
1. Usuario completa el formulario
   ↓
2. Se validan los datos
   ↓
3. Se crea el evento en Google Calendar
   ↓
4. Se guardan datos en Excel + Google Sheets
   ↓
5. Se califica automáticamente el lead
   ↓
6. SE ENVÍAN 2 CORREOS:
   
   A) USUARIO:
      - Confirmación de reunión
      - Link de Google Meet
      - Detalles de la sesión
   
   B) ORGANIZADOR:
      - Estado de calificación
      - Información completa del lead
      - Datos para preparar la llamada
```

---

## 🎨 Diseño de Emails

### Colores Utilizados
- **Verde Primario**: `#29B529` (Marca ErickAds)
- **Verde Brillante**: `#39ff14` (Gradientes)
- **Negro**: `#0a0a0a` (Headers/Fondos)
- **Textos**: `#333` (Legibilidad)

### Elementos Visuales
- ✅ Gradientes profesionales
- ✅ Bordes verde a la izquierda
- ✅ Cajas informativas
- ✅ Emojis para mejor UX
- ✅ Botones con hover effects
- ✅ Diseño responsive

---

## 🧪 Prueba del Sistema

### En Desarrollo

1. **Inicia el backend**
   ```bash
   cd backend
   npm run dev
   ```

2. **Llena el formulario en la landing**
   - Frontend: `http://localhost:5173`
   - Completa todos los campos
   - Selecciona fecha y hora

3. **Verifica los correos**
   - En tu email (usuario)
   - En erickadsai@gmail.com (organizador)

### En Producción

- Asegúrate de que `EMAIL_PASSWORD` esté en variables de entorno
- Usa contraseña de aplicación (App Password)
- Monitorea logs en `/backend/logs/` o console

---

## 📋 Checklist Final

- [ ] Gmail SMTP configurado
- [ ] Contraseña de aplicación generada
- [ ] `.env` actualizado con APP_PASSWORD
- [ ] ORGANIZER_EMAIL configurado
- [ ] MEETING_TIMEZONE correcto
- [ ] Backend compilado sin errores: `npm run build`
- [ ] Backend ejecutándose: `npm run dev`
- [ ] Correos enviándose correctamente

---

## 🐛 Troubleshooting

### "Email not sent - transporter not configured"
→ Verifica que `EMAIL_USER` y `EMAIL_PASSWORD` estén en `.env`

### "Error sending email: Invalid login"
→ Comprueba que usaste contraseña de aplicación (no la contraseña de cuenta)

### "Connection timeout"
→ Verifica que:
   - EMAIL_HOST = `smtp.gmail.com`
   - EMAIL_PORT = `587`
   - EMAIL_SECURE = `false`

### Correos no se envían pero no hay error
→ Mira los logs, busca `[WARNING]` o `[ERROR]`

---

## 📞 Soporte

Para más información sobre:
- **Gmail SMTP**: [Google Workspace - Configure SMTP](https://support.google.com/a/answer/176600)
- **Nodemailer**: [Documentación Oficial](https://nodemailer.com)
- **Verificación en 2 Pasos**: [Google Account Security](https://myaccount.google.com/security)

---

## 📝 Notas Importantes

1. **Seguridad**: Nunca hagas commit del `.env` real a git
2. **Límites**: Gmail tiene límite de ~100-300 emails/día para cuentas gratuitas
3. **Retraso**: Los correos pueden tardar 1-5 segundos en llegar
4. **Monitoreo**: Agrega logs en Sentry o similar para producción

---

*Última actualización: 2026*
*Sistema implementado y listo para usar* ✅

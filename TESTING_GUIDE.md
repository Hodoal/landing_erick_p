# 🧪 Guía de Testing - Sistema de Correos

## ✅ Pre-Testing Checklist

Antes de probar el sistema de emails, asegúrate de:

- [ ] Gmail SMTP configurado
- [ ] App Password generado en Gmail
- [ ] `.env` actualizado en `/backend`
- [ ] Backend compilado: `npm run build`
- [ ] Variables de entorno correctas

---

## 🚀 Instrucciones de Testing

### Paso 1: Configurar Gmail (5 minutos)

#### A. Habilitar Verificación en Dos Pasos
1. Abre [myaccount.google.com](https://myaccount.google.com)
2. Click en "Seguridad" (izquierda)
3. Busca "Verificación en dos pasos"
4. Sigue el proceso

#### B. Generar App Password
1. Vuelve a Seguridad
2. Busca "Contraseñas de aplicaciones"
   - ⚠️ Solo aparece si tienes 2FA activo
3. Selecciona:
   - **App**: Mail
   - **Device**: Mac (o tu dispositivo)
4. Google te dará: `xxxx xxxx xxxx xxxx` (16 caracteres)
5. Copia exactamente sin espacios

#### C. Actualizar .env
```bash
cd /Users/javier/Documents/landing_erick_p/backend
nano .env
```

Busca y actualiza:
```env
EMAIL_PASSWORD=xxxxxxxxxxxxxxxx  # Pega la contraseña de 16 caracteres sin espacios
```

Guarda: `Ctrl+X → Y → Enter`

### Paso 2: Iniciar el Servidor (2 minutos)

```bash
# Terminal 1: Backend
cd /Users/javier/Documents/landing_erick_p/backend
npm run dev

# Deberías ver:
# ✅ Backend running on http://localhost:3000
# ✅ [INFO] Calendar service initialized
```

```bash
# Terminal 2: Frontend
cd /Users/javier/Documents/landing_erick_p/frontend
npm run dev

# Deberías ver:
# ✅ VITE v5.1.0 ready in 123 ms
# ✅ Local: http://localhost:5173
```

### Paso 3: Probar el Flujo Completo (3 minutos)

1. Abre [http://localhost:5173](http://localhost:5173) en tu navegador

2. **Llena el Formulario Principal**:
   ```
   Nombre:           Juan
   Apellido:         García
   Email:            tu-email@gmail.com  ← USA TU EMAIL
   WhatsApp:         +57 310 1234567
   Instagram:        @juangarcia
   País:             Colombia
   Tipo de Negocio:  Agencia de Marketing
   Ingreso Mensual:  $200k-$500k
   ```

3. **Continúa al Formulario de Calificación**:
   ```
   ¿Has invertido en publicidad?:    Sí, actualmente
   Mayor desafío:                    Generar leads de calidad
   Tomador de decisión:              Sí
   Plazo:                            1-3 meses
   Inversión:                        $5k-$15k
   ```

4. **Selecciona Fecha y Hora**:
   - Fecha: Cualquier día futuro
   - Hora: Cualquiera disponible
   - Zona horaria: Automática (America/Bogota)

5. **Confirma la Reunión**:
   - Click en "Confirmar"
   - Espera confirmación visual

### Paso 4: Verificar Correos Enviados (5 minutos)

#### Correo 1: A tu Email (Usuario)
- **Asunto**: `✅ Confirmación de Reunión - ErickAds.ai - [Fecha]`
- **De**: `ErickAds <erickadsai@gmail.com>`
- **Contenido**:
  ✅ Saludo con tu nombre
  ✅ Confirmación de reunión
  ✅ Fecha, hora, duración
  ✅ Botón "UNIRSE A LA REUNIÓN" (verde)
  ✅ Sección "¿Qué esperar?"
  ✅ Aviso sobre WhatsApp
  ✅ Diseño profesional con colores verdes

#### Correo 2: A erickadsai@gmail.com (Admin)
- **Asunto**: `🎯 CALIFICADO - Juan García - [Fecha]`
- **De**: `ErickAds <erickadsai@gmail.com>`
- **Contenido**:
  ✅ Estado: "✅ CALIFICADO"
  ✅ Datos de contacto (nombre, email, WhatsApp, Instagram)
  ✅ Info profesional (ingreso, decisor, plazo)
  ✅ Mayor desafío del negocio
  ✅ Análisis de calificación
  ✅ Link para unirse a reunión
  ✅ Diseño profesional con estructura de datos

---

## 🔍 Verificación de Logs

Mientras pruebas, revisa la consola del backend para logs:

```
[SUCCESS] Slots retrieved: 5 slots for 2026-01-15
[SUCCESS] Email sent to juan@example.com
[SUCCESS] Email sent to erickadsai@gmail.com
[SUCCESS] Data saved to Excel
[SUCCESS] Lead appended to Google Sheets
```

### Errores Comunes & Soluciones

| Error | Causa | Solución |
|-------|-------|----------|
| `Invalid login` | App Password incorrecta | Regenera en Gmail, verifica sin espacios |
| `Connection timeout` | Gmail SMTP down o firewall | Verifica HOST/PORT, reinicia servidor |
| `Email not sent - transporter not configured` | EMAIL_USER/PASSWORD falta | Actualiza .env y reinicia backend |
| `404 /api/calendar/appointment` | Backend no corriendo | Asegúrate que backend está en puerto 3000 |

---

## 📊 Casos de Testing

### Test 1: Lead CALIFICADO
```
Criterios:
✅ Ha invertido actualmente en publicidad
✅ Es tomador de decisión
✅ Presupuesto: $5k+
✅ Plazo: 1-3 meses

Resultado Esperado:
- Asunto del admin: "🎯 CALIFICADO - [Nombre]"
- Status box: Verde "✅ CALIFICADO"
- Todos los campos de análisis marcados ✅
```

### Test 2: Lead NO CALIFICADO
```
Criterios:
❌ No ha invertido en publicidad
❌ No es tomador de decisión
❌ Presupuesto: < $5k
❌ Plazo: > 6 meses

Resultado Esperado:
- Asunto del admin: "⚠️ NO CALIFICADO - [Nombre]"
- Status box: Rojo "⚠️ NO CALIFICADO"
- Algunos campos de análisis sin marcar ❌
```

### Test 3: Verificar Integración Completa
```
✅ Usuario ve página de confirmación
✅ Confeti animado en pantalla
✅ Link del meet visible
✅ Correo de confirmación llega
✅ Correo de admin llega
✅ Datos guardados en Excel
✅ Datos guardados en Google Sheets
✅ Evento creado en Google Calendar
```

---

## 🎯 Puntos de Validación

### Email del Usuario
- [ ] Nombre del usuario aparece personalizado
- [ ] Fecha está en formato legible (español)
- [ ] Link de Meet es funcional
- [ ] Botón es verde (#29B529)
- [ ] Sección "¿Qué esperar?" tiene viñetas
- [ ] Aviso de WhatsApp es visible
- [ ] Footer tiene información de ErickAds

### Email del Admin
- [ ] Status "CALIFICADO/NO CALIFICADO" es correcto
- [ ] Datos del contacto están completos
- [ ] Info profesional está presente
- [ ] Link de reunión funciona
- [ ] Secciones están bien organizadas
- [ ] Colores verdes son consistentes

### Integración
- [ ] No hay errores en consola del backend
- [ ] Ambos emails llegan en < 5 segundos
- [ ] Excel se actualiza correctamente
- [ ] Google Sheets se actualiza
- [ ] Evento del Calendar es creado

---

## 📱 Testing en Diferentes Clientes de Email

Verifica los correos en:

- [ ] **Gmail** (Web)
- [ ] **Gmail** (Mobile)
- [ ] **Apple Mail** (si tienes Mac)
- [ ] **Outlook** (si tienes cuenta)
- [ ] **Dispositivo móvil** (nativo)

### Checklist de Compatibilidad
- [ ] Imagen/gradientes se ven bien
- [ ] Texto es legible
- [ ] Botones son clickeables
- [ ] Colores se preservan
- [ ] Layouts responsivos

---

## 🚨 Problemas Conocidos & Soluciones

### Los correos no llegan
```
1. Verifica que el backend tiene logs "[SUCCESS] Email sent"
2. Checkea carpeta de Spam/Promotions
3. Verifica que EMAIL_PASSWORD está correcta
4. Reinicia el servidor backend después de cambiar .env
5. Mira los logs del backend para errores
```

### Correos llegan pero sin formato
```
1. Algunos clientes de email no soportan CSS inline
2. Usa un cliente más moderno (Gmail, Outlook Web)
3. No es un error - el contenido es el mismo, solo sin estilos
```

### El botón "UNIRSE A LA REUNIÓN" no funciona
```
1. Verifica que meetingLink tiene un URL válido
2. El link debe empezar con https://meet.google.com/
3. Intenta copiar y pegar manualmente en navegador
```

### Se envía correo solo al usuario, no al admin
```
1. Verifica ORGANIZER_EMAIL en .env
2. Revisa que el email está en formato válido
3. Mira logs del backend para errores de "organizer email"
```

---

## 📝 Reporte de Testing

Cuando termines la prueba, documenta:

```markdown
## Prueba de Sistema de Emails - [Fecha]

**Lead de Prueba:**
- Nombre: Juan García
- Email: juan@example.com
- Calificación: CALIFICADO ✅

**Resultados:**
- [ ] Email usuario recibido ✅
- [ ] Email admin recibido ✅
- [ ] Formatos correctos ✅
- [ ] Links funcionan ✅
- [ ] Datos en sheets ✅
- [ ] Evento en calendar ✅

**Problemas Encontrados:**
(Ninguno/Listar aquí)

**Recomendaciones:**
(Listar aquí)

**Estado Final:** ✅ LISTO PARA PRODUCCIÓN
```

---

## 🎉 Checklist Final

- [ ] Backend corriendo sin errores
- [ ] Frontend accesible en localhost:5173
- [ ] Email usuario recibido con formato correcto
- [ ] Email admin recibido con información completa
- [ ] Calificación es correcta (CALIFICADO/NO CALIFICADO)
- [ ] Excel se actualiza
- [ ] Google Sheets se actualiza
- [ ] Google Calendar evento creado
- [ ] Todos los logs son SUCCESS
- [ ] Sin errores 500 en frontend

---

## 🚀 Siguiente Paso: Producción

Una vez todo funcione localmente:

1. Deploy backend a servidor
2. Generar nueva App Password si es otro email
3. Actualizar .env en producción
4. Revisar logs de producción
5. Hacer una prueba final

¡El sistema está listo! 🎉

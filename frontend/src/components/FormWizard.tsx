import { useState, useEffect } from 'react'
import styles from './FormWizard.module.css'
import { FormData } from '../types'
import { validateEmail, validateWhatsApp, validateInstagram } from '../utils/validation'

interface FormWizardProps {
  onComplete: (data: FormData) => void
}

const FormWizard = ({ onComplete }: FormWizardProps) => {
  const [formData, setFormData] = useState<Partial<FormData>>({})
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [countryCode, setCountryCode] = useState('+57') // Default Colombia
  const [detectedCountry, setDetectedCountry] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('') // Solo el número sin código

  // Detectar país automáticamente
  useEffect(() => {
    const detectCountry = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/')
        const data = await response.json()
        const dialCode = data.country_calling_code || '+57'
        setCountryCode(dialCode)
        setDetectedCountry(data.country_name || 'Colombia')
      } catch (error) {
        console.error('Error detecting country:', error)
        setCountryCode('+57') // Default Colombia
      }
    }
    detectCountry()
  }, [])

  const questions = [
    {
      id: 'nombre',
      label: 'Nombre',
      type: 'text',
      placeholder: 'Nombre',
      required: true,
      validation: (value: string) => value.length >= 2,
    },
    {
      id: 'apellido',
      label: 'Apellido',
      type: 'text',
      placeholder: 'Apellido',
      required: true,
      validation: (value: string) => value.length >= 2,
    },
    {
      id: 'whatsapp',
      label: 'Número de WhatsApp',
      type: 'tel',
      placeholder: 'Ej: 3046744778',
      required: true,
      validation: validateWhatsApp,
      helperText: `País detectado: ${detectedCountry || 'Detectando...'}. Código: ${countryCode}`,
    },
    {
      id: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Ejemplo: soporte.juanads@gmail.com',
      required: true,
      validation: validateEmail,
    },
    {
      id: 'instagram',
      label: 'Usuario de Instagram',
      type: 'text',
      placeholder: 'Ejemplo: @juan_adss',
      required: true,
      validation: validateInstagram,
    },
    {
      id: 'ingresoActual',
      label: '¿Cuál es tu ingreso mensual promedio actual?',
      type: 'text',
      placeholder: 'Ejemplo: $15.000',
      required: false,
      helperText: 'Escribe tu ingreso de ventas en dólares estadounidenses.',
    },
    {
      id: 'ingresoMensual',
      label: '¿Cuál es tu ingreso mensual promedio?',
      type: 'select',
      required: true,
      options: [
        'Menos de $500 USD',
        '$500 USD - $1.000 USD',
        '$1.000 USD - $3.000 USD',
        '$3.000 USD - $10.000 USD',
        '$10.000 USD - $30.000 USD',
        'Más de $30.000 USD',
      ],
    },
    {
      id: 'tomadorDecision',
      label: '¿Eres quien toma la decisión final de inversión en marketing?',
      type: 'select',
      required: true,
      options: ['Sí', 'Lo consulto con socios', 'No'],
    },
    {
      id: 'plazoImplementacion',
      label: '¿En qué plazo te gustaría implementar este sistema?',
      type: 'select',
      required: true,
      options: ['Inmediatamente', '30 días', '60–90 días', 'Solo estoy explorando'],
    },
    {
      id: 'inversionPublicidad',
      label: '¿Has invertido antes en publicidad digital?',
      type: 'select',
      required: true,
      options: ['Sí, actualmente', 'Sí, en el pasado', 'Nunca'],
    },
    {
      id: 'mayorDesafio',
      label: '¿Cuál es tu mayor desafío hoy?',
      type: 'select',
      required: true,
      options: [
        'No tengo suficientes clientes',
        'No convierto bien los leads',
        'Respondo tarde',
        'No tengo automatización',
      ],
    },
    {
      id: 'dispuestoInvertir',
      label: 'Si detectamos oportunidad de crecimiento, ¿estás dispuesto a invertir en implementar el sistema?',
      type: 'select',
      required: true,
      options: ['Sí', 'Depende del plan', 'No por ahora'],
    },
    {
      id: 'confirmaContacto',
      label: 'Te contactaremos por WhatsApp o Llamada para confirmar tu cita. Si no respondes, tendremos que cancelar la llamada.',
      type: 'select',
      required: true,
      options: [
        'Sí, lo entiendo y contestaré.',
        'No, no contestaré, soy un bot, curioso o te estoy copiando el funnel.',
      ],
    },
    {
      id: 'otrosDecisores',
      label: '¿Existe/n otro/s tomador/es de decisiones que deba/n asistir a esta reunión?',
      type: 'select',
      required: true,
      options: ['Sí, asistirán conmigo', 'Si, pero no pueden asistir', 'No, yo tomo las decisiones'],
    },
    {
      id: 'aceptaTerminos',
      label: 'Acepto los términos y condiciones. Al marcar esta casilla, acepto recibir mensajes de marketing y promocionales, incluyendo ofertas especiales, descuentos, novedades sobre productos, entre otros.',
      type: 'checkbox',
      required: true,
    },
  ]

  const validateField = (question: typeof questions[0], value: any) => {
    if (question.required && !value) {
      return 'Este campo es requerido'
    }

    if (question.validation && value) {
      if (!question.validation(value)) {
        return 'El formato es inválido'
      }
    }

    return ''
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar todos los campos
    const newErrors: { [key: string]: string } = {}
    
    questions.forEach(question => {
      const value = formData[question.id as keyof FormData]
      const error = validateField(question, value)
      if (error) {
        newErrors[question.id] = error
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      console.log('Form validation errors:', newErrors)
      return
    }

    console.log('Form submitted successfully:', formData)
    // Completar formulario
    onComplete(formData as FormData)
  }

  const handleChange = (questionId: string, value: any) => {
    setFormData({
      ...formData,
      [questionId]: value,
    })
    // Limpiar error específico del campo
    if (errors[questionId]) {
      const newErrors = { ...errors }
      delete newErrors[questionId]
      setErrors(newErrors)
    }
  }

  const renderQuestion = (question: typeof questions[0]) => {
    return (
      <div key={question.id} className={styles.questionContainer}>
        <label className={styles.label}>
          {question.label}
          {question.required && <span className={styles.required}>*</span>}
        </label>

        {question.helperText && (
          <p className={styles.helperText}>{question.helperText}</p>
        )}

        {question.type === 'text' || question.type === 'email' || question.type === 'tel' ? (
          <div>
            {question.id === 'whatsapp' && (
              <select
                className={styles.countryCodeSelect}
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
              >
                <option value="+1">+1 (USA/Canadá)</option>
                <option value="+52">+52 (México)</option>
                <option value="+57">+57 (Colombia)</option>
                <option value="+54">+54 (Argentina)</option>
                <option value="+56">+56 (Chile)</option>
                <option value="+51">+51 (Perú)</option>
                <option value="+58">+58 (Venezuela)</option>
                <option value="+593">+593 (Ecuador)</option>
                <option value="+591">+591 (Bolivia)</option>
                <option value="+595">+595 (Paraguay)</option>
                <option value="+598">+598 (Uruguay)</option>
                <option value="+34">+34 (España)</option>
                <option value="+44">+44 (Reino Unido)</option>
                <option value="+33">+33 (Francia)</option>
                <option value="+49">+49 (Alemania)</option>
                <option value="+39">+39 (Italia)</option>
                <option value="+351">+351 (Portugal)</option>
              </select>
            )}
            <input
              type={question.type === 'tel' ? 'tel' : question.type}
              className={question.id === 'whatsapp' ? styles.phoneInput : styles.input}
              placeholder={question.placeholder}
              value={question.id === 'whatsapp' ? phoneNumber : (formData[question.id as keyof FormData] as string) || ''}
              onChange={(e) => {
                if (question.id === 'whatsapp') {
                  // Solo guardar los dígitos que el usuario escribe
                  const numericValue = e.target.value.replace(/[^0-9]/g, '')
                  setPhoneNumber(numericValue)
                  // Guardar el número completo con código de país en formData
                  const fullNumber = countryCode + numericValue
                  handleChange(question.id, fullNumber)
                } else {
                  handleChange(question.id, e.target.value)
                }
              }}
            />
          </div>
        ) : question.type === 'select' ? (
          <select
            className={styles.select}
            value={(formData[question.id as keyof FormData] as string) || ''}
            onChange={(e) => handleChange(question.id, e.target.value)}
          >
            <option value="">Selecciona una opción</option>
            {question.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : question.type === 'checkbox' ? (
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={(formData[question.id as keyof FormData] as boolean) || false}
              onChange={(e) => handleChange(question.id, e.target.checked)}
            />
            <span className={styles.checkboxText}>Acepto</span>
          </label>
        ) : null}

        {errors[question.id] && (
          <p className={styles.error}>{errors[question.id]}</p>
        )}
      </div>
    )
  }

  return (
    <form className={styles.formWizard} onSubmit={handleSubmit}>
      <div className={styles.header}>
        <h2 className={styles.title}>Formulario de Calificación</h2>
        <p className={styles.description}>
          Completa todos los campos para agendar tu consultoría personalizada
        </p>
      </div>

      <div className={styles.allQuestions}>
        {questions.map(question => renderQuestion(question))}
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.submitButton}>
          Agendar Llamada
        </button>
      </div>
    </form>
  )
}

export default FormWizard

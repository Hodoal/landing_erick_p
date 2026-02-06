import { FormData } from '../types'

// Sistema de calificación de leads basado en los criterios de las preguntas
export const qualifyLead = (formData: FormData): boolean => {
  let score = 0
  
  // Ingreso mensual (peso: 30 puntos)
  switch (formData.ingresoMensual) {
    case 'Más de $30.000 USD':
      score += 30
      break
    case '$10.000 USD - $30.000 USD':
      score += 25
      break
    case '$3.000 USD - $10.000 USD':
      score += 20
      break
    case '$1.000 USD - $3.000 USD':
      score += 10
      break
    case '$500 USD - $1.000 USD':
      score += 5
      break
    default:
      score += 0
  }
  
  // Tomador de decisión (peso: 25 puntos)
  if (formData.tomadorDecision === 'Sí') {
    score += 25
  } else if (formData.tomadorDecision === 'Lo consulto con socios') {
    score += 15
  }
  
  // Plazo de implementación (peso: 20 puntos)
  switch (formData.plazoImplementacion) {
    case 'Inmediatamente':
      score += 20
      break
    case '30 días':
      score += 15
      break
    case '60–90 días':
      score += 10
      break
    default:
      score += 0
  }
  
  // Inversión previa en publicidad (peso: 15 puntos)
  if (formData.inversionPublicidad === 'Sí, actualmente') {
    score += 15
  } else if (formData.inversionPublicidad === 'Sí, en el pasado') {
    score += 10
  }
  
  // Disposición a invertir (peso: 10 puntos)
  if (formData.dispuestoInvertir === 'Sí') {
    score += 10
  } else if (formData.dispuestoInvertir === 'Depende del plan') {
    score += 5
  }
  
  // Lead califica si tiene más de 60 puntos de 100
  return score >= 60
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateWhatsApp = (phone: string): boolean => {
  // Formato internacional sin espacios ni caracteres especiales
  const phoneRegex = /^\+\d{10,15}$/
  return phoneRegex.test(phone)
}

export const validateInstagram = (username: string): boolean => {
  // Debe empezar con @
  return username.startsWith('@') && username.length > 1
}

export const formatCurrency = (amount: string): string => {
  return amount.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

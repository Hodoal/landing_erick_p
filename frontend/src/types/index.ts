export interface FormData {
  nombre: string
  apellido: string
  whatsapp: string
  email: string
  instagram: string
  ingresoActual: string
  ingresoMensual: string
  tomadorDecision: string
  plazoImplementacion: string
  inversionPublicidad: string
  mayorDesafio: string
  dispuestoInvertir: string
  confirmaContacto: string
  otrosDecisores: string
  aceptaTerminos: boolean
  calificado?: boolean
}

export interface AppointmentData extends FormData {
  fecha: string
  hora: string
  zonaHoraria: string
}

export interface CalendarSlot {
  date: string
  time: string
  available: boolean
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

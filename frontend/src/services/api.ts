import axios from 'axios'
import { FormData, AppointmentData, CalendarSlot, ApiResponse } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const calendarApi = {
  getAvailableSlots: async (date: string): Promise<CalendarSlot[]> => {
    const response = await api.get<ApiResponse<CalendarSlot[]>>(`/calendar/slots`, {
      params: { date },
    })
    return response.data.data || []
  },

  createAppointment: async (data: AppointmentData): Promise<any> => {
    const response = await api.post<ApiResponse<any>>('/calendar/appointment', data)
    return response.data.data
  },
}

export const leadApi = {
  submitLead: async (data: FormData): Promise<any> => {
    const response = await api.post<ApiResponse<any>>('/leads', data)
    return response.data.data
  },

  qualifyLead: async (data: FormData): Promise<boolean> => {
    const response = await api.post<ApiResponse<{ calificado: boolean }>>('/leads/qualify', data)
    return response.data.data?.calificado || false
  },
}

export default api

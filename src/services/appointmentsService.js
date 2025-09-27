import { supabase } from '../lib/supabase';

export class AppointmentsService {
  static async getAppointments(userId = null) {
    try {
      let query = supabase
        ?.from('appointments')
        ?.select(`
          *,
          therapist:user_profiles!therapist_id(id, full_name, specialization),
          client:user_profiles!client_id(id, full_name, anonymous_id)
        `)
        ?.order('appointment_date', { ascending: true })

      if (userId) {
        query = query?.eq('client_id', userId)
      }

      const { data, error } = await query

      if (error) {
        return { data: null, error: { message: error?.message || 'Failed to load appointments' } }
      }
      
      return { data: data || [], error: null }
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          data: null, 
          error: { message: 'Cannot connect to database. Please check your connection.' } 
        }
      }
      
      console.error('JavaScript error in getAppointments:', error)
      return { data: null, error: { message: 'Something went wrong. Please try again.' } }
    }
  }

  static async createAppointment(appointmentData) {
    try {
      const { data, error } = await supabase
        ?.from('appointments')
        ?.insert([appointmentData])
        ?.select(`
          *,
          therapist:user_profiles!therapist_id(id, full_name, specialization),
          client:user_profiles!client_id(id, full_name, anonymous_id)
        `)
        ?.single()

      if (error) {
        return { data: null, error }
      }
      
      return { data, error: null }
    } catch (error) {
      console.error('Error creating appointment:', error)
      return { data: null, error: { message: 'Failed to create appointment' } }
    }
  }

  static async updateAppointmentStatus(id, status) {
    try {
      const { data, error } = await supabase
        ?.from('appointments')
        ?.update({ status, updated_at: new Date()?.toISOString() })
        ?.eq('id', id)
        ?.select(`
          *,
          therapist:user_profiles!therapist_id(id, full_name, specialization),
          client:user_profiles!client_id(id, full_name, anonymous_id)
        `)
        ?.single()

      if (error) {
        return { data: null, error }
      }
      
      return { data, error: null }
    } catch (error) {
      console.error('Error updating appointment:', error)
      return { data: null, error: { message: 'Failed to update appointment' } }
    }
  }

  static async getTherapistAvailability() {
    try {
      const { data, error } = await supabase
        ?.from('therapist_availability')
        ?.select(`
          *,
          therapist:user_profiles(id, full_name, specialization, bio)
        `)
        ?.eq('is_active', true)
        ?.order('day_of_week')

      if (error) {
        return { data: null, error }
      }
      
      return { data: data || [], error: null }
    } catch (error) {
      console.error('Error fetching availability:', error)
      return { data: null, error: { message: 'Failed to load therapist availability' } }
    }
  }

  static async deleteAppointment(id) {
    try {
      const { error } = await supabase
        ?.from('appointments')
        ?.delete()
        ?.eq('id', id)

      if (error) {
        return { error }
      }
      
      return { error: null }
    } catch (error) {
      console.error('Error deleting appointment:', error)
      return { error: { message: 'Failed to delete appointment' } }
    }
  }
}
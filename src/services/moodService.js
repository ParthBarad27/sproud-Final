import { supabase } from '../lib/supabase';

export class MoodService {
  static async getMoodEntries(userId, limit = 30) {
    try {
      const { data, error } = await supabase
        ?.from('mood_entries')
        ?.select('*')
        ?.eq('user_id', userId)
        ?.order('created_at', { ascending: false })
        ?.limit(limit)

      if (error) {
        return { data: null, error: { message: error?.message || 'Failed to load mood entries' } }
      }
      
      return { data: data || [], error: null }
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        return { 
          data: null, 
          error: { message: 'Cannot connect to database. Please check your connection.' } 
        }
      }
      
      console.error('JavaScript error in getMoodEntries:', error)
      return { data: null, error: { message: 'Something went wrong. Please try again.' } }
    }
  }

  static async createMoodEntry(moodData) {
    try {
      const { data, error } = await supabase
        ?.from('mood_entries')
        ?.insert([moodData])
        ?.select()
        ?.single()

      if (error) {
        return { data: null, error }
      }
      
      return { data, error: null }
    } catch (error) {
      console.error('Error creating mood entry:', error)
      return { data: null, error: { message: 'Failed to save mood entry' } }
    }
  }

  static async getMoodStats(userId, days = 7) {
    try {
      const { data, error } = await supabase
        ?.from('mood_entries')
        ?.select('mood_value, energy_level, stress_level, sleep_hours, created_at')
        ?.eq('user_id', userId)
        ?.gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000)?.toISOString())
        ?.order('created_at', { ascending: true })

      if (error) {
        return { data: null, error }
      }

      // Calculate averages
      const stats = {
        totalEntries: data?.length || 0,
        averageEnergy: 0,
        averageStress: 0,
        averageSleep: 0,
        moodDistribution: {},
        trend: 'stable'
      }

      if (data?.length > 0) {
        const moodValues = { very_poor: 1, poor: 2, neutral: 3, good: 4, excellent: 5 }
        
        stats.averageEnergy = (data?.reduce((sum, entry) => sum + (entry?.energy_level || 0), 0) / data?.length)?.toFixed(1)
        stats.averageStress = (data?.reduce((sum, entry) => sum + (entry?.stress_level || 0), 0) / data?.length)?.toFixed(1)
        stats.averageSleep = (data?.reduce((sum, entry) => sum + (entry?.sleep_hours || 0), 0) / data?.length)?.toFixed(1)
        
        // Mood distribution
        data?.forEach(entry => {
          const mood = entry?.mood_value || 'neutral'
          stats.moodDistribution[mood] = (stats?.moodDistribution?.[mood] || 0) + 1
        })

        // Simple trend calculation
        if (data?.length >= 2) {
          const recent = data?.slice(-3)?.map(e => moodValues?.[e?.mood_value] || 3)
          const earlier = data?.slice(0, 3)?.map(e => moodValues?.[e?.mood_value] || 3)
          
          const recentAvg = recent?.reduce((a, b) => a + b, 0) / recent?.length
          const earlierAvg = earlier?.reduce((a, b) => a + b, 0) / earlier?.length
          
          if (recentAvg > earlierAvg + 0.5) stats.trend = 'improving'
          else if (recentAvg < earlierAvg - 0.5) stats.trend = 'declining'
        }
      }
      
      return { data: stats, error: null }
    } catch (error) {
      console.error('Error calculating mood stats:', error)
      return { data: null, error: { message: 'Failed to calculate mood statistics' } }
    }
  }
}
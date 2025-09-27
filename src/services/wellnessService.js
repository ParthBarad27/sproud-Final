import { supabase } from '../lib/supabase';

export class WellnessService {
  static async getWellnessGoals(userId) {
    try {
      const { data, error } = await supabase
        ?.from('wellness_goals')
        ?.select('*')
        ?.eq('user_id', userId)
        ?.eq('is_active', true)
        ?.order('created_at', { ascending: false })

      if (error) {
        return { data: null, error: { message: error?.message || 'Failed to load wellness goals' } }
      }
      
      return { data: data || [], error: null }
    } catch (error) {
      console.error('Error fetching wellness goals:', error)
      return { data: null, error: { message: 'Failed to load wellness goals' } }
    }
  }

  static async createWellnessGoal(goalData) {
    try {
      const { data, error } = await supabase
        ?.from('wellness_goals')
        ?.insert([goalData])
        ?.select()
        ?.single()

      if (error) {
        return { data: null, error }
      }
      
      return { data, error: null }
    } catch (error) {
      console.error('Error creating wellness goal:', error)
      return { data: null, error: { message: 'Failed to create wellness goal' } }
    }
  }

  static async updateGoalProgress(goalId, progress) {
    try {
      const updateData = {
        current_value: progress,
        achieved: false
      }

      // Get goal to check if target is reached
      const { data: goal } = await supabase
        ?.from('wellness_goals')
        ?.select('target_value')
        ?.eq('id', goalId)
        ?.single()

      if (goal && progress >= goal?.target_value) {
        updateData.achieved = true
        updateData.achieved_at = new Date()?.toISOString()
      }

      const { data, error } = await supabase
        ?.from('wellness_goals')
        ?.update(updateData)
        ?.eq('id', goalId)
        ?.select()
        ?.single()

      if (error) {
        return { data: null, error }
      }
      
      return { data, error: null }
    } catch (error) {
      console.error('Error updating goal progress:', error)
      return { data: null, error: { message: 'Failed to update progress' } }
    }
  }

  static async getUserProgress(userId) {
    try {
      const { data, error } = await supabase
        ?.from('user_progress')
        ?.select(`
          *,
          resource:resources(id, title, resource_type, duration_minutes)
        `)
        ?.eq('user_id', userId)
        ?.order('last_accessed', { ascending: false })

      if (error) {
        return { data: null, error }
      }
      
      return { data: data || [], error: null }
    } catch (error) {
      console.error('Error fetching user progress:', error)
      return { data: null, error: { message: 'Failed to load progress data' } }
    }
  }

  static async updateResourceProgress(userId, resourceId, progressPercentage) {
    try {
      const progressData = {
        user_id: userId,
        resource_id: resourceId,
        progress_percentage: progressPercentage,
        completed: progressPercentage >= 100,
        last_accessed: new Date()?.toISOString()
      }

      if (progressPercentage >= 100) {
        progressData.completed_at = new Date()?.toISOString()
      }

      // Use upsert to handle existing progress records
      const { data, error } = await supabase
        ?.from('user_progress')
        ?.upsert(progressData, { 
          onConflict: 'user_id,resource_id'
        })
        ?.select()
        ?.single()

      if (error) {
        return { data: null, error }
      }
      
      return { data, error: null }
    } catch (error) {
      console.error('Error updating resource progress:', error)
      return { data: null, error: { message: 'Failed to update progress' } }
    }
  }

  static async getWellnessMetrics(userId, days = 7) {
    try {
      // Get mood entries for metrics
      const { data: moodData } = await supabase
        ?.from('mood_entries')
        ?.select('*')
        ?.eq('user_id', userId)
        ?.gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000)?.toISOString())

      // Get goals progress
      const { data: goalsData } = await supabase
        ?.from('wellness_goals')
        ?.select('*')
        ?.eq('user_id', userId)
        ?.eq('is_active', true)

      // Get resource progress
      const { data: progressData } = await supabase
        ?.from('user_progress')
        ?.select('*')
        ?.eq('user_id', userId)
        ?.gte('last_accessed', new Date(Date.now() - days * 24 * 60 * 60 * 1000)?.toISOString())

      const metrics = {
        moodEntries: moodData?.length || 0,
        averageMood: 0,
        averageStress: 0,
        averageSleep: 0,
        activeGoals: goalsData?.length || 0,
        achievedGoals: goalsData?.filter(g => g?.achieved)?.length || 0,
        resourcesAccessed: progressData?.length || 0,
        completedResources: progressData?.filter(p => p?.completed)?.length || 0
      }

      if (moodData?.length > 0) {
        const moodValues = { very_poor: 1, poor: 2, neutral: 3, good: 4, excellent: 5 }
        
        metrics.averageMood = (moodData?.reduce((sum, entry) => 
          sum + (moodValues?.[entry?.mood_value] || 3), 0) / moodData?.length)?.toFixed(1)
        
        metrics.averageStress = (moodData?.reduce((sum, entry) => 
          sum + (entry?.stress_level || 0), 0) / moodData?.length)?.toFixed(1)
        
        metrics.averageSleep = (moodData?.reduce((sum, entry) => 
          sum + (entry?.sleep_hours || 0), 0) / moodData?.length)?.toFixed(1)
      }

      return { data: metrics, error: null }
    } catch (error) {
      console.error('Error calculating wellness metrics:', error)
      return { data: null, error: { message: 'Failed to calculate wellness metrics' } }
    }
  }
}
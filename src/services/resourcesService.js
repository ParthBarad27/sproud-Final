import { supabase } from '../lib/supabase';

export class ResourcesService {
  static async getResources(filters = {}) {
    try {
      let query = supabase
        ?.from('resources')
        ?.select(`
          *,
          creator:user_profiles!created_by(id, full_name, role)
        `)
        ?.order('created_at', { ascending: false })

      // Apply filters
      if (filters?.category) {
        query = query?.eq('category', filters?.category)
      }
      
      if (filters?.resource_type) {
        query = query?.eq('resource_type', filters?.resource_type)
      }
      
      if (filters?.featured) {
        query = query?.eq('is_featured', true)
      }

      if (filters?.limit) {
        query = query?.limit(filters?.limit)
      }

      const { data, error } = await query

      if (error) {
        return { data: null, error: { message: error?.message || 'Failed to load resources' } }
      }
      
      return { data: data || [], error: null }
    } catch (error) {
      console.error('Error fetching resources:', error)
      return { data: null, error: { message: 'Failed to load resources' } }
    }
  }

  static async getResourceById(id) {
    try {
      const { data, error } = await supabase
        ?.from('resources')
        ?.select(`
          *,
          creator:user_profiles!created_by(id, full_name, role)
        `)
        ?.eq('id', id)
        ?.single()

      if (error) {
        return { data: null, error }
      }
      
      // Increment view count
      await supabase
        ?.from('resources')
        ?.update({ view_count: (data?.view_count || 0) + 1 })
        ?.eq('id', id)
      
      return { data, error: null }
    } catch (error) {
      console.error('Error fetching resource:', error)
      return { data: null, error: { message: 'Failed to load resource' } }
    }
  }

  static async searchResources(searchTerm) {
    try {
      const { data, error } = await supabase
        ?.from('resources')
        ?.select(`
          *,
          creator:user_profiles!created_by(id, full_name, role)
        `)
        ?.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,tags.cs.{${searchTerm}}`)
        ?.order('created_at', { ascending: false })

      if (error) {
        return { data: null, error }
      }
      
      return { data: data || [], error: null }
    } catch (error) {
      console.error('Error searching resources:', error)
      return { data: null, error: { message: 'Failed to search resources' } }
    }
  }

  static async getFeaturedResources(limit = 6) {
    try {
      const { data, error } = await supabase
        ?.from('resources')
        ?.select(`
          *,
          creator:user_profiles!created_by(id, full_name, role)
        `)
        ?.eq('is_featured', true)
        ?.order('view_count', { ascending: false })
        ?.limit(limit)

      if (error) {
        return { data: null, error }
      }
      
      return { data: data || [], error: null }
    } catch (error) {
      console.error('Error fetching featured resources:', error)
      return { data: null, error: { message: 'Failed to load featured resources' } }
    }
  }

  static async getResourceCategories() {
    try {
      const { data, error } = await supabase
        ?.from('resources')
        ?.select('category')
        ?.not('category', 'is', null)

      if (error) {
        return { data: null, error }
      }
      
      // Get unique categories
      const categories = [...new Set(data?.map(r => r?.category).filter(Boolean))]
      
      return { data: categories, error: null }
    } catch (error) {
      console.error('Error fetching categories:', error)
      return { data: null, error: { message: 'Failed to load categories' } }
    }
  }

  static async createResource(resourceData) {
    try {
      const { data, error } = await supabase
        ?.from('resources')
        ?.insert([resourceData])
        ?.select(`
          *,
          creator:user_profiles!created_by(id, full_name, role)
        `)
        ?.single()

      if (error) {
        return { data: null, error }
      }
      
      return { data, error: null }
    } catch (error) {
      console.error('Error creating resource:', error)
      return { data: null, error: { message: 'Failed to create resource' } }
    }
  }

  static async updateResource(id, updates) {
    try {
      const { data, error } = await supabase
        ?.from('resources')
        ?.update(updates)
        ?.eq('id', id)
        ?.select(`
          *,
          creator:user_profiles!created_by(id, full_name, role)
        `)
        ?.single()

      if (error) {
        return { data: null, error }
      }
      
      return { data, error: null }
    } catch (error) {
      console.error('Error updating resource:', error)
      return { data: null, error: { message: 'Failed to update resource' } }
    }
  }
}
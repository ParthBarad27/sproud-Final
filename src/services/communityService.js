import { supabase } from '../lib/supabase';

export class CommunityService {
  static async getCommunityPosts(filters = {}) {
    try {
      let query = supabase
        ?.from('community_posts')
        ?.select(`
          *,
          author:user_profiles!author_id(id, full_name, anonymous_id)
        `)
        ?.order('created_at', { ascending: false })

      if (filters?.category) {
        query = query?.eq('category', filters?.category)
      }

      if (filters?.featured) {
        query = query?.eq('is_featured', true)
      }

      if (filters?.limit) {
        query = query?.limit(filters?.limit)
      }

      const { data, error } = await query

      if (error) {
        return { data: null, error: { message: error?.message || 'Failed to load community posts' } }
      }
      
      return { data: data || [], error: null }
    } catch (error) {
      console.error('Error fetching community posts:', error)
      return { data: null, error: { message: 'Failed to load community posts' } }
    }
  }

  static async createCommunityPost(postData) {
    try {
      const { data, error } = await supabase
        ?.from('community_posts')
        ?.insert([postData])
        ?.select(`
          *,
          author:user_profiles!author_id(id, full_name, anonymous_id)
        `)
        ?.single()

      if (error) {
        return { data: null, error }
      }
      
      return { data, error: null }
    } catch (error) {
      console.error('Error creating community post:', error)
      return { data: null, error: { message: 'Failed to create post' } }
    }
  }

  static async getPostComments(postId) {
    try {
      const { data, error } = await supabase
        ?.from('community_comments')
        ?.select(`
          *,
          author:user_profiles!author_id(id, full_name, anonymous_id)
        `)
        ?.eq('post_id', postId)
        ?.order('created_at', { ascending: true })

      if (error) {
        return { data: null, error }
      }
      
      return { data: data || [], error: null }
    } catch (error) {
      console.error('Error fetching comments:', error)
      return { data: null, error: { message: 'Failed to load comments' } }
    }
  }

  static async createComment(commentData) {
    try {
      // First create the comment
      const { data, error } = await supabase
        ?.from('community_comments')
        ?.insert([commentData])
        ?.select(`
          *,
          author:user_profiles!author_id(id, full_name, anonymous_id)
        `)
        ?.single()

      if (error) {
        return { data: null, error }
      }

      // Update the post's comment count
      await supabase
        ?.from('community_posts')
        ?.update({ 
          comments_count: supabase?.raw('comments_count + 1')
        })
        ?.eq('id', commentData?.post_id)
      
      return { data, error: null }
    } catch (error) {
      console.error('Error creating comment:', error)
      return { data: null, error: { message: 'Failed to create comment' } }
    }
  }

  static async togglePostLike(postId, userId) {
    try {
      // This would typically involve a likes table, but for simplicity 
      // we'll just increment the likes_count
      const { data, error } = await supabase
        ?.from('community_posts')
        ?.update({ 
          likes_count: supabase?.raw('likes_count + 1')
        })
        ?.eq('id', postId)
        ?.select()
        ?.single()

      if (error) {
        return { data: null, error }
      }
      
      return { data, error: null }
    } catch (error) {
      console.error('Error toggling post like:', error)
      return { data: null, error: { message: 'Failed to update like' } }
    }
  }

  static async getFeaturedPosts(limit = 5) {
    return this.getCommunityPosts({ featured: true, limit })
  }
}
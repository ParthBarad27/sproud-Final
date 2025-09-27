import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { CommunityService } from '../../../services/communityService';

const CommunityActivity = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFeaturedPosts();
  }, []);

  const loadFeaturedPosts = async () => {
    setLoading(true);
    setError(null);

    const { data, error: postsError } = await CommunityService?.getFeaturedPosts(3);
    
    if (postsError) {
      setError(postsError?.message || 'Failed to load community posts');
      setPosts([]);
    } else {
      setPosts(data || []);
    }
    
    setLoading(false);
  };

  const handleLikePost = async (postId) => {
    const { error: likeError } = await CommunityService?.togglePostLike(postId);
    if (likeError) {
      console.error('Failed to like post:', likeError);
    } else {
      // Optimistically update the UI
      setPosts(posts?.map(post => 
        post?.id === postId 
          ? { ...post, likes_count: (post?.likes_count || 0) + 1 }
          : post
      ));
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date?.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <Icon name="Users" size={16} color="white" />
          </div>
          <h3 className="font-semibold text-card-foreground">Community Activity</h3>
        </div>
        <div className="text-center py-8 text-muted-foreground">Loading community posts...</div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <Icon name="Users" size={16} color="white" />
          </div>
          <h3 className="font-semibold text-card-foreground">Community Activity</h3>
        </div>
        <Button variant="ghost" size="sm" iconName="MessageSquare" iconSize={16}>
          Join
        </Button>
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-700 text-sm">{error}</p>
          <button 
            onClick={loadFeaturedPosts}
            className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
          >
            Try again
          </button>
        </div>
      )}
      <div className="space-y-4">
        {posts?.length > 0 ? (
          posts?.map((post) => (
            <div key={post?.id} className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="User" size={14} color="white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-card-foreground truncate">
                      {post?.is_anonymous 
                        ? post?.author?.anonymous_id || 'Anonymous User' : post?.author?.full_name ||'Community Member'
                      }
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(post?.created_at)}
                    </span>
                    {post?.category && (
                      <>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                          {post?.category}
                        </span>
                      </>
                    )}
                  </div>
                  
                  <h4 className="font-medium text-card-foreground mb-1 line-clamp-1">
                    {post?.title}
                  </h4>
                  
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {post?.content}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <button 
                      onClick={() => handleLikePost(post?.id)}
                      className="flex items-center space-x-1 hover:text-accent transition-colors"
                    >
                      <Icon name="Heart" size={12} />
                      <span>{post?.likes_count || 0}</span>
                    </button>
                    
                    <div className="flex items-center space-x-1">
                      <Icon name="MessageCircle" size={12} />
                      <span>{post?.comments_count || 0}</span>
                    </div>
                    
                    <button className="flex items-center space-x-1 hover:text-primary transition-colors">
                      <Icon name="Share2" size={12} />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Users" size={24} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-4">No community posts yet</p>
            <Button variant="default" iconName="Plus" iconSize={16}>
              Start a Discussion
            </Button>
          </div>
        )}
      </div>
      {posts?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {posts?.length} featured post{posts?.length !== 1 ? 's' : ''}
            </span>
            <button className="text-primary hover:underline">
              View community →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityActivity;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { ResourcesService } from '../../../services/resourcesService';

const ResourceHighlights = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFeaturedResources();
  }, []);

  const loadFeaturedResources = async () => {
    setLoading(true);
    setError(null);

    const { data, error: resourcesError } = await ResourcesService?.getFeaturedResources(4);
    
    if (resourcesError) {
      setError(resourcesError?.message || 'Failed to load resources');
      setResources([]);
    } else {
      setResources(data || []);
    }
    
    setLoading(false);
  };

  const getResourceTypeIcon = (type) => {
    switch (type) {
      case 'article':
        return 'FileText';
      case 'video':
        return 'Play';
      case 'audio':
        return 'Headphones';
      case 'exercise':
        return 'Activity';
      case 'assessment':
        return 'Clipboard';
      default:
        return 'Book';
    }
  };

  const getResourceTypeColor = (type) => {
    switch (type) {
      case 'article':
        return 'text-blue-600 bg-blue-100';
      case 'video':
        return 'text-red-600 bg-red-100';
      case 'audio':
        return 'text-purple-600 bg-purple-100';
      case 'exercise':
        return 'text-green-600 bg-green-100';
      case 'assessment':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-warning rounded-lg flex items-center justify-center">
            <Icon name="BookOpen" size={16} color="white" />
          </div>
          <h3 className="font-semibold text-card-foreground">Resource Highlights</h3>
        </div>
        <div className="text-center py-8 text-muted-foreground">Loading resources...</div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-warning rounded-lg flex items-center justify-center">
            <Icon name="BookOpen" size={16} color="white" />
          </div>
          <h3 className="font-semibold text-card-foreground">Resource Highlights</h3>
        </div>
        <Link to="/resource-library">
          <Button variant="ghost" size="sm" iconName="ExternalLink" iconSize={16}>
            Browse
          </Button>
        </Link>
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-700 text-sm">{error}</p>
          <button 
            onClick={loadFeaturedResources}
            className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
          >
            Try again
          </button>
        </div>
      )}
      <div className="space-y-3">
        {resources?.length > 0 ? (
          resources?.map((resource) => (
            <div
              key={resource?.id}
              className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors cursor-pointer"
            >
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getResourceTypeColor(resource?.resource_type)}`}>
                  <Icon 
                    name={getResourceTypeIcon(resource?.resource_type)} 
                    size={16} 
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-card-foreground truncate">
                      {resource?.title}
                    </h4>
                    {resource?.duration_minutes && (
                      <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                        {resource?.duration_minutes}min
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {resource?.description || 'Helpful resource for your wellness journey'}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                      {resource?.category && (
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-full">
                          {resource?.category}
                        </span>
                      )}
                      
                      {resource?.view_count > 0 && (
                        <div className="flex items-center space-x-1">
                          <Icon name="Eye" size={12} />
                          <span>{resource?.view_count}</span>
                        </div>
                      )}
                      
                      {resource?.rating > 0 && (
                        <div className="flex items-center space-x-1">
                          <Icon name="Star" size={12} />
                          <span>{resource?.rating?.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    
                    <Button variant="ghost" size="xs" iconName="ArrowRight" iconSize={12}>
                      View
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="BookOpen" size={24} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-4">No featured resources available</p>
            <Link to="/resource-library">
              <Button variant="default" iconName="Search" iconSize={16}>
                Explore Resources
              </Button>
            </Link>
          </div>
        )}
      </div>
      {resources?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {resources?.length} featured resource{resources?.length !== 1 ? 's' : ''}
            </span>
            <Link to="/resource-library" className="text-primary hover:underline">
              View library →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceHighlights;
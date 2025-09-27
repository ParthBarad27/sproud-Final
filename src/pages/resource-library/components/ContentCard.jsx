import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ContentCard = ({ 
  content, 
  onBookmark, 
  onPlay, 
  isBookmarked = false,
  showProgress = false,
  progress = 0 
}) => {
  const getDurationDisplay = (duration) => {
    if (duration < 60) return `${duration}m`;
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'Beginner': return 'bg-success text-success-foreground';
      case 'Intermediate': return 'bg-warning text-warning-foreground';
      case 'Advanced': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video': return 'Play';
      case 'meditation': return 'Brain';
      case 'audio': return 'Headphones';
      case 'worksheet': return 'FileText';
      case 'sleep': return 'Moon';
      default: return 'BookOpen';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-gentle-hover transition-all duration-300 group">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={content?.thumbnail}
          alt={content?.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Play Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button
            variant="default"
            size="icon"
            className="w-12 h-12 rounded-full bg-white/90 text-primary hover:bg-white"
            iconName={getTypeIcon(content?.type)}
            iconSize={20}
            onClick={() => onPlay(content)}
          />
        </div>

        {/* Duration Badge */}
        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
          {getDurationDisplay(content?.duration)}
        </div>

        {/* Type Badge */}
        <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium capitalize">
          {content?.type}
        </div>

        {/* Progress Bar */}
        {showProgress && progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-card-foreground line-clamp-2 flex-1 mr-2">
            {content?.title}
          </h3>
          <Button
            variant="ghost"
            size="xs"
            iconName={isBookmarked ? "Bookmark" : "BookmarkPlus"}
            iconSize={16}
            className={`flex-shrink-0 ${isBookmarked ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
            onClick={() => onBookmark(content?.id)}
          />
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {content?.description}
        </p>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full ${getDifficultyColor(content?.difficulty)}`}>
              {content?.difficulty}
            </span>
            <div className="flex items-center text-muted-foreground">
              <Icon name="Star" size={12} className="mr-1" />
              <span>{content?.rating}</span>
            </div>
          </div>
          
          <div className="flex items-center text-muted-foreground">
            <Icon name="Users" size={12} className="mr-1" />
            <span>{content?.completions}+ completed</span>
          </div>
        </div>

        {/* Tags */}
        {content?.tags && content?.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {content?.tags?.slice(0, 3)?.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs"
              >
                {tag}
              </span>
            ))}
            {content?.tags?.length > 3 && (
              <span className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs">
                +{content?.tags?.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentCard;
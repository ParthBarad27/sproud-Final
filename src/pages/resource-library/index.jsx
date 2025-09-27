import React, { useState, useEffect } from 'react';

import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import ContentCard from './components/ContentCard';
import FilterSidebar from './components/FilterSidebar';
import SearchHeader from './components/SearchHeader';
import ContentPlayer from './components/ContentPlayer';
import PlaylistManager from './components/PlaylistManager';
import ProgressTracker from './components/ProgressTracker';

const ResourceLibrary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: [],
    difficulty: [],
    duration: [],
    category: []
  });
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [bookmarkedItems, setBookmarkedItems] = useState(new Set());
  const [playlists, setPlaylists] = useState([]);
  const [isPlaylistManagerOpen, setIsPlaylistManagerOpen] = useState(false);
  const [playlistContent, setPlaylistContent] = useState(null);
  const [activeTab, setActiveTab] = useState('browse');

  // Mock content data
  const mockContent = [
    {
      id: 1,
      title: "Managing Academic Stress: A Complete Guide",
      description: "Learn evidence-based techniques to handle academic pressure, exam anxiety, and study-related stress effectively.",
      type: "video",
      category: "Academic Stress",
      difficulty: "Beginner",
      duration: 25,
      rating: 4.8,
      completions: 1250,
      thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=225&fit=crop",
      tags: ["stress", "academics", "coping", "study tips"],
      mediaUrl: "/mock-video.mp4"
    },
    {
      id: 2,
      title: "10-Minute Morning Meditation for Students",
      description: "Start your day with clarity and focus using this guided meditation designed specifically for students.",
      type: "meditation",
      category: "Mindfulness",
      difficulty: "Beginner",
      duration: 10,
      rating: 4.9,
      completions: 2100,
      thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=225&fit=crop",
      tags: ["meditation", "morning", "focus", "mindfulness"],
      mediaUrl: "/mock-audio.mp3"
    },
    {
      id: 3,
      title: "CBT Worksheet: Challenging Negative Thoughts",
      description: "Interactive worksheet to identify and challenge negative thought patterns that affect your mental well-being.",
      type: "worksheet",
      category: "Cognitive Therapy",
      difficulty: "Intermediate",
      duration: 15,
      rating: 4.7,
      completions: 890,
      thumbnail: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=225&fit=crop",
      tags: ["CBT", "thoughts", "worksheet", "therapy"],
      mediaUrl: "/mock-worksheet.pdf"
    },
    {
      id: 4,
      title: "Sleep Stories: Peaceful Campus Nights",
      description: "Drift off to sleep with calming stories set in peaceful college environments, designed to ease your mind.",
      type: "sleep",
      category: "Sleep & Rest",
      difficulty: "Beginner",
      duration: 45,
      rating: 4.6,
      completions: 1580,
      thumbnail: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=225&fit=crop",
      tags: ["sleep", "stories", "relaxation", "bedtime"],
      mediaUrl: "/mock-sleep-story.mp3"
    },
    {
      id: 5,
      title: "Building Healthy Relationships in College",
      description: "Navigate friendships, romantic relationships, and social connections during your college years with confidence.",
      type: "video",
      category: "Relationships",
      difficulty: "Intermediate",
      duration: 35,
      rating: 4.5,
      completions: 750,
      thumbnail: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=225&fit=crop",
      tags: ["relationships", "social", "communication", "college"],
      mediaUrl: "/mock-video-2.mp4"
    },
    {
      id: 6,
      title: "Focus Sounds: Library Ambience",
      description: "Enhance your concentration with carefully curated background sounds that mimic a peaceful library environment.",
      type: "audio",
      category: "Focus & Study",
      difficulty: "Beginner",
      duration: 60,
      rating: 4.4,
      completions: 2300,
      thumbnail: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=225&fit=crop",
      tags: ["focus", "study", "ambience", "concentration"],
      mediaUrl: "/mock-focus-sounds.mp3"
    }
  ];

  // Filter and search content
  const filteredContent = mockContent?.filter(item => {
    // Search filter
    if (searchQuery && !item?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) &&
        !item?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase()) &&
        !item?.tags?.some(tag => tag?.toLowerCase()?.includes(searchQuery?.toLowerCase()))) {
      return false;
    }

    // Type filter
    if (filters?.type?.length > 0 && !filters?.type?.includes(item?.type)) {
      return false;
    }

    // Difficulty filter
    if (filters?.difficulty?.length > 0 && !filters?.difficulty?.includes(item?.difficulty)) {
      return false;
    }

    // Duration filter
    if (filters?.duration?.length > 0) {
      const durationMatch = filters?.duration?.some(range => {
        switch (range) {
          case '0-10': return item?.duration <= 10;
          case '10-30': return item?.duration > 10 && item?.duration <= 30;
          case '30-60': return item?.duration > 30 && item?.duration <= 60;
          case '60+': return item?.duration > 60;
          default: return false;
        }
      });
      if (!durationMatch) return false;
    }

    // Category filter
    if (filters?.category?.length > 0) {
      const categoryMatch = filters?.category?.some(cat => {
        switch (cat) {
          case 'stress': return item?.category?.toLowerCase()?.includes('stress');
          case 'anxiety': return item?.tags?.includes('anxiety') || item?.category?.toLowerCase()?.includes('anxiety');
          case 'relationships': return item?.category?.toLowerCase()?.includes('relationship');
          case 'sleep': return item?.category?.toLowerCase()?.includes('sleep') || item?.type === 'sleep';
          case 'focus': return item?.category?.toLowerCase()?.includes('focus') || item?.tags?.includes('focus');
          case 'cultural': return item?.tags?.includes('cultural') || item?.category?.toLowerCase()?.includes('cultural');
          default: return false;
        }
      });
      if (!categoryMatch) return false;
    }

    return true;
  });

  // Sort content
  const sortedContent = [...filteredContent]?.sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return b?.id - a?.id;
      case 'popular':
        return b?.completions - a?.completions;
      case 'rating':
        return b?.rating - a?.rating;
      case 'duration-short':
        return a?.duration - b?.duration;
      case 'duration-long':
        return b?.duration - a?.duration;
      default:
        return 0;
    }
  });

  const handleFilterChange = (sectionId, newFilters) => {
    setFilters(prev => ({
      ...prev,
      [sectionId]: newFilters
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      type: [],
      difficulty: [],
      duration: [],
      category: []
    });
  };

  const handleBookmark = (contentId) => {
    setBookmarkedItems(prev => {
      const newSet = new Set(prev);
      if (newSet?.has(contentId)) {
        newSet?.delete(contentId);
      } else {
        newSet?.add(contentId);
      }
      return newSet;
    });
  };

  const handlePlayContent = (content) => {
    setSelectedContent(content);
  };

  const handleNextContent = () => {
    if (selectedContent) {
      const currentIndex = sortedContent?.findIndex(item => item?.id === selectedContent?.id);
      if (currentIndex < sortedContent?.length - 1) {
        setSelectedContent(sortedContent?.[currentIndex + 1]);
      }
    }
  };

  const handlePreviousContent = () => {
    if (selectedContent) {
      const currentIndex = sortedContent?.findIndex(item => item?.id === selectedContent?.id);
      if (currentIndex > 0) {
        setSelectedContent(sortedContent?.[currentIndex - 1]);
      }
    }
  };

  const handleCreatePlaylist = (playlist) => {
    setPlaylists(prev => [...prev, playlist]);
  };

  const handleAddToPlaylist = (playlistId, content) => {
    setPlaylists(prev => prev?.map(playlist => 
      playlist?.id === playlistId 
        ? { ...playlist, items: [...playlist?.items, content] }
        : playlist
    ));
  };

  const handleRemoveFromPlaylist = (playlistId, contentId) => {
    setPlaylists(prev => prev?.map(playlist => 
      playlist?.id === playlistId 
        ? { ...playlist, items: playlist?.items?.filter(item => item?.id !== contentId) }
        : playlist
    ));
  };

  const tabs = [
    { id: 'browse', label: 'Browse', icon: 'Search' },
    { id: 'playlists', label: 'My Playlists', icon: 'Music' },
    { id: 'progress', label: 'Progress', icon: 'TrendingUp' },
    { id: 'bookmarks', label: 'Bookmarked', icon: 'Bookmark' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Resource Library
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Discover curated mental health content including expert-verified videos, guided meditations, 
                and interactive therapeutic materials designed for your wellness journey.
              </p>
              
              {/* Quick Stats */}
              <div className="flex items-center justify-center space-x-8 text-sm">
                <div className="flex items-center space-x-2">
                  <Icon name="Play" size={16} className="text-primary" />
                  <span>139+ Videos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Brain" size={16} className="text-secondary" />
                  <span>85+ Meditations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="FileText" size={16} className="text-accent" />
                  <span>42+ Worksheets</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Users" size={16} className="text-success" />
                  <span>15K+ Students</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation Tabs */}
          <div className="flex items-center space-x-1 mb-8 bg-muted p-1 rounded-lg w-fit">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab?.id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'browse' && (
            <div className="flex gap-8">
              {/* Sidebar */}
              <div className="hidden lg:block w-80 flex-shrink-0">
                <FilterSidebar
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                  isOpen={isFilterOpen}
                  onToggle={() => setIsFilterOpen(!isFilterOpen)}
                />
              </div>

              {/* Main Content */}
              <div className="flex-1 min-w-0">
                <SearchHeader
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  totalResults={sortedContent?.length}
                />

                {/* Mobile Filter */}
                <div className="lg:hidden">
                  <FilterSidebar
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                    isOpen={isFilterOpen}
                    onToggle={() => setIsFilterOpen(!isFilterOpen)}
                  />
                </div>

                {/* Content Grid */}
                <div className="mt-6">
                  {sortedContent?.length === 0 ? (
                    <div className="text-center py-12">
                      <Icon name="Search" size={48} className="mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium text-muted-foreground mb-2">
                        No content found
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Try adjusting your search or filters to find what you're looking for.
                      </p>
                      <Button
                        variant="outline"
                        onClick={handleClearFilters}
                        iconName="RotateCcw"
                        iconPosition="left"
                        iconSize={16}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  ) : (
                    <div className={`grid gap-6 ${
                      viewMode === 'grid' ?'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' :'grid-cols-1'
                    }`}>
                      {sortedContent?.map((content) => (
                        <ContentCard
                          key={content?.id}
                          content={content}
                          onBookmark={handleBookmark}
                          onPlay={handlePlayContent}
                          isBookmarked={bookmarkedItems?.has(content?.id)}
                          showProgress={true}
                          progress={Math.floor(Math.random() * 100)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'playlists' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">My Playlists</h2>
                  <p className="text-muted-foreground">Organize your favorite content</p>
                </div>
                <Button
                  variant="default"
                  iconName="Plus"
                  iconPosition="left"
                  iconSize={16}
                  onClick={() => setIsPlaylistManagerOpen(true)}
                >
                  Create Playlist
                </Button>
              </div>

              {playlists?.length === 0 ? (
                <div className="text-center py-12">
                  <Icon name="Music" size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    No playlists yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first playlist to organize your favorite content
                  </p>
                  <Button
                    variant="default"
                    iconName="Plus"
                    iconPosition="left"
                    iconSize={16}
                    onClick={() => setIsPlaylistManagerOpen(true)}
                  >
                    Create Playlist
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {playlists?.map((playlist) => (
                    <div key={playlist?.id} className="bg-card border border-border rounded-lg p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon name="Music" size={20} className="text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{playlist?.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {playlist?.items?.length} item{playlist?.items?.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        fullWidth
                        iconName="Play"
                        iconPosition="left"
                        iconSize={14}
                      >
                        Play All
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'progress' && (
            <ProgressTracker
              weeklyProgress={{}}
              streaks={{}}
              achievements={[]}
              onViewDetails={() => {}}
            />
          )}

          {activeTab === 'bookmarks' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold">Bookmarked Content</h2>
                <p className="text-muted-foreground">Your saved resources for quick access</p>
              </div>

              {bookmarkedItems?.size === 0 ? (
                <div className="text-center py-12">
                  <Icon name="Bookmark" size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    No bookmarks yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Bookmark content while browsing to save it for later
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('browse')}
                    iconName="Search"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Browse Content
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {mockContent?.filter(content => bookmarkedItems?.has(content?.id))?.map((content) => (
                      <ContentCard
                        key={content?.id}
                        content={content}
                        onBookmark={handleBookmark}
                        onPlay={handlePlayContent}
                        isBookmarked={true}
                        showProgress={true}
                        progress={Math.floor(Math.random() * 100)}
                      />
                    ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Access Floating Button */}
        <div className="fixed bottom-6 right-6 z-40">
          <Button
            variant="default"
            size="icon"
            className="w-14 h-14 rounded-full shadow-gentle-hover breathing-animation"
            iconName="Headphones"
            iconSize={24}
            onClick={() => {
              const meditationContent = mockContent?.find(c => c?.type === 'meditation');
              if (meditationContent) {
                handlePlayContent(meditationContent);
              }
            }}
          />
        </div>

        {/* Content Player Modal */}
        {selectedContent && (
          <ContentPlayer
            content={selectedContent}
            onClose={() => setSelectedContent(null)}
            onNext={handleNextContent}
            onPrevious={handlePreviousContent}
            hasNext={sortedContent?.findIndex(item => item?.id === selectedContent?.id) < sortedContent?.length - 1}
            hasPrevious={sortedContent?.findIndex(item => item?.id === selectedContent?.id) > 0}
          />
        )}

        {/* Playlist Manager Modal */}
        <PlaylistManager
          playlists={playlists}
          onCreatePlaylist={handleCreatePlaylist}
          onAddToPlaylist={handleAddToPlaylist}
          onRemoveFromPlaylist={handleRemoveFromPlaylist}
          selectedContent={playlistContent}
          isOpen={isPlaylistManagerOpen}
          onClose={() => {
            setIsPlaylistManagerOpen(false);
            setPlaylistContent(null);
          }}
        />
      </div>
    </div>
  );
};

export default ResourceLibrary;
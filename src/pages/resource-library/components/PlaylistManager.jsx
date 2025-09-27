import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const PlaylistManager = ({ 
  playlists, 
  onCreatePlaylist, 
  onAddToPlaylist, 
  onRemoveFromPlaylist,
  selectedContent = null,
  isOpen,
  onClose 
}) => {
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreatePlaylist = () => {
    if (newPlaylistName?.trim()) {
      onCreatePlaylist({
        id: Date.now()?.toString(),
        name: newPlaylistName?.trim(),
        description: '',
        items: selectedContent ? [selectedContent] : [],
        createdAt: new Date(),
        thumbnail: selectedContent?.thumbnail || null
      });
      setNewPlaylistName('');
      setIsCreating(false);
      if (selectedContent) {
        onClose();
      }
    }
  };

  const handleAddToPlaylist = (playlistId) => {
    if (selectedContent) {
      onAddToPlaylist(playlistId, selectedContent);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-gentle-hover w-full max-w-md max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-semibold text-lg">
            {selectedContent ? 'Add to Playlist' : 'Manage Playlists'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            iconSize={16}
            onClick={onClose}
          />
        </div>

        {/* Selected Content Info */}
        {selectedContent && (
          <div className="p-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src={selectedContent?.thumbnail} 
                  alt={selectedContent?.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm line-clamp-1">{selectedContent?.title}</h3>
                <p className="text-xs text-muted-foreground">{selectedContent?.type} • {selectedContent?.duration}m</p>
              </div>
            </div>
          </div>
        )}

        {/* Create New Playlist */}
        <div className="p-4 border-b border-border">
          {!isCreating ? (
            <Button
              variant="outline"
              fullWidth
              iconName="Plus"
              iconPosition="left"
              iconSize={16}
              onClick={() => setIsCreating(true)}
            >
              Create New Playlist
            </Button>
          ) : (
            <div className="space-y-3">
              <Input
                placeholder="Playlist name"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e?.target?.value)}
                onKeyPress={(e) => e?.key === 'Enter' && handleCreatePlaylist()}
                autoFocus
              />
              <div className="flex space-x-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleCreatePlaylist}
                  disabled={!newPlaylistName?.trim()}
                >
                  Create
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsCreating(false);
                    setNewPlaylistName('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Existing Playlists */}
        <div className="flex-1 overflow-y-auto">
          {playlists?.length === 0 ? (
            <div className="p-8 text-center">
              <Icon name="Music" size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium text-muted-foreground mb-2">No playlists yet</h3>
              <p className="text-sm text-muted-foreground">
                Create your first playlist to organize your favorite content
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-2">
              {playlists?.map((playlist) => {
                const isContentInPlaylist = selectedContent && 
                  playlist?.items?.some(item => item?.id === selectedContent?.id);
                
                return (
                  <div
                    key={playlist?.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                      isContentInPlaylist 
                        ? 'border-primary bg-primary/5' :'border-border hover:bg-muted'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                      {playlist?.thumbnail ? (
                        <img 
                          src={playlist?.thumbnail} 
                          alt={playlist?.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Icon name="Music" size={16} className="text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-1">{playlist?.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {playlist?.items?.length} item{playlist?.items?.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    {selectedContent && (
                      <Button
                        variant={isContentInPlaylist ? "default" : "outline"}
                        size="sm"
                        iconName={isContentInPlaylist ? "Check" : "Plus"}
                        iconSize={14}
                        onClick={() => {
                          if (isContentInPlaylist) {
                            onRemoveFromPlaylist(playlist?.id, selectedContent?.id);
                          } else {
                            handleAddToPlaylist(playlist?.id);
                          }
                        }}
                      >
                        {isContentInPlaylist ? 'Added' : 'Add'}
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {!selectedContent && (
          <div className="p-4 border-t border-border">
            <Button
              variant="outline"
              fullWidth
              iconName="FolderOpen"
              iconPosition="left"
              iconSize={16}
            >
              View All Playlists
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistManager;
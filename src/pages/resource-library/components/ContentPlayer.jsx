import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const ContentPlayer = ({ content, onClose, onNext, onPrevious, hasNext, hasPrevious }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showTranscript, setShowTranscript] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  const mockTranscript = [
    { time: 0, text: "Welcome to this guided meditation session. Find a comfortable position and close your eyes." },
    { time: 15, text: "Take a deep breath in through your nose, and slowly exhale through your mouth." },
    { time: 30, text: "Notice the sensation of your breath as it enters and leaves your body." },
    { time: 45, text: "If your mind wanders, gently bring your attention back to your breathing." },
    { time: 60, text: "Continue to breathe naturally, allowing yourself to relax with each exhale." }
  ];

  const mockKeyTakeaways = [
    "Practice deep breathing for immediate stress relief",
    "Use the 4-7-8 breathing technique before exams",
    "Regular meditation improves focus and concentration",
    "Mindfulness helps manage academic pressure effectively"
  ];

  useEffect(() => {
    const mediaElement = content?.type === 'video' ? videoRef?.current : audioRef?.current;
    if (mediaElement) {
      const updateTime = () => setCurrentTime(mediaElement?.currentTime);
      const updateDuration = () => setDuration(mediaElement?.duration);
      
      mediaElement?.addEventListener('timeupdate', updateTime);
      mediaElement?.addEventListener('loadedmetadata', updateDuration);
      
      return () => {
        mediaElement?.removeEventListener('timeupdate', updateTime);
        mediaElement?.removeEventListener('loadedmetadata', updateDuration);
      };
    }
  }, [content?.type]);

  const togglePlayPause = () => {
    const mediaElement = content?.type === 'video' ? videoRef?.current : audioRef?.current;
    if (mediaElement) {
      if (isPlaying) {
        mediaElement?.pause();
      } else {
        mediaElement?.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e) => {
    const mediaElement = content?.type === 'video' ? videoRef?.current : audioRef?.current;
    if (mediaElement) {
      const rect = e?.currentTarget?.getBoundingClientRect();
      const pos = (e?.clientX - rect?.left) / rect?.width;
      mediaElement.currentTime = pos * duration;
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds?.toString()?.padStart(2, '0')}`;
  };

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <div className="w-full h-full max-w-6xl mx-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-black/50">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              iconName="ArrowLeft"
              iconSize={20}
              onClick={onClose}
              className="text-white hover:bg-white/20"
            />
            <div>
              <h2 className="text-white font-semibold">{content?.title}</h2>
              <p className="text-white/70 text-sm">{content?.category} • {content?.difficulty}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="FileText"
              iconSize={16}
              onClick={() => setShowTranscript(!showTranscript)}
              className={`text-white hover:bg-white/20 ${showTranscript ? 'bg-white/20' : ''}`}
            >
              Transcript
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName="Bookmark"
              iconSize={16}
              className="text-white hover:bg-white/20"
            />
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              iconSize={20}
              onClick={onClose}
              className="text-white hover:bg-white/20"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Media Player */}
          <div className="flex-1 flex flex-col">
            {/* Video/Audio Player */}
            <div className="flex-1 flex items-center justify-center bg-black">
              {content?.type === 'video' ? (
                <video
                  ref={videoRef}
                  className="max-w-full max-h-full"
                  poster={content?.thumbnail}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                >
                  <source src={content?.mediaUrl} type="video/mp4" />
                </video>
              ) : (
                <div className="flex flex-col items-center space-y-6">
                  <Image
                    src={content?.thumbnail}
                    alt={content?.title}
                    className="w-64 h-64 rounded-lg object-cover"
                  />
                  <audio
                    ref={audioRef}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  >
                    <source src={content?.mediaUrl} type="audio/mp3" />
                  </audio>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="bg-black/80 p-4 space-y-4">
              {/* Progress Bar */}
              <div className="flex items-center space-x-3">
                <span className="text-white text-sm">{formatTime(currentTime)}</span>
                <div 
                  className="flex-1 h-2 bg-white/20 rounded-full cursor-pointer"
                  onClick={handleSeek}
                >
                  <div 
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-white text-sm">{formatTime(duration)}</span>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="SkipBack"
                    iconSize={20}
                    onClick={onPrevious}
                    disabled={!hasPrevious}
                    className="text-white hover:bg-white/20 disabled:opacity-50"
                  />
                  <Button
                    variant="ghost"
                    size="lg"
                    iconName={isPlaying ? "Pause" : "Play"}
                    iconSize={24}
                    onClick={togglePlayPause}
                    className="text-white hover:bg-white/20"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="SkipForward"
                    iconSize={20}
                    onClick={onNext}
                    disabled={!hasNext}
                    className="text-white hover:bg-white/20 disabled:opacity-50"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  {/* Speed Control */}
                  <select
                    value={playbackSpeed}
                    onChange={(e) => setPlaybackSpeed(parseFloat(e?.target?.value))}
                    className="bg-white/20 text-white border border-white/30 rounded px-2 py-1 text-sm"
                  >
                    {speedOptions?.map(speed => (
                      <option key={speed} value={speed} className="bg-black">
                        {speed}x
                      </option>
                    ))}
                  </select>

                  {/* Volume Control */}
                  <div className="flex items-center space-x-2">
                    <Icon name="Volume2" size={16} className="text-white" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e?.target?.value))}
                      className="w-20"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          {showTranscript && (
            <div className="w-80 bg-background border-l border-border flex flex-col">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold mb-2">Interactive Transcript</h3>
                <p className="text-sm text-muted-foreground">
                  Click on any text to jump to that moment
                </p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {mockTranscript?.map((item, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      currentTime >= item?.time && currentTime < (mockTranscript?.[index + 1]?.time || duration)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                    onClick={() => {
                      const mediaElement = content?.type === 'video' ? videoRef?.current : audioRef?.current;
                      if (mediaElement) {
                        mediaElement.currentTime = item?.time;
                      }
                    }}
                  >
                    <div className="text-xs opacity-70 mb-1">{formatTime(item?.time)}</div>
                    <div className="text-sm">{item?.text}</div>
                  </div>
                ))}
              </div>

              {/* Key Takeaways */}
              <div className="p-4 border-t border-border">
                <h4 className="font-medium mb-3">Key Takeaways</h4>
                <div className="space-y-2">
                  {mockKeyTakeaways?.map((takeaway, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Icon name="CheckCircle" size={16} className="text-success mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{takeaway}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentPlayer;
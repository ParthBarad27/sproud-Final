import React, { useEffect, useState } from 'react';

const YOUTUBE_API_KEY = "AIzaSyChkyZguK5COp4pMJsMSGVpx6zKRfNhPNI";
const FREESOUND_API_KEY = "Sf3jOQtlrBmplQ6hbUUVDY0vsWMFBP3tvW3fwPJQ";

// Mental wellness articles data
const wellnessArticles = [
  {
    id: 1,
    title: "5 Breathing Techniques to Reduce Anxiety",
    excerpt: "Learn simple yet effective breathing exercises that can help calm your mind and reduce anxiety in stressful moments.",
    content: "Deep breathing is one of the most effective ways to activate your body's relaxation response. Try the 4-7-8 technique: inhale for 4 counts, hold for 7, exhale for 8. This pattern helps regulate your nervous system and promotes calm.",
    author: "Dr. Sarah Johnson",
    readTime: "3 min read",
    category: "Anxiety Management",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop"
  },
  {
    id: 2,
    title: "Creating a Mindful Morning Routine",
    excerpt: "Start your day with intention and peace through these gentle morning practices designed to center your mind.",
    content: "A mindful morning sets the tone for your entire day. Begin with 5 minutes of meditation, practice gratitude by writing down three things you're thankful for, and set a positive intention for the day ahead.",
    author: "Maya Patel",
    readTime: "5 min read",
    category: "Mindfulness",
    image: "https://images.unsplash.com/photo-1471958680802-1345a694ba6d?w=400&h=200&fit=crop"
  },
  {
    id: 3,
    title: "The Science of Self-Compassion",
    excerpt: "Discover how treating yourself with kindness can improve your mental health and overall well-being.",
    content: "Self-compassion involves treating yourself with the same kindness you'd show a good friend. Research shows that self-compassionate people experience less anxiety and depression while building greater emotional resilience.",
    author: "Dr. Michael Chen",
    readTime: "4 min read",
    category: "Self-Care",
    image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&h=200&fit=crop"
  },
  {
    id: 4,
    title: "Nature Therapy: Healing in Green Spaces",
    excerpt: "Explore the profound healing benefits of spending time in nature and how it can restore mental balance.",
    content: "Studies show that spending just 20 minutes in nature can significantly reduce stress hormones. Whether it's a walk in the park or sitting under a tree, nature connection is a powerful tool for mental wellness.",
    author: "Dr. Emma Rodriguez",
    readTime: "6 min read",
    category: "Nature Therapy",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=200&fit=crop"
  },
  {
    id: 5,
    title: "Building Emotional Resilience",
    excerpt: "Learn practical strategies to bounce back from life's challenges with greater strength and wisdom.",
    content: "Resilience isn't about avoiding difficult emotions—it's about developing healthy ways to process and learn from them. Practice acknowledging your feelings, seeking support when needed, and viewing challenges as opportunities for growth.",
    author: "Lisa Thompson",
    readTime: "7 min read",
    category: "Emotional Health",
    image: "https://images.unsplash.com/photo-1517960413843-0aee8e2b3285?w=400&h=200&fit=crop"
  },
  {
    id: 6,
    title: "Digital Detox for Mental Clarity",
    excerpt: "Discover how reducing screen time and creating digital boundaries can improve your mental clarity and peace.",
    content: "Constant connectivity can overwhelm our minds. Try implementing phone-free hours, turning off notifications during meals, and creating tech-free spaces in your home to give your mind the rest it needs.",
    author: "Alex Kumar",
    readTime: "4 min read",
    category: "Digital Wellness",
    image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&h=200&fit=crop"
  }
];

export default function ResourceHubPrototype() {
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [sounds, setSounds] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('videos');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch YouTube Videos (mental health content)
        const youtubeResponse = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=meditation+mindfulness+relaxation&type=video&maxResults=9&key=${YOUTUBE_API_KEY}`);
        const youtubeData = await youtubeResponse.json();
        setYoutubeVideos(youtubeData.items || []);

        // Fetch Freesound Audio Clips (relaxing sounds)
        const soundResponse = await fetch("https://freesound.org/apiv2/search/text/?query=meditation+nature+calm&fields=id,name,previews&page_size=9", {
          headers: { Authorization: `Token ${FREESOUND_API_KEY}` }
        });
        const soundData = await soundResponse.json();
        setSounds(soundData.results || []);
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderArticleModal = () => {
    if (!selectedArticle) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl max-h-[80vh] overflow-y-auto animate-scale-in shadow-2xl">
          <div className="relative">
            <img 
              src={selectedArticle.image} 
              alt={selectedArticle.title}
              className="w-full h-48 object-cover rounded-t-xl"
            />
            <button 
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-all duration-200 shadow-sm"
            >
              <span className="text-gray-600 text-xl">×</span>
            </button>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium">{selectedArticle.category}</span>
              <span className="text-sm text-gray-500">{selectedArticle.readTime}</span>
            </div>
            <h2 className="text-2xl font-bold mb-3 text-gray-700">
              {selectedArticle.title}
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              By {selectedArticle.author}
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              {selectedArticle.content}
            </p>
            <div className="pt-4 border-t border-gray-200">
              <button 
                onClick={() => setSelectedArticle(null)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-all duration-300 w-full"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50">
      {/* Peaceful Header with Background */}
      <div className="relative py-24 mb-12 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=800&fit=crop&crop=center')`,
          }}
        ></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-200/80 via-blue-200/70 to-teal-200/80"></div>
        
        {/* Glass Effect Overlay */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
        
        {/* Content */}
        <div className="container-lg text-center relative z-10">
          <h1 className="text-6xl md:text-7xl font-light mb-6 animate-fade-in text-white drop-shadow-lg">
            🌿 Serenity Space
          </h1>
          <p className="text-xl text-white/90 animate-slide-up font-light max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
            Your peaceful sanctuary for mental wellness, mindful content, and inner tranquility
          </p>
        </div>
        
        {/* Floating Decorative Elements */}
        <div className="absolute top-12 left-12 w-24 h-24 bg-white/20 rounded-full animate-pulse blur-sm"></div>
        <div className="absolute top-40 right-20 w-20 h-20 bg-white/15 rounded-full animate-pulse blur-sm" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-16 left-1/3 w-16 h-16 bg-white/25 rounded-full animate-pulse blur-sm" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-20 right-1/3 w-12 h-12 bg-white/20 rounded-full animate-pulse blur-sm" style={{animationDelay: '1.5s'}}></div>
        
        {/* Decorative Wave at Bottom */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg 
            className="relative block w-full h-16" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none"
          >
            <path 
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
              opacity=".25" 
              fill="currentColor"
              className="text-green-50"
            ></path>
            <path 
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
              opacity=".5" 
              fill="currentColor"
              className="text-blue-50"
            ></path>
            <path 
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
              fill="currentColor"
              className="text-white"
            ></path>
          </svg>
        </div>
      </div>

      <div className="container-lg">
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-full p-2 shadow-lg border border-white border-opacity-50">
            <div className="flex space-x-2">
              {[
                { id: 'videos', label: '🎬 Mindful Videos', icon: '🧘‍♀️' },
                { id: 'sounds', label: '🎵 Calming Sounds', icon: '🌊' },
                { id: 'articles', label: '📖 Wellness Articles', icon: '🌿' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    activeSection === tab.id
                      ? 'bg-green-100 text-green-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mindful Videos Section */}
        {activeSection === 'videos' && (
          <section className="mb-16 animate-fade-in">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-light text-gray-700 mb-4">
                🧘‍♀️ Mindful Video Collection
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Guided meditations, breathing exercises, and peaceful content to nurture your inner calm
              </p>
              <div className="mt-4">
                <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  {youtubeVideos.length} peaceful videos
                </span>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="spinner mr-3 text-green-400"></div>
                <span className="text-gray-600">Gathering peaceful content...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {youtubeVideos.map((video, index) => (
                  <div 
                    key={video.id.videoId} 
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 group animate-slide-up border border-gray-100"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative overflow-hidden rounded-xl mb-5">
                      <img
                        src={video.snippet.thumbnails.medium.url}
                        alt={video.snippet.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-green-400 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-white text-4xl">▶</span>
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="font-medium text-gray-700 mb-3 truncate-2 leading-relaxed">
                      {video.snippet.title}
                    </h3>
                    
                    <p className="text-sm text-gray-500 mb-5">
                      By {video.snippet.channelTitle}
                    </p>
                    
                    <a
                      href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-100 hover:bg-green-200 text-green-700 px-6 py-3 rounded-xl font-medium transition-all duration-300 w-full text-center block"
                    >
                      🧘‍♀️ Begin Journey
                    </a>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Calming Sounds Section */}
        {activeSection === 'sounds' && (
          <section className="mb-16 animate-fade-in">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-light text-gray-700 mb-4">
                🌊 Tranquil Soundscape
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Immerse yourself in nature's symphony and peaceful ambient sounds for deep relaxation
              </p>
              <div className="mt-4">
                <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm font-medium">
                  {sounds.length} calming sounds
                </span>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="spinner mr-3 text-teal-400"></div>
                <span className="text-gray-600">Curating peaceful sounds...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sounds.map((sound, index) => (
                  <div 
                    key={sound.id} 
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 animate-slide-up border border-gray-100"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="font-medium text-gray-700 truncate flex-1 mr-3">
                        {sound.name}
                      </h3>
                      <span className="bg-teal-50 text-teal-700 px-2 py-1 rounded-full text-xs font-medium shrink-0">
                        🎵
                      </span>
                    </div>
                    
                    <div className="bg-gradient-to-r from-teal-25 to-green-25 rounded-xl p-5">
                      <audio 
                        controls 
                        className="w-full opacity-80 hover:opacity-100 transition-opacity duration-300"
                        style={{ 
                          height: '45px',
                          filter: 'hue-rotate(180deg) saturate(0.8)'
                        }}
                      >
                        <source src={sound.previews && sound.previews['preview-hq-mp3']} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Wellness Articles Section */}
        {activeSection === 'articles' && (
          <section className="mb-16 animate-fade-in">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-light text-gray-700 mb-4">
                🌸 Wisdom & Wellness
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Thoughtful articles and insights to nurture your mental wellness journey
              </p>
              <div className="mt-4">
                <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  {wellnessArticles.length} wellness articles
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {wellnessArticles.map((article, index) => (
                <div 
                  key={article.id} 
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 group animate-slide-up border border-gray-100 cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => setSelectedArticle(article)}
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span>{article.author}</span>
                      <span className="mx-2">•</span>
                      <span>{article.readTime}</span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-700 mb-3 group-hover:text-gray-600 transition-colors duration-300">
                      {article.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 truncate-3">
                      {article.excerpt}
                    </p>
                    
                    <button className="text-gray-500 hover:text-gray-700 font-medium text-sm flex items-center transition-colors duration-300">
                      Read full article
                      <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Peaceful Call to Action */}
        <section className="bg-white bg-opacity-60 backdrop-blur-sm rounded-3xl p-12 text-center mb-16 animate-fade-in border border-gray-200 shadow-lg">
          <h3 className="text-3xl font-light mb-6 text-gray-700">
            🌿 Cultivate Inner Peace
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Your mental wellness journey is unique and valuable. Take a moment to breathe, 
            be kind to yourself, and remember that every small step towards peace matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-green-100 hover:bg-green-200 text-green-700 px-8 py-4 rounded-2xl font-medium transition-all duration-300">
              🤝 Find Support
            </button>
            <button className="border-2 border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-700 px-8 py-4 rounded-2xl font-medium transition-all duration-300">
              🌱 Explore More Resources
            </button>
          </div>
        </section>

        {/* Gentle Footer */}
        <footer className="text-center py-12 border-t border-gray-200">
          <p className="text-gray-500 mb-2">
            🕊️ May you find peace in every moment
          </p>
          <p className="text-sm text-gray-400">
            Remember: You are worthy of love, peace, and happiness
          </p>
        </footer>
      </div>

      {/* Article Modal */}
      {renderArticleModal()}
    </div>
  );
}
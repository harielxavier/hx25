import React, { useState } from 'react';
import { Calendar, List, Instagram, Facebook, Twitter, Linkedin, Plus, Edit, Trash2, Clock, CheckCircle, Image, Video, Link } from 'lucide-react';

const SocialMedia: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calendar' | 'list'>('calendar');
  const [activeFilter, setActiveFilter] = useState<'all' | 'scheduled' | 'published'>('all');
  
  // Mock data for social media posts
  const mockPosts = [
    {
      id: '1',
      content: 'Check out this stunning wedding at Lakeside Gardens! #WeddingPhotography #HarielXavier',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      platforms: ['instagram', 'facebook'],
      status: 'scheduled',
      date: new Date('2025-04-02T10:00:00'),
      type: 'image'
    },
    {
      id: '2',
      content: 'Spring mini sessions now available! Book your spot today. Link in bio.',
      image: 'https://images.unsplash.com/photo-1623944889288-cb1be59a4fe8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      platforms: ['instagram', 'facebook', 'twitter'],
      status: 'published',
      date: new Date('2025-03-25T14:30:00'),
      type: 'image'
    },
    {
      id: '3',
      content: 'Tips for preparing for your family photo session - check out our latest blog post!',
      image: '',
      link: 'https://harielxavier.com/blog/family-photo-tips',
      platforms: ['facebook', 'twitter', 'linkedin'],
      status: 'published',
      date: new Date('2025-03-20T09:15:00'),
      type: 'link'
    },
    {
      id: '4',
      content: 'Behind the scenes from yesterday\'s corporate headshot session. #BehindTheScenes #CorporatePhotography',
      image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      platforms: ['instagram', 'facebook'],
      status: 'scheduled',
      date: new Date('2025-04-05T16:00:00'),
      type: 'image'
    }
  ];
  
  // Filter posts based on active filter
  const filteredPosts = mockPosts.filter(post => {
    return activeFilter === 'all' || post.status === activeFilter;
  });
  
  // Sort posts by date
  const sortedPosts = [...filteredPosts].sort((a, b) => b.date.getTime() - a.date.getTime());
  
  // Platform icons mapping
  const platformIcons = {
    instagram: <Instagram className="h-5 w-5 text-pink-600" />,
    facebook: <Facebook className="h-5 w-5 text-blue-600" />,
    twitter: <Twitter className="h-5 w-5 text-blue-400" />,
    linkedin: <Linkedin className="h-5 w-5 text-blue-700" />
  };
  
  // Type icons mapping
  const typeIcons = {
    image: <Image className="h-5 w-5" />,
    video: <Video className="h-5 w-5" />,
    link: <Link className="h-5 w-5" />
  };
  
  // Function to render post type icon
  const renderTypeIcon = (type: string) => {
    return typeIcons[type as keyof typeof typeIcons] || <Image className="h-5 w-5" />;
  };
  
  // Function to render calendar view
  const renderCalendarView = () => {
    // This would be a more complex calendar implementation
    // For now, we'll just render a simplified version
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium mb-4">April 2025</h2>
        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-medium text-gray-500 text-sm py-2">
              {day}
            </div>
          ))}
          {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
            const postsOnDay = sortedPosts.filter(post => 
              post.date.getDate() === day && post.date.getMonth() === 3 // April is month 3 (0-indexed)
            );
            
            return (
              <div 
                key={day} 
                className={`border rounded-lg p-2 h-24 ${postsOnDay.length > 0 ? 'bg-blue-50' : ''}`}
              >
                <div className="text-right text-sm font-medium">{day}</div>
                {postsOnDay.length > 0 && (
                  <div className="mt-1">
                    {postsOnDay.slice(0, 2).map(post => (
                      <div key={post.id} className="flex items-center text-xs text-gray-600 mt-1">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div>
                        <span className="truncate">{post.content.substring(0, 20)}...</span>
                      </div>
                    ))}
                    {postsOnDay.length > 2 && (
                      <div className="text-xs text-blue-500 mt-1">+{postsOnDay.length - 2} more</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  // Function to render list view
  const renderListView = () => {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {sortedPosts.length === 0 ? (
          <div className="text-center py-12">
            <Instagram className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No posts found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new social media post.
            </p>
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Create Post
              </button>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {sortedPosts.map((post) => (
              <li key={post.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {post.status === 'scheduled' ? (
                          <Clock className="h-6 w-6 text-amber-500" />
                        ) : (
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        )}
                      </div>
                      <div className="ml-4 flex-grow">
                        <div className="flex items-center">
                          <div className="mr-2">
                            {renderTypeIcon(post.type)}
                          </div>
                          <p className="text-sm font-medium text-gray-900 truncate max-w-md">
                            {post.content}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <span>
                            {post.status === 'scheduled' 
                              ? `Scheduled for ${post.date.toLocaleDateString()} at ${post.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` 
                              : `Published on ${post.date.toLocaleDateString()} at ${post.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex space-x-2 mb-2">
                        {post.platforms.map(platform => (
                          <div key={platform}>
                            {platformIcons[platform as keyof typeof platformIcons]}
                          </div>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-1 text-blue-400 hover:text-blue-500">
                          <Edit className="h-5 w-5" />
                        </button>
                        <button className="p-1 text-red-400 hover:text-red-500">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  {post.image && (
                    <div className="mt-2">
                      <img 
                        src={post.image} 
                        alt="Post preview" 
                        className="h-24 w-auto rounded-md object-cover"
                      />
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Social Media</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" />
          <span>Create Post</span>
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg flex items-center">
            <Instagram className="h-8 w-8 text-pink-600 mr-3" />
            <div>
              <h3 className="font-medium">Instagram</h3>
              <p className="text-sm text-gray-500">Connected</p>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg flex items-center">
            <Facebook className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h3 className="font-medium">Facebook</h3>
              <p className="text-sm text-gray-500">Connected</p>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg flex items-center">
            <Twitter className="h-8 w-8 text-blue-400 mr-3" />
            <div>
              <h3 className="font-medium">Twitter</h3>
              <p className="text-sm text-gray-500">Connected</p>
            </div>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg flex items-center">
            <Linkedin className="h-8 w-8 text-gray-400 mr-3" />
            <div>
              <h3 className="font-medium">LinkedIn</h3>
              <p className="text-sm text-gray-500">Connect</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center px-3 py-2 rounded-md ${
              activeTab === 'calendar' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Calendar className="h-5 w-5 mr-1" />
            <span>Calendar</span>
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center px-3 py-2 rounded-md ${
              activeTab === 'list' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <List className="h-5 w-5 mr-1" />
            <span>List</span>
          </button>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 text-sm rounded-md ${
              activeFilter === 'all' 
                ? 'bg-gray-200 text-gray-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter('scheduled')}
            className={`px-3 py-1 text-sm rounded-md ${
              activeFilter === 'scheduled' 
                ? 'bg-amber-100 text-amber-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Scheduled
          </button>
          <button
            onClick={() => setActiveFilter('published')}
            className={`px-3 py-1 text-sm rounded-md ${
              activeFilter === 'published' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Published
          </button>
        </div>
      </div>
      
      {activeTab === 'calendar' ? renderCalendarView() : renderListView()}
    </div>
  );
};

export default SocialMedia;

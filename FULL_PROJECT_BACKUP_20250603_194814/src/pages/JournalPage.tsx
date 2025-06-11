import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Clock, Share2, ChevronDown } from 'lucide-react';
import Navigation from '../components/landing/Navigation';
import SEO from '../components/SEO';

// Rich blog data structure
const stories = [
  {
    id: '1',
    title: "Sarah & John's Central Park Wedding",
    date: "Fall 2023",
    location: "New York City",
    excerpt: "A beautiful autumn wedding in the heart of Manhattan, featuring intimate moments and stunning cityscapes...",
    content: `
      <p>Sarah and John's wedding was a perfect blend of urban sophistication and natural beauty, set against the iconic backdrop of Central Park in the height of autumn...</p>
      <h2>The Venue</h2>
      <p>They chose the Loeb Boathouse for its timeless elegance and stunning views of the lake...</p>
      <h2>The Ceremony</h2>
      <p>As the sun began to set, casting a golden glow through the trees...</p>
    `,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552",
    gallery: [
      "https://images.unsplash.com/photo-1519741497674-611481863552",
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a",
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf"
    ],
    categories: ["Weddings", "Fall Weddings", "City Weddings"],
    tags: ["Central Park", "Fall Colors", "City Wedding"],
    author: {
      name: "Xavier Studio",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
      bio: "Capturing timeless moments across NYC and beyond"
    },
    readingTime: "6 min read",
    views: 1234
  },
  {
    id: '2',
    title: "Emma & James' Beach Celebration",
    date: "Summer 2023",
    location: "Jersey Shore",
    excerpt: "A romantic sunset ceremony by the ocean, where the waves provided the perfect backdrop for this intimate celebration...",
    content: `
      <p>Emma and James chose the pristine beaches of the Jersey Shore for their summer wedding celebration...</p>
      <h2>The Setting</h2>
      <p>With the ocean as their witness and the sand between their toes...</p>
      <h2>The Details</h2>
      <p>Coastal-inspired decor and soft, sandy hues created the perfect beach atmosphere...</p>
    `,
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a",
    gallery: [
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a",
      "https://images.unsplash.com/photo-1519741497674-611481863552",
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf"
    ],
    categories: ["Weddings", "Summer Weddings", "Beach Weddings"],
    tags: ["Beach", "Summer", "Sunset"],
    author: {
      name: "Xavier Studio",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
      bio: "Capturing timeless moments across NYC and beyond"
    },
    readingTime: "5 min read",
    views: 982
  },
  {
    id: '3',
    title: "Maria & David's Garden Wedding",
    date: "Spring 2023",
    location: "Brooklyn Botanic Garden",
    excerpt: "An intimate celebration surrounded by blooming flowers and lush greenery in the heart of Brooklyn...",
    content: `
      <p>The Brooklyn Botanic Garden provided a magical setting for Maria and David's spring wedding...</p>
      <h2>The Garden</h2>
      <p>Cherry blossoms and tulips created a natural cathedral for their vows...</p>
      <h2>The Celebration</h2>
      <p>As day turned to night, the garden transformed into an enchanted wonderland...</p>
    `,
    image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf",
    gallery: [
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf",
      "https://images.unsplash.com/photo-1519741497674-611481863552",
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a"
    ],
    categories: ["Weddings", "Spring Weddings", "Garden Weddings"],
    tags: ["Garden", "Spring", "Brooklyn"],
    author: {
      name: "Xavier Studio",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
      bio: "Capturing timeless moments across NYC and beyond"
    },
    readingTime: "4 min read",
    views: 756
  }
];

export default function JournalPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showMore, setShowMore] = useState(false);

  const categories = Array.from(
    new Set(stories.flatMap(story => story.categories))
  );

  const filteredStories = stories.filter(story => {
    const matchesSearch = 
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = 
      selectedCategory === 'all' || 
      story.categories.includes(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <SEO 
        title="Wedding Stories & Journal | Xavier Studio"
        description="Real wedding stories and behind-the-scenes moments from recent celebrations."
      />
      <Navigation />
      
      <main id="main-content" className="pt-24">
        {/* Hero Section */}
        <section className="relative h-[40vh] flex items-center justify-center mb-12">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1606216794074-735e91aa2c92"
              alt="Wedding Blog"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50" />
          </div>
          <div className="relative text-center text-white px-4">
            <h1 className="font-serif text-5xl mb-4">The Journal</h1>
            <p className="text-xl font-light max-w-2xl mx-auto">
              Wedding photography tips, planning advice, and inspiration
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4">
          {/* Search and Filters */}
          <div className="mb-12 space-y-6">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:border-black transition-colors"
              />
            </div>

            <div className="flex justify-center gap-4 flex-wrap">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Stories
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    selectedCategory === category
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Stories Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredStories.map((story) => (
              <article key={story.id} className="group">
                <Link to={`/blog/${story.id}`} className="block">
                  <div className="relative aspect-[3/2] overflow-hidden mb-4">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {story.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {story.readingTime}
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl mb-2 group-hover:text-primary transition-colors">
                    {story.title}
                  </h2>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {story.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={story.author.avatar}
                        alt={story.author.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm text-gray-500">{story.author.name}</span>
                    </div>
                    <button className="text-primary hover:text-black transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-4 flex gap-2 flex-wrap">
                    {story.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {/* Load More */}
          {filteredStories.length > 6 && (
            <div className="text-center mb-16">
              <button
                onClick={() => setShowMore(!showMore)}
                className="flex items-center gap-2 mx-auto text-primary hover:text-black transition-colors"
              >
                {showMore ? 'Show Less' : 'Load More Stories'}
                <ChevronDown className={`w-4 h-4 transform transition-transform ${
                  showMore ? 'rotate-180' : ''
                }`} />
              </button>
            </div>
          )}

          {/* Newsletter Section */}
          <section className="bg-gray-100 p-12 rounded-lg text-center mb-16">
            <h2 className="font-serif text-3xl mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Get the latest wedding photography tips, trends, and inspiration delivered directly to your inbox.
            </p>
            <form className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:border-black transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </section>
        </div>
      </main>
    </>
  );
}

export { stories }
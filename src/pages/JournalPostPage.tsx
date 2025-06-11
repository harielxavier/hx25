import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, Tag, Share2, ArrowLeft, Facebook, Twitter, Instagram } from 'lucide-react';
import Navigation from '../components/landing/Navigation';
import SEO from '../components/SEO';
import LoadingSpinner from '../components/LoadingSpinner';

// Import the stories data
import { stories } from './JournalPage';

export default function JournalPostPage() {
  const { id } = useParams();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  const story = stories.find(s => s.id === id);
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.scrollY / totalScroll) * 100;
      setScrollProgress(currentProgress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen">
          <LoadingSpinner />
        </div>
      </>
    );
  }

  if (!story) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl mb-4">Story Not Found</h1>
            <Link to="/journal" className="text-primary hover:text-black transition-colors">
              ← Back to Journal
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO 
        title={`${story.title} | Xavier Studio Journal`}
        description={story.excerpt}
        image={story.image}
      />
      <Navigation />

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-primary transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      
      <main id="main-content" className="pt-24">
        {/* Hero Section */}
        <section className="relative h-[60vh] flex items-center justify-center mb-12">
          <div className="absolute inset-0">
            <img 
              src={story.image}
              alt={story.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50" />
          </div>
          <div className="relative text-center text-white px-4">
            <div className="flex items-center justify-center gap-4 mb-6 text-sm">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {story.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {story.readingTime}
              </span>
            </div>
            <h1 className="font-serif text-5xl mb-4">{story.title}</h1>
            <p className="text-xl font-light max-w-2xl mx-auto">
              {story.location}
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Link */}
          <Link 
            to="/journal"
            className="inline-flex items-center gap-2 text-primary hover:text-black transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Journal
          </Link>

          {/* Content */}
          <article className="prose prose-lg max-w-none mb-12">
            <div dangerouslySetInnerHTML={{ __html: story.content }} />
          </article>

          {/* Image Gallery */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            {story.gallery.map((image, index) => (
              <div key={index} className="aspect-square">
                <img
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="flex items-center gap-4 mb-12">
            <Tag className="w-5 h-5 text-gray-400" />
            <div className="flex gap-2 flex-wrap">
              {story.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Author Bio */}
          <div className="bg-gray-100 p-8 rounded-lg mb-12">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={story.author.avatar}
                alt={story.author.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="font-serif text-xl">{story.author.name}</h3>
                <p className="text-gray-600">{story.author.bio}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <a 
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Related Stories */}
          <section className="mb-16">
            <h2 className="font-serif text-3xl mb-8">Related Stories</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedStories.map((story) => (
                <Link 
                  key={story.id}
                  to={`/journal/${story.id}`}
                  className="group"
                >
                  <div className="relative aspect-[3/2] overflow-hidden mb-4">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  </div>
                  <h3 className="font-serif text-xl mb-2 group-hover:text-primary transition-colors">
                    {story.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{story.date}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Share Section */}
          <div className="text-center mb-16">
            <h3 className="font-serif text-2xl mb-4">Share This Story</h3>
            <div className="flex justify-center gap-4">
              <button className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                <Facebook className="w-5 h-5" />
              </button>
              <button className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                <Twitter className="w-5 h-5" />
              </button>
              <button className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { getAllPosts } from '../../services/supabaseBlogService';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string[];
  featured_image: string;
  published_at: string;
  read_time: string;
}

interface RelatedPostsProps {
  currentPostId: string;
  currentCategory: string;
  currentTags: string[];
  limit?: number;
}

/**
 * Related Posts Component
 *
 * Shows related blog posts based on category and tags
 * Keeps readers engaged by suggesting relevant content
 *
 * Algorithm:
 * 1. Match by shared tags (highest priority)
 * 2. Match by same category
 * 3. Fall back to recent posts if no matches
 *
 * Usage:
 * <RelatedPosts
 *   currentPostId={post.id}
 *   currentCategory={post.category}
 *   currentTags={post.tags}
 *   limit={3}
 * />
 */
export const RelatedPosts: React.FC<RelatedPostsProps> = ({
  currentPostId,
  currentCategory,
  currentTags = [],
  limit = 3
}) => {
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        const allPosts = await getAllPosts();

        // Filter out current post
        const otherPosts = allPosts.filter((post: BlogPost) => post.id !== currentPostId);

        // Calculate relevance score for each post
        const postsWithScores = otherPosts.map((post: BlogPost) => {
          let score = 0;

          // Same category: +10 points
          if (post.category === currentCategory) {
            score += 10;
          }

          // Shared tags: +5 points per tag
          const sharedTags = post.tags?.filter((tag: string) =>
            currentTags?.includes(tag)
          ) || [];
          score += sharedTags.length * 5;

          return { ...post, score };
        });

        // Sort by score (highest first), then by published date
        const sorted = postsWithScores.sort((a, b) => {
          if (b.score !== a.score) {
            return b.score - a.score;
          }
          const aDate = a.published_at ? new Date(a.published_at).getTime() : 0;
          const bDate = b.published_at ? new Date(b.published_at).getTime() : 0;
          return bDate - aDate;
        });

        // Take top results
        setRelatedPosts(sorted.slice(0, limit));
      } catch (error) {
        console.error('Error fetching related posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedPosts();
  }, [currentPostId, currentCategory, currentTags, limit]);

  if (loading) {
    return (
      <div className="py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-64 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif mb-4">Continue Reading</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            More wedding photography tips and inspiration
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {relatedPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              <Link to={`/blog/${post.slug}`}>
                <div className="relative overflow-hidden">
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = '/images/placeholders/default.jpg';
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString()
                        : 'Recently'}
                    </span>
                    <Clock className="w-4 h-4 ml-4 mr-2" />
                    <span>{post.read_time || '5 min read'}</span>
                  </div>

                  <h3 className="text-xl font-serif mb-3 line-clamp-2 group-hover:text-accent transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

                  <div className="inline-flex items-center text-accent hover:text-rose-dark font-medium transition-colors">
                    Read More
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/blog"
            className="inline-flex items-center text-gray-700 hover:text-accent font-medium transition-colors group"
          >
            View All Blog Posts
            <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RelatedPosts;

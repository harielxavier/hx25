import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Search, Filter, Trash2, Edit, Eye, AlertCircle } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, getDocs, doc, deleteDoc, Timestamp, setDoc } from 'firebase/firestore';

interface Author {
  name: string;
  avatar: string;
  bio?: string;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  createdAt: any;
  updatedAt: any;
  publishedAt: any;
  featured: boolean;
  author: Author;
  slug: string;
  views: number;
  readTime?: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    try {
      setLoading(true);
      setError(null);
      
      // Simple collection fetch without complex queries to avoid index issues
      const postsRef = collection(db, 'posts');
      const querySnapshot = await getDocs(postsRef);
      
      const fetchedPosts: BlogPost[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<BlogPost, 'id'>;
        fetchedPosts.push({
          id: doc.id,
          ...data,
          title: data.title || '',
          excerpt: data.excerpt || '',
          status: data.status || 'draft',
          category: data.category || 'Uncategorized',
          views: data.views || 0,
          slug: data.slug || ''
        });
      });
      
      // Sort posts by updatedAt date in memory
      fetchedPosts.sort((a, b) => {
        return b.updatedAt?.toDate?.() > a.updatedAt?.toDate?.() ? 1 : -1;
      });
      
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
      setError('Failed to load blog posts. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  async function handleCreateSamplePosts() {
    try {
      setCreating(true);
      setError(null);
      
      // Check if we already have posts
      if (posts.length > 0) {
        setError('You already have blog posts. Sample posts can only be created when no posts exist.');
        return;
      }
      
      // Sample post data
      const samplePosts = [
        {
          title: 'The Art of Portrait Photography',
          slug: 'art-of-portrait-photography',
          excerpt: 'Learn the essential techniques for capturing stunning portrait photographs that tell a story.',
          content: `
# The Art of Portrait Photography

Portrait photography is one of the most rewarding genres in photography. It allows you to connect with your subject and capture their personality, emotions, and story in a single frame.

## Lighting Techniques

Good lighting is essential for portrait photography. Here are some basic lighting setups:

1. **Rembrandt Lighting**: Creates a triangle of light on the cheek opposite to the light source.
2. **Butterfly Lighting**: Places the light source directly in front of and above the subject.
3. **Split Lighting**: Illuminates half the face, creating a dramatic effect.

## Composition Tips

- Use the rule of thirds to place your subject in the frame
- Pay attention to the background to avoid distractions
- Experiment with different angles to find the most flattering perspective

## Building Rapport

The most important aspect of portrait photography is building a connection with your subject. Take time to make them feel comfortable and relaxed. Engage in conversation and give clear, positive direction.

Remember, a great portrait captures not just what a person looks like, but who they are.
          `,
          image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
          category: 'Photography Tips',
          tags: ['portrait', 'lighting', 'composition', 'beginner'],
          status: 'published',
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          publishedAt: Timestamp.now(),
          featured: true,
          author: {
            name: "Hariel Xavier",
            avatar: "/images/author.jpg",
            bio: "Professional photographer with over 10 years of experience capturing life's precious moments."
          },
          views: 142,
          readTime: '5 min read',
          seo: {
            title: 'The Art of Portrait Photography - Essential Tips and Techniques',
            description: 'Learn the essential techniques for capturing stunning portrait photographs that tell a story and convey emotion.',
            keywords: ['portrait photography', 'lighting techniques', 'composition', 'photography tips'],
            ogImage: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'
          }
        },
        {
          title: 'Essential Camera Gear for Wedding Photography',
          slug: 'essential-camera-gear-wedding-photography',
          excerpt: 'Discover the must-have equipment for capturing perfect wedding moments from preparation to reception.',
          content: `
# Essential Camera Gear for Wedding Photography

Wedding photography requires a specific set of equipment to ensure you capture every important moment without technical issues. Here's a comprehensive guide to the essential gear for wedding photographers.

## Camera Bodies

Always bring at least two camera bodies to a wedding:
- A primary full-frame camera with excellent low-light performance
- A backup camera that you're equally comfortable using

## Lenses

A versatile lens selection is crucial:

1. **70-200mm f/2.8**: Perfect for ceremonies and candid moments
2. **24-70mm f/2.8**: The workhorse lens for most wedding situations
3. **50mm f/1.4 or f/1.8**: Great for low-light and portraits
4. **Macro lens**: For ring shots and details

## Lighting Equipment

- At least two external flashes
- Flash triggers for off-camera lighting
- Light stands and modifiers (softboxes, umbrellas)
- LED continuous light for video segments

## Accessories

- Multiple batteries for all equipment
- Multiple memory cards (high capacity and speed)
- Camera straps or harness system
- Sturdy tripod
- Reflector and diffuser
- Emergency kit (tape, scissors, safety pins)

Remember, the best gear is the gear you know how to use effectively. Practice with your equipment before the big day so you can focus on capturing moments rather than fiddling with settings.
          `,
          image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
          category: 'Equipment',
          tags: ['wedding', 'gear', 'equipment', 'professional'],
          status: 'published',
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          publishedAt: Timestamp.now(),
          featured: false,
          author: {
            name: "Hariel Xavier",
            avatar: "/images/author.jpg",
            bio: "Professional photographer with over 10 years of experience capturing life's precious moments."
          },
          views: 98,
          readTime: '7 min read',
          seo: {
            title: 'Essential Camera Gear for Wedding Photography - Complete Guide',
            description: 'Discover the must-have equipment for capturing perfect wedding moments from preparation to reception.',
            keywords: ['wedding photography', 'camera gear', 'photography equipment', 'professional photography'],
            ogImage: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'
          }
        },
        {
          title: 'Mastering Landscape Photography',
          slug: 'mastering-landscape-photography',
          excerpt: 'Explore techniques for capturing breathtaking landscape photos in any environment and lighting condition.',
          content: `
# Mastering Landscape Photography

Landscape photography allows us to capture the beauty of the natural world. Whether you're shooting mountains, oceans, forests, or deserts, these techniques will help you create stunning landscape images.

## Planning Your Shoot

The best landscape photos often come from careful planning:

- Research locations beforehand
- Check weather forecasts and sun position
- Visit during golden hour (shortly after sunrise or before sunset)
- Consider seasonal changes to the landscape

## Essential Equipment

- Wide-angle lens (16-35mm range)
- Sturdy tripod
- Polarizing filter to reduce reflections and enhance colors
- Neutral density filters for long exposures
- Remote shutter release to avoid camera shake

## Composition Techniques

1. **Foreground Interest**: Include compelling elements in the foreground
2. **Leading Lines**: Use natural lines to guide the viewer's eye
3. **Rule of Thirds**: Place key elements at intersection points
4. **Sense of Scale**: Include elements that provide scale to grand landscapes

## Post-Processing Tips

- Use graduated filters in editing to balance exposure between sky and land
- Enhance colors subtly without oversaturating
- Focus on bringing out texture and detail
- Consider the mood you want to convey

Remember that great landscape photography often requires patience. Be prepared to return to locations multiple times to capture them in the perfect light and conditions.
          `,
          image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
          category: 'Photography Tips',
          tags: ['landscape', 'composition', 'nature', 'outdoor'],
          status: 'published',
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          publishedAt: Timestamp.now(),
          featured: true,
          author: {
            name: "Hariel Xavier",
            avatar: "/images/author.jpg",
            bio: "Professional photographer with over 10 years of experience capturing life's precious moments."
          },
          views: 215,
          readTime: '6 min read',
          seo: {
            title: 'Mastering Landscape Photography - Techniques and Tips',
            description: 'Explore techniques for capturing breathtaking landscape photos in any environment and lighting condition.',
            keywords: ['landscape photography', 'composition', 'outdoor photography', 'nature photography'],
            ogImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'
          }
        }
      ];
      
      // Add sample posts to Firestore
      const postsRef = collection(db, 'posts');
      
      for (const post of samplePosts) {
        await setDoc(doc(postsRef, post.slug), post);
      }
      
      // Reload posts
      await loadPosts();
      
    } catch (error) {
      console.error('Error creating sample posts:', error);
      setError('Failed to create sample blog posts. Please try again.');
    } finally {
      setCreating(false);
    }
  }
  
  async function handleDeletePost(postId: string) {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }
    
    try {
      setDeleting(postId);
      
      // Delete the post
      await deleteDoc(doc(db, 'posts', postId));
      
      // Update local state
      setPosts(posts.filter(post => post.id !== postId));
      
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Failed to delete post. Please try again.');
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-light text-gray-900 mb-1">Blog Management</h1>
            <p className="text-gray-400">Create and manage your blog content</p>
          </div>
          <button 
            onClick={() => navigate('/admin/blog-editor')} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            New Post
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>{error}</div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600"></div>
            <p className="mt-2 text-gray-500">Loading posts...</p>
          </div>
        ) : (
          /* Posts Table */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <p className="text-gray-500">No posts found.</p>
                {posts.length === 0 && !loading && (
                  <div className="flex justify-center">
                    <button
                      onClick={handleCreateSamplePosts}
                      disabled={creating}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      {creating ? (
                        <>
                          <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Creating...
                        </>
                      ) : (
                        <>
                          <PlusCircle className="w-4 h-4 mr-2" />
                          Create Sample Posts
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Title</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Category</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Published</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Views</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="group hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{post.title}</p>
                          <p className="text-sm text-gray-400 line-clamp-1">{post.excerpt}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {post.category || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          post.status === 'published'
                            ? 'bg-green-500/10 text-green-500'
                            : 'bg-yellow-500/10 text-yellow-500'
                        }`}>
                          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {post.publishedAt
                          ? new Date(post.publishedAt.toDate()).toLocaleDateString()
                          : '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {post.views || 0}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                            <Link to={`/blog/${post.slug}`} target="_blank">
                              <Eye className="w-4 h-4" />
                            </Link>
                          </button>
                          <Link 
                            to={`/admin/blog-editor/${post.id}`}
                            className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button 
                            onClick={() => handleDeletePost(post.id)}
                            disabled={deleting === post.id}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                          >
                            {deleting === post.id ? (
                              <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
  );
}
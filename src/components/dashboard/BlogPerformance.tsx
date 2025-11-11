import React from 'react';
import { Eye, ThumbsUp, MessageSquare, Share2, TrendingUp } from 'lucide-react';
// REMOVED FIREBASE: import { db } from '../../lib/firebase';
// REMOVED FIREBASE: import { collection, query, where, orderBy, limit, getDocs // REMOVED FIREBASE

interface BlogPost {
  id: string;
  title: string;
  analytics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    trend: number;
  };
}

export default function BlogPerformance() {
  const [posts, setPosts] = React.useState<BlogPost[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadTopPosts();
  }, []);

  async function loadTopPosts() {
    try {
      setLoading(true);
      
      // Query posts collection
      const postsRef = collection(db, 'blog_posts');
      const q = query(
        postsRef,
        where('status', '==', 'published'),
        orderBy('views', 'desc'),
        limit(3)
      );
      
      const querySnapshot = await getDocs(q);
      const fetchedPosts: BlogPost[] = [];
      
      // Process each post
      querySnapshot.forEach((doc) => {
        const postData = doc.data();
        fetchedPosts.push({
          id: doc.id,
          title: postData.title || '',
          analytics: {
            views: postData.views || 0,
            likes: postData.likes || 0,
            comments: postData.comments || 0,
            shares: postData.shares || 0,
            trend: postData.trend || 0
          }
        });
      });
      
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error loading top posts:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-6">Blog Performance</h3>

      {loading ? (
        <div className="text-center py-6">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-gray-200 border-t-blue-600"></div>
          <p className="mt-2 text-sm text-gray-500">Loading blog data...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-500">No published posts found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium mb-1">{post.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{post.analytics.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{post.analytics.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.analytics.comments}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Share2 className="w-4 h-4" />
                      <span>{post.analytics.shares}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-green-500">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">{post.analytics.trend}%</span>
                </div>
              </div>

              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${(post.analytics.views / 1500) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-6 border-t">
        <button className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors">
          View All Posts
        </button>
      </div>
    </div>
  );
}
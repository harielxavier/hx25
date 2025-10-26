import { useState, useEffect } from 'react';
import { collection, addDoc, query, where, orderBy, getDocs, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { MessageCircle, Send, User } from 'lucide-react';

interface Comment {
  id: string;
  postId: string;
  author: string;
  email: string;
  content: string;
  createdAt: Timestamp;
  approved?: boolean;
}

interface BlogCommentsProps {
  postId: string;
  postSlug: string;
}

export default function BlogComments({ postId, postSlug }: BlogCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    author: '',
    email: '',
    content: ''
  });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const commentsRef = collection(db, 'comments');
      const q = query(
        commentsRef,
        where('postSlug', '==', postSlug),
        where('approved', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const fetchedComments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Comment));
      
      setComments(fetchedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      // If index doesn't exist, just show empty comments
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.author || !formData.email || !formData.content) {
      setSubmitStatus('error');
      return;
    }

    setSubmitting(true);
    setSubmitStatus('idle');

    try {
      await addDoc(collection(db, 'comments'), {
        postId,
        postSlug,
        author: formData.author,
        email: formData.email,
        content: formData.content,
        createdAt: serverTimestamp(),
        approved: false // Comments need approval by default
      });

      setSubmitStatus('success');
      setFormData({ author: '', email: '', content: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } catch (error) {
      console.error('Error submitting comment:', error);
      setSubmitStatus('error');
      
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp || !timestamp.toDate) return 'Recently';
    const date = timestamp.toDate();
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return hours === 0 ? 'Just now' : `${hours}h ago`;
    } else if (diffInHours < 168) { // 7 days
      const days = Math.floor(diffInHours / 24);
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <div className="flex items-center space-x-2 mb-6">
        <MessageCircle className="h-6 w-6" />
        <h3 className="text-2xl font-bold">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Comment Form */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h4 className="text-lg font-medium mb-4">Leave a Comment</h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                id="author"
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                disabled={submitting}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={submitting}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Comment *
            </label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              disabled={submitting}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Your comment will be reviewed before being published.
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{submitting ? 'Submitting...' : 'Post Comment'}</span>
              <Send size={16} />
            </button>
          </div>
          
          {submitStatus === 'success' && (
            <div className="p-3 bg-green-100 text-green-800 rounded-lg text-sm">
              ✓ Comment submitted successfully! It will appear after review.
            </div>
          )}
          {submitStatus === 'error' && (
            <div className="p-3 bg-red-100 text-red-800 rounded-lg text-sm">
              ✗ Error submitting comment. Please try again.
            </div>
          )}
        </form>
      </div>

      {/* Comments List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h5 className="font-medium text-gray-900">{comment.author}</h5>
                      <p className="text-sm text-gray-500">{formatDate(comment.createdAt)}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}








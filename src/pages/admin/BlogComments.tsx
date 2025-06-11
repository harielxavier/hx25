import { useState, useEffect } from 'react';
import { Trash2, Check, AlertCircle, ExternalLink, MessageSquare } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { db } from '../../lib/firebase';
import { 
  collection, 
  getDocs, 
  deleteDoc, 
  updateDoc, 
  doc, 
  query, 
  orderBy,
  where,
  getDoc,
  Timestamp,
  addDoc
} from 'firebase/firestore';

interface Comment {
  id: string;
  postId: string;
  postTitle?: string;
  author: string;
  email: string;
  content: string;
  status: 'pending' | 'approved' | 'spam' | 'trash';
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export default function BlogComments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'spam' | 'trash'>('all');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    fetchComments();
  }, [filter]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const commentsRef = collection(db, 'comments');
      let q;
      
      if (filter === 'all') {
        q = query(commentsRef, orderBy('createdAt', 'desc'));
      } else {
        q = query(
          commentsRef, 
          where('status', '==', filter),
          orderBy('createdAt', 'desc')
        );
      }
      
      const querySnapshot = await getDocs(q);
      
      const commentsData: Comment[] = [];
      
      for (const commentDoc of querySnapshot.docs) {
        const comment = {
          id: commentDoc.id,
          ...commentDoc.data()
        } as Comment;
        
        // Get post title
        if (comment.postId) {
          const postDoc = await getDoc(doc(db, 'posts', comment.postId));
          if (postDoc.exists()) {
            comment.postTitle = postDoc.data().title;
          }
        }
        
        commentsData.push(comment);
      }
      
      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Failed to load comments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteDoc(doc(db, 'comments', id));
        setComments(comments.filter(comment => comment.id !== id));
      } catch (error) {
        console.error('Error deleting comment:', error);
        setError('Failed to delete comment. Please try again.');
      }
    }
  };

  const handleUpdateStatus = async (id: string, status: 'pending' | 'approved' | 'spam' | 'trash') => {
    try {
      const commentRef = doc(db, 'comments', id);
      await updateDoc(commentRef, {
        status,
        updatedAt: new Date()
      });
      
      setComments(comments.map(comment => 
        comment.id === id ? { ...comment, status } : comment
      ));
    } catch (error) {
      console.error('Error updating comment status:', error);
      setError('Failed to update comment status. Please try again.');
    }
  };

  const handleReplySubmit = async () => {
    if (!replyingTo || !replyContent.trim()) return;
    
    try {
      const originalComment = comments.find(c => c.id === replyingTo);
      if (!originalComment) return;
      
      const replyData = {
        postId: originalComment.postId,
        author: 'Admin',
        email: 'admin@example.com',
        content: replyContent.trim(),
        status: 'approved',
        createdAt: new Date(),
        parentId: replyingTo,
        isAdminReply: true
      };
      
      const commentsRef = collection(db, 'comments');
      await addDoc(commentsRef, replyData);
      
      setReplyingTo(null);
      setReplyContent('');
      fetchComments();
    } catch (error) {
      console.error('Error adding reply:', error);
      setError('Failed to add reply. Please try again.');
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'spam':
        return 'bg-red-100 text-red-800';
      case 'trash':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Comments Management</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <AlertCircle size={18} className="mr-2" />
            {error}
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all' 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'pending' 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'approved' 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilter('spam')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'spam' 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Spam
            </button>
            <button
              onClick={() => setFilter('trash')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'trash' 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Trash
            </button>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-10">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">No comments found.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium">{comment.author}</div>
                      <div className="text-sm text-gray-500">{comment.email}</div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(comment.status)}`}>
                      {comment.status.charAt(0).toUpperCase() + comment.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="text-gray-700 mb-3">{comment.content}</div>
                  
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <div>
                      {formatDate(comment.createdAt)}
                    </div>
                    {comment.postTitle && (
                      <div className="flex items-center">
                        <span>On: </span>
                        <a 
                          href={`/blog/${comment.postId}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="ml-1 text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          {comment.postTitle}
                          <ExternalLink size={14} className="ml-1" />
                        </a>
                      </div>
                    )}
                  </div>
                  
                  {replyingTo === comment.id ? (
                    <div className="mt-3 border-t pt-3">
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write your reply..."
                        className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
                        rows={3}
                      />
                      <div className="flex justify-end mt-2 gap-2">
                        <button
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyContent('');
                          }}
                          className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleReplySubmit}
                          className="px-3 py-1 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setReplyingTo(comment.id)}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Reply
                      </button>
                      
                      {comment.status !== 'approved' && (
                        <button
                          onClick={() => handleUpdateStatus(comment.id, 'approved')}
                          className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors flex items-center"
                        >
                          <Check size={14} className="mr-1" />
                          Approve
                        </button>
                      )}
                      
                      {comment.status !== 'pending' && (
                        <button
                          onClick={() => handleUpdateStatus(comment.id, 'pending')}
                          className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors"
                        >
                          Pending
                        </button>
                      )}
                      
                      {comment.status !== 'spam' && (
                        <button
                          onClick={() => handleUpdateStatus(comment.id, 'spam')}
                          className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          Mark as Spam
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors flex items-center"
                      >
                        <Trash2 size={14} className="mr-1" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
  );
}

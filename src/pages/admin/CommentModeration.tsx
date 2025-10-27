import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, updateDoc, doc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { MessageCircle, Check, X, Trash2 } from 'lucide-react';

interface Comment {
  id: string;
  postId: string;
  postSlug: string;
  author: string;
  email: string;
  content: string;
  createdAt: Timestamp;
  approved: boolean;
}

export default function CommentModeration() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'all'>('pending');
  const [loading, setLoading] = useState(true);

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
        const approved = filter === 'approved';
        q = query(
          commentsRef,
          where('approved', '==', approved),
          orderBy('createdAt', 'desc')
        );
      }

      const snapshot = await getDocs(q);
      const fetchedComments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Comment));

      setComments(fetchedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const approveComment = async (commentId: string) => {
    try {
      await updateDoc(doc(db, 'comments', commentId), {
        approved: true
      });
      fetchComments();
    } catch (error) {
      console.error('Error approving comment:', error);
    }
  };

  const rejectComment = async (commentId: string) => {
    try {
      await updateDoc(doc(db, 'comments', commentId), {
        approved: false
      });
      fetchComments();
    } catch (error) {
      console.error('Error rejecting comment:', error);
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      await deleteDoc(doc(db, 'comments', commentId));
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp || !timestamp.toDate) return 'Recently';
    return timestamp.toDate().toLocaleString();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center space-x-3">
          <MessageCircle className="h-8 w-8" />
          <span>Comment Moderation</span>
        </h1>
        <p className="text-gray-600">Review and approve blog comments</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'pending' 
              ? 'bg-yellow-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'approved' 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Approved
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All
        </button>
      </div>

      {/* Comments List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">No {filter !== 'all' ? filter : ''} comments found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div 
              key={comment.id} 
              className={`bg-white border-2 rounded-lg p-6 ${
                comment.approved ? 'border-green-200' : 'border-yellow-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium text-lg">{comment.author}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      comment.approved 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {comment.approved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{comment.email}</p>
                  <p className="text-sm text-gray-500 mb-3">{formatDate(comment.createdAt)}</p>
                  <p className="text-sm text-gray-600 mb-2">
                    Post: <span className="font-medium">{comment.postSlug}</span>
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 mt-3">
                    <p className="text-gray-800">{comment.content}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 mt-4">
                {!comment.approved && (
                  <button
                    onClick={() => approveComment(comment.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Check size={16} />
                    <span>Approve</span>
                  </button>
                )}
                {comment.approved && (
                  <button
                    onClick={() => rejectComment(comment.id)}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center space-x-2"
                  >
                    <X size={16} />
                    <span>Unapprove</span>
                  </button>
                )}
                <button
                  onClick={() => deleteComment(comment.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}












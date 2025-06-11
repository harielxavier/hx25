import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  Timestamp,
  DocumentData
} from 'firebase/firestore';
import { db } from '../firebase/config';

export interface Comment {
  id: string;
  post_id: string;
  parent_id?: string;
  author_name: string;
  author_email: string;
  author_avatar?: string;
  content: string;
  status: 'pending' | 'approved' | 'spam' | 'trash';
  created_at: Timestamp;
  updated_at: Timestamp;
  replies?: Comment[];
}

// Convert Firestore document to Comment
const convertToComment = (id: string, data: DocumentData): Comment => {
  return {
    id,
    post_id: data.post_id || '',
    parent_id: data.parent_id || null,
    author_name: data.author_name || '',
    author_email: data.author_email || '',
    author_avatar: data.author_avatar || '',
    content: data.content || '',
    status: data.status || 'pending',
    created_at: data.created_at,
    updated_at: data.updated_at
  };
};

// Get all comments
export const getAllComments = async (status?: string): Promise<Comment[]> => {
  try {
    const commentsRef = collection(db, 'comments');
    let q;
    
    if (status) {
      q = query(commentsRef, where('status', '==', status), orderBy('created_at', 'desc'));
    } else {
      q = query(commentsRef, orderBy('created_at', 'desc'));
    }
    
    const querySnapshot = await getDocs(q);
    const comments: Comment[] = [];
    
    querySnapshot.forEach(doc => {
      comments.push(convertToComment(doc.id, doc.data()));
    });
    
    return comments;
  } catch (error) {
    console.error('Error getting comments:', error);
    throw error;
  }
};

// Get comments for a specific post
export const getCommentsByPostId = async (postId: string, includeAll = false): Promise<Comment[]> => {
  try {
    const commentsRef = collection(db, 'comments');
    let q;
    
    if (includeAll) {
      // For admin, get all comments for the post
      q = query(
        commentsRef, 
        where('post_id', '==', postId),
        where('parent_id', '==', null), // Only get top-level comments
        orderBy('created_at', 'desc')
      );
    } else {
      // For public, only get approved comments
      q = query(
        commentsRef, 
        where('post_id', '==', postId),
        where('status', '==', 'approved'),
        where('parent_id', '==', null), // Only get top-level comments
        orderBy('created_at', 'desc')
      );
    }
    
    const querySnapshot = await getDocs(q);
    const comments: Comment[] = [];
    
    // First get all top-level comments
    for (const doc of querySnapshot.docs) {
      const comment = convertToComment(doc.id, doc.data());
      
      // Then get replies for each comment
      const replies = await getRepliesByParentId(comment.id, includeAll);
      if (replies.length > 0) {
        comment.replies = replies;
      }
      
      comments.push(comment);
    }
    
    return comments;
  } catch (error) {
    console.error('Error getting comments by post ID:', error);
    throw error;
  }
};

// Get replies for a comment
export const getRepliesByParentId = async (parentId: string, includeAll = false): Promise<Comment[]> => {
  try {
    const commentsRef = collection(db, 'comments');
    let q;
    
    if (includeAll) {
      // For admin, get all replies
      q = query(
        commentsRef, 
        where('parent_id', '==', parentId),
        orderBy('created_at', 'asc')
      );
    } else {
      // For public, only get approved replies
      q = query(
        commentsRef, 
        where('parent_id', '==', parentId),
        where('status', '==', 'approved'),
        orderBy('created_at', 'asc')
      );
    }
    
    const querySnapshot = await getDocs(q);
    const replies: Comment[] = [];
    
    querySnapshot.forEach(doc => {
      replies.push(convertToComment(doc.id, doc.data()));
    });
    
    return replies;
  } catch (error) {
    console.error('Error getting replies by parent ID:', error);
    throw error;
  }
};

// Get a comment by ID
export const getCommentById = async (id: string): Promise<Comment | null> => {
  try {
    const docRef = doc(db, 'comments', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return convertToComment(docSnap.id, docSnap.data());
    }
    
    return null;
  } catch (error) {
    console.error('Error getting comment by ID:', error);
    throw error;
  }
};

// Create a new comment
export const createComment = async (commentData: Omit<Comment, 'id' | 'created_at' | 'updated_at' | 'replies'>): Promise<string> => {
  try {
    // Set timestamps
    const now = serverTimestamp();
    const newComment = {
      ...commentData,
      status: commentData.status || 'pending', // Default to pending for moderation
      created_at: now,
      updated_at: now
    };
    
    const docRef = await addDoc(collection(db, 'comments'), newComment);
    
    // Update comment count on the post
    await incrementPostCommentCount(commentData.post_id);
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

// Update an existing comment
export const updateComment = async (id: string, commentData: Partial<Omit<Comment, 'id' | 'post_id' | 'created_at' | 'updated_at' | 'replies'>>): Promise<boolean> => {
  try {
    const docRef = doc(db, 'comments', id);
    
    const updateData = {
      ...commentData,
      updated_at: serverTimestamp()
    };
    
    await updateDoc(docRef, updateData);
    return true;
  } catch (error) {
    console.error('Error updating comment:', error);
    return false;
  }
};

// Delete a comment
export const deleteComment = async (id: string): Promise<boolean> => {
  try {
    // First get the comment to get the post_id
    const commentRef = doc(db, 'comments', id);
    const commentSnap = await getDoc(commentRef);
    
    if (!commentSnap.exists()) {
      return false;
    }
    
    const commentData = commentSnap.data();
    const postId = commentData.post_id;
    
    // Delete all replies to this comment
    const repliesRef = collection(db, 'comments');
    const q = query(repliesRef, where('parent_id', '==', id));
    const repliesSnapshot = await getDocs(q);
    
    // Delete each reply
    const deletePromises = repliesSnapshot.docs.map(replyDoc => 
      deleteDoc(doc(db, 'comments', replyDoc.id))
    );
    
    // Wait for all replies to be deleted
    await Promise.all(deletePromises);
    
    // Delete the comment itself
    await deleteDoc(commentRef);
    
    // Update comment count on the post
    await decrementPostCommentCount(postId);
    
    return true;
  } catch (error) {
    console.error('Error deleting comment:', error);
    return false;
  }
};

// Approve a comment
export const approveComment = async (id: string): Promise<boolean> => {
  try {
    const docRef = doc(db, 'comments', id);
    
    await updateDoc(docRef, {
      status: 'approved',
      updated_at: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error approving comment:', error);
    return false;
  }
};

// Mark a comment as spam
export const markCommentAsSpam = async (id: string): Promise<boolean> => {
  try {
    const docRef = doc(db, 'comments', id);
    
    await updateDoc(docRef, {
      status: 'spam',
      updated_at: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error marking comment as spam:', error);
    return false;
  }
};

// Move a comment to trash
export const trashComment = async (id: string): Promise<boolean> => {
  try {
    const docRef = doc(db, 'comments', id);
    
    await updateDoc(docRef, {
      status: 'trash',
      updated_at: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error trashing comment:', error);
    return false;
  }
};

// Get comment count for a post
export const getCommentCountByPostId = async (postId: string, includeAll = false): Promise<number> => {
  try {
    const commentsRef = collection(db, 'comments');
    let q;
    
    if (includeAll) {
      // Count all comments for the post
      q = query(commentsRef, where('post_id', '==', postId));
    } else {
      // Count only approved comments
      q = query(
        commentsRef, 
        where('post_id', '==', postId),
        where('status', '==', 'approved')
      );
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting comment count:', error);
    return 0;
  }
};

// Helper function to increment comment count on a post
const incrementPostCommentCount = async (postId: string): Promise<boolean> => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDoc(postRef);
    
    if (!postSnap.exists()) {
      return false;
    }
    
    const currentCount = postSnap.data().comment_count || 0;
    
    await updateDoc(postRef, {
      comment_count: currentCount + 1
    });
    
    return true;
  } catch (error) {
    console.error('Error incrementing post comment count:', error);
    return false;
  }
};

// Helper function to decrement comment count on a post
const decrementPostCommentCount = async (postId: string): Promise<boolean> => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDoc(postRef);
    
    if (!postSnap.exists()) {
      return false;
    }
    
    const currentCount = postSnap.data().comment_count || 0;
    
    await updateDoc(postRef, {
      comment_count: Math.max(0, currentCount - 1)
    });
    
    return true;
  } catch (error) {
    console.error('Error decrementing post comment count:', error);
    return false;
  }
};

// Get recent comments
export const getRecentComments = async (limit: number = 5): Promise<Comment[]> => {
  try {
    const commentsRef = collection(db, 'comments');
    const q = query(
      commentsRef,
      where('status', '==', 'approved'),
      orderBy('created_at', 'desc'),
      orderBy('post_id')
    );
    
    const querySnapshot = await getDocs(q);
    const comments: Comment[] = [];
    
    querySnapshot.forEach(doc => {
      comments.push(convertToComment(doc.id, doc.data()));
    });
    
    return comments.slice(0, limit);
  } catch (error) {
    console.error('Error getting recent comments:', error);
    throw error;
  }
};

// Get pending comment count
export const getPendingCommentCount = async (): Promise<number> => {
  try {
    const commentsRef = collection(db, 'comments');
    const q = query(commentsRef, where('status', '==', 'pending'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting pending comment count:', error);
    return 0;
  }
};

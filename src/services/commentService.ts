import { supabase } from '../lib/supabase';

export interface Comment {
  id: string;
  post_id: string;
  parent_id?: string;
  author_name: string;
  author_email: string;
  author_avatar?: string;
  content: string;
  status: 'pending' | 'approved' | 'spam' | 'trash';
  created_at: string;
  updated_at: string;
  replies?: Comment[];
}

// Convert database row to Comment
const convertToComment = (row: any): Comment => {
  return {
    id: row.id,
    post_id: row.post_id || '',
    parent_id: row.parent_id || null,
    author_name: row.author_name || '',
    author_email: row.author_email || '',
    author_avatar: row.author_avatar || '',
    content: row.content || '',
    status: row.status || 'pending',
    created_at: row.created_at,
    updated_at: row.updated_at
  };
};

// Get all comments
export const getAllComments = async (status?: string): Promise<Comment[]> => {
  try {
    let query = supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data ? data.map(convertToComment) : [];
  } catch (error) {
    console.error('Error getting comments:', error);
    throw error;
  }
};

// Get comments for a specific post
export const getCommentsByPostId = async (postId: string, includeAll = false): Promise<Comment[]> => {
  try {
    let query = supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .is('parent_id', null)
      .order('created_at', { ascending: false });

    if (!includeAll) {
      query = query.eq('status', 'approved');
    }

    const { data, error } = await query;

    if (error) throw error;

    const comments: Comment[] = [];

    // Get replies for each comment
    for (const row of (data || [])) {
      const comment = convertToComment(row);

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
    let query = supabase
      .from('comments')
      .select('*')
      .eq('parent_id', parentId)
      .order('created_at', { ascending: true });

    if (!includeAll) {
      query = query.eq('status', 'approved');
    }

    const { data, error } = await query;

    if (error) throw error;
    return data ? data.map(convertToComment) : [];
  } catch (error) {
    console.error('Error getting replies by parent ID:', error);
    throw error;
  }
};

// Get a comment by ID
export const getCommentById = async (id: string): Promise<Comment | null> => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data ? convertToComment(data) : null;
  } catch (error) {
    console.error('Error getting comment by ID:', error);
    throw error;
  }
};

// Create a new comment
export const createComment = async (commentData: Omit<Comment, 'id' | 'created_at' | 'updated_at' | 'replies'>): Promise<string> => {
  try {
    const now = new Date().toISOString();
    const newComment = {
      post_id: commentData.post_id,
      parent_id: commentData.parent_id || null,
      author_name: commentData.author_name,
      author_email: commentData.author_email,
      author_avatar: commentData.author_avatar || '',
      content: commentData.content,
      status: commentData.status || 'pending',
      created_at: now,
      updated_at: now
    };

    const { data, error } = await supabase
      .from('comments')
      .insert([newComment])
      .select('id')
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned');

    // Update comment count on the post
    await incrementPostCommentCount(commentData.post_id);

    return data.id;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

// Update an existing comment
export const updateComment = async (id: string, commentData: Partial<Omit<Comment, 'id' | 'post_id' | 'created_at' | 'updated_at' | 'replies'>>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('comments')
      .update({
        ...commentData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating comment:', error);
    return false;
  }
};

// Delete a comment
export const deleteComment = async (id: string): Promise<boolean> => {
  try {
    // Get the comment to get the post_id
    const { data: comment, error: fetchError } = await supabase
      .from('comments')
      .select('post_id')
      .eq('id', id)
      .single();

    if (fetchError || !comment) return false;

    const postId = comment.post_id;

    // Delete all replies to this comment
    const { error: deleteRepliesError } = await supabase
      .from('comments')
      .delete()
      .eq('parent_id', id);

    if (deleteRepliesError) throw deleteRepliesError;

    // Delete the comment itself
    const { error: deleteError } = await supabase
      .from('comments')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

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
    const { error } = await supabase
      .from('comments')
      .update({
        status: 'approved',
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error approving comment:', error);
    return false;
  }
};

// Mark a comment as spam
export const markCommentAsSpam = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('comments')
      .update({
        status: 'spam',
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error marking comment as spam:', error);
    return false;
  }
};

// Move a comment to trash
export const trashComment = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('comments')
      .update({
        status: 'trash',
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error trashing comment:', error);
    return false;
  }
};

// Get comment count for a post
export const getCommentCountByPostId = async (postId: string, includeAll = false): Promise<number> => {
  try {
    let query = supabase
      .from('comments')
      .select('id', { count: 'exact', head: true })
      .eq('post_id', postId);

    if (!includeAll) {
      query = query.eq('status', 'approved');
    }

    const { count, error } = await query;

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error getting comment count:', error);
    return 0;
  }
};

// Helper function to increment comment count on a post
const incrementPostCommentCount = async (postId: string): Promise<boolean> => {
  try {
    const { data: post, error: fetchError } = await supabase
      .from('posts')
      .select('comment_count')
      .eq('id', postId)
      .single();

    if (fetchError || !post) return false;

    const currentCount = post.comment_count || 0;

    const { error: updateError } = await supabase
      .from('posts')
      .update({ comment_count: currentCount + 1 })
      .eq('id', postId);

    if (updateError) throw updateError;
    return true;
  } catch (error) {
    console.error('Error incrementing post comment count:', error);
    return false;
  }
};

// Helper function to decrement comment count on a post
const decrementPostCommentCount = async (postId: string): Promise<boolean> => {
  try {
    const { data: post, error: fetchError } = await supabase
      .from('posts')
      .select('comment_count')
      .eq('id', postId)
      .single();

    if (fetchError || !post) return false;

    const currentCount = post.comment_count || 0;

    const { error: updateError } = await supabase
      .from('posts')
      .update({ comment_count: Math.max(0, currentCount - 1) })
      .eq('id', postId);

    if (updateError) throw updateError;
    return true;
  } catch (error) {
    console.error('Error decrementing post comment count:', error);
    return false;
  }
};

// Get recent comments
export const getRecentComments = async (limit: number = 5): Promise<Comment[]> => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data ? data.map(convertToComment) : [];
  } catch (error) {
    console.error('Error getting recent comments:', error);
    throw error;
  }
};

// Get pending comment count
export const getPendingCommentCount = async (): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('comments')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending');

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error getting pending comment count:', error);
    return 0;
  }
};

import React, { useEffect } from 'react';
import { useComments } from '../../hooks/useComments'; // Adjust path as necessary
import { Comment, CommentCreationData } from '../../types/comment'; // Adjust path as necessary
import CommentItem from './CommentItem'; // Adjust path as necessary
import CommentForm from './CommentForm'; // Adjust path as necessary
import { useAuth } from '../../contexts/AuthContext'; // Adjust path as necessary
// import { Button } from './ui/button'; // Shadcn UI
// import { toast } from 'sonner'; // Shadcn UI

// Fallback components for conceptual UI
const FallbackButton: React.FC<any> = ({ children, ...props }) => <button {...props}>{children}</button>;
const ActualButton = Button || FallbackButton;
const toast = { success: (msg: string) => alert(msg), error: (msg: string) => alert(msg) };


interface CommentsSectionProps {
  entityType: string;
  entityId: number | string; // number for int IDs, string for UUIDs
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ entityType, entityId }) => {
  const { user, isAdmin } = useAuth();
  const { 
    comments, 
    totalComments, 
    loading, 
    error, 
    fetchComments, 
    postComment, 
    deleteComment 
  } = useComments(entityType, entityId);

  // Initial fetch for top-level comments
  useEffect(() => {
    // fetchComments(1, 10, null); // Fetch top-level comments (page 1, limit 10)
    // The hook itself now handles initial fetch on entityType/entityId change
  }, [entityType, entityId]); // Removed fetchComments from here

  const handlePostComment = async (content: string, parentId?: number | null): Promise<boolean> => {
    if (!user) {
      toast.error("You must be logged in to comment.");
      return false;
    }
    
    const commentData: CommentCreationData = {
      content,
      entity_type: entityType, 
      // entityId is implicitly handled by the hook's scope for the main post
      // but needs to be explicit if hook was structured differently
      parent_id: parentId || null,
    };
    if (typeof entityId === 'number') {
        commentData.entity_id_int = entityId;
    } else {
        commentData.entity_id_uuid = entityId;
    }


    const newComment = await postComment(commentData);
    return !!newComment; // Returns true if newComment is not null
  };

  const handleDeleteComment = async (commentId: number): Promise<boolean> => {
    // Permissions are checked within useComments or CommentItem (or backend)
    const success = await deleteComment(commentId);
    return success;
  };

  const handleLoadMore = () => {
    // Basic load more: fetch next page of top-level comments
    // Assumes comments are currently top-level. More complex pagination needed for replies.
    const nextPage = Math.floor(comments.length / 10) + 1; // Simple calculation
    if (comments.length < totalComments) {
        fetchComments(nextPage, 10, null); // Fetch next page of top-level
    }
  };
  
  // For replies, this simplified example will use the main postComment function from the hook.
  // A more advanced implementation might fetch replies specifically for a parent comment.
  const handlePostReply = async (parentId: number, content: string): Promise<boolean> => {
     if (!user) {
      toast.error("You must be logged in to reply.");
      return false;
    }
     const replyData: CommentCreationData = {
      content,
      entity_type: entityType, // Same entity as parent
      parent_id: parentId,
    };
    if (typeof entityId === 'number') {
        replyData.entity_id_int = entityId;
    } else {
        replyData.entity_id_uuid = entityId;
    }
    
    const newReply = await postComment(replyData);
    return !!newReply;
  };


  if (loading && comments.length === 0) return <p className="text-gray-500 text-sm">Loading comments...</p>;
  if (error) return <p className="text-red-500 text-sm">Error loading comments: {error.message}</p>;

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Comments ({totalComments})</h3>
      
      {user && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow">
            <h4 className="text-md font-semibold text-gray-700 mb-2">Leave a Comment</h4>
            <CommentForm onSubmit={handlePostComment} />
        </div>
      )}
      {!user && <p className="text-sm text-gray-600 mb-4">Please <a href="/login" className="text-indigo-600 hover:underline">log in</a> to post a comment.</p>}

      {comments.length === 0 && !loading && (
        <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
      )}

      <div className="space-y-4">
        {comments.map((comment: Comment) => (
          // Assuming CommentItem handles display of its own replies if data structure is nested,
          // or this CommentsSection would need to fetch and pass replies to CommentItem.
          // For this version, we assume a flat list of top-level comments, and replies are handled by CommentItem's form.
          <CommentItem 
            key={comment.id} 
            comment={comment} 
            onReply={handlePostReply} // Replies are also new comments with parent_id
            onDelete={handleDeleteComment}
            currentUserId={user?.id}
            isAdmin={isAdmin}
          />
        ))}
      </div>

      {comments.length < totalComments && !loading && (
        <div className="mt-6 text-center">
          <ActualButton onClick={handleLoadMore} variant="outline" size="sm">
            Load More Comments
          </ActualButton>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;

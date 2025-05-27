import React, { useState } from 'react';
import { Comment } from '../../types/comment';
import { useAuth } from '../../contexts/AuthContext';
// import { Button } from './ui/button'; // Shadcn UI
// import { Textarea } from './ui/textarea'; // Shadcn UI
// import { toast } from 'sonner'; // Shadcn UI

// Fallback components for conceptual UI
const FallbackButton: React.FC<any> = ({ children, ...props }) => <button {...props}>{children}</button>;
const FallbackTextarea: React.FC<any> = (props) => <textarea {...props} />;

const ActualButton = Button || FallbackButton;
const ActualTextarea = Textarea || FallbackTextarea;
const toast = { success: (msg: string) => alert(msg), error: (msg: string) => alert(msg) };


interface CommentItemProps {
  comment: Comment;
  onReply: (parentId: number, content: string) => Promise<boolean>; // Parent component handles actual API call
  onDelete: (commentId: number) => Promise<boolean>; // Parent component handles actual API call
  // onEdit: (commentId: number, newContent: string) => Promise<boolean>; // Future: Edit functionality
  currentUserId: string | undefined;
  isAdmin: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onReply, onDelete, currentUserId, isAdmin }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const canDelete = isAdmin || comment.user_id === currentUserId;
  // const canEdit = comment.user_id === currentUserId; // Future

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) {
      toast.error("Reply cannot be empty.");
      return;
    }
    setIsReplying(true);
    const success = await onReply(comment.id, replyContent.trim());
    if (success) {
      setReplyContent('');
      setShowReplyForm(false);
      toast.success("Reply posted!");
    } else {
      toast.error("Failed to post reply.");
    }
    setIsReplying(false);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this comment? This may also delete replies.")) {
        setIsDeleting(true);
        const success = await onDelete(comment.id);
        if (success) {
            toast.success("Comment deleted.");
            // Comment will disappear from list via parent's state update
        } else {
            toast.error("Failed to delete comment.");
        }
        setIsDeleting(false);
    }
  };

  return (
    <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 mb-3">
      <div className="flex items-start space-x-3">
        <img 
          src={comment.user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user?.username || 'U')}&background=random`} 
          alt={comment.user?.username || 'User avatar'}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm text-gray-800">{comment.user?.username || 'Anonymous User'}</span>
            <span className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleString()}</span>
          </div>
          <p className="text-gray-700 text-sm mt-1 whitespace-pre-wrap">{comment.content}</p>
          <div className="mt-2 flex items-center space-x-3">
            <ActualButton 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-xs text-indigo-600 hover:text-indigo-800 p-1"
            >
              Reply ({comment.reply_count || 0})
            </ActualButton>
            {/* {canEdit && <ActualButton variant="ghost" size="sm" className="text-xs">Edit</ActualButton>} */}
            {canDelete && (
              <ActualButton 
                variant="ghost" 
                size="sm" 
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-xs text-red-500 hover:text-red-700 p-1"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </ActualButton>
            )}
          </div>

          {showReplyForm && (
            <form onSubmit={handleReplySubmit} className="mt-2 ml-4 pl-4 border-l-2 border-gray-200">
              <ActualTextarea 
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`Replying to ${comment.user?.username || 'user'}...`}
                rows={2}
                className="w-full text-sm p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              <div className="mt-2 flex justify-end space-x-2">
                <ActualButton type="button" variant="ghost" size="sm" onClick={() => setShowReplyForm(false)} className="text-xs">Cancel</ActualButton>
                <ActualButton type="submit" size="sm" disabled={isReplying} className="text-xs bg-indigo-500 hover:bg-indigo-600 text-white">
                  {isReplying ? 'Posting...' : 'Post Reply'}
                </ActualButton>
              </div>
            </form>
          )}
        </div>
      </div>
      {/* Render replies if they are passed as part of the comment object (nested structure) */}
      {/* This example assumes replies are fetched separately when expanding or by a parent_id filter */}
    </div>
  );
};

export default CommentItem;

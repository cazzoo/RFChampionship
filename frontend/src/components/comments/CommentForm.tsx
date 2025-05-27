import React, { useState } from 'react';
// import { Button } from './ui/button'; // Shadcn UI
// import { Textarea } from './ui/textarea'; // Shadcn UI
// import { toast } from 'sonner'; // Shadcn UI

// Fallback components for conceptual UI
const FallbackButton: React.FC<any> = ({ children, ...props }) => <button {...props}>{children}</button>;
const FallbackTextarea: React.FC<any> = (props) => <textarea {...props} />;

const ActualButton = Button || FallbackButton;
const ActualTextarea = Textarea || FallbackTextarea;
const toast = { success: (msg: string) => alert(msg), error: (msg: string) => alert(msg) };


interface CommentFormProps {
  onSubmit: (content: string, parentId?: number | null) => Promise<boolean>; // Returns true on success
  parentId?: number | null; // For replies
  submitButtonText?: string;
  placeholderText?: string;
  onCancel?: () => void; // For reply forms primarily
}

const CommentForm: React.FC<CommentFormProps> = ({ 
    onSubmit, 
    parentId = null, 
    submitButtonText = "Post Comment",
    placeholderText = "Write your comment...",
    onCancel
}) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }
    setIsSubmitting(true);
    const success = await onSubmit(content.trim(), parentId);
    if (success) {
      setContent(''); // Clear form on successful submission
      if (parentId && onCancel) { // If it's a reply form, call onCancel to hide it
        onCancel();
      }
      toast.success(parentId ? "Reply posted!" : "Comment posted!");
    } else {
      toast.error(parentId ? "Failed to post reply." : "Failed to post comment.");
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className={`mt-4 ${parentId ? 'ml-4 pl-4 border-l-2 border-gray-200' : ''}`}>
      <ActualTextarea 
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholderText}
        rows={parentId ? 2 : 3} // Smaller for replies
        required
        className="w-full text-sm p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
      />
      <div className="mt-2 flex justify-end space-x-2">
        {onCancel && (
            <ActualButton type="button" variant="ghost" size="sm" onClick={onCancel} className="text-xs">
                Cancel
            </ActualButton>
        )}
        <ActualButton type="submit" size="sm" disabled={isSubmitting} className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white">
          {isSubmitting ? 'Submitting...' : submitButtonText}
        </ActualButton>
      </div>
    </form>
  );
};

export default CommentForm;

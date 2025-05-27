import React, { useState, useEffect } from 'react';
import { useAdminComments } from '../../../hooks/useAdminComments';
import { Comment } from '../../../types/comment';
import { Link } from 'react-router-dom';

// Conceptual Shadcn UI imports
import { Button } from '../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Input } from '../../../components/ui/input'; // For filter inputs
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Label } from '../../../components/ui/label';
// import { toast } from 'sonner';

// Fallback components
const FallbackButton: React.FC<any> = ({ children, ...props }) => <button {...props}>{children}</button>;
const FallbackTable: React.FC<any> = ({ children, ...props }) => <table {...props}>{children}</table>;
const FallbackTableBody: React.FC<any> = ({ children, ...props }) => <tbody {...props}>{children}</tbody>;
const FallbackTableCell: React.FC<any> = ({ children, ...props }) => <td {...props}>{children}</td>;
const FallbackTableHead: React.FC<any> = ({ children, ...props }) => <th {...props}>{children}</th>;
const FallbackTableHeader: React.FC<any> = ({ children, ...props }) => <thead {...props}>{children}</thead>;
const FallbackTableRow: React.FC<any> = ({ children, ...props }) => <tr {...props}>{children}</tr>;
const FallbackInput: React.FC<any> = (props) => <input {...props} />;
const FallbackLabel: React.FC<any> = ({ children, ...props }) => <label {...props}>{children}</label>;
const FallbackSelect: React.FC<any> = ({ children, ...props }) => <select {...props}>{children}</select>;
const FallbackSelectContent: React.FC<any> = ({ children, ...props }) => <div {...props}>{children}</div>;
const FallbackSelectItem: React.FC<any> = ({ children, ...props }) => <option {...props}>{children}</option>;
const FallbackSelectTrigger: React.FC<any> = ({ children, ...props }) => <button {...props}>{children}</button>;
const FallbackSelectValue: React.FC<any> = (props) => <span {...props} />;

const ActualButton = Button || FallbackButton;
const ActualTable = Table || FallbackTable;
const ActualTableBody = TableBody || FallbackTableBody;
const ActualTableCell = TableCell || FallbackTableCell;
const ActualTableHead = TableHead || FallbackTableHead;
const ActualTableHeader = TableHeader || FallbackTableHeader;
const ActualTableRow = TableRow || FallbackTableRow;
const ActualInput = Input || FallbackInput;
const ActualLabel = Label || FallbackLabel;
const ActualSelect = Select || FallbackSelect;
const ActualSelectContent = SelectContent || FallbackSelectContent;
const ActualSelectItem = SelectItem || FallbackSelectItem;
const ActualSelectTrigger = SelectTrigger || FallbackSelectTrigger;
const ActualSelectValue = SelectValue || FallbackSelectValue;

const toast = { success: (msg: string) => alert(msg), error: (msg: string) => alert(msg) };

const ENTITY_TYPE_OPTIONS = ['championship', 'event', 'result', 'track', 'vehicle', 'user_profile', 'team', 'comment'];


const AdminCommentsListPage: React.FC = () => {
  const { comments, totalComments, loading, error, fetchComments, deleteCommentAsAdmin } = useAdminComments();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Filter states
  const [filterUserId, setFilterUserId] = useState('');
  const [filterEntityType, setFilterEntityType] = useState('');

  useEffect(() => {
    fetchComments(currentPage, itemsPerPage, { 
        userId: filterUserId || undefined,
        entityType: filterEntityType || undefined,
    });
  }, [currentPage, filterUserId, filterEntityType, fetchComments]);

  const handleDeleteComment = async (commentId: number) => {
    if (window.confirm('Are you sure you want to delete this comment? This may also affect replies.')) {
      const success = await deleteCommentAsAdmin(commentId);
      toast[success ? 'success' : 'error'](success ? 'Comment deleted by admin!' : 'Failed to delete comment.');
    }
  };
  
  const totalPages = Math.ceil(totalComments / itemsPerPage);

  const getEntityLink = (comment: Comment): string | null => {
    if (!comment.entity_type) return null;
    switch(comment.entity_type) {
        case 'championship': return `/championships/${comment.entity_id_int}`;
        case 'event': return `/events/${comment.entity_id_int}`;
        case 'user_profile': return `/users/${comment.entity_id_uuid}`; // Assuming a user profile page route
        case 'track': return `/admin/tracks`; // No public track detail page yet
        case 'vehicle': return `/admin/vehicles`; // No public vehicle detail page yet
        case 'team': return `/teams/${comment.entity_id_int}`; // Assuming public team page
        // Add more cases as needed
        default: return null;
    }
  }


  return (
    <div className="container mx-auto py-4">
      <h1 className="text-2xl font-semibold mb-6">Manage Comments</h1>

      {/* Filter Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg shadow">
        <div>
            <ActualLabel htmlFor="filter-comment-user">Filter by User ID</ActualLabel>
            <ActualInput 
                id="filter-comment-user" 
                value={filterUserId} 
                onChange={(e) => setFilterUserId(e.target.value)} 
                placeholder="Enter User ID (UUID)" 
                className="mt-1"/>
        </div>
        <div>
            <ActualLabel htmlFor="filter-comment-entity">Filter by Entity Type</ActualLabel>
             <ActualSelect value={filterEntityType} onValueChange={setFilterEntityType}>
                <ActualSelectTrigger id="filter-comment-entity" className="w-full mt-1"><ActualSelectValue placeholder="All Entity Types" /></ActualSelectTrigger>
                <ActualSelectContent>
                    <ActualSelectItem value="">All Entity Types</ActualSelectItem>
                    {ENTITY_TYPE_OPTIONS.map(type => (
                        <ActualSelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</ActualSelectItem>
                    ))}
                </ActualSelectContent>
            </ActualSelect>
        </div>
        {/* Add more filters if needed, e.g., entity_id_int or entity_id_uuid if entityType is selected */}
      </div>


      {loading && <p>Loading comments...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      
      {!loading && !error && (
        <>
          <ActualTable className="bg-white shadow rounded-lg">
            <ActualTableHeader>
              <ActualTableRow>
                <ActualTableHead>User</ActualTableHead>
                <ActualTableHead className="w-1/3">Content</ActualTableHead>
                <ActualTableHead>Entity Type</ActualTableHead>
                <ActualTableHead>Entity Link</ActualTableHead>
                <ActualTableHead>Parent ID</ActualTableHead>
                <ActualTableHead>Date</ActualTableHead>
                <ActualTableHead>Actions</ActualTableHead>
              </ActualTableRow>
            </ActualTableHeader>
            <ActualTableBody>
              {comments.map((comment) => (
                <ActualTableRow key={comment.id}>
                  <ActualTableCell className="font-medium text-xs">
                    {comment.user?.username || comment.user?.email || comment.user_id.substring(0,8) + '...'}
                  </ActualTableCell>
                  <ActualTableCell className="text-sm break-words">{comment.content}</ActualTableCell>
                  <ActualTableCell>{comment.entity_type}</ActualTableCell>
                  <ActualTableCell>
                    {getEntityLink(comment) ? (
                        <Link to={getEntityLink(comment)!} className="text-indigo-600 hover:underline text-xs">
                            View Entity ({comment.entity_id_int || comment.entity_id_uuid?.substring(0,8)})
                        </Link>
                    ) : (
                        <span className="text-xs">{comment.entity_id_int || comment.entity_id_uuid?.substring(0,8)}</span>
                    )}
                  </ActualTableCell>
                  <ActualTableCell>{comment.parent_id || 'N/A'}</ActualTableCell>
                  <ActualTableCell className="text-xs">{new Date(comment.created_at).toLocaleDateString()}</ActualTableCell>
                  <ActualTableCell>
                     <ActualButton variant="destructive" size="sm" onClick={() => handleDeleteComment(comment.id)} className="text-xs">Delete</ActualButton>
                  </ActualTableCell>
                </ActualTableRow>
              ))}
            </ActualTableBody>
          </ActualTable>
          <div className="flex items-center justify-end space-x-2 py-4">
            <ActualButton variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>Previous</ActualButton>
            <span className="text-sm">Page {currentPage} of {totalPages}</span>
            <ActualButton variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages || totalComments === 0}>Next</ActualButton>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminCommentsListPage;

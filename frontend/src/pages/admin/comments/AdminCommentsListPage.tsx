import React, { useState, useEffect } from 'react';
import { useAdminComments } from '../../../hooks/useAdminComments';
import type { Comment } from '../../../types/comment';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Input } from '../../../components/ui/input';

const ENTITY_TYPE_OPTIONS = ['championship', 'event', 'result', 'track', 'vehicle', 'user_profile', 'team', 'comment'];

export default function AdminCommentsListPage() {
  const { comments, totalComments, loading, error, fetchComments, deleteCommentAsAdmin } = useAdminComments();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
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
      await deleteCommentAsAdmin(commentId);
    }
  };

  const totalPages = Math.ceil(totalComments / itemsPerPage);

  const getEntityLink = (comment: Comment): string | null => {
    if (!comment.entity_type) return null;
    switch (comment.entity_type) {
      case 'championship': return `/championships/${comment.entity_id_int}`;
      case 'event': return `/events/${comment.entity_id_int}`;
      case 'user_profile': return `/users/${comment.entity_id_uuid}`;
      case 'track': return `/admin/tracks`;
      case 'vehicle': return `/admin/vehicles`;
      case 'team': return `/teams/${comment.entity_id_int}`;
      default: return null;
    }
  };

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-2xl font-semibold mb-6">Manage Comments</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg shadow">
        <div>
          <label htmlFor="filter-comment-user">Filter by User ID</label>
          <Input
            id="filter-comment-user"
            value={filterUserId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterUserId(e.target.value)}
            placeholder="Enter User ID (UUID)"
          />
        </div>
        <div>
          <label htmlFor="filter-comment-entity">Filter by Entity Type</label>
          <select
            id="filter-comment-entity"
            value={filterEntityType}
            onChange={(e) => setFilterEntityType(e.target.value)}
          >
            <option value="">All Entity Types</option>
            {ENTITY_TYPE_OPTIONS.map(type => (
              <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>
      {loading && <p>Loading comments...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      {!loading && !error && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Entity Type</TableHead>
                <TableHead>Entity Link</TableHead>
                <TableHead>Parent ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comments.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell>{comment.user?.username || (comment.user && typeof comment.user === 'object' && 'email' in comment.user ? (comment.user as { email?: string }).email : undefined) || comment.user_id.substring(0, 8) + '...'}</TableCell>
                  <TableCell>{comment.content}</TableCell>
                  <TableCell>{comment.entity_type}</TableCell>
                  <TableCell>
                    {getEntityLink(comment) ? (
                      <Link to={getEntityLink(comment)!}>
                        View Entity ({comment.entity_id_int || comment.entity_id_uuid?.substring(0, 8)})
                      </Link>
                    ) : (
                      <span>{comment.entity_id_int || comment.entity_id_uuid?.substring(0, 8)}</span>
                    )}
                  </TableCell>
                  <TableCell>{comment.parent_id || 'N/A'}</TableCell>
                  <TableCell>{new Date(comment.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleDeleteComment(comment.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>Previous</Button>
            <span className="text-sm">Page {currentPage} of {totalPages}</span>
            <Button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages || totalComments === 0}>Next</Button>
          </div>
        </>
      )}
    </div>
  );
}

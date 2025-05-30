import { Request, Response, NextFunction } from 'express';
import { authMiddleware, AuthenticatedRequest } from '../authMiddleware'; // Adjust path as necessary
import { supabase } from '../../config/supabaseClient'; // Adjust path as necessary

// Mock Supabase client
jest.mock('../../config/supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
  },
}));

describe('Auth Middleware', () => {
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call next() and set req.user if token is valid and user object is complete', async () => {
    const mockUser = { id: '123', email: 'test@example.com', app_metadata: { user_role: 'user' } };
    mockRequest.headers = { authorization: 'Bearer validtoken' };
    (supabase.auth.getUser as jest.Mock).mockResolvedValueOnce({
      data: { user: mockUser },
      error: null,
    });

    await authMiddleware(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);

    expect(supabase.auth.getUser).toHaveBeenCalledWith('validtoken');
    expect(mockRequest.user).toEqual(mockUser);
    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it('should return 401 if no token is provided', async () => {
    await authMiddleware(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'No token provided or malformed token.' });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should return 401 if token is malformed (not starting with "Bearer ")', async () => {
    mockRequest.headers = { authorization: 'InvalidTokenFormat' };
    await authMiddleware(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'No token provided or malformed token.' });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should return 401 if token is just "Bearer" with no actual token value', async () => {
    mockRequest.headers = { authorization: 'Bearer ' }; // Space after Bearer indicates missing token part
    await authMiddleware(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);

    // The current implementation splits 'Bearer ' and checks the second part.
    // If the second part is empty, it might proceed to supabase.auth.getUser('')
    // Depending on Supabase client behavior with empty token, it might return an error or no user.
    // Let's assume it leads to an error or no user, and thus a 401.
    // If Supabase client throws an error with an empty token string, it would be caught by the generic error handler.
    // If it returns { data: { user: null }, error: someError }, it's handled.
    // If it returns { data: { user: null }, error: null }, it's "User not found".
    // The most direct check is that it should not call next().
    // The specific json response depends on how supabase.auth.getUser('') behaves.
    // For this test, we'll ensure it doesn't call next() and returns 401.
    // The current code would result in 'No token provided or malformed token.' because token.split(' ')[1] would be undefined or empty.

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
      error: expect.stringMatching(/No token provided or malformed token.|Invalid token|User not found for this token/i)
    }));
    expect(nextFunction).not.toHaveBeenCalled();
  });


  it('should return 401 if supabase.auth.getUser returns an error', async () => {
    mockRequest.headers = { authorization: 'Bearer invalidtoken' };
    const mockError = { message: 'Invalid token', status: 401 };
    (supabase.auth.getUser as jest.Mock).mockResolvedValueOnce({
      data: { user: null },
      error: mockError,
    });

    await authMiddleware(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);

    expect(supabase.auth.getUser).toHaveBeenCalledWith('invalidtoken');
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid token.', details: mockError.message });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should return 401 if supabase.auth.getUser returns no user', async () => {
    mockRequest.headers = { authorization: 'Bearer nousertoken' };
    (supabase.auth.getUser as jest.Mock).mockResolvedValueOnce({
      data: { user: null },
      error: null,
    });

    await authMiddleware(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);

    expect(supabase.auth.getUser).toHaveBeenCalledWith('nousertoken');
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'User not found for this token.' });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should return 500 if supabase.auth.getUser throws an unexpected error', async () => {
    mockRequest.headers = { authorization: 'Bearer errorToken' };
    const unexpectedError = new Error('Unexpected Supabase error');
    (supabase.auth.getUser as jest.Mock).mockRejectedValueOnce(unexpectedError);

    await authMiddleware(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);

    expect(supabase.auth.getUser).toHaveBeenCalledWith('errorToken');
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Internal server error during authentication.',
      details: unexpectedError.message,
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  // New test cases
  it('should call next() and set req.user even if app_metadata is missing', async () => {
    const mockUserWithoutAppMetadata = { id: '456', email: 'noappmeta@example.com' }; // No app_metadata field
    mockRequest.headers = { authorization: 'Bearer validtoken_no_app_metadata' };
    (supabase.auth.getUser as jest.Mock).mockResolvedValueOnce({
      data: { user: mockUserWithoutAppMetadata },
      error: null,
    });

    await authMiddleware(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);

    expect(supabase.auth.getUser).toHaveBeenCalledWith('validtoken_no_app_metadata');
    expect(mockRequest.user).toEqual(mockUserWithoutAppMetadata);
    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it('should call next() and set req.user if app_metadata exists but user_role is missing', async () => {
    const mockUserWithPartialAppMetadata = { id: '789', email: 'partialappmeta@example.com', app_metadata: {} }; // Empty app_metadata, so no user_role
    mockRequest.headers = { authorization: 'Bearer validtoken_partial_app_metadata' };
    (supabase.auth.getUser as jest.Mock).mockResolvedValueOnce({
      data: { user: mockUserWithPartialAppMetadata },
      error: null,
    });

    await authMiddleware(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);

    expect(supabase.auth.getUser).toHaveBeenCalledWith('validtoken_partial_app_metadata');
    expect(mockRequest.user).toEqual(mockUserWithPartialAppMetadata);
    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).not.toHaveBeenCalled();
  });
});

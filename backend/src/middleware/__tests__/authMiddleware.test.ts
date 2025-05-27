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

  it('should call next() and set req.user if token is valid', async () => {
    const mockUser = { id: '123', email: 'test@example.com' };
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

  it('should return 401 if token is malformed', async () => {
    mockRequest.headers = { authorization: 'InvalidTokenFormat' };
    await authMiddleware(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'No token provided or malformed token.' });
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
});

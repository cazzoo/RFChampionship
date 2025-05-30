import { Request, Response, NextFunction } from 'express';
import { checkRole } from '../rbacMiddleware'; // Adjust path as needed
import { AuthenticatedRequest } from '../../types/express'; // Adjust path

describe('RBAC Middleware - checkRole', () => {
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {
      user: {
        id: 'user-id-123',
        app_metadata: {
          user_role: 'user', // Default role for most tests
        },
        // other user properties...
      } as AuthenticatedRequest['user'], // Type assertion
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  // Test cases for single role checks
  it('should call next() if user has the required single role', () => {
    const middleware = checkRole('user');
    middleware(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it('should return 403 if user does not have the required single role', () => {
    const middleware = checkRole('admin');
    middleware(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Forbidden: Insufficient permissions' });
  });

  // Test cases for array of roles
  it('should call next() if user has one of the required roles in array', () => {
    mockRequest.user!.app_metadata.user_role = 'editor';
    const middleware = checkRole(['user', 'editor', 'admin']);
    middleware(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should return 403 if user does not have any of the required roles in array', () => {
    mockRequest.user!.app_metadata.user_role = 'guest';
    const middleware = checkRole(['user', 'editor', 'admin']);
    middleware(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(403);
  });

  // Edge cases for user object and role property
  it('should return 403 if req.user is missing', () => {
    mockRequest.user = undefined;
    const middleware = checkRole('user');
    middleware(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(403);
  });

  it('should return 403 if req.user.app_metadata is missing', () => {
    mockRequest.user!.app_metadata = undefined as any; // Force undefined
    const middleware = checkRole('user');
    middleware(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(403);
  });

  it('should return 403 if req.user.app_metadata.user_role is missing, null or undefined', () => {
    mockRequest.user!.app_metadata.user_role = null as any; // Test with null
    const middleware = checkRole('user');
    middleware(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(403);

    // Test with undefined
    (mockRequest.user!.app_metadata as any).user_role = undefined;
    const nextFunction2 = jest.fn();
    middleware(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction2);
    expect(nextFunction2).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(403);
  });

  it('should handle case-insensitivity for roles if desired (current is case-sensitive)', () => {
    // This test assumes case-sensitivity. If case-insensitivity is implemented, this test needs to change.
    mockRequest.user!.app_metadata.user_role = 'User';
    const middleware = checkRole('user');
    middleware(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled(); // Fails because 'User' !== 'user'
    expect(mockResponse.status).toHaveBeenCalledWith(403);
  });

  it('should return 403 for an empty array of required roles', () => {
    const middleware = checkRole([]);
    middleware(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(403);
  });
});

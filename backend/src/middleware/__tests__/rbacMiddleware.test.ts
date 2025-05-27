import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../authMiddleware'; // Adjust path as necessary
import { checkRole } from '../rbacMiddleware'; // Adjust path as necessary

describe('RBAC Middleware (checkRole)', () => {
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {
      user: {
        id: '123',
        app_metadata: {
          user_role: 'user', // Default role for tests
        },
      },
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

  it('should call next() if user has the required single role', () => {
    const rbac = checkRole('user');
    rbac(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);
    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it('should return 403 if user does not have the required single role', () => {
    const rbac = checkRole('admin');
    rbac(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Forbidden. Insufficient permissions.' });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should call next() if user has one of the multiple allowed roles', () => {
    mockRequest.user!.app_metadata!.user_role = 'editor';
    const rbac = checkRole(['user', 'editor', 'admin']);
    rbac(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);
    expect(nextFunction).toHaveBeenCalledTimes(1);
  });

  it('should return 403 if user does not have any of the multiple allowed roles', () => {
    mockRequest.user!.app_metadata!.user_role = 'guest';
    const rbac = checkRole(['user', 'editor', 'admin']);
    rbac(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Forbidden. Insufficient permissions.' });
  });

  it('should return 403 if user object is missing', () => {
    mockRequest.user = undefined;
    const rbac = checkRole('user');
    rbac(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Forbidden. User role not available.' });
  });

  it('should return 403 if app_metadata is missing', () => {
    mockRequest.user!.app_metadata = undefined;
    const rbac = checkRole('user');
    rbac(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Forbidden. User role not available.' });
  });
  
  it('should return 403 if user_role is missing from app_metadata', () => {
    mockRequest.user!.app_metadata = { some_other_claim: true }; // user_role is missing
    const rbac = checkRole('user');
    rbac(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Forbidden. User role not available.' });
  });
});

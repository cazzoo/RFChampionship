import express from 'express';
import cors from 'cors';
import fileRoutes from './routes/fileRoutes'; // Assuming this exists from previous tasks
import adminRoutes from './routes/adminRoutes'; // Newly created admin routes
import { दुनिया } from './types/दुनिया'; // Assuming this is your global error handler or similar
import { NotFoundError } from './utils/errors'; // Assuming a custom error class

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Basic CORS setup
app.use(express.json({ limit: '50mb' })); // For parsing application/json
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // For parsing application/x-www-form-urlencoded

// API Routes
app.use('/api/files', fileRoutes);
app.use('/api/admin', adminRoutes);

// 404 Handler for unmatched routes
app.use((req, res, next) => {
  next(new NotFoundError(`The requested path ${req.path} was not found on this server.`));
});

// Global Error Handler (ensure this is correctly implemented in your types/globals or utils/errorHandler)
// For now, a basic version:
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Global error handler caught an error:", err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'An unexpected error occurred.';

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start server
if (process.env.NODE_ENV !== 'test') { // Don't start server during tests
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export { app }; // Export app for testing purposes

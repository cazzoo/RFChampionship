import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { authMiddleware, AuthenticatedRequest } from './middleware/authMiddleware'; // Adjust path as necessary
import userRoutes from './routes/userRoutes';
import championshipRoutes from './routes/championshipRoutes';
import eventRoutes from './routes/eventRoutes';
import teamRoutes from './routes/teamRoutes';
import trackRoutes from './routes/trackRoutes';
import vehicleRoutes from './routes/vehicleRoutes';
import ruleRoutes from './routes/ruleRoutes';
import registrationRoutes from './routes/registrationRoutes';
import resultRoutes from './routes/resultRoutes';
import commentRoutes from './routes/commentRoutes';
import fileRoutes from './routes/fileRoutes';

// Load environment variables
dotenv.config({ path: '.env' });


const app = express();
const port = process.env.PORT || 3001;

app.use(express.json()); // Middleware to parse JSON bodies

// Root API endpoint
app.get('/api', (req: Request, res: Response) => {
  res.send('API is running successfully!');
});

// Mount routers
app.use('/api/users', userRoutes);
app.use('/api/championships', championshipRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/tracks', trackRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/rules', ruleRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/files', fileRoutes);


// Protected test route (can be kept for quick auth testing)
app.get('/api/protected-test', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  // If authMiddleware succeeds, req.user will be populated
  res.json({ message: 'Access to protected route successful', user: req.user });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

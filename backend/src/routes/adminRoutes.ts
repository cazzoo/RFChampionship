import express, { Request, Response, Router } from 'express';
import { supabase } from '../lib/supabaseClient'; // Assuming supabase client is exported from here
import { authenticate, checkRole } from '../middleware/auth'; // Assuming auth middleware
import { seedDatabase } from '../services/seedingService';
import { Database } from '../types/supabase'; // For SupabaseClient type

const router = Router();

/**
 * @openapi
 * /admin/seed-data:
 *   post:
 *     summary: Seeds the database with mock data (Admin only)
 *     description: |
 *       Populates the database with a predefined set of mock data for various tables.
 *       This is an admin-only endpoint.
 *       **WARNING:** Can be destructive if `overwrite` is true.
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: query
 *         name: overwrite
 *         schema:
 *           type: boolean
 *         description: If true, attempts to delete existing data in tables before seeding. Defaults to false.
 *     security:
 *       - bearerAuth: [] # Assuming you use bearer tokens for auth
 *     responses:
 *       200:
 *         description: Database seeded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Database seeded successfully.
 *                 details:
 *                   type: string
 *                   example: Seeding process completed. Overwrite was true.
 *       401:
 *         description: Unauthorized (not authenticated).
 *       403:
 *         description: Forbidden (user is not an admin).
 *       500:
 *         description: Internal server error during seeding.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to seed database.
 *                 error:
 *                   type: string
 *                   example: Specific error message.
 */
router.post(
  '/seed-data',
  authenticate, // Ensures user is logged in
  checkRole('admin'), // Ensures user has admin role
  async (req: Request, res: Response) => {
    const overwriteQuery = req.query.overwrite;
    const overwrite = typeof overwriteQuery === 'string' && overwriteQuery.toLowerCase() === 'true';

    try {
      // Cast supabase to the correct SupabaseClient type if necessary, or ensure it's typed correctly at source
      await seedDatabase(supabase as unknown as SupabaseClient<Database>, overwrite);
      res.status(200).json({
        message: 'Database seeded successfully.',
        details: `Seeding process completed. Overwrite was ${overwrite}.`
      });
    } catch (error: any) {
      console.error('Error during database seeding:', error);
      res.status(500).json({ message: 'Failed to seed database.', error: error.message });
    }
  }
);

export default router;

import express, { Router, Request, Response } from "express";

const router: Router = express.Router();

/**
 * Root Health Check
 * Confirms the API is reachable. 
 */
router.get("/", (req: Request, res: Response) => {
  return res.status(200).json({ 
    message: "Children Welfare Portal API is running",
    system: "Supabase-connected",
    timestamp: new Date().toISOString()
  });
});

export default router;
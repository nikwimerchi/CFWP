import express, { Router } from "express";
import userRoute from "./users.route";
import childRoute from "./child.route";
import authRoute from "./auth.route";
import advisorsRoute from "./advisors.route";
import parentsRoute from "./parents.route";
import measurements from "./measurements.route";
import healthData from "./healthData.route";
import chats from "./chats.route";
import notifications from "./notifications.route";

const router = express.Router();

interface IRoute {
  path: string;
  route: Router;
}

/**
 * Registry of all portal routes.
 * These paths are prefixed to the individual route definitions.
 */
const defaultIRoute: IRoute[] = [
  { path: "/auth", route: authRoute },           // Login, Signup, Verification
  { path: "/users", route: userRoute },          // General User Management
  { path: "/child", route: childRoute },         // Child registration & Approval
  { path: "/advisors", route: advisorsRoute },   // Advisor jurisdiction & specialized actions
  { path: "/parents", route: parentsRoute },     // Parent-specific data retrieval
  { path: "/measurements", route: measurements }, // WHO Health Standard management
  { path: "/healthData", route: healthData },    // Monthly growth tracking records
  { path: "/chat", route: chats },               // AI Health Assistant interactions
  { path: "/notifications", route: notifications }, // System alerts & Nutritional advice
];

// Mount all routes dynamically
defaultIRoute.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
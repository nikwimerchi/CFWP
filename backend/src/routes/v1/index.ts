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

const defaultIRoute: IRoute[] = [
  { path: "/auth", route: authRoute },
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/child",
    route: childRoute,
  },
  {
    path: "/advisors",
    route: advisorsRoute,
  },
  {
    path: "/parents",
    route: parentsRoute,
  },
  {
    path: "/measurements",
    route: measurements,
  },
  {
    path: "/healthData",
    route: healthData,
  },
  {
    path: "/chat",
    route: chats,
  },
  {
    path: "/notifications",
    route: notifications,
  },
];

defaultIRoute.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;

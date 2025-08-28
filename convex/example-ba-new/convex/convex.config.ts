import { defineApp } from "convex/server";
import autumn from "@atmn-hq/convex/convex.config";
import betterAuth from "@convex-dev/better-auth/convex.config";

const app = defineApp();
app.use(autumn);
app.use(betterAuth);

export default app;
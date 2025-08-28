import { defineApp } from "convex/server";
import autumn from "@atmn-hq/convex/convex.config";

const app = defineApp();
app.use(autumn);

export default app;

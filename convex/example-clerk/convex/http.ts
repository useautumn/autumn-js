import {
  GenericActionCtx,
  httpRouter,
} from "convex/server";
import { action, internalAction } from "./_generated/server";
import { api, components, internal } from "./_generated/api";
import { Autumn } from "@atmn-hq/convex";
import { verifyToken } from "@clerk/backend"

const http = httpRouter();

export default http;

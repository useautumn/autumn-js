import { findRoute } from "rou3";
import { Autumn } from "@sdk";
import { createRouterWithOptions } from "./routes/backendRouter";
import { AuthResult } from "./utils/AuthFunction";
import { autumnApiUrl } from "./constants";
import { secretKeyCheck } from "./utils/secretKeyCheck";

// Define middleware types
export type AutumnRequestHandler = (req: any, res: any, next: any) => void;

export type AutumnHandlerOptions = {
  identify: (req: any, res: any) => AuthResult;
  version?: string;
  secretKey?: string;
  baseURL?: string;
  autumn?: (req: any) => Autumn | Autumn;
};

export const autumnHandler = (
  options?: AutumnHandlerOptions
): AutumnRequestHandler => {
  const router = createRouterWithOptions();

  let { found, error: resError } = secretKeyCheck(options?.secretKey);

  return async (req: any, res: any, next: any) => {
    if (!found && !options?.secretKey) {
      return res.status(resError!.statusCode).json(resError);
    }

    let autumn =
      typeof options?.autumn === "function"
        ? options.autumn(req)
        : options?.autumn ||
          new Autumn({
            baseURL: options?.baseURL || autumnApiUrl,
            apiVersion: options?.version,
          });

    let path = req.path;
    const searchParams = Object.fromEntries(new URLSearchParams(req.query));

    if (!path.startsWith("/api/autumn")) {
      path = "/api/autumn" + path;
    }

    const match = findRoute(router, req.method, path);

    if (match) {
      const { data, params: pathParams } = match;
      const { handler } = data;

      let body = null;
      if (req.method === "POST") {
        try {
          body = req.body;
        } catch (error) {}
      }

      try {
        let result = await handler({
          autumn,
          body,
          path: req.path,
          getCustomer: async () => {
            return await options?.identify(req, res);
          },
          pathParams,
          searchParams,
        });

        return res.status(result.statusCode).json(result.body);
      } catch (error) {
        console.error("Error handling Autumn request:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }

    next();
  };
};

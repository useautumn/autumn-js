export interface AuthPluginOptions {
  provider: "better-auth" | "supabase" | "clerk";
  instance?: any;
  useOrg?: boolean;
  useUser?: boolean;
}

declare global {
  var __autumnAuth: AuthPluginOptions;
}

export const setupAuthPlugin = (options: AuthPluginOptions) => {
  global.__autumnAuth = options;
};

export const getAuthPlugin = () => {
  return global.__autumnAuth;
};

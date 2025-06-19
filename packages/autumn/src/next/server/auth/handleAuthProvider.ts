import { AuthPluginOptions } from "./authPlugin";
import { createSupabaseClient } from "./supabase-wrapper";
import { getClerkModule } from "./clerk-wrapper";
import { getNextHeadersAndCookies } from "./get-next-headers";

export const handleBetterAuth = async (options: AuthPluginOptions) => {
  let betterAuth: any = options.instance;
  if (!betterAuth) {
    throw {
      message: "BetterAuth instance is required",
      code: "auth_instance_required",
    };
  }

  const { headers } = await getNextHeadersAndCookies();

  if (options.useOrg) {
    try {
      let org = await betterAuth.api.getFullOrganization({
        headers: await headers(),
      });

      let session = await betterAuth.api.getSession({
        headers: await headers(),
      });

      if (org) {
        return {
          customerId: org.id,
          customerData: {
            name: org.name,
            email: session?.user?.email,
          },
        };
      }
    } catch (error) {
      throw {
        message: "Failed to get/create organization",
        code: "failed_to_create_organization",
      };
    }
  }

  if (options.useUser) {
    try {
      let session = await betterAuth.api.getSession({
        headers: await headers(),
      });

      if (session) {
        return {
          customerId: session.user.id,
          customerData: {
            name: session.user.name,
            email: session.user.email,
          },
        };
      }
    } catch (error) {
      throw {
        message: "Failed to get/create user",
        code: "failed_to_create_user",
      };
    }
  }

  return null;
};

export const handleClerk = async ({
  options,
  withCustomerData,
}: {
  options: AuthPluginOptions;
  withCustomerData: boolean;
}) => {
  const { verifyToken, createClerkClient } = await getClerkModule();
  const { cookies } = await getNextHeadersAndCookies();
  const cookieStore = await cookies();
  let sessionToken = cookieStore.get("__session")?.value;

  if (!sessionToken) {
    console.warn("(Autumn) No clerk session token found");
    return null;
  }

  const clerk = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  });

  const authData = await verifyToken(sessionToken, {
    secretKey: process.env.CLERK_SECRET_KEY,
  });

  let orgId = authData.org_id;
  let userId = authData.sub;

  if (options.useOrg) {
    try {
      if (orgId && withCustomerData) {
        let org = await clerk.organizations.getOrganization({
          organizationId: orgId,
        });

        let email = null;
        if (userId) {
          let user = await clerk.users.getUser(userId);
          email = user.primaryEmailAddress?.emailAddress;
        }

        return {
          customerId: orgId,
          customerData: {
            name: org.name,
            email: email,
          },
        };
      } else {
        if (authData.orgId) {
          return {
            customerId: authData.orgId,
          };
        }
      }
    } catch (error) {
      throw {
        message: `Failed to get/create clerk organization: ${error}`,
        code: "failed_to_create_clerk_organization",
      };
    }
  }

  if (options.useUser && userId) {
    try {
      let user = await clerk.users.getUser(userId);
      return {
        customerId: userId,
        customerData: {
          name: user.fullName,
          email: user.primaryEmailAddress?.emailAddress,
        },
      };
    } catch (error) {
      throw {
        message: `Failed to get/create clerk user: ${error}`,
        code: "failed_to_create_clerk_user",
      };
    }
  }

  return null;
};

export const handleSupabase = async (options: AuthPluginOptions) => {
  let supabase;

  supabase = await createSupabaseClient();

  if (options.useOrg) {
    console.warn("Supabase does not support organizations");
  }

  if (options.useUser) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    return {
      customerId: user?.id,
      customerData: {
        name: user?.user_metadata?.name,
        email: user?.email,
      },
    };
  }

  return null;
};

export const handleAuthProvider = ({
  authPlugin,
  withCustomerData,
}: {
  authPlugin: AuthPluginOptions;
  withCustomerData: boolean;
}) => {
  let authProvider = authPlugin.provider;

  switch (authProvider) {
    case "better-auth":
      return handleBetterAuth(authPlugin);
    case "clerk":
      return handleClerk({ options: authPlugin, withCustomerData });
    case "supabase":
      return handleSupabase(authPlugin);
    default:
      throw {
        message: `Unsupported auth provider: ${authProvider}`,
        code: "unsupported_auth_provider",
      };
  }
};

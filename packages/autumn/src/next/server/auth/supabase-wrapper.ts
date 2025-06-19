import { getNextHeadersAndCookies } from "./get-next-headers";

export async function createSupabaseClient() {
  let createServerClient;

  // 1. Try to import the createServerClient function
  try {
    let module = await import(/* webpackIgnore: true */ "@supabase/ssr");
    createServerClient = module.createServerClient;
  } catch (error) {
    throw {
      message: `Failed to import @supabase/ssr. Please ensure you have the @supabase/ssr package installed.`,
      code: "failed_to_import_supabase_ssr",
    };
  }

  const { cookies } = await getNextHeadersAndCookies();

  // 2. Try to create the client
  try {
    const cookieStore = await cookies();

    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );
  } catch (error: any) {
    throw {
      message: `Failed to create supabase client. Error: ${
        error.message || error
      }`,
      code: "failed_to_create_supabase_client",
    };
  }
}

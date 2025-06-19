// Create a separate file that manages the import
// clerks-wrapper.ts
let clerkModule: any = null;

export async function getClerkModule() {
  if (!clerkModule) {
    try {
      clerkModule = await import(
        /* webpackIgnore: true */
        // @ts-ignore
        "@clerk/backend"
      );
    } catch (e) {
      throw {
        message:
          "Failed to import @clerk/backend. Please ensure you have the @clerk/backend package installed.",
        code: "failed_to_import_clerk_backend",
      };
    }
  }
  return clerkModule;
}

import { betterAuth, Session } from "better-auth";
import { Organization, organization } from "better-auth/plugins";
import { autumn } from "autumn-js/better-auth";
import Database from "bun:sqlite";

export const auth = betterAuth({
	database: new Database("database.sqlite"),
	trustedOrigins: ["http://localhost:3000", "http://localhost:3001"],
	secret: process.env.BETTER_AUTH_SECRET,
	emailAndPassword: {
		enabled: true,
	},
	plugins: [
		organization(),
		autumn({
			identify: ({ session, organization }) => {
				if (organization?.id) {
					return {
						customerId: organization.id ?? null,
						customerData: {
							email: organization.ownerEmail ?? null,
							name: organization.name ?? null,
						},
					};
				} else if (session?.user.id) {
					return {
						customerId: session.user.id ?? null,
						customerData: {
							email: session.user.email ?? null,
							name: session.user.name ?? null,
						},
					};
				} else return null;
			},
		}),
	],
});

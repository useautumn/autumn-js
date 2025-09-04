import Database from "bun:sqlite";
import { autumn } from "autumn-js/better-auth";
import { betterAuth } from "better-auth";
import { organization } from "better-auth/plugins";

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
			enableOrganizations: true,
		}),
	],
});
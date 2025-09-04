import type { Session } from "better-auth";
import type { Organization } from "better-auth/plugins";

export type AutumnOptions = {
	url?: string;
	secretKey?: string;
	enableOrganizations?: boolean;
	identify?: (options: {
		session: Session;
		organization?: (Organization & { ownerEmail: string | null }) | null;
	}) => {
		customerId: string;
		customerData: {
			email: string;
			name: string;
		};
	} | null;
};

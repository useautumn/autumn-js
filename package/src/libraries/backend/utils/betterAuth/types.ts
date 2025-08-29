import { Session } from "better-auth";
import { Organization } from "better-auth/plugins";

export type AutumnOptions = {
	url?: string;
	secretKey?: string;
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

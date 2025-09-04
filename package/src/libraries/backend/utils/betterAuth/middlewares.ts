import { getSessionFromCtx } from "better-auth/api";
import {
	createAuthMiddleware,
	type Member,
	type Organization,
} from "better-auth/plugins";
import type { AutumnOptions } from "./types";

export const organizationMiddleware = (options?: AutumnOptions) =>
	createAuthMiddleware(async (ctx) => {
		if (!options?.enableOrganizations)
			return {
				activeOrganizationId: null,
				activeOrganization: null,
				activeOrganizationEmail: null,
			};

		const session = await getSessionFromCtx(ctx as any);
		const orgId = session?.session.activeOrganizationId;

		if (orgId && session) {
			// Check if user is a member of the organization
			const member = await ctx.context.adapter.findOne({
				model: "member",
				where: [
					{ field: "userId", value: session.user.id },
					{ field: "organizationId", value: orgId },
				],
			});

			if (!member) {
				// User is not a member, return null values
				return {
					activeOrganizationId: null,
					activeOrganization: null,
				};
			}

			// User is a member, get the organization and owner members in parallel
			const [organization, ownerMembers] = await Promise.all([
				ctx.context.adapter.findOne({
					model: "organization",
					where: [
						{
							field: "id",
							value: orgId,
						},
					],
				}),
				ctx.context.adapter.findMany({
					model: "member",
					where: [
						{ field: "organizationId", value: orgId },
						{
							field: "role",
							value: ctx.context.orgOptions?.creatorRole || "owner",
						},
					],
				}),
			]);

			// Get the first owner's name or handle multiple owners
			let ownerEmail = null;
			if (ownerMembers.length > 0) {
				const ownerUser = await ctx.context.adapter.findOne({
					model: "user",
					where: [
						{
							field: "id",
							value: (ownerMembers[0] as Member).userId as string,
						},
					],
				});
				ownerEmail = (ownerUser as any)?.email || null;
			}

			return {
				activeOrganizationId: orgId,
				activeOrganization: organization,
				activeOrganizationEmail: ownerEmail,
			};
		}

		return {
			activeOrganizationId: null,
			activeOrganization: null,
		};
	});

export const identityMiddleware = (options?: AutumnOptions) =>
	createAuthMiddleware(async (ctx) => {
		if (!options?.identify) return {
			autumnIdentity: null,
		}
		const session = await getSessionFromCtx(ctx as any);
		const org = (ctx.context as any).activeOrganization;
		const ownerEmail = (ctx.context as any).activeOrganizationEmail;
		const identity = await options?.identify?.({
			session: session?.session as any,
			organization:
				org?.id !== null
					? ({
							...org,
							ownerEmail: ownerEmail as string | null,
						} as Organization & { ownerEmail: string | null })
					: null,
		});
		return {
			autumnIdentity: identity,
		};
	});

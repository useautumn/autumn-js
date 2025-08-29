import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const orgs = await auth.api.listOrganizations();

	console.log("Orgs list", orgs);

    const res = await auth.api.deleteOrganization({
		body: {
			organizationId: "test-organization-2",
		},
	});

	const res2 = await auth.api.deleteOrganization({
		body: {
			organizationId: "test-organization",
		},
	});

	return NextResponse.json({ res, res2 });
}

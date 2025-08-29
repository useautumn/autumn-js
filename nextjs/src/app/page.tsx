"use client";
// import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import {
	PaywallDialog,
	PricingTable,
	useCustomer,
	useEntity,
} from "autumn-js/react";
import { useEffect, useState } from "react";
// import PricingTable from "@/components/autumn/pricing-table";
import { default as BlockingPaywallDialog } from "@/components/autumn/paywall-dialog";

export default function Home() {
	const {
		attach,
		check,
		track,
		cancel,
		checkout,
		openBillingPortal,
		redeemReferralCode,
		createReferralCode,
		isLoading,
		createEntity,
		customer,
		refetch: refetchCustomer,
		// allowed,
	} = useCustomer();
	const { data: session, refetch: refetchSession } = authClient.useSession();
	const { data: organisation } = authClient.useActiveOrganization();
	const { data: orgs } = authClient.useListOrganizations();
	const { entity, refetch: refetchEntity } = useEntity("test_" + (session?.session.activeOrganizationId ?? "default"));

	// useEffect(() => {
	//   check({ featureId: "create_thinkfasts", dialog: BlockingPaywallDialog });
	// }, [isLoading]);

	// useEffect(() => {
	//   check({ featureId: "create_thinkfasts", dialog: PaywallDialog });
	// }, [isLoading]);

	return (
		<div className="min-h-screen w-screen flex">
			{/* Left Column - Actions & Pricing */}
			<div className="flex-1 min-h-screen overflow-y-auto p-10 space-y-8">
				<h2 className="text-2xl font-bold">Actions & Pricing</h2>

				{/* Pricing Table - Top of left column */}
				<PricingTable />

				{/* All Action Buttons */}
				<section className="space-y-4">
					<h3 className="text-xl font-semibold">All Actions</h3>
					<div className="grid grid-cols-2 gap-3">
						{/* Authentication */}
						<Button
							onClick={async () => {
								const res = await authClient.signIn.email({
									email: "johnyeo10@gmail.com",
									password: "testing123",
								});
								console.log(res);
							}}
						>
							Sign In
						</Button>
						<Button
							onClick={async () => {
								const res = await authClient.signOut();
								console.log(res);
							}}
						>
							Sign Out
						</Button>
						<Button
							onClick={async () => {
								const res = await authClient.signUp.email({
									name: "John Yeo",
									email: "johnyeo10@gmail.com",
									password: "testing123",
								});
								console.log(res);
							}}
						>
							Sign Up
						</Button>
						<Button
							onClick={async () => {
								const res = await fetch("http://localhost:3001/api/test", {
									method: "GET",
								});
								console.log(res);
							}}
						>
							Test Better Auth Plugin
						</Button>

						{/* Organizations */}
						<Button
							onClick={async () => {
								const res = await authClient.organization.create({
									name: "Test Organization",
									slug: "test-organization",
								});

								const resJoin = await authClient.organization.inviteMember({
									organizationId: res.data?.id,
									email: "johnyeo10@gmail.com",
									role: "admin",
									resend: true,
								});

								const res2 = await authClient.organization.create({
									name: "Test Organization 2",
									slug: "test-organization-2",
								});

								const resJoin2 = await authClient.organization.inviteMember({
									organizationId: "test-organization-2",
									email: "johnyeo10@gmail.com",
									role: "admin",
									resend: true,
								});

								console.log(res, resJoin, res2, resJoin2);
							}}
						>
							Create Organization
						</Button>
						<Button
							onClick={async () => {
								const res = await authClient.organization.setActive({
									organizationId: orgs?.find(
										(org) => org.name === "Test Organization"
									)?.id,
								});
								refetchSession();
								refetchCustomer();  
								refetchEntity();
								console.log(res);
							}}
						>
							Set Active Organization 1
						</Button>
						<Button
							onClick={async () => {
								const res = await authClient.organization.setActive({
									organizationId: orgs?.find(
										(org) => org.name === "Test Organization 2"
									)?.id,
								});
								refetchSession();
								refetchCustomer();
								refetchEntity();
								console.log(res);
							}}
						>
							Set Active Organization 2
						</Button>
						<Button
							onClick={async () => {
								const res = await fetch(
									"http://localhost:3001/api/test/deleteAllOrgs",
									{
										method: "GET",
									}
								);
								const data = await res.json();
								refetchSession();
								refetchEntity();
								console.log(data);
							}}
						>
							Delete All Orgs
						</Button>

						{/* Entities */}
						<Button
							onClick={async () => {
								const res = await createEntity({
									id: "test_" + (session?.session.activeOrganizationId ?? "default"),
									name: "Test Entity",
									featureId: "test",
								});
								refetchCustomer();
								refetchEntity();
							}}
						>
							Create Entity
						</Button>
						<Button
							onClick={async () => {
								const entity = useEntity("test");
								console.log(entity.entity);
							}}
						>
							Get Entity
						</Button>
						<Button
							onClick={async () => {
								const entity = useEntity("test");
								refetchEntity();
							}}
						>
							Delete Entity
						</Button>

						{/* Billing & Features */}
						<Button
							onClick={async () => {
								const res = await openBillingPortal({
									// openInNewTab: true,
									returnUrl: "https://facebook.com",
								});
								console.log(res);
							}}
						>
							Open Billing Portal
						</Button>
						<Button
							onClick={async () => {
								const res = await cancel({
									productId: "pro",
								});
								console.log(res);
							}}
						>
							Cancel
						</Button>
						<Button
							onClick={async () => {
								const res = await check({
									featureId: "messages",
								});
								console.log(res);
							}}
						>
							Check
						</Button>
						<Button
							onClick={async () => {
								const res = await track({
									featureId: "messages",
								});
								console.log(res);
							}}
						>
							Track
						</Button>
						<Button
							onClick={async () => {
								const res = await checkout({
									productId: "pro",
									successUrl: "https://facebook.com",
								});
								console.log(res);
							}}
						>
							Checkout
						</Button>
						<Button
							onClick={async () => {
								const res = await attach({
									productId: "pro",
									openInNewTab: true,
								});
								console.log(res);
							}}
						>
							Attach
						</Button>
						<Button
							onClick={async () => {
								const res = await createReferralCode({
									programId: "test",
								});
								console.log(res);
							}}
						>
							Create Referral Code
						</Button>
						<Button
							onClick={async () => {
								const res = await redeemReferralCode({
									code: "test",
								});
								console.log(res);
							}}
						>
							Redeem Referral Code
						</Button>
					</div>
				</section>
			</div>

			{/* Right Column - Data Display */}
			<div className="flex-1 min-h-screen overflow-y-auto p-10 space-y-6 gap-y-4">
				<h2 className="text-2xl font-bold">Data</h2>

				{session && (
					<details className="p-4 rounded-lg">
						<summary className="text-lg font-semibold mb-2 cursor-pointer hover:text-blue-600">
							Session
						</summary>
						<div className="space-y-1 mt-4">
							<p>
								<span className="font-medium">User ID:</span> {session.user.id}
							</p>
							<p>
								<span className="font-medium">Name:</span> {session.user.name}
							</p>
							<p>
								<span className="font-medium">Email:</span> {session.user.email}
							</p>
							<p>
								<span className="font-medium">Session ID:</span>{" "}
								{session.session.id}
							</p>
							{session.session.activeOrganizationId && (
								<p>
									<span className="font-medium">Active Org ID:</span>{" "}
									{session.session.activeOrganizationId}
								</p>
							)}
						</div>
					</details>
				)}

				{organisation && (
					<details className="p-4 rounded-lg py-8">
						<summary className="text-lg font-semibold mb-2 cursor-pointer hover:text-blue-600">
							Active Organization
						</summary>
						<div className="space-y-1 mt-4">
							<p>
								<span className="font-medium">ID:</span> {organisation.id}
							</p>
							<p>
								<span className="font-medium">Name:</span> {organisation.name}
							</p>
							<p>
								<span className="font-medium">Slug:</span> {organisation.slug}
							</p>
						</div>
					</details>
				)}

				{orgs && (
					<details className="p-4 rounded-lg">
						<summary className="text-lg font-semibold mb-2 cursor-pointer hover:text-blue-600">
							Organizations ({orgs.length})
						</summary>
						<div className="space-y-2 mt-4">
							{orgs.map((org) => (
								<div key={org.id} className="border-b pb-2">
									<p>
										<span className="font-medium">ID:</span> {org.id}
									</p>
									<p>
										<span className="font-medium">Name:</span> {org.name}
									</p>
								</div>
							))}
						</div>
					</details>
				)}

				{entity && (
					<details className="p-4 rounded-lg">
						<summary className="text-lg font-semibold mb-2 cursor-pointer hover:text-blue-600">
							Entity
						</summary>
						<div className="space-y-1 mt-4">
							<p>
								<span className="font-medium">ID:</span> {entity.id}
							</p>
							<p>
								<span className="font-medium">Name:</span> {entity.name}
							</p>
						</div>
					</details>
				)}

				{customer && (
					<details className="p-4 rounded-lg">
						<summary className="text-lg font-semibold mb-2 cursor-pointer hover:text-blue-600">
							Customer
						</summary>
						<div className="space-y-1 mt-4">
							<p>
								<span className="font-medium">ID:</span> {customer.id}
							</p>
							<p>
								<span className="font-medium">Email:</span> {customer.email}
							</p>
							<p>
								<span className="font-medium">Name:</span> {customer.name}
							</p>
							<p>
								<span className="font-medium">Environment:</span>{" "}
								{(customer as any).env}
							</p>
							<p>
								<span className="font-medium">Stripe ID:</span>{" "}
								{(customer as any).stripe_id || "None"}
							</p>

							{(customer as any).products &&
								(customer as any).products.length > 0 && (
									<div className="mt-3">
										<p className="font-medium">Products:</p>
										<div className="ml-4 space-y-2">
											{(customer as any).products.map(
												(product: any, index: number) => (
													<div
														key={index}
														className="border-l-2 border-gray-300 pl-3"
													>
														<p>
															<span className="font-medium">ID:</span>{" "}
															{product.id}
														</p>
														<p>
															<span className="font-medium">Name:</span>{" "}
															{product.name}
														</p>
														<p>
															<span className="font-medium">Status:</span>{" "}
															{product.status}
														</p>
														<p>
															<span className="font-medium">Default:</span>{" "}
															{product.is_default ? "Yes" : "No"}
														</p>
														{product.started_at && (
															<p>
																<span className="font-medium">Started:</span>{" "}
																{new Date(
																	product.started_at
																).toLocaleDateString()}
															</p>
														)}
														{product.items && product.items.length > 0 && (
															<div className="mt-2">
																<p className="font-medium text-sm">Items:</p>
																<div className="ml-2 space-y-1">
																	{product.items.map(
																		(item: any, itemIndex: number) => (
																			<div key={itemIndex} className="text-sm">
																				<p>
																					<span className="font-medium">
																						Feature:
																					</span>{" "}
																					{item.feature_id} ({item.feature_type}
																					)
																				</p>
																				<p>
																					<span className="font-medium">
																						Usage:
																					</span>{" "}
																					{item.included_usage}
																				</p>
																			</div>
																		)
																	)}
																</div>
															</div>
														)}
													</div>
												)
											)}
										</div>
									</div>
								)}

							{(customer as any).features &&
								Object.keys((customer as any).features).length > 0 && (
									<div className="mt-3">
										<p className="font-medium">Features:</p>
										<div className="ml-4 space-y-2">
											{Object.entries((customer as any).features).map(
												([featureId, feature]: [string, any]) => (
													<div
														key={featureId}
														className="border-l-2 border-blue-300 pl-3"
													>
														<p>
															<span className="font-medium">ID:</span>{" "}
															{feature.id}
														</p>
														<p>
															<span className="font-medium">Name:</span>{" "}
															{feature.name}
														</p>
														<p>
															<span className="font-medium">Type:</span>{" "}
															{feature.type}
														</p>
														<p>
															<span className="font-medium">Balance:</span>{" "}
															{feature.balance}
														</p>
														<p>
															<span className="font-medium">Usage:</span>{" "}
															{feature.usage}
														</p>
														<p>
															<span className="font-medium">Included:</span>{" "}
															{feature.included_usage}
														</p>
														<p>
															<span className="font-medium">Unlimited:</span>{" "}
															{feature.unlimited ? "Yes" : "No"}
														</p>
														{feature.next_reset_at && (
															<p>
																<span className="font-medium">Next Reset:</span>{" "}
																{new Date(
																	feature.next_reset_at
																).toLocaleDateString()}
															</p>
														)}
													</div>
												)
											)}
										</div>
									</div>
								)}
						</div>
					</details>
				)}
			</div>
		</div>
	);
}

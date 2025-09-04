import type {
  AutumnError,
  AutumnPromise,
  BillingPortalResult,
  CancelResult,
  CheckResult,
  CreateReferralCodeResult,
  Customer,
  CustomerExpandOption,
  Entity,
  RedeemReferralCodeResult,
  SetupPaymentResult,
  TrackResult,
} from "@sdk";
import type { AttachResult, CheckoutResult } from "@sdk/general/attachTypes";
import type { Success } from "@sdk/response";
import type React from "react";
import { useEffect } from "react";
import useSWR, { type SWRConfiguration } from "swr";
import type {
  AttachParams,
  CheckoutParams,
} from "@/client/types/clientAttachTypes";
import type {
  CancelParams,
  CheckParams,
  OpenBillingPortalParams,
  SetupPaymentParams,
  TrackParams,
} from "@/client/types/clientGenTypes";
import { type AutumnContextParams, useAutumnContext } from "../AutumnContext";
import type { AutumnClient } from "../client/ReactAutumnClient";
import type { CreateEntityParams } from "../client/types/clientEntTypes";
import type {
  CreateReferralCodeParams,
  RedeemReferralCodeParams,
} from "../client/types/clientReferralTypes";
import { handleCheck, openDialog } from "./helpers/handleCheck";
import { useAutumnBase } from "./helpers/useAutumnBase";

export interface UseCustomerResult {
	/** The current customer data including subscription and feature information */
	customer: Customer | null;
	/** Whether customer data is currently being loaded */
	isLoading: boolean;
	/** Any error that occurred while fetching customer data */
	error: AutumnError | null;

	// Autumn functions
	/**
	 * Attaches a product to the current customer, enabling access and handling billing.
	 * Activates a product and applies all product items with automatic payment handling.
	 */
	attach: (params: AttachParams) => AutumnPromise<AttachResult | CheckResult>;

	/**
	 * Tracks usage events for metered features.
	 * Records feature usage and updates customer balances server-side.
	 */
	track: (params: TrackParams) => AutumnPromise<TrackResult>;

	/**
	 * Cancels a customer's subscription or product attachment.
	 * Can cancel immediately or at the end of the billing cycle.
	 */
	cancel: (params: CancelParams) => AutumnPromise<CancelResult>;

	/**
	 * Sets up a payment method for the customer.
	 * Collects payment information without immediately charging.
	 */
	setupPayment: (
		params: SetupPaymentParams,
	) => AutumnPromise<SetupPaymentResult>;

	/**
	 * Opens the Stripe billing portal for the customer.
	 * Allows customers to manage their subscription and payment methods.
	 */
	openBillingPortal: (
		params?: OpenBillingPortalParams,
	) => AutumnPromise<BillingPortalResult>;

	/**
	 * Initiates a checkout flow for product purchase.
	 * Handles payment collection and redirects to Stripe checkout when needed.
	 */
	checkout: (params: CheckoutParams) => AutumnPromise<CheckoutResult>;

	/** Refetches the customer data from the server */
	refetch: () => Promise<Customer | null>;

	/**
	 * Creates new entities for granular feature tracking.
	 * Entities allow per-user or per-workspace feature limits.
	 */
	createEntity: (
		params: CreateEntityParams | CreateEntityParams[],
	) => AutumnPromise<Entity | Entity[]>;

	/**
	 * Creates a referral code for the customer.
	 * Generates codes that can be shared for referral programs.
	 */
	createReferralCode: (
		params: CreateReferralCodeParams,
	) => AutumnPromise<CreateReferralCodeResult>;

	/**
	 * Redeems a referral code for the customer.
	 * Applies referral benefits when a valid code is provided.
	 */
	redeemReferralCode: (
		params: RedeemReferralCodeParams,
	) => AutumnPromise<RedeemReferralCodeResult>;

	/**
	 * Checks if a customer has access to a feature and shows paywalls if needed.
	 * Client-side feature gating with optional dialog display for upgrades.
	 */
	check: (params: CheckParams) => Success<CheckResult>;
}

export interface UseCustomerParams {
	errorOnNotFound?: boolean;
	expand?: CustomerExpandOption[];
	swrConfig?: SWRConfiguration;
}

export const useCustomerBase = ({
	params,
	AutumnContext,
	client,
}: {
	params?: UseCustomerParams;
	AutumnContext?: React.Context<AutumnContextParams>;
	client?: AutumnClient;
}): UseCustomerResult => {
	let context: AutumnContextParams | undefined;

	if (AutumnContext) {
    // biome-ignore lint/correctness/useHookAtTopLevel: needed
		context = useAutumnContext({
			AutumnContext,
			name: "useCustomer",
		});
	}

	if (!client) {
		client = context!.client;
	}

	const baseUrl = client?.backendUrl || "";
	const queryKey = ["customer", baseUrl, params?.expand];

	const fetchCustomer = async () => {
		const { data, error } = await client!.createCustomer({
			errorOnNotFound: params?.errorOnNotFound,
			expand: params?.expand,
		});

		if (error) {
			throw error;
		}

		if (!data) {
			return null;
		}

		return data;
	};

	const {
		data: customer,
		error,
		isLoading,
		mutate,
	} = useSWR(queryKey, fetchCustomer, {
		fallbackData: null,
		// Default to 5 minutes
		swrConfig: {
			shouldRetryOnError: false,
			// refreshInterval: 1000 * 60 * 5,
			refreshInterval: 0,
			...params?.swrConfig,
		},
	});

	const autumnFunctions = useAutumnBase({
		context,
		client,
		refetchCustomer: mutate,
	});

	useEffect(() => {
		// console.log("Paywall ref:", context?.paywallRef.current);
		// context?.paywallDialog.setOpen(true);
		// context?.paywallDialog.setProps(params);
		// context?.paywallDialog.setOpen(true);
	// }, [context?.paywallRef.current]);
  }, []);

	return {
		customer: error ? null : customer,
		isLoading,
		error,
		refetch: mutate as () => Promise<Customer | null>,

		...autumnFunctions,
		createEntity: client.entities.create,
		createReferralCode: client.referrals.createCode,
		redeemReferralCode: client.referrals.redeemCode,
		check: (params: CheckParams) => {
			const res = handleCheck({
				customer,
				params,
				isEntity: false,
				context,
			});

			openDialog({
				result: res.data,
				params,
				context: context!,
			});

			return res;
		},
	};
};

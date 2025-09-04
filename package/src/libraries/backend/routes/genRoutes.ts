import type { AttachParams, CheckoutParams } from "@sdk/general/attachTypes";
import { addRoute, type RouterContext } from "rou3";
import type { QueryParams } from "@/client/types/clientGenTypes";
import type {
	Autumn,
	BillingPortalParams,
	CancelParams,
	CheckParams,
	CustomerData,
	SetupPaymentParams,
	TrackParams,
} from "../../../sdk";
import { BASE_PATH } from "../constants";
import { withAuth } from "../utils/withAuth";

const sanitizeBody = (body: any) => {
	const bodyCopy = { ...body };
	delete bodyCopy.customer_id;
	delete bodyCopy.customer_data;
	return bodyCopy;
};

const checkoutHandler = withAuth({
	fn: async ({
		autumn,
		customer_id,
		customer_data,
		body,
	}: {
		autumn: Autumn;
		customer_id: string;
		customer_data?: CustomerData;
		body: CheckoutParams;
	}) => {
		return await autumn.checkout({
			...sanitizeBody(body),
			customer_id,
			customer_data,
		});
	},
});
const attachHandler = withAuth({
	fn: async ({
		autumn,
		customer_id,
		customer_data,
		body,
	}: {
		autumn: Autumn;
		customer_id: string;
		customer_data?: CustomerData;
		body: AttachParams;
	}) => {
		return await autumn.attach({
			...sanitizeBody(body),
			customer_id,
			customer_data,
		});
	},
});
const setupPaymentHandler = withAuth({
	fn: async ({
		autumn,
		customer_id,
		customer_data,
		body,
	}: {
		autumn: Autumn;
		customer_id: string;
		customer_data?: CustomerData;
		body: SetupPaymentParams;
	}) => {
		return await autumn.setupPayment({
			...sanitizeBody(body),
			customer_id,
			customer_data,
		});
	},
});

const cancelHandler = withAuth({
	fn: async ({
		autumn,
		customer_id,
		body,
	}: {
		autumn: Autumn;
		customer_id: string;
		body: CancelParams;
	}) => {
		return await autumn.cancel({
			...sanitizeBody(body),
			customer_id,
		});
	},
});

const checkHandler = withAuth({
	fn: async ({
		autumn,
		customer_id,
		customer_data,
		body,
	}: {
		autumn: Autumn;
		customer_id: string;
		customer_data?: CustomerData;
		body: CheckParams;
	}) => {
		// console.log("checkHandler", body);

		const result = await autumn.check({
			...sanitizeBody(body),
			customer_id,
			customer_data,
		});
		// console.log("checkHandler result", result);
		return result;
	},
});

const trackHandler = withAuth({
	fn: async ({
		autumn,
		customer_id,
		customer_data,
		body,
	}: {
		autumn: Autumn;
		customer_id: string;
		customer_data?: CustomerData;
		body: TrackParams;
	}) => {
		return await autumn.track({
			...sanitizeBody(body),
			customer_id,
			customer_data,
		});
	},
});

const openBillingPortalHandler = withAuth({
	fn: async ({
		autumn,
		customer_id,
		body,
	}: {
		autumn: Autumn;
		customer_id: string;
		body: BillingPortalParams;
	}) => {
		return await autumn.customers.billingPortal(customer_id, body);
	},
});

const queryHandler = withAuth({
	fn: async ({
		autumn,
		customer_id,
		body,
	}: {
		autumn: Autumn;
		customer_id: string;
		body: QueryParams;
	}) => {
		return await autumn.query({ customer_id, range: body.range, feature_id: body.featureId });
	},
});

const addGenRoutes = (router: RouterContext) => {
	addRoute(router, "POST", `${BASE_PATH}/checkout`, {
		handler: checkoutHandler,
	});
	addRoute(router, "POST", `${BASE_PATH}/attach`, {
		handler: attachHandler,
	});
	addRoute(router, "POST", `${BASE_PATH}/cancel`, {
		handler: cancelHandler,
	});
	addRoute(router, "POST", `${BASE_PATH}/check`, {
		handler: checkHandler,
	});
	addRoute(router, "POST", `${BASE_PATH}/track`, {
		handler: trackHandler,
	});
	addRoute(router, "POST", `${BASE_PATH}/billing_portal`, {
		handler: openBillingPortalHandler,
	});
	addRoute(router, "POST", `${BASE_PATH}/setup_payment`, {
		handler: setupPaymentHandler,
	});
	addRoute(router, "POST", `${BASE_PATH}/query`, {
		handler: queryHandler,
	});
};

export { addGenRoutes };

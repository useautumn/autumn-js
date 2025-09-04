import type { AutumnPromise } from "@sdk/response";
import type { Product } from "src/sdk/products/prodTypes";
import type { AutumnClient } from "./ReactAutumnClient";

export async function listProductsMethod(this: AutumnClient): AutumnPromise<{
	list: Product[];
}> {
	const res = await this.get(`${this.prefix}/products`);
	return res;
}

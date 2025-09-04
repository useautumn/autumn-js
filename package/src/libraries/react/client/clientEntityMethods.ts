import type { AutumnPromise, DeleteEntityResult, Entity } from "../../../sdk";
import { getEntityExpandStr } from "../../../utils/entityUtils";
import { toSnakeCase } from "../utils/toSnakeCase";
import type { AutumnClient } from "./ReactAutumnClient";
import type {
	CreateEntityParams,
	GetEntityParams,
} from "./types/clientEntTypes";

export async function createEntityMethod(
	this: AutumnClient,
	params: CreateEntityParams | CreateEntityParams[],
): AutumnPromise<Entity | Entity[]> {
	const snakeParams = toSnakeCase(params);
	const res = await this.post(`${this.prefix}/entities`, !this.camelCase ? snakeParams : params);
	return res;
}

export async function getEntityMethod(
	this: AutumnClient,
	entityId: string,
	params?: GetEntityParams,
): AutumnPromise<Entity> {
	const expand = getEntityExpandStr(params?.expand);

	const res = await this.get(`${this.prefix}/entities/${entityId}?${expand}`);

	return res;
}

export async function deleteEntityMethod(
	this: AutumnClient,
	entityId: string,
): AutumnPromise<DeleteEntityResult> {
	const res = await this.delete(
		`${this.prefix}/entities/${entityId}`
	);
	return res;
}

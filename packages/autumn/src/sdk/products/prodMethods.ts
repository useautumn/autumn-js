import { Autumn } from "../client";

import { AutumnPromise } from "../response";
import { staticWrapper } from "../utils";
import { CreateProductParams, ListProductsParams, Product } from "./prodTypes";

export const productMethods = (instance?: Autumn) => {
  return {
    get: (id: string) => staticWrapper(getProduct, instance, { id }),
    create: (params?: CreateProductParams) =>
      staticWrapper(createProduct, instance, { params }),
    list: (params?: ListProductsParams) =>
      staticWrapper(listProducts, instance, { params }),
  };
};

export const listProducts = async ({
  instance,
  params,
}: {
  instance: Autumn;
  params?: ListProductsParams;
}): AutumnPromise<Product[]> => {
  let path = "/products";
  if (params) {
    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        queryParams.append(key, String(value));
      }
    }
    const queryString = queryParams.toString();
    if (queryString) {
      path += `?${queryString}`;
    }
  }
  return instance.get(path);
};

export const getProduct = async ({
  instance,
  id,
}: {
  instance: Autumn;
  id: string;
}): AutumnPromise<Product> => {
  return instance.get(`/products/${id}`);
};

export const createProduct = async ({
  instance,
  params,
}: {
  instance: Autumn;
  params?: CreateProductParams;
}): AutumnPromise<Product> => {
  return instance.post("/products", params);
};

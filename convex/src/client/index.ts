import {
  actionGeneric,
  mutationGeneric,
  queryGeneric,
  httpActionGeneric,
} from "convex/server";
import type {
  ActionBuilder,
  FunctionVisibility,
  HttpRouter,
  GenericActionCtx,
  FunctionReference,
  RegisteredAction,
  FunctionHandle,
} from "convex/server";
import { ROUTABLE_HTTP_METHODS } from "convex/server";
import { corsRouter } from "convex-helpers/server/cors";
import { JSONValue, v } from "convex/values";
import type { Mounts } from "../component/_generated/api.js";
import type {
  UseApi,
  RunMutationCtx,
  RunQueryCtx,
  RunActionCtx,
} from "./types.js";
import {
  type TrackArgsType,
  AttachArgs,
  AttachArgsType,
  CheckArgs,
  CheckArgsType,
  CheckoutArgs,
  CheckoutArgsType,
  TrackArgs,
  UserTrackArgs,
  UserCheckArgs,
  UserAttachArgs,
  UserCheckoutArgs,
  CreateEntityArgs,
  CreateEntityArgsType,
  UserCreateEntityArgsType,
  UserCreateEntityArgs,
  UserCreateSingleEntityArgs,
  UserCreateSingleEntityArgsType,
  DeleteEntityArgsType,
  DeleteEntityArgs,
  GetCustomerArgsType,
  UpdateCustomerArgsType,
  DeleteCustomerArgsType,
  BillingPortalArgsType,
  GetProductArgsType,
  ListProductsArgsType,
  CreateReferralCodeArgsType,
  RedeemReferralCodeArgsType,
  UsageArgs,
  UsageArgsType,
  QueryArgs,
  QueryArgsType,
  CancelArgs,
  CancelArgsType,
  SetupPaymentArgs,
  SetupPaymentArgsType,
  GetEntityArgsType,
  FetchCustomerArgs,
  ExpandArgs,
  UserTrackArgsType,
  UserCheckArgsType,
  UserAttachArgsType,
  UserCheckoutArgsType,
  camelToSnake,
  CreateCustomerArgsType,
} from "../types.js";
import { convexHandler } from "autumn-js/convex";
import * as autumnHelpers from "./helpers/index.js";
import { action } from "../component/_generated/server.js";

// UseApi<typeof api> is an alternative that has jump-to-definition but is
// less stable and reliant on types within the component files, which can cause
// issues where passing `components.foo` doesn't match the argument
export type AutumnComponent = UseApi<Mounts>;

export class Autumn {
  constructor(
    public component: AutumnComponent,
    public options: {
      identify: any;
      apiKey: string;
      url?: string;
    }
  ) {}

  async track(ctx: any, args: UserTrackArgsType) {
    const identifierOpts = await this.getIdentifierOpts(ctx);
    return await autumnHelpers.track({
      ...args,
      customer_id: identifierOpts.customerId,
      customer_data: identifierOpts.customerData,
      apiKey: this.options.apiKey,
    });
  }

  async check(ctx: any, args: UserCheckArgsType) {
    const identifierOpts = await this.getIdentifierOpts(ctx);
    return await autumnHelpers.check({
      ...args,
      customer_id: identifierOpts.customerId,
      customer_data: identifierOpts.customerData,
      apiKey: this.options.apiKey,
    });
  }

  async attach(ctx: any, args: UserAttachArgsType) {
    const identifierOpts = await this.getIdentifierOpts(ctx);
    return await autumnHelpers.attach({
      ...args,
      customer_id: identifierOpts.customerId,
      customer_data: identifierOpts.customerData,
      apiKey: this.options.apiKey,
    });
  }

  async checkout(ctx: any, args: UserCheckoutArgsType) {
    const identifierOpts = await this.getIdentifierOpts(ctx);
    return await autumnHelpers.checkout({
      ...camelToSnake(args),
      customer_id: identifierOpts.customerId,
      apiKey: this.options.apiKey,
    });
  }

  customers = {
    get: async (ctx: any, args: Omit<GetCustomerArgsType, "apiKey">) => {
      const identifierOpts = await this.getIdentifierOpts(ctx);
      return await autumnHelpers.customers.get({
        ...camelToSnake(args),
        customer_id: identifierOpts.customerId,
        apiKey: this.options.apiKey,
      });
    },
    getById: async (ctx: any, id: string) => {
      return await autumnHelpers.customers.get({
        customer_id: id,
        apiKey: this.options.apiKey,
      });
    },
    update: async (ctx: any, args: Omit<UpdateCustomerArgsType, "apiKey">) => {
      const identifierOpts = await this.getIdentifierOpts(ctx);
      return await autumnHelpers.customers.update({
        ...camelToSnake(args),
        customer_id: identifierOpts.customerId,
        apiKey: this.options.apiKey,
      });
    },
    delete: async (ctx: any) => {
      const identifierOpts = await this.getIdentifierOpts(ctx);
      return await autumnHelpers.customers.discard({
        customer_id: identifierOpts.customerId,
        apiKey: this.options.apiKey,
      });
    },
    create: async (ctx: any, args: Omit<CreateCustomerArgsType, "apiKey">) => {
      return await autumnHelpers.customers.create({
        ...args,
        apiKey: this.options.apiKey,
      });
    },
    billingPortal: async (ctx: any, args: BillingPortalArgsType) => {
      const identifierOpts = await this.getIdentifierOpts(ctx);
      return await autumnHelpers.customers.billingPortal({
        ...camelToSnake(args),
        customer_id: identifierOpts.customerId,
        apiKey: this.options.apiKey,
      });
    },
  };

  products = {
    get: async (ctx: any, args: Omit<GetProductArgsType, "apiKey">) => {
      return await autumnHelpers.products.get({
        ...args,
        apiKey: this.options.apiKey,
      });
    },
    list: async (ctx: any) => {
      return await autumnHelpers.products.list({
        apiKey: this.options.apiKey,
      });
    },
  };

  referrals = {
    createCode: async (
      ctx: any,
      args: Omit<CreateReferralCodeArgsType, "apiKey" | "customer_id">
    ) => {
      const identifierOpts = await this.getIdentifierOpts(ctx);
      return await autumnHelpers.referrals.createCode({
        ...args,
        customer_id: identifierOpts.customerId,
        apiKey: this.options.apiKey,
      });
    },
    redeemCode: async (
      ctx: any,
      args: Omit<RedeemReferralCodeArgsType, "apiKey" | "customer_id">
    ) => {
      const identifierOpts = await this.getIdentifierOpts(ctx);
      return await autumnHelpers.referrals.redeemCode({
        ...args,
        customer_id: identifierOpts.customerId,
        apiKey: this.options.apiKey,
      });
    },
  };

  entities = {
    get: async (ctx: any, args: Omit<GetEntityArgsType, "apiKey">) => {
      const identifierOpts = await this.getIdentifierOpts(ctx);
      return await autumnHelpers.entities.get({
        ...args,
        customer_id: identifierOpts.customerId,
        apiKey: this.options.apiKey,
      });
    },
    create: async (
      ctx: any,
      args: Omit<CreateEntityArgsType, "apiKey" | "customer_id">
    ) => {
      const identifierOpts = await this.getIdentifierOpts(ctx);
      return await autumnHelpers.entities.create({
        ...args,
        customer_id: identifierOpts.customerId,
        apiKey: this.options.apiKey,
      });
    },
    delete: async (ctx: any, args: Omit<DeleteEntityArgsType, "apiKey">) => {
      return await autumnHelpers.entities.discard({
        ...args,
        apiKey: this.options.apiKey,
      });
    },
  };

  /**
   * Utility to re-export actions with automatic customer identification.
   * Example usage:
   *   autumn.api().track({ featureId: "message" })
   */
  api() {
    return {
      // Core tracking and checking methods
      track: actionGeneric({
        args: UserTrackArgs,
        handler: async (ctx, args) => {
          const identifierOpts = await this.options.identify(ctx);
          if (!identifierOpts) {
            throw new Error(
              "No customer identifier found for Autumn.identify()"
            );
          }

          const trackArgs: TrackArgsType = {
            feature_id: args.featureId,
            value: args.value,
            entity_id: args.entityId,
            event_name: args.eventName,
            idempotency_key: args.idempotencyKey,
            customer_data: args.customerData || identifierOpts.customerData,
            entity_data: args.entityData,
            customer_id: identifierOpts.customerId,
            apiKey: this.options.apiKey,
          };

          return await autumnHelpers.track(trackArgs);
        },
      }),

      check: actionGeneric({
        args: UserCheckArgs,
        handler: async (ctx, args) => {
          const identifierOpts = await this.options.identify(ctx);
          if (!identifierOpts) {
            throw new Error(
              "No customer identifier found for Autumn.identify()"
            );
          }

          const checkArgs: CheckArgsType = {
            product_id: args.productId,
            feature_id: args.featureId,
            required_balance: args.requiredBalance,
            send_event: args.sendEvent,
            with_preview: args.withPreview,
            entity_id: args.entityId,
            customer_data: args.customerData || identifierOpts.customerData,
            entity_data: args.entityData,
            customer_id: identifierOpts.customerId,
            apiKey: this.options.apiKey,
          };

          return await autumnHelpers.check(checkArgs);
        },
      }),

      // Product attachment and checkout
      attach: actionGeneric({
        args: UserAttachArgs,
        handler: async (ctx, args) => {
          const identifierOpts = await this.options.identify(ctx);
          if (!identifierOpts) {
            throw new Error(
              "No customer identifier found for Autumn.identify()"
            );
          }

          const attachArgs: AttachArgsType = {
            product_id: args.productId,
            product_ids: args.productIds,
            entity_id: args.entityId,
            options: args.options,
            free_trial: args.freeTrial,
            success_url: args.successUrl,
            metadata: args.metadata,
            force_checkout: args.forceCheckout,
            customer_data: args.customerData || identifierOpts.customerData,
            entity_data: args.entityData,
            checkout_session_params: args.checkoutSessionParams,
            reward: args.reward,
            invoice: args.invoice,
            customer_id: identifierOpts.customerId,
            apiKey: this.options.apiKey,
          };

          return await autumnHelpers.attach(attachArgs);
        },
      }),

      checkout: actionGeneric({
        args: UserCheckoutArgs,
        handler: async (ctx, args) => {
          const identifierOpts = await this.options.identify(ctx);
          if (!identifierOpts) {
            throw new Error(
              "No customer identifier found for Autumn.identify()"
            );
          }

          const checkoutArgs: CheckoutArgsType = {
            product_id: args.productId,
            entity_id: args.entityId,
            options: args.options,
            force_checkout: args.forceCheckout,
            invoice: args.invoice,
            success_url: args.successUrl,
            customer_data: args.customerData || identifierOpts.customerData,
            entity_data: args.entityData,
            checkout_session_params: args.checkoutSessionParams,
            reward: args.reward,
            customer_id: identifierOpts.customerId,
            apiKey: this.options.apiKey,
          };

          return await autumnHelpers.checkout(checkoutArgs);
        },
      }),

      // Entity management - single entity creation
      createEntity: actionGeneric({
        args: UserCreateSingleEntityArgs,
        handler: async (ctx, args) => {
          const identifierOpts = await this.options.identify(ctx);
          if (!identifierOpts) {
            throw new Error(
              "No customer identifier found for Autumn.identify()"
            );
          }

          // Single entity format
          const entities = {
            name: args.name,
            feature_id: args.featureId,
            id: args.id,
          };

          return await autumnHelpers.entities.create({
            customer_id: identifierOpts.customerId,
            entities,
            apiKey: this.options.apiKey,
          });
        },
      }),

      createEntities: actionGeneric({
        args: UserCreateEntityArgs,
        handler: async (ctx, args) => {
          const identifierOpts = await this.options.identify(ctx);
          if (!identifierOpts) {
            throw new Error(
              "No customer identifier found for Autumn.identify()"
            );
          }

          // Convert camelCase featureId to snake_case feature_id for each entity
          const entities = Array.isArray(args.entities)
            ? args.entities.map((entity) => ({
                name: entity.name,
                feature_id: entity.featureId,
                id: entity.id,
              }))
            : {
                name: args.entities.name,
                feature_id: args.entities.featureId,
                id: args.entities.id,
              };

          return await autumnHelpers.entities.create({
            customer_id: identifierOpts.customerId,
            entities,
            apiKey: this.options.apiKey,
          });
        },
      }),

      getEntity: actionGeneric({
        args: v.object({
          entityId: v.string(),
          expand: v.optional(v.array(v.literal("invoices"))),
        }),
        handler: async (ctx, args) => {
          const identifierOpts = await this.options.identify(ctx);
          if (!identifierOpts) {
            throw new Error(
              "No customer identifier found for Autumn.identify()"
            );
          }

          return await autumnHelpers.entities.get({
            customer_id: identifierOpts.customerId,
            entity_id: args.entityId,
            expand: args.expand,
            apiKey: this.options.apiKey,
          });
        },
      }),

      deleteEntity: actionGeneric({
        args: v.object({
          entityId: v.string(),
        }),
        handler: async (ctx, args) => {
          const identifierOpts = await this.options.identify(ctx);
          if (!identifierOpts) {
            throw new Error(
              "No customer identifier found for Autumn.identify()"
            );
          }

          return await autumnHelpers.entities.discard({
            customer_id: identifierOpts.customerId,
            entity_id: args.entityId,
            apiKey: this.options.apiKey,
          });
        },
      }),

      // Customer management
      getCustomer: actionGeneric({
        args: v.object({
          expand: v.optional(
            v.array(
              v.union(
                v.literal("invoices"),
                v.literal("rewards"),
                v.literal("trials_used"),
                v.literal("entities"),
                v.literal("referrals")
              )
            )
          ),
        }),
        handler: async (ctx, args) => {
          const identifierOpts = await this.options.identify(ctx);
          if (!identifierOpts) {
            throw new Error(
              "No customer identifier found for Autumn.identify()"
            );
          }

          return await autumnHelpers.customers.create({
            customer_id: identifierOpts.customerId,
            name: identifierOpts.customerData.name,
            email: identifierOpts.customerData.email,
            apiKey: this.options.apiKey,
            expand: args?.expand,
          });
        },
      }),

      fetchCustomer: actionGeneric({
        args: v.object({
          expand: ExpandArgs,
        }),
        handler: async (ctx, args) => {
          const identifierOpts = await this.options.identify(ctx);
          if (!identifierOpts) {
            throw new Error(
              "No customer identifier found for Autumn.identify()"
            );
          }

          return await autumnHelpers.customers.create({
            customer_id: identifierOpts.customerId,
            name: identifierOpts.customerData.name,
            email: identifierOpts.customerData.email,
            apiKey: this.options.apiKey,
            expand: args?.expand,
          });
        },
      }),

      updateCustomer: actionGeneric({
        args: v.object({
          name: v.optional(v.string()),
          email: v.optional(v.string()),
        }),
        handler: async (ctx, args) => {
          const identifierOpts = await this.options.identify(ctx);
          if (!identifierOpts) {
            throw new Error(
              "No customer identifier found for Autumn.identify()"
            );
          }

          return await autumnHelpers.customers.update({
            customer_id: identifierOpts.customerId,
            name: args.name,
            email: args.email,
            apiKey: this.options.apiKey,
          });
        },
      }),

      deleteCustomer: actionGeneric({
        args: {},
        handler: async (ctx) => {
          const identifierOpts = await this.options.identify(ctx);
          if (!identifierOpts) {
            throw new Error(
              "No customer identifier found for Autumn.identify()"
            );
          }

          return await autumnHelpers.customers.discard({
            customer_id: identifierOpts.customerId,
            apiKey: this.options.apiKey,
          });
        },
      }),

      billingPortal: actionGeneric({
        args: v.object({
          returnUrl: v.optional(v.string()),
        }),
        handler: async (ctx, args) => {
          const identifierOpts = await this.options.identify(ctx);
          if (!identifierOpts) {
            throw new Error(
              "No customer identifier found for Autumn.identify()"
            );
          }

          return await autumnHelpers.customers.billingPortal({
            customer_id: identifierOpts.customerId,
            return_url: args.returnUrl,
            apiKey: this.options.apiKey,
          });
        },
      }),

      // Product methods
      getProduct: actionGeneric({
        args: v.object({
          productId: v.string(),
        }),
        handler: async (ctx, args) => {
          return await autumnHelpers.products.get({
            product_id: args.productId,
            apiKey: this.options.apiKey,
          });
        },
      }),

      listProducts: actionGeneric({
        args: {},
        handler: async (ctx) => {
          const identifierOpts = await this.options.identify(ctx);
          if (!identifierOpts) {
            throw new Error(
              "No customer identifier found for Autumn.identify()"
            );
          }

          return await autumnHelpers.products.list({
            customer_id: identifierOpts.customerId,
            apiKey: this.options.apiKey,
          });
        },
      }),

      // Referral methods
      createReferralCode: actionGeneric({
        args: v.object({
          programId: v.string(),
        }),
        handler: async (ctx, args) => {
          const identifierOpts = await this.options.identify(ctx);
          if (!identifierOpts) {
            throw new Error(
              "No customer identifier found for Autumn.identify()"
            );
          }

          return await autumnHelpers.referrals.createCode({
            customer_id: identifierOpts.customerId,
            program_id: args.programId,
            apiKey: this.options.apiKey,
          });
        },
      }),

      redeemReferralCode: actionGeneric({
        args: v.object({
          code: v.string(),
        }),
        handler: async (ctx, args) => {
          const identifierOpts = await this.options.identify(ctx);
          if (!identifierOpts) {
            throw new Error(
              "No customer identifier found for Autumn.identify()"
            );
          }

          return await autumnHelpers.referrals.redeemCode({
            customer_id: identifierOpts.customerId,
            code: args.code,
            apiKey: this.options.apiKey,
          });
        },
      }),

      // Additional general methods
      usage: actionGeneric({
        args: v.object({
          featureId: v.string(),
          value: v.number(),
        }),
        handler: async (ctx, args) => {
          const identifierOpts = await this.options.identify(ctx);
          if (!identifierOpts) {
            throw new Error(
              "No customer identifier found for Autumn.identify()"
            );
          }

          const usageArgs: UsageArgsType = {
            feature_id: args.featureId,
            value: args.value,
            customer_id: identifierOpts.customerId,
            customer_data: identifierOpts.customerData,
            apiKey: this.options.apiKey,
          };

          return await autumnHelpers.usage(usageArgs);
        },
      }),

      query: actionGeneric({
        args: v.object({
          featureId: v.union(v.string(), v.array(v.string())),
        }),
        handler: async (ctx, args) => {
          const identifierOpts = await this.options.identify(ctx);
          if (!identifierOpts) {
            throw new Error(
              "No customer identifier found for Autumn.identify()"
            );
          }

          const queryArgs: QueryArgsType = {
            feature_id: args.featureId,
            customer_id: identifierOpts.customerId,
            customer_data: identifierOpts.customerData,
            apiKey: this.options.apiKey,
          };

          return await autumnHelpers.autumnQuery(queryArgs);
        },
      }),

      cancel: actionGeneric({
        args: v.object({
          productId: v.string(),
          entityId: v.optional(v.string()),
          cancelImmediately: v.optional(v.boolean()),
        }),
        handler: async (ctx, args) => {
          const identifierOpts = await this.options.identify(ctx);
          if (!identifierOpts) {
            throw new Error(
              "No customer identifier found for Autumn.identify()"
            );
          }

          const cancelArgs: CancelArgsType = {
            product_id: args.productId,
            entity_id: args.entityId,
            cancel_immediately: args.cancelImmediately,
            customer_id: identifierOpts.customerId,
            customer_data: identifierOpts.customerData,
            apiKey: this.options.apiKey,
          };

          return await autumnHelpers.cancel(cancelArgs);
        },
      }),

      setupPayment: actionGeneric({
        args: v.object({
          successUrl: v.optional(v.string()),
          checkoutSessionParams: v.optional(v.object({})),
        }),
        handler: async (ctx, args) => {
          const identifierOpts = await this.options.identify(ctx);
          if (!identifierOpts) {
            throw new Error(
              "No customer identifier found for Autumn.identify()"
            );
          }

          const setupPaymentArgs: SetupPaymentArgsType = {
            ...args,
            customer_id: identifierOpts.customerId,
            customer_data: identifierOpts.customerData,
            apiKey: this.options.apiKey,
          };

          return await autumnHelpers.setupPayment(setupPaymentArgs);
        },
      }),
    };
  }

  async getIdentifierOpts(ctx: any) {
    const identifierOpts = await this.options.identify(ctx);
    if (!identifierOpts) {
      throw new Error("No customer identifier found for Autumn.identify()");
    }
    return identifierOpts;
  }

  async registerRoutes(
    http: HttpRouter,
    options?: {
      corsOrigin?: string;
      corsOrigins?: string[];
      corsAllowHeadersList?: string[];
      allowCredentials?: boolean;
      browserCacheMaxAge?: number;
      enforceAllowOrigins?: boolean;
      debug?: boolean;
    }
  ) {
    const corsOrigin =
      options?.corsOrigin ||
      process.env.CLIENT_ORIGIN ||
      "http://localhost:3000";
    const corsAllowHeaders = options?.corsAllowHeadersList || [
      "Better-Auth-Cookie",
      "Cookie",
      "Content-Type",
      "Authorization",
    ];

    // Create CORS router with configuration
    const cors = corsRouter(http, {
      allowedOrigins: [corsOrigin, ...(options?.corsOrigins || [])],
      allowedHeaders: corsAllowHeaders,
      allowCredentials: options?.allowCredentials ?? true,
      browserCacheMaxAge: options?.browserCacheMaxAge ?? 86400,
      enforceAllowOrigins: options?.enforceAllowOrigins ?? false,
      debug: options?.debug ?? false,
    });

    // Register routes for all HTTP methods except OPTIONS
    for (const method of ROUTABLE_HTTP_METHODS.filter(
      (method) => method !== "OPTIONS"
    )) {
      cors.route({
        pathPrefix: "/api/autumn/",
        method: method,
        handler: httpActionGeneric(async (ctx, request) => {
          const identity = await this.options.identify(ctx, {});

          return await convexHandler({
            identity: identity,
            secretKey: this.options.apiKey,
            url: this.options.url || undefined,
            corsOrigin: corsOrigin,
          })(ctx, request);
        }),
      });
    }
  }
}

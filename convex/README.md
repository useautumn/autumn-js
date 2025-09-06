# Autumn + Convex

## Introduction
[Autumn](https://useautumn.com) is your pricing and customer database—an abstraction over Stripe that lets you model any pricing (subscriptions, usage-based, seats, trials, credits) and implement it in your codebase in just three functions: check for access, track for metering, and checkout for purchases.

## Setup

> Note: You’ll need Convex v1.25.0+ and `autumn-js` v0.1.24+.

#### 1) Install the packages

```bash
npm install @useautumn/convex autumn-js 
```

#### 2) Set the Autumn secret key in your Convex environment

```bash
npx convex env set AUTUMN_SECRET_KEY=am_sk_xxx
```

#### 3) Add the component to your application

Add the Autumn Convex component to `convex/convex.config.ts`:

```ts
import { defineApp } from "convex/server";
import autumn from "@useautumn/convex/convex.config";

const app = defineApp();
app.use(autumn);

export default app;
```

#### 4) Initialize the Autumn client

In `convex/autumn.ts`, add the following code:

```ts
import { components } from "./_generated/api";
import { Autumn } from "@useautumn/convex";

export const autumn = new Autumn(components.autumn, {
  secretKey: process.env.AUTUMN_SECRET_KEY ?? "",
  identify: async (ctx: any) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) return null;

    const userId = user.subject.split("|")[0];
    return {
      customerId: user.subject as string,
      customerData: {
        name: user.name as string,
        email: user.email as string,
      },
    };
  },
});

export const {
  track,
  cancel,
  query,
  attach,
  check,
  checkout,
  usage,
  setupPayment,
  createCustomer,
  listProducts,
  billingPortal,
  createReferralCode,
  redeemReferralCode,
  createEntity,
  getEntity,
} = autumn.api();
```
> The example above uses Convex auth as an example. Visit this [page](https://docs.useautumn.com/setup/convex#4-initialize-the-autumn-client) see code snippets for other providers like Clerk / Better Auth

> Note: The `identify()` function determines which customer is making the request. Customize it for your use case (e.g. use an organization ID as `customerId` for entity billing). You may need to change `user.subject` to `user.id` depending on your auth provider.

#### 5) Set up `<AutumnProvider />` on your frontend

Add `AutumnWrapper.tsx` to enable hooks and components:

```tsx
"use client";
import { AutumnProvider } from "autumn-js/react";
import { api } from "../convex/_generated/api";
import { useConvex } from "convex/react";

export function AutumnWrapper({ children }: { children: React.ReactNode }) {
  const convex = useConvex();

  return (
    <AutumnProvider convex={convex} convexApi={(api as any).autumn}>
      {children}
    </AutumnProvider>
  );
}
```

> Note: If you use Autumn only on the backend, you can skip this step.

## Using hooks and components on the frontend

The quickest way to get started is to use our `<PricingTable/>` component:


`<PricingTable/>`

```tsx
import { PricingTable } from "autumn-js/react";

export default function Home() {
  return <PricingTable />;
}
```

> Components are available as shadcn components and are fully customizable: https://docs.useautumn.com/setup/shadcn

`useCustomer`

We also provide a useCustomer hook which lets you easily access your customer data and interact with the Autumn API directly from your frontend. For example, to upgrade a user:


```tsx
import { useCustomer, CheckoutDialog } from "autumn-js/react";

export default function Home() {
  const { customer, track, check, checkout } = useCustomer();
  return (
    <button
      onClick={() =>
        checkout({
          productId: "pro",
          dialog: CheckoutDialog,
        })
      }
    >
      Upgrade to Pro
    </button>
  );
}
```

You can use all `useCustomer()` and `useEntity()` features as usual. Learn more: /api-reference/hooks/useCustomer

## Using Autumn on the backend

You will also need to use Autumn on your backend for actions such as tracking or gating usage of a feature. To do so, you can use our Autumn client:


Check feature access:

```ts
import { autumn } from "convex/autumn";

const { data, error } = await autumn.check(ctx, {
  featureId: "messages",
});

if (data.allowed) {
  // Action to perform if user is allowed messages
}
```

Track feature usage:

```ts
import { autumn } from "convex/autumn";

const { data, error } = await autumn.track(ctx, {
  featureId: "messages",
  value: 10,
});
```

These are the most common functions, but others like `checkout` and `attach` are also available. API reference: https://docs.useautumn.com/api-reference/core/checkout




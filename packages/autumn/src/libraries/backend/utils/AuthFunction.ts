export type AuthResult = Promise<{
  customerId?: string;
  customerData?: {
    name?: string;
    email?: string;
  };
} | null>;

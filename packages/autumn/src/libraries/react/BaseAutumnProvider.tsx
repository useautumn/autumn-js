import { AutumnContext } from "./AutumnContext";
import { useEffect, useState } from "react";
import { AutumnClient } from "./client/ReactAutumnClient";
import { useDialog } from "./hooks/useDialog";
import { usePricingTableProvider } from "./hooks/usePricingTableProvider";
import { useEntityProvider } from "./hooks/useEntityProvider";
import { useCustomerProvider } from "./hooks/useCustomerProvider";

export function BaseAutumnProvider({
  client,
  children,
}: {
  client: AutumnClient;
  children: React.ReactNode;
}) {
  const [components, setComponents] = useState<{
    paywallDialog?: any;
    productChangeDialog?: any;
  }>({});

  const [paywallProps, setPaywallProps, paywallOpen, setPaywallOpen] =
    useDialog(components.paywallDialog);

  const [
    productChangeProps,
    setProductChangeProps,
    productChangeOpen,
    setProductChangeOpen,
  ] = useDialog(components.productChangeDialog);

  const customerProvider = useCustomerProvider(client);

  const entityProvider = useEntityProvider({ client });

  const {
    pricingTableProducts,
    isLoading: pricingTableLoading,
    error: pricingTableError,
    refetch,
  } = usePricingTableProvider({
    client,
  });

  useEffect(() => {
    customerProvider.refetch({
      errorOnNotFound: false,
    });
  }, []);

  return (
    <AutumnContext.Provider
      value={{
        customerProvider,

        entityProvider,

        pricingTableProvider: {
          pricingTableProducts,
          isLoading: pricingTableLoading,
          error: pricingTableError,
          refetch,
        },

        client,

        paywallDialog: {
          props: paywallProps,
          setProps: setPaywallProps,
          open: paywallOpen,
          setOpen: setPaywallOpen,
          setComponent: (component: any) => {
            setComponents({
              ...components,
              paywallDialog: component,
            });
          },
        },

        prodChangeDialog: {
          props: productChangeProps,
          setProps: setProductChangeProps,
          open: productChangeOpen,
          setOpen: setProductChangeOpen,
          setComponent: (component: any) => {
            setComponents({
              ...components,
              productChangeDialog: component,
            });
          },
        },
      }}
    >
      {components.paywallDialog && (
        <components.paywallDialog
          open={paywallOpen}
          setOpen={setPaywallOpen}
          {...paywallProps}
        />
      )}
      {components.productChangeDialog && (
        <components.productChangeDialog
          open={productChangeOpen}
          setOpen={setProductChangeOpen}
          {...productChangeProps}
        />
      )}
      {children}
    </AutumnContext.Provider>
  );
}

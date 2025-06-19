import { Entity } from "src/sdk/customers/entities/entTypes";
import { CustomerData } from "src/sdk";
import { AutumnContext } from "./AutumnContext";
import { useEffect, useState } from "react";
import { Customer, PricingTableProduct } from "src/sdk";
import { useCustomer } from "./hooks/useCustomer";

export interface AutumnProviderProps {
  children?: React.ReactNode;
  encryptedCustomerId?: string;
  customerData?: CustomerData;
}

const useDialog = (component?: any) => {
  const [dialogFound, setDialogFound] = useState<boolean>(false);
  const [dialogProps, setDialogProps] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  // useEffect(() => {
  //   if (dialogProps) {
  //     setDialogOpen(true);
  //   }
  // }, [dialogProps]);

  useEffect(() => {
    if (!dialogOpen) {
      setTimeout(() => {
        setDialogProps(null);
      }, 200);
    }
  }, [dialogOpen]);

  const loadDialog = async () => {
    if (component) {
      setDialogFound(true);
    } else {
      setDialogFound(false);
    }
  };

  useEffect(() => {
    loadDialog();
  }, []);

  return [dialogFound, dialogProps, setDialogProps, dialogOpen, setDialogOpen];
};

export const AutumnClientProvider = ({
  children,
  encryptedCustomerId,
  customerData,
}: AutumnProviderProps) => {
  let [customer, setCustomer] = useState<Customer | null>(null);

  useCustomer({
    encryptedCustomerId,
    customerData,
    errorOnNotFound: false,
  });

  let [pricingTableProducts, setPricingTableProducts] = useState<
    PricingTableProduct[] | null
  >(null);

  const [components, setComponents] = useState<{
    paywallDialog?: any;
    productChangeDialog?: any;
  }>({});

  const [entity, setEntity] = useState<Entity | null>(null);

  const [
    prodChangeDialogFound,
    prodChangeDialogProps,
    setProdChangeDialogProps,
    prodChangeDialogOpen,
    setProdChangeDialogOpen,
  ] = useDialog(components?.productChangeDialog);

  const [
    paywallFound,
    paywallProps,
    setPaywallProps,
    paywallOpen,
    setPaywallOpen,
  ] = useDialog(components?.paywallDialog);

  return (
    <AutumnContext.Provider
      value={{
        encryptedCustomerId,
        customerData,
        customer,
        setCustomer,
        prodChangeDialog: {
          found: prodChangeDialogFound,
          setProps: setProdChangeDialogProps,
          setOpen: setProdChangeDialogOpen,
          setComponent: (component: any) => {
            setComponents({
              ...components,
              productChangeDialog: component,
            });
          },
        },
        paywallDialog: {
          found: paywallFound,
          setProps: setPaywallProps,
          setOpen: setPaywallOpen,
          setComponent: (component: any) => {
            setComponents({
              ...components,
              paywallDialog: component,
            });
          },
        },
        pricingTableProducts,
        setPricingTableProducts,
        entity,
        setEntity,
      }}
    >
      {components?.productChangeDialog && (
        <components.productChangeDialog
          open={prodChangeDialogOpen}
          setOpen={setProdChangeDialogOpen}
          {...prodChangeDialogProps}
        />
      )}
      {components?.paywallDialog && (
        <components.paywallDialog
          open={paywallOpen}
          setOpen={setPaywallOpen}
          {...paywallProps}
        />
      )}
      {children}
    </AutumnContext.Provider>
  );
};

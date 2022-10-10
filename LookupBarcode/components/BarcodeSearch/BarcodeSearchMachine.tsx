import { assign, createMachine, actions } from "xstate";
import { LookupBarcode } from "../..";
import { IInputs } from "../../generated/ManifestTypes";

export interface IBarCodeLookupMachineContext {
  selectedValue?: ILookupValue;
  searchResults?: ILookupValue[];
  lookupProps?: ILookupProps;
  pcfContext: ComponentFramework.Context<IInputs>;
  searchFilter?:string;
  errorMessage?:string
}

export interface ILookupValue {
  name: string;
  value: string;
  entityType: string;
}
export interface ILookupProps {
  entityName: string;
  fieldtoSearch: string;
  nameColumn: string;
  showNew: boolean;
  defaultviewId: string;
}
type Event =
  | {
      type: "SEARCH"; searchText:string
    }
  | { type: "OPEN-RECORD"; lookup: ILookupValue }
  | { type: "CLEAR-RECORD" };

export const barcordLookupMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QCECGAnAxgewmAMttgNYCuADgLKqYAWAlgHZgB0ANtqhE1AAoaoAtrADEEbMxZMAbiVZosuAkTJUaDSRy49+6IbAQzsmVABd6EgNoAGALqJQ5bLHrmJDkAA9EAJgDMABws1gCcAIw+AGwhfgCsfgDs4X4ANCAAnohhfj7BATkALJE+2ZEB+QkAvpVpCjh4hCQU1HRMrFrcjHwCwiJg6OjY6CzkbGYAZkOCLHVKjaotGu2cnd16woaMsiZujDb2SCBOLrse3gj+ISx+kcUhZQHRPiE+aZkXfmEsRdEF+cVhaw+ApVGogWYNFTNdRtKQQNhgEQAZQAogBBABKAGEABIeY6uCyMM6+axBMIBWKAgqxAIJCIRSJvRB+e4scJhSLWAoFcLApIFaq1DD1ZRNNStST0eGIgDyvBRADkALQYlFY2UYgAi+OchPch3OMT8LDpvJCAR8oRyxWZCFKLGB-gS1kiIIi1j8grBELFCxhUplIix+HRGNV6s1OsOBNOhsQCT8Jvu5RdIUTYViTIyvh8uQSkTils5kTCgL8QvBIrmUIlSxYsDAIo0UDEElYRmI8mrkPFi1hjebPE22zMRP2upORJJCDiCXZJUtSRdBYKdrd1hYXNiCUTPJiZZ8ld982hktYg6wLb6AyGIzGpkm6GmJ9r-ckl8lUBHxjHVjsk76sS8b2o6VK-JSFJhDyu6pDmCAhCCLAJH86axPcCR0rE3pgowSjwIcr59gGyzaF0uj6IBcagOcyqfKanzWBEu7oU80F2iUVxJlm+TZMkfzHj2fpnvW0oIlR04gaWVw8Ym6Y+FSZIhHaXr5phIS0tkcSBLugmKL2-rng2TZXjwEkGjRiDKi61yUrEwJPLSrLZu8BRJiw8SutyRT2RS3rCvpwl1m05nAZZCDKohtmxPZRQvE59zrpugJhCEMRJNae7VNUQA */
  createMachine({
  tsTypes: {} as import("./BarcodeSearchMachine.typegen").Typegen0,
  schema: {
    context: {} as IBarCodeLookupMachineContext,
    events: {} as Event,
    services: {} as {
      searchByValue: { data: ILookupValue[] };
      loadParams: { data: ILookupProps | undefined };
    },
  },
  id: "BarcodeLookupMachine",
  initial: "loadingParams",
  states: {
    loadingParams: {
      invoke: {
        src: "loadParams",
        onDone: [
          {
            actions: "setContextParams",
            target: "idle",
          },
        ],
        onError: [
          {
            actions: "setContextError",
            target: "idle",
          },
        ],
      },
    },
    idle: {
      on: {
        SEARCH: [
          {
            actions: "setContextSearchText",
            cond: "ParamsNotNull",
            target: "searching",
          },
          {
            actions: "setContextError",
          },
        ],
        "OPEN-RECORD": {
          actions: "openRecordInline",
          cond: "contextHasSelectedValue",
        },
        "CLEAR-RECORD": {
          actions: "clearRecordfromLookup",
        },
      },
    },
    searching: {
      invoke: {
        src: "searchByValue",
        onDone: [
          {
            actions: "setContextLookupValue",
            cond: "IsResultSingle",
            target: "idle",
          },
          {
            actions: "OpenLookupControl",
            cond: "IsResultMultiple",
            target: "idle",
          },
          {
            actions: "setSearchError",
            target: "idle",
          },
        ],
        onError: [
          {
            actions: "setContextError",
            target: "idle",
          },
        ],
      },
    },
  },
});

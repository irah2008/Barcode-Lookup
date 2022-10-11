import { assign, createMachine, actions } from "xstate";
import { LookupBarcode } from "../..";
import { IInputs } from "../../generated/ManifestTypes";

export interface IBarCodeLookupMachineContext {
  selectedValue?: ILookupValue;
  searchResults?: ILookupValue[];
  lookupProps?: ILookupProps;
  pcfContext: ComponentFramework.Context<IInputs>;
  OnChange: (value?: ComponentFramework.LookupValue[]) => void;
  searchFilter?: string;
  errorMessage?: string;
}

export interface ILookupValue {
  name: string;
  id: string;
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
      type: "SEARCH";
      searchText: string;
    }
  | { type: "OPEN-RECORD"; lookup: ILookupValue }
  | { type: "CLEAR-RECORD" };

export const barcordLookupMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QCECGAnAxgewmAMttgNYCuADgLKqYAWAlgHZgB0ANtqhE1AAoaoAtrADEEbMxZMAbiVZosuAkTJUaDSRy49+6IbAQzsmVABd6EgNoAGALqJQ5bLHrmJDkAA9EAJgDMABws1gCcAIw+AGwhfgCsfgDs4X4ANCAAnohhfj7BATkALJE+2ZEB+QkAvpVpCjh4hCQU1HRMrFrcjHwCwiJg6OjY6CzkbGYAZkOCLHVKjaotGu2cnd16woaMsiZujDb2SCBOLrse3gj+ISx+kcWR1gkBJQUhT2mZF-cskYk+CTmhAoPSLVWoYerKJpqVqSegQNhgEQAZQAogBBABKAGEABIeY6uCyMM6+axBMIBWJhawFWIBBIRCKRd6IPwhSIscJhe4FF4RApJAqgkCzBoqZrqNpSeGIgDyvBRADkALQYlFY2UYgAi+OchPch3OMT8LHpL1ePlCOWKLIQpRYPgK-gS1kiAoi1j8QpqIvBc3F0KW0oRIix+HRGNV6s1OsOBNOhsQ-xN7PKLpC-zCsWZGV8PlyCR+dJKtzC1L8wtFkIWksksDA4I0UDEElYRmI8j9Yqhiyl9cbPE22zMRP2upORJJCDiCU5JSeSRdhYKtrd1m+1liCX+vJiZZ8la71YlMNY-awTb6AyGIzGpkm6GmVfmJ6D55hUCHxhHVjs4-1xKJnaDpUtEBSUhSYS8tuqS5ggIQCiwCTgRmsTso8CSxN6PqMEo8CHM+Aa9poKw6D0+GOHqCagOcyp+GEpr0dYETbmh0TPLaJRXH4cRlPRbLZOBh6KN2NansGYD-tRXiIJEYRXNm9JsgkPhUmSIS2l6BaPCEdLZHEgTbsJEIvoGfYNhePBSZOQHKi61yUrEjrsXSbI5h8BQ8Sw8SujSRRORS3pgiJx5mcw1kGjRiDKghDmxE5RQhKp+Tsqu67UvJSW3NEPHWAe1SVEAA */
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
              actions: ["setContextParams", "setExistingValue"],
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

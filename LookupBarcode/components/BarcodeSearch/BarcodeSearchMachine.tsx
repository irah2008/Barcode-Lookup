import {  createMachine } from "xstate";
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
  | { type: "CLEAR-RECORD" }
  | { type: "SET-RECORD"; data?: ILookupValue[] };

export const barcordLookupMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QCECGAnAxgewmAMttgNYCuADgLKqYAWAlgHZgB0ANtqhE1AAoaoAtrADEEbMxZMAbiVZosuAkTJUaDSRy49+6IbAQzsmVABd6EgNoAGALqJQ5bLHrmJDkAA9EAJgDMABws1gCcAIw+AGwhfgCsfgDs4X4ANCAAnohhfj7BATkALJE+2ZEB+QkAvpVpCjh4hCQU1HRMrFrcjHwCwiJg6OjY6CzkbGYAZkOCLHVKjaotGu2cnd16woaMsiZujDb2SCBOLrse3gj+ISx+kcWR1gkBJQUhT2mZF-cskYk+CTmhAoPSLVWoYerKJpqVqSegQNhgEQAZQAogBBABKAGEABIeY6uCyMM6+axBMIBWJhawFWIBBIRCKRd6IPwhSIscJhe4FF4RApJAqgkCzBoqZrqNpSeGIgDyvBRADkALQYlFY2UYgAi+OchPch3OMT8LHpL1ePlCOWKLIQpRYPgK-gS1kiAoi1j8QpqIvBc3F0KW0oRIix+HRGNV6s1OsOBNOhsQ-xN7PKLpC-zCsWZGV8PlyCR+dJKtzC1L8wtFkIWkthMuRKIAKlGNdrdSciSSEAEs9cftFbm6GTdbQVe7Fwj4qT2Ag8wt6wYoxVDFlLYGBwRooGIJKwjMR5H7lzWYax15ueJttmYift2-riYmEHEEpySk8ki7CwVbW7rN9rFiBJ-l5GIyx8Ssj2rCVTxYc8sC3PoBiGEYxlMSZ0GmKt5hgoN4JhKAr2MG8rDse8E1Ac4wgdKlogKSkKXnAV-ltEIBRYBJ6IzCdIkeBJYm9H1GCUeBDmwgNV00FYdB6UTHD1CivEQZU-Go-JqQiYCeJCZ5bRKK4-DiMpVLZbJ6MgpdoMDKU4QRcjOyfSIwiubN6TZBIp2pAIQltL0C0eEI6WyOJAmAiyIRw6zJHwrd7INSjlJda5KViR1oinfJ2VHQyWHiV0aSKVKKQXX1LMiySwDix8EoQZU2OS2JUqKHS6TZHMPi+DSQgzdkfk4ziQWqSogA */
  createMachine({
  tsTypes: {} as import('./BarcodeSearchMachine.typegen').Typegen0,
  schema: {
    context: {} as IBarCodeLookupMachineContext,
    events: {} as Event,
    services: {} as {
      searchByValue: { data: ILookupValue[] };
      loadParams: { data: ILookupProps | undefined };
    },
  },
  id: 'BarcodeLookupMachine',
  initial: 'loadingParams',
  states: {
    loadingParams: {
      invoke: {
        src: 'loadParams',
        onDone: [
          {
            actions: ['setContextParams', 'setExistingValue'],
            target: 'idle',
          },
        ],
        onError: [
          {
            actions: 'setContextError',
            target: 'idle',
          },
        ],
      },
    },
    idle: {
      on: {
        SEARCH: [
          {
            actions: 'setContextSearchText',
            cond: 'ParamsNotNull',
            target: 'searching',
          },
          {
            actions: 'setContextError',
          },
        ],
        'OPEN-RECORD': {
          actions: 'openRecordInline',
          cond: 'contextHasSelectedValue',
        },
        'CLEAR-RECORD': {
          actions: 'clearRecordfromLookup',
        },
        'SET-RECORD': {
          actions: 'setContextLookupValue',
          target: 'idle',
        },
      },
    },
    searching: {
      invoke: {
        src: 'searchByValue',
        onDone: [
          {
            actions: 'setContextLookupValue',
            cond: 'IsResultSingle',
            target: 'idle',
          },
          {
            actions: 'OpenLookupControl',
            cond: 'IsResultMultiple',
            target: 'idle',
          },
          {
            actions: 'setSearchError',
            target: 'idle',
          },
        ],
        onError: [
          {
            actions: 'setContextError',
            target: 'idle',
          },
        ],
      },
    },
  },
});

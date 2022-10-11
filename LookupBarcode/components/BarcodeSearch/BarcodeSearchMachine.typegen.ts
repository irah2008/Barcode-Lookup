// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "done.invoke.BarcodeLookupMachine.loadingParams:invocation[0]": {
      type: "done.invoke.BarcodeLookupMachine.loadingParams:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.BarcodeLookupMachine.searching:invocation[0]": {
      type: "done.invoke.BarcodeLookupMachine.searching:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.BarcodeLookupMachine.loadingParams:invocation[0]": {
      type: "error.platform.BarcodeLookupMachine.loadingParams:invocation[0]";
      data: unknown;
    };
    "error.platform.BarcodeLookupMachine.searching:invocation[0]": {
      type: "error.platform.BarcodeLookupMachine.searching:invocation[0]";
      data: unknown;
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    loadParams: "done.invoke.BarcodeLookupMachine.loadingParams:invocation[0]";
    searchByValue: "done.invoke.BarcodeLookupMachine.searching:invocation[0]";
  };
  missingImplementations: {
    actions:
      | "setContextParams"
      | "setExistingValue"
      | "setContextError"
      | "setContextSearchText"
      | "openRecordInline"
      | "clearRecordfromLookup"
      | "setContextLookupValue"
      | "OpenLookupControl"
      | "setSearchError";
    services: "loadParams" | "searchByValue";
    guards:
      | "ParamsNotNull"
      | "contextHasSelectedValue"
      | "IsResultSingle"
      | "IsResultMultiple";
    delays: never;
  };
  eventsCausingActions: {
    OpenLookupControl: "done.invoke.BarcodeLookupMachine.searching:invocation[0]";
    clearRecordfromLookup: "CLEAR-RECORD";
    openRecordInline: "OPEN-RECORD";
    setContextError:
      | "SEARCH"
      | "error.platform.BarcodeLookupMachine.loadingParams:invocation[0]"
      | "error.platform.BarcodeLookupMachine.searching:invocation[0]";
    setContextLookupValue: "done.invoke.BarcodeLookupMachine.searching:invocation[0]";
    setContextParams: "done.invoke.BarcodeLookupMachine.loadingParams:invocation[0]";
    setContextSearchText: "SEARCH";
    setExistingValue: "done.invoke.BarcodeLookupMachine.loadingParams:invocation[0]";
    setSearchError: "done.invoke.BarcodeLookupMachine.searching:invocation[0]";
  };
  eventsCausingServices: {
    loadParams: "xstate.init";
    searchByValue: "SEARCH";
  };
  eventsCausingGuards: {
    IsResultMultiple: "done.invoke.BarcodeLookupMachine.searching:invocation[0]";
    IsResultSingle: "done.invoke.BarcodeLookupMachine.searching:invocation[0]";
    ParamsNotNull: "SEARCH";
    contextHasSelectedValue: "OPEN-RECORD";
  };
  eventsCausingDelays: {};
  matchesStates: "idle" | "loadingParams" | "searching";
  tags: never;
}

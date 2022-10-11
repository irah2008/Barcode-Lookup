import {
  barcordLookupMachine,
  IBarCodeLookupMachineContext,
  ILookupProps,
  ILookupValue,
} from "./BarcodeSearchMachine";
import { useMachine } from "@xstate/react";
import { assign } from "xstate";
import { send } from "xstate/lib/actions";

export const useBarcodeLookupMachine = (
  initialContext: IBarCodeLookupMachineContext
) => {
  const actor = useMachine(barcordLookupMachine, {
    devTools: true,
    context: initialContext,
    guards: {
      IsResultMultiple: (ctx, e) => (e.data || [])?.length > 1,
      IsResultSingle: (ctx, e) => (e.data || [])?.length === 1,
      ParamsNotNull: (ctx, e) =>
        !!ctx.lookupProps && !Object.values(ctx.lookupProps).every((x) => !!x),
      contextHasSelectedValue: (ctx, e) => !!ctx.selectedValue,
    },
    actions: {
      setContextSearchText: (ctx, e) => assign({ searchFilter: e.searchText }),
      clearRecordfromLookup: assign({
        selectedValue: (ctx, e) => undefined
        
      }),
      setExistingValue: assign({
        selectedValue: (ctx, e) => {
          var defaultValue =
            ctx.pcfContext.parameters.barcodeLookupProperty.raw;
          if (defaultValue.length > 0) {
            return {
              entityType: defaultValue[0].entityType,
              id: defaultValue[0].id,
              name: defaultValue[0].name ?? "",
            };
          }
          return undefined;
        },
      }),

      openRecordInline: (ctx, e) => {
        if (ctx.selectedValue)
          initialContext.pcfContext.navigation.openForm({
            entityName: ctx.selectedValue?.entityType,
            entityId: ctx.selectedValue?.id,
          });
      },
      OpenLookupControl: (ctx, e) => {
        if (ctx.lookupProps) {
          initialContext.pcfContext.utils.lookupObjects({
            allowMultiSelect: false,
            defaultEntityType: ctx.lookupProps.entityName,
            defaultViewId: ctx.lookupProps.defaultviewId,
            entityTypes: [ctx.lookupProps.defaultviewId],
            viewIds: [],
            searchText: ctx.searchFilter,
          });
        }
      },
      setContextError: assign({
        errorMessage: (context, e) =>
          e.type === "SEARCH"
            ? "Params passed to the control is incorrect"
            : ((e.data as any).message as string),
      }),
      setContextLookupValue: assign({
        selectedValue: (ctx, e) => e.data[0],
      }),
      setContextParams: assign({
        lookupProps: (ctx, e) => e.data,
      }),
      setSearchError: assign({
        errorMessage: (_ctx, e) => (e.data as any).message as string,
      }),
    },
    services: {
      loadParams: async (ctx) => {
        let inputProps = ctx.pcfContext.parameters.configProperty.raw;
        if (inputProps) {
          let lookupProps: ILookupProps = JSON.parse(
            ctx.pcfContext.parameters.configProperty.raw ?? ""
          ) as ILookupProps;

          return lookupProps;
        }
        return undefined;
      },
      searchByValue: async (ctx, e): Promise<ILookupValue[]> => {
        let returnValue: ILookupValue[] = [];
        let pcfContext = ctx.pcfContext;
        let lookupProps = ctx.lookupProps;
        if (lookupProps) {
          let clientType = pcfContext.client.getClient();
          if (clientType == "Mobile") {
            let searchText = await pcfContext.device.getBarcodeValue();
            let retrievedEntities =
              await pcfContext.webAPI.retrieveMultipleRecords(
                lookupProps.entityName,
                `?$select=${lookupProps.nameColumn}&$filter=contains(${lookupProps.fieldtoSearch},'${searchText}')`
              );
            returnValue = retrievedEntities.entities.map((x) => {
              return {
                entityType: x.LogicalName,
                name: lookupProps ? x[lookupProps.nameColumn] : "",
                id: x[`${x.LogicalName}id`],
              };
            });
          } else {
            let returnValuefromLookup =
              await ctx.pcfContext.utils.lookupObjects({
                allowMultiSelect: false,
                defaultEntityType: ctx.lookupProps?.entityName ?? "",
                defaultViewId: ctx.lookupProps?.defaultviewId ?? "",
                entityTypes: [ctx.lookupProps?.entityName ?? ""],
                viewIds: [ctx.lookupProps?.defaultviewId ?? ""],
                searchText: e.searchText ?? "",
              });
            if (returnValuefromLookup.length > 0) {
              returnValue = returnValuefromLookup.map((x) => {
                return {
                  entityType: x.entityType,
                  name: x.name ?? "",
                  id: x.id,
                };
              });
            }
          }
        }
        return returnValue;
      },
    },
  });
  return actor;
};

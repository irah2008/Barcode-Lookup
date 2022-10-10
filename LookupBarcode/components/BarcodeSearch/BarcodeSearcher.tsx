import { IBarCodeLookupMachineContext } from "./BarcodeSearchMachine";
import { useBarcodeLookupMachine } from "./useBarcodeSearch";
import { IInputs } from "../../generated/ManifestTypes";
import React = require("react");
import {
  IconButton,
  IIconProps,
  mergeStyles,
  Persona,
  PersonaPresence,
  PersonaSize,
  Stack,
  StackItem,
} from "@fluentui/react";
import { useRef, useState } from "react";

export interface BarcodeSearcherProps {
  context: ComponentFramework.Context<IInputs>;
}

export const BarcodeSearcher = (
  initialContext: IBarCodeLookupMachineContext
) => {
  const [state, send] = useBarcodeLookupMachine(initialContext);
  const handleOnWebClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    debugger;
    send({
      type: "SEARCH",
      searchText: inputRef.current ? inputRef.current["value"] : "",
    });
  };
  const handleOnMobileClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    debugger;
    send({ type: "SEARCH", searchText: "" });
  };

  const handleRemoveLookup = (e: React.MouseEvent<HTMLButtonElement>) => {
    send({ type: "CLEAR-RECORD" });
  };

  const isMobileApp = state.context.pcfContext.client.getClient() === "Mobile";

  const inputRef = useRef(null);
  return (
    <>
      <div>
        {state.context.selectedValue && (
          <Stack horizontal={true}>
            <StackItem
              className={mergeStyles({
                backgroundColor: "#e6e3e3",
                borderTopLeftRadius: "8px",
                borderBottomLeftRadius: "8px",
              })}
            >
              <Persona
                id={state.context.selectedValue.value}
                text={state.context.selectedValue.name}
                size={PersonaSize.size8}
                presence={PersonaPresence.none}
                imageAlt={state.context.selectedValue.name}
              />
            </StackItem>
            <StackItem
              className={mergeStyles({
                backgroundColor: "#e6e3e3",
                borderTopRightRadius: "10px",
                borderBottomRightRadius: "10px",
              })}
            >
              <IconButton
                iconProps={{ iconName: "Cancel" }}
                onClick={handleRemoveLookup}
              ></IconButton>
            </StackItem>
          </Stack>
        )}
        {!state.context.selectedValue && (
          <input type="text" ref={inputRef} disabled={isMobileApp} />
        )}

        <IconButton
          iconProps={{
            iconName: isMobileApp ? "GenericScan" : "Search",
          }}
          onClick={isMobileApp ? handleOnMobileClick : handleOnWebClick}
        ></IconButton>
      </div>
    </>
  );
};

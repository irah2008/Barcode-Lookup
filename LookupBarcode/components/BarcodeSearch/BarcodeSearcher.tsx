import { IBarCodeLookupMachineContext } from "./BarcodeSearchMachine";
import { useBarcodeLookupMachine } from "./useBarcodeSearch";
import { IInputs } from "../../generated/ManifestTypes";
import React = require("react");
import {
  IconButton,
  IIconProps,
  Link,
  mergeStyles,
  Persona,
  PersonaPresence,
  PersonaSize,
  Stack,
  StackItem,
} from "@fluentui/react";
import { useRef, useEffect } from "react";

export interface BarcodeSearcherProps {
  context: ComponentFramework.Context<IInputs>;
}

export const BarcodeSearcher = (
  initialContext: IBarCodeLookupMachineContext
) => {
  const [state, send] = useBarcodeLookupMachine(initialContext);
  useEffect(() => {
    let returnValue: ComponentFramework.LookupValue[] | undefined = undefined;
    if (state.context.selectedValue) {
      returnValue = [state.context.selectedValue];
    }

    state.context.OnChange(returnValue);
  }, [state.context.selectedValue]);

  const handleOnWebClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    send({
      type: "SEARCH",
      searchText: inputRef.current ? inputRef.current["value"] : "",
    });
  };
  const handleOnMobileClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    send({ type: "SEARCH", searchText: "" });
  };

  const handleRemoveLookup = (e: React.MouseEvent<HTMLButtonElement>) => {
    send({ type: "CLEAR-RECORD" });
  };
  const OnTextBoxEnter = (e: React.MouseEvent<HTMLInputElement>) => {
    e.currentTarget.setAttribute(
      "placeholder",
      e.type === "mouseenter" ? "Lookup for records" : "---"
    );
  };

  const isMobileApp = state.context.pcfContext.client.getClient() === "Mobile";

  const inputRef = useRef(null);
  return (
    <>
      <div
        className={mergeStyles({
          ":hover": { border: "solid 1px" },
          ":hover .searchBtnCls": { visibility: "visible" },
          ":hover .removeSelectedBtn": { visibility: "visible" },
        })}
      >
        <Stack horizontal={true}>
          {state.context.selectedValue && (
            <StackItem grow={12}>
              <Stack horizontal={true}>
                <StackItem
                  className={mergeStyles({
                    fontWeight: 600,
                    color: "rgb(17, 96, 183)",
                    overflowY: "hidden",
                    padding: "2%",
                    ":hover": {
                      "text-decoration": "underline",
                      cursor: "pointer",
                    },
                  })}
                  id={state.context.selectedValue.id}
                >
                  {state.context.selectedValue.name}
                </StackItem>
                <StackItem>
                  <IconButton
                    iconProps={{ iconName: "Cancel" }}
                    onClick={handleRemoveLookup}
                    className="removeSelectedBtn"
                  ></IconButton>
                </StackItem>
              </Stack>
            </StackItem>
          )}
          <StackItem grow={12}>
            {!state.context.selectedValue && (
              <input
                type="text"
                id="inputText"
                className={mergeStyles({
                  width: "95%",
                  height: "85%",
                  border: "none",
                })}
                ref={inputRef}
                disabled={isMobileApp}
                placeholder="---"
                onMouseEnter={OnTextBoxEnter}
                onMouseLeave={OnTextBoxEnter}
              />
            )}
          </StackItem>
          <StackItem align="end" grow={1} className="searchBtnCls">
            <IconButton
              iconProps={{
                iconName: isMobileApp ? "GenericScan" : "Search",
              }}
              className={mergeStyles({ color: "black" })}
              onClick={isMobileApp ? handleOnMobileClick : handleOnWebClick}
            ></IconButton>
          </StackItem>
        </Stack>
      </div>
    </>
  );
};

import { IBarCodeLookupMachineContext } from "./BarcodeSearchMachine";
import { useBarcodeLookupMachine } from "./useBarcodeSearch";
import { IInputs } from "../../generated/ManifestTypes";
import React = require("react");
import {
  IconButton,
  Label,
  mergeStyles,
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
  const handleOnClickSelectedItem = (e: React.MouseEvent<HTMLLabelElement>) => {
    const selectedItem = state.context.selectedValue;
    if (selectedItem) {
      state.context.pcfContext.navigation.openForm({
        entityName: selectedItem.entityType,
        entityId: selectedItem.id,
      });
    }
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
          marginLeft: "5px",
        })}
      >
        {state.context.errorMessage && (
          <Label className={mergeStyles({ color: "red" })}>
            Error occurred while loading the component
          </Label>
        )}
        {!state.context.errorMessage && (
          <Stack
            horizontal={true}
            className={mergeStyles({ maxWidth: "100%" })}
          >
            {state.context.selectedValue && (
              <StackItem grow={10} className={mergeStyles({ maxWidth: "80%" })}>
                <Stack
                  horizontal={true}
                  className={mergeStyles({ maxWidth: "100%" })}
                >
                  <StackItem
                    grow={8}
                    className={mergeStyles({ maxWidth: "80%" })}
                  >
                    <Label
                      onClick={handleOnClickSelectedItem}
                      className={mergeStyles({
                        fontWeight: 600,
                        color: "rgb(17, 96, 183)",
                        overflow: "hidden",
                        padding: "2%",
                        ":hover": {
                          "text-decoration": "underline",
                          cursor: "pointer",
                        },
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      })}
                      id={state.context.selectedValue.id}
                    >
                      {state.context.selectedValue.name}
                    </Label>
                  </StackItem>
                  <StackItem grow={2}>
                    <IconButton
                      iconProps={{ iconName: "Cancel" }}
                      onClick={handleRemoveLookup}
                      className="removeSelectedBtn"
                    ></IconButton>
                  </StackItem>
                </Stack>
              </StackItem>
            )}

            {!state.context.selectedValue && (
              <StackItem grow={10}>
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
              </StackItem>
            )}
            <StackItem
              align="end"
              grow={1}
              className={!isMobileApp ? "searchBtnCls" : ""}
            >
              <IconButton
                iconProps={{
                  iconName: isMobileApp ? "GenericScan" : "Search",
                }}
                className={mergeStyles({ color: "black",width:'100%', paddingLeft: "50%" ,':hover':{'background-color':'white'}})}
                onClick={isMobileApp ? handleOnMobileClick : handleOnWebClick}
              ></IconButton>
            </StackItem>
          </Stack>
        )}
      </div>
    </>
  );
};

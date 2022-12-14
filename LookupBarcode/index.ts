import { BarcodeSearcher } from './components/BarcodeSearch/BarcodeSearcher';
import { IBarCodeLookupMachineContext } from './components/BarcodeSearch/BarcodeSearchMachine';
import { IInputs, IOutputs } from './generated/ManifestTypes';
import { createRoot, Root } from 'react-dom/client';
import { createElement } from 'react';

export class LookupBarcode
  implements ComponentFramework.StandardControl<IInputs, IOutputs>
{
  private _notifyOutputChanged: () => void;
  // private _container: HTMLDivElement;
  private _selectedValue: ComponentFramework.LookupValue[] | undefined;
  private _root: Root;
  private _barCodesearcherContext: IBarCodeLookupMachineContext;
  /**
   * Empty constructor.
   */

  /**
   * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
   * Data-set values are not initialized here, use updateView.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
   * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
   * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
   * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
   */

  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ): void {
    // Add control initialization code
    // Add control initialization code
    this._notifyOutputChanged = notifyOutputChanged;
    this._root = createRoot(container!);

    // If the form is diabled because it is inactive or the user doesn't have access
    // isControlDisabled is set to true
    let readOnly = context.mode.isControlDisabled;
    // When a field has FLS enabled, the security property on the attribute parameter is set
    let masked = false;
    if (context.parameters.barcodeLookupProperty.security) {
      readOnly =
        readOnly || !context.parameters.barcodeLookupProperty.security.editable;
      masked = !context.parameters.barcodeLookupProperty.security.readable;
    }

    this._barCodesearcherContext = {
      pcfContext: context,
      OnChange: this.onChange,
      disabled: readOnly,
      masked: masked,
    };
  }

  /**
   * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
   */
  public updateView(context: ComponentFramework.Context<IInputs>): void {
    // RENDER React Component
    this._root.render(
      createElement(BarcodeSearcher, this._barCodesearcherContext)
    );
  }

  onChange = (newValue: ComponentFramework.LookupValue[] | undefined): void => {
    this._selectedValue = newValue;
    this._notifyOutputChanged();
  };

  /**
   * It is called by the framework prior to a control receiving new data.
   * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as ???bound??? or ???output???
   */
  public getOutputs(): IOutputs {
    return {
      barcodeLookupProperty: this._selectedValue,
    };
  }

  /**
   * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
   * i.e. cancelling any pending remote calls, removing listeners, etc.
   */
  public destroy(): void {
    // Add code to cleanup control if necessary
    this._root.unmount();
  }
}

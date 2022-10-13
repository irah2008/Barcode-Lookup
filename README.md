# Barcode-Lookup

A PCF to use barcode scanner control to populate lookup field in Dynamics 365 mobile app.

<img src="https://user-images.githubusercontent.com/22978615/195552523-943f5055-029c-4cfe-a522-69a65062c3a2.png" width = 100  />



- A simple PCF control that reads the barcode and search in Dataverse with the predefined column and populate the values
- Configuration should be passed as JSON object which is described below

<br>
<br>

## Releases

Please download the releases [here](https://github.com/irah2008/Barcode-Lookup/releases)

<br>
<br>

## Sample Configuration

Configuration can be passed to the control via control properties as shown below.

![image](https://user-images.githubusercontent.com/22978615/195521034-d4dfb9ec-494c-4b85-9307-69dec6a57f2c.png)

<br>
<br>



### Sample Configuration below

{
"entityName": "account",
"fieldtoSearch": "accountnumber",
"nameColumn": "name",
"showNew": false,
"defaultviewId": "00000000-0000-0000-00aa-000010001001"
}


<br>
- entityName : The schema name for the entity to be searched
- fieldtoSearch : The field to be searched against with value from barcode
- nameColumn : primary name column of the entity being searched
- showNew : show new button to be visible lookup control in case the barcode is not found
- defaultviewId : default view id to be displayed in the lookup control in case barcode is not found

<br>
<br>

## How does it look

<li> Lookup to account is created on contact form, initially it is blank

 ![image](https://user-images.githubusercontent.com/22978615/195551197-9bd4eda6-3e7f-4280-9b0e-0b1eb9bd83ee.png)

 <br>
 <br>
 </li>
<li> On the Dynamics 365 Mobile App the control appears as QR scanner

![Phone-contact-screen-notfilled](https://user-images.githubusercontent.com/22978615/195552414-cd20139f-ccbe-46e9-9ced-ced6976586ec.jpg)
<br>
<br>
</li>
<li>
- On Click QR is scanned and the output is passed to the search based on the input params

![phone-barcode-scanner](https://user-images.githubusercontent.com/22978615/195552440-b9349bfc-59a1-422a-a826-f58616bf9706.jpg)

<br>
<br>
</li>
<li>
- Retrieved value is set to the lookup field.

![Phone-contact-screen-filled](https://user-images.githubusercontent.com/22978615/195552466-3e0456d9-d1ef-4e97-aa77-6994797ec31b.jpg)

<br>
<br>
</li>
<li>
- Value is updated back to contact record

![image](https://user-images.githubusercontent.com/22978615/195551755-9056dfca-f3f7-41a9-b3eb-0540738dbca9.png)
</li>


[Thanks to DavidXrm's LookupDropdown for the inspiration](https://github.com/drivardxrm/LookupDropdown.PCF)

[Thanks to Statelyai's Xstate for the wonderful State machines](https://github.com/statelyai/xstate)

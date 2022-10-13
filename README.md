# Barcode-Lookup

A PCF to use barcode scanner control to populate lookup field in Dynamics 365 mobile app.

- A simple PCF control that reads the barcode and search in Dataverse with the predefined column and populate the values
- Configuration should be passed as JSON object

## Sample Configuration

{
"entityName": "account",
"fieldtoSearch": "accountnumber",
"nameColumn": "name",
"showNew": false,
"defaultviewId": "00000000-0000-0000-00aa-000010001001"
}

- entityName : The schema name for the entity to be searched
- fieldtoSearch : The field to be searched against with value from barcode
- nameColumn : primary name column of the entity being searched
- showNew : show new button to be visible lookup control in case the barcode is not found
- defaultviewId : default view id to be displayed in the lookup control in case barcode is not found

![image](https://user-images.githubusercontent.com/22978615/195521034-d4dfb9ec-494c-4b85-9307-69dec6a57f2c.png)


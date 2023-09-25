BalanceImportTest =
{
    BalImpTest: function () {
        if (!Monad.CbotData.bNonemptyData) {
            Logger.Log("\t\tFAIL -- Check CBOT's B2 Imports from AmazonPurchases");
            return false;
        }

        SpreadsheetApp.getActive()
            .getSheetByName("AmazonPurchases")
            .getRange('J1')
            .setValue(198904.23);

        let importedValue = Monad.CbotData.sheet
            .getRange('B2')
            .getValue();

        let finalResult = (importedValue == 198904.23);
        let message = finalResult ? "PASS" : "FAIL";
        Logger.Log("\t\t" + message + " -- Check CBOT's B2 Imports from AmazonPurchases");
        return finalResult;
    }
}
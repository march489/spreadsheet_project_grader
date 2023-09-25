NoOverpaymentTest =
{
    MinPayTogTest: function () {
        if (!Monad.CbotData.bNonemptyData) {
            Logger.Log("\t\tFAIL -- Check Minimum Payment Formula Prevents Overpaying");
            return false;
        }

        Monad.CbotData.sheet.getRange('G10').setValue(23.04);
        let toggledMinPayment = Monad.CbotData.sheet.getRange('H10').getValue();

        let finalResult = (toggledMinPayment == 23.04);
        let message = finalResult ? "PASS" : "FAIL";
        Logger.Log("\t\t" + message + " -- Check Minimum Payment Formula Prevents Overpaying");
        return finalResult;
    }
}
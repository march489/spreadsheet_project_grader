DateIncrementTest =
{
    DateIncTest: function () {
        if (!Monad.CbotData.bNonemptyData) {
            Logger.Log("\t\tFAIL -- Check Dates Incremented Using a Formula");
            return false;
        }

        if (Monad.CbotData.sheet.getRange('A3').getFormula() == '') {
            Logger.Log("\t\tFAIL -- Check Dates Incremented Using a Formula");
            return false;
        }

        let originalDateArray = [];
        try {
            originalDateArray = Monad.CbotData.sheet.getRange(2, 1, Monad.CbotData.numRows, 1)
                .getValues()
                .flat();
            // //console.log(originalDateArray);
        }
        catch (e) {
            //console.log(e + ", invalid array for st: [%s]", TestDriver.studentName);
        }


        // autofill
        try {
            Monad.CbotData.sheet
                .getRange('A3')
                .autoFill(
                    Monad.CbotData.sheet.getRange(3, 1, Monad.CbotData.numRows - 1, 1),
                    SpreadsheetApp.AutoFillSeries.DEFAULT_SERIES
                );
        }
        catch (e) {
            //console.log(e + ", student: " + TestDriver.studentName);
        }

        let updatedDateArray = Monad.CbotData.sheet.getRange(2, 1, Monad.CbotData.numRows, 1)
            .getValues()
            .flat();
        // //console.log(updatedDateArray);

        for (let [index, date] of originalDateArray.entries()) {
            if (date - updatedDateArray[index] != 0) {
                Logger.Log("\t\tFAIL -- Check Dates Incremented Using a Formula");
                //console.log("autofill dates, expected [%s], got [%s]", updatedDateArray[index], date);
                return false;
            }
        }

        Logger.Log("\t\tPASS -- Check Dates Incremented Using a Formula");
        return true;
    }
}
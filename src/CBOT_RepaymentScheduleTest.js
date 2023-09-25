RepaymentScheduleTest =
{
    CheckBalancesBeforePaymentAreCalculatedCorrectly: function () {
        // check if data is valid
        if (!Monad.CbotData.bNonemptyData) {
            Logger.Log("\t\tFAIL -- Check Balances Before Payment Are Calculated Correctly");
            return false;
        }

        let apr = Monad.CbotData.apr ? Monad.CbotData.apr : 0.2285;

        for (let i = 0; i < Monad.CbotData.numRows - 1; i++) {
            let correctAnswer = Monad.CbotData.dataArray[i][3] * Math.exp(apr * 30 / 365);
            let studentAnswer = Monad.CbotData.dataArray[i + 1][1];

            // check their answer
            if (correctAnswer != studentAnswer) {
                //console.log("BBP error at index [i = %s], expected: [%s], got: [%s]", i, correctAnswer, studentAnswer);
                Logger.Log("\t\tFAIL -- Check Balances Before Payment Are Calculated Correctly");
                return false;
            }
        }

        // check their work
        Logger.Log("\t\tPASS -- Check Balances Before Payment Are Calculated Correctly");
        return true;
    },

    CheckBalancesAfterPaymentAreCalculatedCorrectly: function () {
        // check if data is valid
        if (!Monad.CbotData.bNonemptyData) {
            Logger.Log("\t\tFAIL -- Check Balances After Payment Are Calculated Correctly");
            return false;
        }

        for (let i = 0; i < Monad.CbotData.numRows; i++) {
            let studentAnswer = Monad.CbotData.dataArray[i][3];
            let correctAnswer = Monad.CbotData.dataArray[i][1] - Monad.CbotData.dataArray[i][2];

            if (correctAnswer != studentAnswer) {
                Logger.Log("\t\tFAIL -- Check Balances After Payment Are Calculated Correctly");
                return false;
            }
        }

        Logger.Log("\t\tPASS -- Check Balances After Payment Are Calculated Correctly");
        return true;
    },

    CheckTotalsPaidToDateAreCalculatedCorrectly: function () {
        // check if data is valid
        if (!Monad.CbotData.bNonemptyData) {
            Logger.Log("\t\tFAIL -- Check Totals Paid To Date Are Calculated Correctly");
            return false;
        }

        // check first row
        if (Math.abs(Monad.CbotData.dataArray[0][2] - Monad.CbotData.dataArray[0][4]) > 0.01) {
            //console.log("first row wrong");
            //console.log(Monad.CbotData.dataArray[0][2]);
            //console.log(Monad.CbotData.dataArray[0][4])
            Logger.Log("\t\tFAIL -- Check Totals Paid To Date Are Calculated Correctly");
            return false;
        }

        // check the other rows
        for (let i = 1; i < Monad.CbotData.numRows; i++) {
            let studentAnswer = parseFloat(Monad.CbotData.dataArray[i][4]);
            let correctAnswer = parseFloat(Monad.CbotData.dataArray[i - 1][4]) + parseFloat(Monad.CbotData.dataArray[i][2]);

            if (studentAnswer != correctAnswer) {
                //console.log("row " + i + " wrong")
                //console.log("expcted: " + correctAnswer);
                //console.log("got: " + studentAnswer);
                Logger.Log("\t\tFAIL -- Check Totals Paid To Date Are Calculated Correctly");
                return false;
            }
        }

        Logger.Log("\t\tPASS -- Check Totals Paid To Date Are Calculated Correctly");
        return true;
    },

    CheckFinalBalanceIsZero: function () {
        // check if data is valid
        if (!Monad.CbotData.bNonemptyData) {
            Logger.Log("\t\tFAIL -- Check Final Balance Is Zero");
            return false;
        }

        let finalResult = (parseFloat(Monad.CbotData.dataArray[Monad.CbotData.numRows - 1][3]) == 0);
        let message = finalResult ? "PASS" : "FAIL";
        Logger.Log("\t\t" + message + " -- Check Final Balance Is Zero");
        return finalResult;
    },

    CheckBalancesBeforePaymentCalculatedWithRobustFormula: function () {
        // Check if null -- only null if data is invalid
        if (!Monad.CbotData.exponentialFunctionFormulaCell) {
            Logger.Log("\t\tFAIL -- Check Balances Before Payment Calculated Using Robust Formula");
            return false;
        }

        let exponentialFormula = Monad.CbotData.exponentialFunctionFormulaCell.getFormula();
        if (exponentialFormula == '') {
            // student didn't use a formula --> hard coded
            //console.log('no BBP formula');
            Logger.Log("\t\tFAIL -- Check Balances Before Payment Calculated Using Robust Formula");
            return false;
        }
        let originalBalance = Monad.CbotData.dataRange
            .getCell(Monad.CbotData.numRows, 4)
            .getValue();

        // //console.log(exponentialFormula);
        Monad.CbotData.exponentialFunctionFormulaCell.autoFill(
            Monad.CbotData.sheet.getRange(3, 2, Monad.CbotData.numRows - 1, 1), // dest Range
            SpreadsheetApp.AutoFillSeries.DEFAULT_SERIES);

        // check if final balance is still zero
        let finalBalance = Monad.CbotData.dataRange
            .getCell(Monad.CbotData.numRows, 4)
            .getValue();

        let finalResult = (finalBalance == originalBalance);
        let message = finalResult ? "PASS" : "FAIL";
        Logger.Log("\t\t" + message + " -- Check Balances Before Payment Calculated Using Robust Formula");
        return finalResult;
    },

    CheckBalancesAfterPaymentCalculatedWithRobustFormula: function () {
        // check if data is valid
        if (!Monad.CbotData.balanceAfterPaymentsFormulaCell) {
            Logger.Log("\t\tFAIL -- Check Balances After Payment Calculated Using Robust Formula");
            return false;
        }

        let bapFormula = Monad.CbotData.balanceAfterPaymentsFormulaCell.getFormula();
        if (bapFormula == '') {
            // student didn't use a formula --> hard coded
            Logger.Log("\t\tFAIL -- Check Balances After Payment Calculated Using Robust Formula");
            return false;
        }

        // get the original balance (may or may not be 0)
        let originalBalance = Monad.CbotData.dataRange
            .getCell(Monad.CbotData.numRows, 4)
            .getValue();

        // //console.log(bapFormula);
        // drag down the formula
        Monad.CbotData.balanceAfterPaymentsFormulaCell.autoFill(
            Monad.CbotData.sheet.getRange(2, 4, Monad.CbotData.numRows, 1), // dest Range
            SpreadsheetApp.AutoFillSeries.DEFAULT_SERIES);

        // check if final balance is still zero
        let finalBalance = Monad.CbotData.dataRange
            .getCell(Monad.CbotData.numRows, 4)
            .getValue();

        let finalResult = (finalBalance == originalBalance);
        let message = finalResult ? "PASS" : "FAIL";
        Logger.Log("\t\t" + message + " -- Check Balances After Payment Calculated Using Robust Formula");
        return finalResult;
    },

    CheckTotalPTDCalculatedWithRobustFormula: function () {
        // check if data is valid
        if (!Monad.CbotData.totalPaidToDateFormulaCell) {
            Logger.Log("\t\tFAIL -- Check Totals Paid to Date Calculated Using Robust Formula");
            return false;
        }

        let tptdFormula = Monad.CbotData.totalPaidToDateFormulaCell.getFormula();
        if (tptdFormula == '') {
            // student didn't use a formula --> hard coded
            Logger.Log("\t\tFAIL -- Check Totals Paid to Date Calculated Using Robust Formula");
            return false;
        }

        // get the original balance (may or may not be 0)
        let originalTotal = Monad.CbotData.dataRange
            .getCell(Monad.CbotData.numRows, 5)
            .getValue();

        // //console.log(bapFormula);
        // drag down the formula
        Monad.CbotData.totalPaidToDateFormulaCell.autoFill(
            Monad.CbotData.sheet.getRange(3, 5, Monad.CbotData.numRows - 1, 1), // dest Range
            SpreadsheetApp.AutoFillSeries.DEFAULT_SERIES);

        // check if final balance is still zero
        let finalTotal = Monad.CbotData.dataRange
            .getCell(Monad.CbotData.numRows, 5)
            .getValue();

        let finalResult = (finalTotal == originalTotal);
        let message = finalResult ? "PASS" : "FAIL";
        Logger.Log("\t\t" + message + " -- Check Totals Paid to Date Calculated Using Robust Formula");
        return finalResult;
    },

    CheckDatesIncrementByThirtyDays: function () {
        const isValidDate = (d) => {
            if (Object.prototype.toString.call(d) != "[object Date]") {
                return false;
            }
            else {
                return !isNaN(d.getTime());
            }
        }

        for (const [index, date] of Monad.CbotData.statementDateArray.entries()) {
            if (!isValidDate(date)) {
                //console.log("invalid date at row %s, got %s", index, date);
                Logger.Log("\t\tFAIL -- Check Satement Dates Increment by 30 Days");
                return false;
            }

            if (index == 0) {
                continue;
            }

            let previousDate = Monad.CbotData.statementDateArray[index - 1];

            if (date - previousDate != 2592000000) {
                //console.log("dates at row %s not incremeneted by 30 days", index);
                //console.log("prev date: %s", previousDate);
                //console.log("current date: %s", date);
                //console.log("diff: %s days", (date - previousDate) / (86400000))
                Logger.Log("\t\tFAIL -- Check Satement Dates Increment by 30 Days");
                return false;
            }
        }

        Logger.Log("\t\tPASS -- Check Satement Dates Increment by 30 Days");
        return true;
    },

    CheckMinimumPaymentFormulaIsCorrect: function () {
        if (!Monad.CbotData.bNonemptyData) {
            Logger.Log("\t\tFAIL -- Check Minimum Payment Formula Is Correct");
            return false;
        }

        let minPaymentFormula = Monad.CbotData.dataRange
            .getCell(1, 3)
            .getFormula()
            .toUpperCase()
            .replaceAll(' ', '');

        // put their formula elsewhere to test it. 
        minPaymentFormula = minPaymentFormula.replaceAll('B2', 'G10');
        Monad.CbotData.sheet.getRange('H10').setFormula(minPaymentFormula);

        // check if 2% works
        Monad.CbotData.sheet.getRange('G10').setValue(1800);
        if (Monad.CbotData.sheet.getRange('H10').getValue() != 1800 * 0.02) {
            Logger.Log("\t\tFAIL -- Check Minimum Payment Formula Is Correct");
            return false;
        }

        // check if default works
        Monad.CbotData.sheet.getRange('G10').setValue(1700);
        if (Monad.CbotData.sheet.getRange('H10').getValue() != 35.00) {
            Logger.Log("\t\tFAIL -- Check Minimum Payment Formula Is Correct");
            return false;
        }

        // everything checks out
        Logger.Log("\t\tPASS -- Check Minimum Payment Formula Is Correct");
        return true;
    },

    CheckMinPaymentFormulaIsAutofilled: function () {
        if (!Monad.CbotData.bNonemptyData) {
            Logger.Log("\t\tFAIL -- Check Minimum Payment Formula Is AutoFilled");
            return false;
        }

        let minPaymentFormulaCell = Monad.CbotData.dataRange
            .getCell(1, 3);

        let minPaymentFormula = minPaymentFormulaCell.getFormula();


        // check if there's a formula
        if (!minPaymentFormula) {
            Logger.Log("\t\tFAIL -- Check Minimum Payment Formula Is AutoFilled");
            return false;
        }

        let originalValue = Monad.CbotData.dataRange.getCell(Monad.CbotData.numRows, 4).getValue();

        try {
            minPaymentFormulaCell.autoFill(
                Monad.CbotData.sheet.getRange(2, 3, Monad.CbotData.numRows - 1, 1),
                SpreadsheetApp.AutoFillSeries.DEFAULT_SERIES);
            //console.log("min payment autofill successful")
        }
        catch (e) {
            // do nothing
            //console.log(e);
            //console.log("min payment autofill failed");
        }

        let finalValue = Monad.CbotData.dataRange.getCell(Monad.CbotData.numRows, 4).getValue();
        if (originalValue != finalValue) {
            Logger.Log("\t\tFAIL -- Check Minimum Payment Formula Is AutoFilled");
            return false;
        }

        // everything checks out
        Logger.Log("\t\tPASS -- Check Minimum Payment Formula Is AutoFilled");
        return true;
    }
}
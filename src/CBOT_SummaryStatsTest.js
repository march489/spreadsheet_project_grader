SummaryStatsTest =
{
    setup: function () {
        if (!Monad.CbotData.bNonemptyData) {
            return false;
        }

        this.initialSummaryStatArray = Monad.CbotData.summaryStatValuesRange
            .getValues()
            .flat();

        this.initialBalanceBeforePayment = Monad.CbotData.dataArray[0][1];

        return true;
    },

    CheckMonthsSpentInRepaymentIsCorrect: function () {
        if (!Monad.CbotData.bNonemptyData) {
            Logger.Log("\t\tFAIL -- Check Months Spent In Repayment Is Correct");
            return false;
        }

        let monthsInRepayment = this.initialSummaryStatArray[4];

        let finalResult = (monthsInRepayment == Monad.CbotData.numRows);
        let message = finalResult ? "PASS" : "FAIL";
        Logger.Log("\t\t" + message + " -- Check Months Spent In Repayment Is Correct");
        return finalResult;
    },

    CheckMonthsSpentInRepaymentCalculatedWithFormula: function () {
        if (!Monad.CbotData.bNonemptyData) {
            Logger.Log("\t\tFAIL -- Check Months Spent In Repayment Calculated with Formula");
            return false;
        }

        let monthsInRepaymentFormula = Monad.CbotData.summaryStatValuesRange
            .getFormulas()
            .flat()
        [4];

        let finalResult = (monthsInRepaymentFormula != '');
        let message = finalResult ? "PASS" : "FAIL";
        Logger.Log("\t\t" + message + " -- Check Months Spent In Repayment Calculated with Formula");
        return finalResult;
    },

    CheckTotalPaidIsCorrect: function () {
        if (!Monad.CbotData.bNonemptyData) {
            Logger.Log("\t\tFAIL -- Check Total Paid Is Correct");
            return false;
        }

        let summaryTotalPaid = this.initialSummaryStatArray[5];
        let tableTotalPaid = Monad.CbotData.dataArray[Monad.CbotData.numRows - 1][4];

        let finalResult = (summaryTotalPaid == tableTotalPaid);
        let message = finalResult ? "PASS" : "FAIL";
        Logger.Log("\t\t" + message + " -- Check Total Paid Is Correct");
        return finalResult;
    },

    CheckTotalInterestIsCorrect: function () {
        if (!Monad.CbotData.bNonemptyData) {
            Logger.Log("\t\tFAIL -- Check Total Interest Is Correct");
            return false;
        }

        let correctInterest = Monad.CbotData.dataArray[Monad.CbotData.numRows - 1][4] - Monad.CbotData.dataArray[0][1];
        let studentInterest = this.initialSummaryStatArray[6]

        let finalResult = (correctInterest == studentInterest);
        let message = finalResult ? "PASS" : "FAIL";
        Logger.Log("\t\t" + message + " -- Check Total Interest Is Correct");
        return finalResult;
    },

    CheckEffectiveInterestRateIsCorrect: function () {
        if (!Monad.CbotData.bNonemptyData) {
            Logger.Log("\t\tFAIL -- Check Effective Interest Rate Is Correct");
            return false;
        }

        let studentEffectiveInterestRate = this.initialSummaryStatArray[7];
        let correctEffectiveInterestRate =
            (Monad.CbotData.dataArray[Monad.CbotData.numRows - 1][4] - Monad.CbotData.dataArray[0][1]) / Monad.CbotData.dataArray[0][1];

        let finalResult = (studentEffectiveInterestRate == correctEffectiveInterestRate);
        let message = finalResult ? "PASS" : "FAIL";
        Logger.Log("\t\t" + message + " -- Check Effective Interest Rate Is Correct");
        return finalResult;
    },

    setupReads: function () {
        if (!Monad.CbotData.bNonemptyData) {
            return false;
        }

        // change all min payments to $30
        for (let i = 1; i <= Monad.CbotData.numRows; i++) {
            Monad.CbotData.dataRange.getCell(i, 3).setValue(30);
        }

        // take new snapshot
        this.updatedSummaryStatArray = Monad.CbotData.summaryStatValuesRange
            .getValues()
            .flat();

        return true;
    },

    CheckTotalPaidFormulaIsRobust: function () {
        if (!Monad.CbotData.bNonemptyData) {
            Logger.Log("\t\tFAIL -- Check Total Paid Formula Is Robust");
            return false;
        }

        // get updated total paid from summary stat table
        let updatedTotalPaid = this.updatedSummaryStatArray[5];
        let finalResult = (updatedTotalPaid == Monad.CbotData.numRows * 30);
        let message = finalResult ? "PASS" : "FAIL";
        Logger.Log("\t\t" + message + " -- Check Total Paid Formula Is Robust");
        return finalResult;
    },

    CheckTotalInterestFormulaIsRobust: function () {
        if (!Monad.CbotData.bNonemptyData) {
            Logger.Log("\t\tFAIL -- Check Total Interest Formula Is Robust");
            return false;
        }

        let updatedTotalInterest = this.updatedSummaryStatArray[6];
        let updatedTotalPaid = Monad.CbotData.dataRange.getCell(Monad.CbotData.numRows, 5).getValue();
        let finalResult = (updatedTotalPaid - this.initialBalanceBeforePayment == updatedTotalInterest);
        let message = finalResult ? "PASS" : "FAIL";
        Logger.Log("\t\t" + message + " -- Check Total Interest Formula Is Robust");
        return finalResult;
    },

    CheckEffectiveInterestFormulaIsRobust: function () {
        if (!Monad.CbotData.bNonemptyData) {
            Logger.Log("\t\tFAIL -- Check Effective Interest Rate Formula Is Robust");
            return false;
        }

        let updatedEffectiveInterestRate = this.updatedSummaryStatArray[7];
        let updatedTotalPaid = Monad.CbotData.dataRange.getCell(Monad.CbotData.numRows, 5).getValue();
        let correctEffectiveInterestRate = (updatedTotalPaid - this.initialBalanceBeforePayment) / this.initialBalanceBeforePayment;

        let finalResult = (updatedEffectiveInterestRate == correctEffectiveInterestRate);
        let message = finalResult ? "PASS" : "FAIL";
        Logger.Log("\t\t" + message + " -- Check Effective Interest Rate Formula Is Robust");
        return finalResult;
    }
}
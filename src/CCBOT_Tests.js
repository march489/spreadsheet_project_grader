function RunCBOTTest() {
    Logger.Log("\n---------------------------")
    Logger.Log("\nCreditBalanceOverTimeTest: Running...")

    const results = new Array();
    let finalResult = true;

    // get original AmazonPurchases
    let amazonsheet = TestDriver.pProjectManager.getSheetByName("AmazonPurchases");
    if (amazonsheet) {
        TestDriver.pProjectManager.deleteSheet(amazonsheet);
    }
    TestDriver.pSpreadsheet.getSheetByName("AmazonPurchases")
        .copyTo(TestDriver.pProjectManager)
        .setName("AmazonPurchases");

    // delete TestSheet if it already exists
    let testSheet = TestDriver.pProjectManager.getSheetByName("CBOT");
    if (testSheet) {
        TestDriver.pProjectManager.deleteSheet(testSheet);
    }

    // set flag for CBOT existing
    let bCbotExists = false;

    try {
        TestDriver.pSpreadsheet.getSheetByName("CBOT")
            .copyTo(TestDriver.pProjectManager)
            .activate()
            .setName("CBOT");

        bCbotExists = true;
    }
    catch (e) {
        //console.log(e + " --> student name: [%s] has not set up CBOT sheet", TestDriver.studentName);
        TestDriver.pProjectManager
            .insertSheet()
            .activate()
            .setName("CBOT");

        bCbotExists = false;
    }

    // otherwise, run test as normal
    if (bCbotExists) {
        for (const [name, f] of Object.entries(CBOT_Tests)) {
            // let singleTestTimer = Date.now();
            results.push(f.call());
            // //console.log("%s run time: %s sec", name, (Date.now() - singleTestTimer) / 1000);
        }

        finalResult = results.reduce((bA, bB) => bA && bB, true);
    }
    else {
        Logger.Log("\tThe CBOT spreadsheet has not yet been correctly set up");
        finalResult = false;
    }

    let message = finalResult ? "ALL TESTS PASS" : "FAIL";
    Logger.Log("CreditBalanceOverTime: " + message);
}

CBOT_Tests =
{
    setup: function () {
        Monad.CbotData.ss = SpreadsheetApp.getActive();
        Monad.CbotData.sheet = ss.getActiveSheet();

        Monad.CbotData.dataArray = Monad.CbotData.sheet
            .getRange('A2:E')
            .getValues()
            .map(row => row.map(cell => cell.toString().replaceAll(" ", "")))
            .filter(Monad.Utils.isRowEmpty);

        if (Monad.CbotData.dataArray.length > 0) {
            Monad.CbotData.numRows = Monad.CbotData.dataArray.length;
            Monad.CbotData.bNonemptyData = true;
        }
        else {
            Monad.CbotData.numRows = 1;
            Monad.CbotData.bNonemptyData = false;
        }

        Monad.CbotData.dataRange = Monad.CbotData.sheet
            .getRange(2, 1, Monad.CbotData.numRows, 5);

        try {
            Monad.CbotData.exponentialFunctionFormulaCell = Monad.CbotData.bNonemptyData ?
                Monad.CbotData.dataRange.getCell(2, 2) :
                null;
        }
        catch (e) {
            Monad.CbotData.exponentialFunctionFormulaCell = null;
        }

        try {
            Monad.CbotData.balanceAfterPaymentsFormulaCell = Monad.CbotData.bNonemptyData ?
                Monad.CbotData.dataRange.getCell(1, 4) :
                null;
        }
        catch (e) {
            Monad.CbotData.balanceAfterPaymentsFormulaCell = null;
        }

        try {
            Monad.CbotData.totalPaidToDateFormulaCell = Monad.CbotData.bNonemptyData ?
                Monad.CbotData.dataRange.getCell(2, 5) :
                null;
        }
        catch (e) {
            Monad.CbotData.totalPaidToDateFormulaCell = null;
        }

        Monad.CbotData.summaryStatHeadersRange = Monad.CbotData.sheet
            .getRange('G1:G8');

        Monad.CbotData.statementDateRange = Monad.CbotData.sheet
            .getRange(2, 1, this.numRows - 1, 1);

        Monad.CbotData.statementDateArray = Monad.CbotData.statementDateRange
            .getValues()
            .flat()
            .filter(Monad.Utils.valueFilter);

        Monad.CbotData.summaryStatHeadersValues = Monad.CbotData.summaryStatHeadersRange.getValues().flat();
        Monad.CbotData.summaryStatHeadersAlignment = Monad.CbotData.summaryStatHeadersRange.getHorizontalAlignments().flat();
        Monad.CbotData.summaryStatHeadersFontWeight = Monad.CbotData.summaryStatHeadersRange.getFontWeights().flat();

        Monad.CbotData.summaryStatValuesRange = Monad.CbotData.sheet
            .getRange('H1:H8');
        Monad.CbotData.apr = Monad.CbotData.summaryStatValuesRange
            .getCell(1, 1)
            .getValue();
        Monad.CbotData.minimumpaymentpercentage = Monad.CbotData.summaryStatValuesRange
            .getCell(2, 1)
            .getValue();
        Monad.CbotData.minimummonthlypayment = Monad.CbotData.summaryStatValuesRange
            .getCell(3, 1)
            .getValue();

        return true;
    },

    CBOTSheetIsSetupTest: function () {
        Logger.Log("\tCardBalanceOverTimeTest -- Running CBOTSheetIsSetupTest... \n");

        const results = new Array();
        // Object.values(CBOTSetupCorrectTest).forEach((f) => { results.push(f.call()); });
        for (const [name, f] of Object.entries(CBOTSetupCorrectTest)) {
            // let singleTestTimer = Date.now();
            results.push(f.call());
            // //console.log("%s run time: %s sec", name, (Date.now() - singleTestTimer) / 1000);
        }

        let finalResult = results.reduce((bA, bB) => bA && bB, true);
        let resultStamp = finalResult ? "Y" : "N";

        TestDriver.pSpreadsheet.getSheetByName("Checklist")
            .getRange('C23')
            .setValue(resultStamp);

        TestDriver.pProjectManager.getSheetByName("Scoring")
            .getRange(TestDriver.scoringRowNumber, 24)
            .setValue(resultStamp);

        let message = finalResult ? "PASS" : "FAIL";
        Logger.Log("\n\tCardBalanceOverTimeTest -- CBOTSheetIsSetupTest: " + message + '\n');
        return finalResult;
    },

    RepaymentScheduleTest: function () {
        Logger.Log("\tCardBalanceOverTimeTest -- Running RepaymentScheduleTest... \n");

        const results = new Array();
        // Object.values(RepaymentScheduleTest).forEach((f) => { results.push(f.call()); });
        for (const [name, f] of Object.entries(RepaymentScheduleTest)) {
            // let singleTestTimer = Date.now();
            results.push(f.call());
            // //console.log("%s run time: %s sec", name, (Date.now() - singleTestTimer) / 1000);
        }

        let finalResult = results.reduce((bA, bB) => bA && bB, true);
        let resultStamp = finalResult ? "Y" : "N";

        TestDriver.pSpreadsheet.getSheetByName("Checklist")
            .getRange('C24')
            .setValue(resultStamp);

        TestDriver.pProjectManager.getSheetByName("Scoring")
            .getRange(TestDriver.scoringRowNumber, 25)
            .setValue(resultStamp);

        let message = finalResult ? "PASS" : "FAIL";
        Logger.Log("\n\tCardBalanceOverTimeTest -- RepaymentScheduleTest: " + message + '\n');
        return finalResult;
    },

    RunSummaryStatsTest: function () {
        Logger.Log("\tCardBalanceOverTimeTest -- Running SummaryStatsTest...\n");

        const results = new Array();
        // Object.values(RepaymentScheduleTest).forEach((f) => { results.push(f.call()); });
        for (const [name, f] of Object.entries(SummaryStatsTest)) {
            // let singleTestTimer = Date.now();
            results.push(f.call());
            // //console.log("%s run time: %s sec", name, (Date.now() - singleTestTimer) / 1000);
        }

        let finalResult = results.reduce((bA, bB) => bA && bB, true);
        let resultStamp = finalResult ? "Y" : "N";

        TestDriver.pSpreadsheet.getSheetByName("Checklist")
            .getRange('C25')
            .setValue(resultStamp);

        TestDriver.pProjectManager.getSheetByName("Scoring")
            .getRange(TestDriver.scoringRowNumber, 26)
            .setValue(resultStamp);

        let message = finalResult ? "PASS" : "FAIL";
        Logger.Log("\n\tCardBalanceOverTimeTest -- SummaryStatsTest: " + message + '\n');
        return finalResult;
    },

    RunBalanceImportTest: function () {
        Logger.Log("\tCardBalanceOverTimeTest -- Running BalanceImportTestt...\n");

        const results = new Array();
        // Object.values(RepaymentScheduleTest).forEach((f) => { results.push(f.call()); });
        for (const [name, f] of Object.entries(BalanceImportTest)) {
            // let singleTestTimer = Date.now();
            results.push(f.call());
            // //console.log("%s run time: %s sec", name, (Date.now() - singleTestTimer) / 1000);
        }

        let finalResult = results.reduce((bA, bB) => bA && bB, true);
        let resultStamp = finalResult ? "Y" : "N";

        TestDriver.pSpreadsheet.getSheetByName("Checklist")
            .getRange('C27')
            .setValue(resultStamp);

        TestDriver.pProjectManager.getSheetByName("Scoring")
            .getRange(TestDriver.scoringRowNumber, 27)
            .setValue(resultStamp);

        let message = finalResult ? "PASS" : "FAIL";
        Logger.Log("\n\tCardBalanceOverTimeTest -- BalanceImportTest: " + message + '\n');
        return finalResult;
    },

    RunDateIncrementTest: function () {
        Logger.Log("\tCardBalanceOverTimeTest -- Running DateIncrementTest...\n");

        const results = new Array();
        // Object.values(RepaymentScheduleTest).forEach((f) => { results.push(f.call()); });
        for (const [name, f] of Object.entries(DateIncrementTest)) {
            // let singleTestTimer = Date.now();
            results.push(f.call());
            // //console.log("%s run time: %s sec", name, (Date.now() - singleTestTimer) / 1000);
        }

        let finalResult = results.reduce((bA, bB) => bA && bB, true);
        let resultStamp = finalResult ? "Y" : "N";

        TestDriver.pSpreadsheet.getSheetByName("Checklist")
            .getRange('C28')
            .setValue(resultStamp);

        TestDriver.pProjectManager.getSheetByName("Scoring")
            .getRange(TestDriver.scoringRowNumber, 28)
            .setValue(resultStamp);

        let message = finalResult ? "PASS" : "FAIL";
        Logger.Log("\n\tCardBalanceOverTimeTest -- DateIncrementTest: " + message + '\n');
        return finalResult;
    },

    RunNoOverPaymentTest: function () {
        Logger.Log("\tCardBalanceOverTimeTest -- Running NoOverpaymentTest...\n");

        const results = new Array();
        // Object.values(RepaymentScheduleTest).forEach((f) => { results.push(f.call()); });
        for (const [name, f] of Object.entries(NoOverpaymentTest)) {
            // let singleTestTimer = Date.now();
            results.push(f.call());
            // //console.log("%s run time: %s sec", name, (Date.now() - singleTestTimer) / 1000);
        }

        let finalResult = results.reduce((bA, bB) => bA && bB, true);
        let resultStamp = finalResult ? "Y" : "N";

        TestDriver.pSpreadsheet.getSheetByName("Checklist")
            .getRange('C29')
            .setValue(resultStamp);

        TestDriver.pProjectManager.getSheetByName("Scoring")
            .getRange(TestDriver.scoringRowNumber, 29)
            .setValue(resultStamp);

        let message = finalResult ? "PASS" : "FAIL";
        Logger.Log("\n\tCardBalanceOverTimeTest -- NoOverpaymentTest: " + message + '\n');
        return finalResult;
    }
}
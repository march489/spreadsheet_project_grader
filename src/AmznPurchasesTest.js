function RunAmznPurchaseTest() {
    Logger.Log("AmazonPurchaseTest: Running...")

    const results = new Array();
    let testSheet = TestDriver.pProjectManager.getSheetByName("AmazonPurchasesTestSheet");

    // delete TestSheet if it already exists
    if (testSheet) {
        TestDriver.pProjectManager.deleteSheet(testSheet);
    }

    try {
        TestDriver.pSpreadsheet.getSheetByName("AmazonPurchases")
            .copyTo(TestDriver.pProjectManager)
            .activate()
            .setName("AmazonPurchasesTestSheet");
    }
    catch (e) {
        //console.log(e);
        //console.log("student name: %s", TestDriver.studentName);
        TestDriver.pProjectManager
            .insertSheet()
            .activate()
            .setName("AmazonPurchasesTestSheet");
    }

    for (const [name, f] of Object.entries(AmznPurchasesTest)) {
        // let singleTestTimer = Date.now();
        results.push(f.call());
        // //console.log("%s run time: %s sec", name, (Date.now() - singleTestTimer) / 1000);
    }

    let finalResult = results.reduce((bA, bB) => bA && bB, true);

    let message = finalResult ? "ALL TESTS PASS" : "FAIL";
    Logger.Log("AamazonPurchaseTest: " + message);
}

AmznPurchasesTest =
{
    RunHeaderTests: function () {
        Logger.Log("\tAmznPurchaseTest -- Running HeaderTest... \n");

        const results = new Array();
        Object.values(APTHeaderTests).forEach((f) => { results.push(f.call()); });

        let finalResult = results.reduce((bA, bB) => bA && bB, true);
        let resultStamp = finalResult ? "Y" : "N";

        TestDriver.pSpreadsheet.getSheetByName("Checklist")
            .getRange('C3')
            .setValue(resultStamp);

        TestDriver.pProjectManager.getSheetByName("Scoring")
            .getRange(TestDriver.scoringRowNumber, 10)
            .setValue(resultStamp);

        let message = finalResult ? "PASS" : "FAIL";
        Logger.Log("\n\tAmazonPurchaseTest -- HeaderTest: " + message + '\n');
        return finalResult;
    },

    RunDataValidationTests: function () {
        Logger.Log("\tAmznPurchaseTest -- Running DataValidationTest... \n");

        const results = new Array();
        Object.values(DataValidationTests).forEach((f) => { results.push(f.call()); });

        let finalResult = results.reduce((bA, bB) => bA && bB, true);
        let resultStamp = finalResult ? "Y" : "N";

        TestDriver.pSpreadsheet.getSheetByName("Checklist")
            .getRange('C4')
            .setValue(resultStamp);

        TestDriver.pProjectManager.getSheetByName("Scoring")
            .getRange(TestDriver.scoringRowNumber, 11)
            .setValue(resultStamp);

        let message = finalResult ? "PASS" : "FAIL";
        Logger.Log("\n\tAmazonPurchaseTest -- DataValidationTest: " + message + '\n');
        return finalResult;
    },

    // Temporarily turned off

    RowSubtotalTests: function () {
        Logger.Log("\tAmznPurchaseTest -- Running RowSubtotalTest... \n");

        const results = new Array();
        Object.values(RowSubtotalTests).forEach((f) => { results.push(f.call()); });

        let finalResult = results.reduce((bA, bB) => bA && bB, true);
        let resultStamp = finalResult ? "Y" : "N";

        TestDriver.pSpreadsheet.getSheetByName("Checklist")
            .getRange('C5')
            .setValue(resultStamp);

        TestDriver.pProjectManager.getSheetByName("Scoring")
            .getRange(TestDriver.scoringRowNumber, 12)
            .setValue(resultStamp);

        let message = finalResult ? "PASS" : "FAIL";
        Logger.Log("\n\tAmazonPurchaseTest -- RowSubtotalTest: " + message + '\n');
        return finalResult;
    },

    // Temporarily turned off

    RunTotalCostTest: function () {
        Logger.Log("\tAmznPurchaseTest -- Running TotalCostTest... \n");

        const results = new Array();
        Object.values(TotalCostTests).forEach((f) => { results.push(f.call()); });

        let finalResult = results.reduce((bA, bB) => bA && bB, true);
        let resultStamp = finalResult ? "Y" : "N";

        TestDriver.pSpreadsheet.getSheetByName("Checklist")
            .getRange('C6')
            .setValue(resultStamp);

        TestDriver.pProjectManager.getSheetByName("Scoring")
            .getRange(TestDriver.scoringRowNumber, 13)
            .setValue(resultStamp);

        let message = finalResult ? "PASS" : "FAIL";
        Logger.Log("\n\tAmazonPurchaseTest -- TotalCostTest: " + message + '\n');
        return finalResult;
    },

    RunAverageCostTest: function () {
        Logger.Log("\tAmznPurchaseTest -- Running AverageCostTest... \n");

        const results = new Array();
        Object.values(AverageCostTests).forEach((f) => { results.push(f.call()); });

        let finalResult = results.reduce((bA, bB) => bA && bB, true);
        let resultStamp = finalResult ? "Y" : "N";

        TestDriver.pSpreadsheet.getSheetByName("Checklist")
            .getRange('C7')
            .setValue(resultStamp);

        TestDriver.pProjectManager.getSheetByName("Scoring")
            .getRange(TestDriver.scoringRowNumber, 14)
            .setValue(resultStamp);

        let message = finalResult ? "PASS" : "FAIL";
        Logger.Log("\n\tAmazonPurchaseTest -- AverageCostTest: " + message + '\n');
        return finalResult;
    },

    RunMostExpensiveItemTest: function () {
        Logger.Log("\tAmznPurchaseTest -- Running MostExpensiveItemTest... \n");

        const results = new Array();
        Object.values(MostExpensiveItemTests).forEach((f) => { results.push(f.call()); });

        let finalResult = results.reduce((bA, bB) => bA && bB, true);
        let resultStamp = finalResult ? "Y" : "N";

        TestDriver.pSpreadsheet.getSheetByName("Checklist")
            .getRange('C8')
            .setValue(resultStamp);

        TestDriver.pProjectManager.getSheetByName("Scoring")
            .getRange(TestDriver.scoringRowNumber, 15)
            .setValue(resultStamp);

        let message = finalResult ? "PASS" : "FAIL";
        Logger.Log("\n\tAmazonPurchaseTest -- MostExpensiveItemTest: " + message + '\n');
        return finalResult;

    }
}
function RunStudentDataTest() {
    Logger.Log("\n---------------------------")
    Logger.Log("\nStudentDataTest: Running...")

    const results = new Array();
    let testSheet = TestDriver.pProjectManager.getSheetByName("StudentData");
    let finalResult = true;

    // delete TestSheet if it already exists
    if (testSheet) {
        TestDriver.pProjectManager.deleteSheet(testSheet);
    }

    try {
        TestDriver.pSpreadsheet.getSheetByName("StudentData")
            .copyTo(TestDriver.pProjectManager)
            .activate()
            .setName("StudentData");
    }
    catch (e) {
        //console.log(e);
        //console.log("student name: %s", TestDriver.studentName);
        TestDriver.pProjectManager
            .insertSheet()
            .activate()
            .setName("StudentData");
    }

    if (SpreadsheetApp.getActiveSheet().getRange('A1').isPartOfMerge()) {
        // quick exit if row A (blocker) has not been deleted
        Logger.Log("\tThis spreadsheet is currently blocked.")
        finalResult = false;
    }
    else {
        // otherwise, run test as normal
        for (const [name, f] of Object.entries(StudentDataTests)) {
            // let singleTestTimer = Date.now();
            results.push(f.call());
            // //console.log("%s run time: %s sec", name, (Date.now() - singleTestTimer) / 1000);
        }

        finalResult = results.reduce((bA, bB) => bA && bB, true);
    }

    let message = finalResult ? "ALL TESTS PASS" : "FAIL";
    Logger.Log("StudentDataTest: " + message);
}

StudentDataTests =
{
    setup: function () {
        this.ss = SpreadsheetApp.getActive();
        this.sheet = this.ss.getActiveSheet();

        return true;
    },

    RunDoubleSortedTest: function () {
        Logger.Log("\tStudentDataTest -- Running DoubleSortTest... \n");

        const results = new Array();
        Object.values(SDDoubleSortTests).forEach((f) => { results.push(f.call()); });

        let finalResult = results.reduce((bA, bB) => bA && bB, true);
        let resultStamp = finalResult ? "Y" : "N";

        TestDriver.pSpreadsheet.getSheetByName("Checklist")
            .getRange('C12')
            .setValue(resultStamp);

        TestDriver.pProjectManager.getSheetByName("Scoring")
            .getRange(TestDriver.scoringRowNumber, 16)
            .setValue(resultStamp);

        let message = finalResult ? "PASS" : "FAIL";
        Logger.Log("\n\tStudentDataTest -- DoubleSortTest: " + message + '\n');
        return finalResult;
    },

    RunStudentHeadersTest: function () {
        Logger.Log("\tStudentDataTest -- Running StudentHeaderTest... \n");

        const results = new Array();
        Object.values(SDHeaderTests).forEach((f) => { results.push(f.call()); });

        let finalResult = results.reduce((bA, bB) => bA && bB, true);
        let resultStamp = finalResult ? "Y" : "N";

        TestDriver.pSpreadsheet.getSheetByName("Checklist")
            .getRange('C13')
            .setValue(resultStamp);

        TestDriver.pProjectManager.getSheetByName("Scoring")
            .getRange(TestDriver.scoringRowNumber, 17)
            .setValue(resultStamp);

        let message = finalResult ? "PASS" : "FAIL";
        Logger.Log("\n\tStudentDataTest -- HeaderTest: " + message + '\n');
        return finalResult;
    },

    RunTotalSatTest: function () {
        Logger.Log("\tStudentDataTest -- Running TotalSATTest... \n");

        const results = new Array();
        Object.values(TotalSATTests).forEach((f) => { results.push(f.call()); });

        let finalResult = results.reduce((bA, bB) => bA && bB, true);
        let resultStamp = finalResult ? "Y" : "N";

        TestDriver.pSpreadsheet.getSheetByName("Checklist")
            .getRange('C14')
            .setValue(resultStamp);

        TestDriver.pProjectManager.getSheetByName("Scoring")
            .getRange(TestDriver.scoringRowNumber, 18)
            .setValue(resultStamp);

        let message = finalResult ? "PASS" : "FAIL";
        Logger.Log("\n\tStudentDataTest -- TotalSATTest: " + message + '\n');
        return finalResult;
    },

    RunPassChemistryTest: function () {
        Logger.Log("\tStudentDataTest -- Running PassChemistryTest... \n");

        const results = new Array();
        Object.values(PassChemistryTests).forEach((f) => { results.push(f.call()); });

        let finalResult = results.reduce((bA, bB) => bA && bB, true);
        let resultStamp = finalResult ? "Y" : "N";

        TestDriver.pSpreadsheet.getSheetByName("Checklist")
            .getRange('C15')
            .setValue(resultStamp);

        TestDriver.pProjectManager.getSheetByName("Scoring")
            .getRange(TestDriver.scoringRowNumber, 19)
            .setValue(resultStamp);

        let message = finalResult ? "PASS" : "FAIL";
        Logger.Log("\n\tStudentDataTest -- PassChemistryTest: " + message + '\n');
        return finalResult;
    },

    RunSiblingsTest: function () {
        Logger.Log("\tStudentDataTest -- Running SiblingTest... \n");

        const results = new Array();
        Object.values(SiblingTest).forEach((f) => { results.push(f.call()); });

        let finalResult = results.reduce((bA, bB) => bA && bB, true);
        let resultStamp = finalResult ? "Y" : "N";

        TestDriver.pSpreadsheet.getSheetByName("Checklist")
            .getRange('C16')
            .setValue(resultStamp);

        TestDriver.pProjectManager.getSheetByName("Scoring")
            .getRange(TestDriver.scoringRowNumber, 20)
            .setValue(resultStamp);

        let message = finalResult ? "PASS" : "FAIL";
        Logger.Log("\n\tStudentDataTest -- SiblingTest: " + message + '\n');
        return finalResult;
    },

    RunAverageGPATest: function () {
        Logger.Log("\tStudentDataTest -- Running AverageGPATest... \n");

        const results = new Array();
        Object.values(AverageGPATest).forEach((f) => { results.push(f.call()); });

        let finalResult = results.reduce((bA, bB) => bA && bB, true);
        let resultStamp = finalResult ? "Y" : "N";

        TestDriver.pSpreadsheet.getSheetByName("Checklist")
            .getRange('C17')
            .setValue(resultStamp);

        TestDriver.pProjectManager.getSheetByName("Scoring")
            .getRange(TestDriver.scoringRowNumber, 21)
            .setValue(resultStamp);

        let message = finalResult ? "PASS" : "FAIL";
        Logger.Log("\n\tStudentDataTest -- AverageGPATest: " + message + '\n');
        return finalResult;
    },

    RunLookupTest: function () {
        Logger.Log("\tStudentDataTest -- Running LookupTest... \n");

        const results = new Array();
        Object.values(LookupTest).forEach((f) => { results.push(f.call()); });

        let finalResult = results.reduce((bA, bB) => bA && bB, true);
        let resultStamp = finalResult ? "Y" : "N";

        TestDriver.pSpreadsheet.getSheetByName("Checklist")
            .getRange('C18')
            .setValue(resultStamp);

        TestDriver.pProjectManager.getSheetByName("Scoring")
            .getRange(TestDriver.scoringRowNumber, 22)
            .setValue(resultStamp);

        let message = finalResult ? "PASS" : "FAIL";
        Logger.Log("\n\tStudentDataTest -- LookupTest: " + message + '\n');
        return finalResult;
    },

    RunCellDataValidationTest: function () {
        Logger.Log("\tStudentDataTest -- Running CellDataValidationTest... \n");

        const results = new Array();
        Object.values(CellDataValidationTest).forEach((f) => { results.push(f.call()); });

        let finalResult = results.reduce((bA, bB) => bA && bB, true);
        let resultStamp = finalResult ? "Y" : "N";

        TestDriver.pSpreadsheet.getSheetByName("Checklist")
            .getRange('C19')
            .setValue(resultStamp);

        TestDriver.pProjectManager.getSheetByName("Scoring")
            .getRange(TestDriver.scoringRowNumber, 23)
            .setValue(resultStamp);

        let message = finalResult ? "PASS" : "FAIL";
        Logger.Log("\n\tStudentDataTest -- CellDataValidationTest: " + message + '\n');
        return finalResult;
    }
}





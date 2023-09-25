AverageCostTests =
{
    setup: function () {
        this.ss = SpreadsheetApp.getActive();
        this.sheet = ss.getActiveSheet();

        // lambdas to filter out empty data
        this.valueFilter = (value) => value !== '';
        this.isRowEmpty = (row) => row.filter(valueFilter).length != 0;

        this.dataArray = this.sheet
            .setActiveSelection('A2:G')
            .getValues()
            .map(row => row.map(cell => cell.toString().replaceAll(" ", ""))) // <-- address random whitespace cells
            .filter(this.isRowEmpty);

        this.bSumCompleted = this.sheet.getRange('J1').getFormula() !== "";

        if (this.dataArray.length > 0) {
            this.numRows = this.dataArray.length;
            this.bNonemptyData = true;
        }
        else {
            this.numRows = 1;
            this.bNonemptyData = false;
        }

        // dot prouct lambda
        this.dot = (a, b) => a.map((x, i) => a[i] * b[i]).reduce((m, n) => m + n);

        this.unitPriceColumn = this.sheet.getRange(2, 5, this.numRows, 1);
        this.quantityColumn = this.sheet.getRange(2, 6, this.numRows, 1);
        this.sumCell = this.sheet.getRange('J1');
        this.averageCell = this.sheet.getRange('J2');

        this.bCorrectlySetup = this.bNonemptyData && this.bSumCompleted;
        return bCorrectlySetup;
    },

    CheckAverageLabel: function () {
        let bAverageLabeled = true;

        try {
            let label = this.ss.getRange('I2')
                .getValue()
                .toLowerCase()
                .replaceAll(" ", "");

            bAverageLabeled = label == "averagecostperitem";

        }
        catch (error) {
            //console.log("unexpected value in I2 for student [%s], url [%s]", TestDriver.studentName, TestDriver.pProjectFile.getUrl());
            //console.log(error);
            bAverageLabeled = false;
        }

        let message = bAverageLabeled && this.bCorrectlySetup ? "PASS" : "FAIL";
        Logger.Log("\t\t" + message + " -- Check I2 Labeled \"Average Cost per Item\"");
        return bAverageLabeled;
    },

    CheckAverageCorrect: function () {
        if (!this.bCorrectlySetup) {
            Logger.Log("\t\tFAIL -- Check Average Calculation Is Correct");
            return false;
        }

        let sum = this.sumCell.getValue();
        let quantitySum = this.quantityColumn.getValues()
            .flat()
            .reduce((a, b) => a + b, 0);
        let calculatedAverage = this.averageCell.getValue();

        let bAverageCorrectlyCalculated = (Math.abs(sum / quantitySum - calculatedAverage) < 0.01);
        let message = bAverageCorrectlyCalculated && this.bCorrectlySetup ? "PASS" : "FAIL";
        Logger.Log("\t\t" + message + " -- Check Average Calculation Is Correct");
        return bAverageCorrectlyCalculated;
    },

    CheckAverageIsRobust: function () {
        if (!this.bCorrectlySetup) {
            Logger.Log("\t\tFAIL -- Check Average Calculation Is Robust");
            return false;
        }

        let arrRandomQuantities = new Array();
        for (let i = 0; i < this.numRows; i++) {
            arrRandomQuantities.push([Math.trunc(Math.random() * 10)]);
        }

        // set the quantity column to random numbers
        this.quantityColumn.setValues(arrRandomQuantities);
        // let bAverageIsRobust = true;

        // let newSum = 0;
        // let newQuantitySum = 0;
        // for (let i = 0; i < this.quantityColumn.length; i++)
        // {
        //   newSum += this.quantityColumn[i] * this.unitPriceColumn[i];
        //   newQuantitySum += this.quantityColumn[i];      
        // }

        let sum = this.sumCell.getValue();
        let quantitySum = this.quantityColumn.getValues()
            .flat()
            .reduce((a, b) => a + b, 0);
        let calculatedAverage = this.averageCell.getValue();

        let bAverageIsRobust = (Math.abs(sum / quantitySum - calculatedAverage) < 0.01);
        let message = bAverageIsRobust && this.bCorrectlySetup ? "PASS" : "FAIL";
        Logger.Log("\t\t" + message + " -- Check Average Calculation Is Robust");
        return bAverageIsRobust;
    }
}
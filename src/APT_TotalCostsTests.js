TotalCostTests =
{
    setup: function () {
        this.ss = SpreadsheetApp.getActive();
        this.sheet = ss.getActiveSheet();

        // lambdas to filter out empty data
        const valueFilter = (value) => value !== '';
        const isRowEmpty = (row) => row.filter(valueFilter).length != 0;

        this.dataArray = this.sheet
            .setActiveSelection('A2:G')
            .getValues()
            .map(row => row.map(cell => cell.toString().replaceAll(" ", ""))) // <-- address random whitespace cells
            .filter(this.isRowEmpty);

        if (this.dataArray.length > 0) {
            this.numRows = this.dataArray.length;
            this.bNonemptyData = true;
        }
        else {
            this.numRows = 1;
            this.bNonemptyData = false;
        }

        this.bSumUsesFormula = false;

        return true;
    },

    CheckTotalLabel: function () {
        let label = this.ss.getRange('I1')
            .getValue()
            .toLowerCase()
            .replaceAll(" ", "");

        let bValidLabel = label === "totalcost";
        let message = bValidLabel && this.bNonemptyData ? "PASS" : "FAIL";
        Logger.Log("\t\t" + message + " -- Check I1 Labeled \"Total Cost\"");
        return bValidLabel;
    },

    CheckSumIsCorrect: function () {
        const valueFilter = (value) => value !== '';

        let sum = this.sheet
            .getRange(2, 7, this.numRows, 1)
            .getValues()
            .flat()
            .filter(valueFilter)
            .reduce((a, b) => a + b, 0);

        let bSumIsCorrect = this.sheet
            .getRange('J1')
            .getValue() == sum;

        let message = bSumIsCorrect && this.bNonemptyData ? "PASS" : "FAIL";
        Logger.Log("\t\t" + message + " -- Check Sum Is Correct");
        return bSumIsCorrect;
    },

    CheckSumUsesFormula: function () {
        let bSumUsesFormula = this.sheet
            .getRange('J1')
            .getFormula() !== '';

        let message = bSumUsesFormula && this.bNonemptyData ? "PASS" : "FAIL";
        Logger.Log("\t\t" + message + " -- Check Sum Calculated with a Formula");
        this.bSumUsesFormula = bSumUsesFormula;
        return bSumUsesFormula;
    },

    CheckSumFormulaIsRobust: function () {
        //early out if the previous tests failed
        if (!this.bSumUsesFormula) {
            Logger.Log("\t\tFAIL -- Check Sum Formula Is Robust");
            return false;
        }

        // get the subtotals array and store the formulas
        let arrRowSubtotals = this.sheet
            .getRange(2, 7, this.numRows, 1);
        let arrRowSubtotalsFormulas = arrRowSubtotals.getFormulas();
        let arrRowSubtotalsValues = arrRowSubtotals.getValues();

        // make an array of random numbers & calculate its sum
        let arrRandomValues = new Array();

        for (let i = 0; i < this.numRows; i++) {
            arrRandomValues.push([Math.trunc(Math.random() * 10000) / 100]);
        }

        let sumRandomValues = arrRandomValues
            .flat()
            .reduce((a, b) => a + b, 0);

        // change the spreadsheet to random values
        arrRowSubtotals.setValues(arrRandomValues);

        // check if the sum adjusted to match the sum of the random values
        let bSumFormulaIsDynamic = this.sheet
            .getRange('J1')
            .getValue() == sumRandomValues;

        // return the spreadsheet to its original state
        arrRowSubtotals.setFormulas(arrRowSubtotalsFormulas);
        for (let i = 0; i < this.numRows; i++) {
            let cell = arrRowSubtotals.getCell(i + 1, 1);
            if (cell.getValue() === '') {
                cell.setValue(arrRowSubtotalsValues[i][0]);
            }
        }

        let message = bSumFormulaIsDynamic && this.bNonemptyData ? "PASS" : "FAIL";
        Logger.Log("\t\t" + message + " -- Check Sum Formula Is Robust");
        return bSumFormulaIsDynamic;
    },

    CheckDataNonempty: function () {
        return this.bNonemptyData;
    }
}
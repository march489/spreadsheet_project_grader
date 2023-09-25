RowSubtotalTests =
{
    setup: function () {
        this.ss = SpreadsheetApp.getActive();
        this.sheet = this.ss.getActiveSheet();

        // lambdas to filter out empty data
        this.valueFilter = (value) => value !== '';
        this.isRowEmpty = (row) => row.filter(this.valueFilter).length != 0;

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

        // this.dataRange = this.sheet.getRange(2, 1, this.numRows, 7);

        // get the relevant columns.
        this.unitPriceRange = this.sheet.getRange(2, 5, this.numRows, 1);
        this.quantityRange = this.sheet.getRange(2, 6, this.numRows, 1);
        this.rowTotalRange = this.sheet.getRange(2, 7, this.numRows, 1);

        return true;
    },

    CheckProducts: function () {
        let arrUnitPrices = this.unitPriceRange.getValues().flat().filter(this.valueFilter);
        let arrQuantities = this.quantityRange.getValues().flat().filter(this.valueFilter);
        let arrTotals = this.rowTotalRange.getValues().flat().filter(this.valueFilter);


        let bUnitPricesValid = arrUnitPrices.length == this.numRows;
        let bQuantitiesValid = arrQuantities.length == this.numRows;
        let bTotalsValid = arrTotals.length == this.numRows;

        if (!bUnitPricesValid || !bQuantitiesValid || !bTotalsValid) {
            Logger.Log("\t\tFAIL -- Check Subtotals Are Calculated Correctly");
            return false;
        }

        for (let i = 0; i < this.numRows; i++) {
            if (arrUnitPrices[i] * arrQuantities[i] != arrTotals[i]) {
                Logger.Log("\t\tFAIL -- Check Subtotals Are Calculated Correctly");
                return false;
            }
        }

        Logger.Log("\t\t\PASS -- Check Subtotals Are Calculated Correctly");
        return true;
    },


    //// <-- REFACTOR: Should check robustness by changing values, not checking formula string literal -->
    //// <-- REFACTOR: Check for AutoFill down on formulas                                             -->
    CheckFormulas: function () {
        let arrTotalFormulas = this.rowTotalRange.getFormulas()
            .flat()
            .filter(this.valueFilter)
            .map((f) => f.toUpperCase().replaceAll(" ", ""));

        if (arrTotalFormulas.length != this.numRows) {
            Logger.Log("\t\tFAIL -- Check Subtotals Calculated as Product Formulas");
            return false;
        }

        let bArrValidFormulas = new Array();
        for (let i = 0; i < this.numRows; i++) {
            let testString1 = `=E${i + 2}*F${i + 2}`;
            let testString2 = `=F${i + 2}*E${i + 2}`;
            if (testString1 != arrTotalFormulas[i] && testString2 != arrTotalFormulas[i]) {
                Logger.Log("\t\tFAIL -- Check Subtotals Calculated as Product Formulas");
                return false;
            }
        }

        Logger.Log("\t\tPASS -- Check Subtotals Calculated as Product Formulas");
        return true;
    },

    CheckDataNonempty: function () {
        return this.bNonemptyData;
    }
}
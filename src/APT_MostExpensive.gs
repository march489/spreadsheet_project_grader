MostExpensiveItemTests =
{
    setup: function () {
        this.ss = SpreadsheetApp.getActive();
        this.sheet = this.ss.getActiveSheet();

        // lambdas to filter out empty data
        this.valueFilter = (value) => value !== '';
        this.isRowEmpty = (row) => row.filter(valueFilter).length != 0;

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

        this.itemNameRange = this.sheet.getRange(2, 1, this.numRows, 1);
        this.itemNameArray = this.itemNameRange.getValues().flat();

        this.unitPriceArray = this.sheet.getRange(2, 5, this.numRows, 1).getValues().flat();
        this.maxUnitPrice = Math.max.apply(null, this.unitPriceArray);
        this.maxUnitPriceIndex = this.unitPriceArray.indexOf(this.maxUnitPrice);

        this.studentAnswerCell = this.sheet.getRange('J3');

        this.testCellK3 = this.sheet.getRange('K3').getCell(1, 1);
        let endRow = 1 + this.numRows;
        this.testCellK3.setFormula(`=INDEX(A2:A${endRow}, MATCH(MAX(E2:E${endRow}),E2:E${endRow},0),1)`);

        return this.bNonemptyData;
    },

    CheckMostExpensiveItemIsCorrect: function () {
        let studentAnswer = this.studentAnswerCell.getValue();
        let result = (studentAnswer == this.itemNameArray[this.maxUnitPriceIndex]);
        let message = result ? "PASS" : "FAIL";
        Logger.Log("\t\t" + message + " -- Check Most Expensive Item Is Correct");
        return result;
    },

    CheckMostExpensiveItemFormulaIsRobust: function () {
        for (let i = 0; i < this.numRows; i++) {
            let newPrice = this.maxUnitPrice + (i + 1);
            this.unitPriceRange.getCell(i + 1, 1).setValue(newPrice);

            let studentAnswer = this.studentAnswerCell.getValue();
            let rightAnswer = this.testCellK3.getValue();

            if (studentAnswer != rightAnswer) {
                //console.log(i + ", new price: " + newPrice);
                //console.log("wrong most expensive, expected [%s], got [%s]", rightAnswer, studentAnswer);
                Logger.Log("\t\tFAIL -- Check Most Expensive Item Formula Is Robust");
                return false;
            }
        }

        Logger.Log("\t\tPASS -- Check Most Expensive Item Formula Is Robust");
        return true;
    }
}
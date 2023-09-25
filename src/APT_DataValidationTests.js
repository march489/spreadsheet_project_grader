DataValidationTests =
{
    setup: function () {
        this.ss = SpreadsheetApp.getActive();
        this.sheet = ss.getActiveSheet();

        // lambdas to filter out empty data
        this.valueFilter = (value) => value != '';
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

        return true;
    },

    CheckAtLeastTenRows: function () {
        let bAtLeastTenRows = this.numRows >= 10;
        let message = bAtLeastTenRows && this.bNonemptyData ? "PASS" : "FAIL";
        Logger.Log("\t\t" + message + " -- Check At Least 10 Rows of Data");
        return bAtLeastTenRows;
    },

    CheckAllCellsNonempty: function () {
        // const valueFilter = (value) => value !== '';
        let numCells = 7 * this.numRows;

        let bTableAllNonempty = this.dataArray.flat()
            .filter(this.valueFilter)
            .length == numCells;

        let message = bTableAllNonempty && this.bNonemptyData ? "PASS" : "FAIL";
        Logger.Log("\t\t" + message + " -- Check No Empty Data Cells");
        return bTableAllNonempty;
    },

    CheckHyperlinkText: function () {
        // const valueFilter = (value) => value !== '';

        let hyperlinkRange = this.sheet.getRange(2, 2, this.numRows, 1);
        if (hyperlinkRange.getValues().filter(this.valueFilter).length != this.numRows) {
            Logger.Log("\t\tFAIL -- Check Hyperlink Text is \"link\"");
            return false;
        }

        let arrLinkTexts = hyperlinkRange.getValues()
            .flat()
            .map(s => s.toLowerCase())
            .map(s => s.replaceAll(" ", ""));

        for (let i = 0; i < arrLinkTexts.length; i++) {
            if (arrLinkTexts[i] != "link") {
                Logger.Log("\t\tFAIL -- Check Hyperlink Text is \"link\"");
                return false;
            }
        }

        Logger.Log("\t\tPASS -- Check Hyperlink Text is \"link\"");
        return true;
    },

    CheckHyperlinksAreFunctions: function () {
        // const valueFilter = (value) => value !== '';

        let hyperlinkRange = this.sheet.getRange(2, 2, this.numRows, 1);
        if (hyperlinkRange.getFormulas().filter(this.valueFilter).length != this.numRows) {
            Logger.Log("\t\tFAIL -- Check Hyperlinks Are Functions");
            return false;
        }

        let bCorrectLinks = true;
        let hyperlinkArray = hyperlinkRange.getFormulas()
            .flat();

        for (const link of hyperlinkArray) {
            if (!link.toLowerCase().replaceAll(' ', '').startsWith('=hyperlink(')) {
                //console.log(link.toLowerCase().replaceAll(' ', ''));
                bCorrectLinks = false;
                break;
            }
        }

        // let bCorrectLinks = hyperlinkRange.getFormulas()
        //   .flat()
        //   .map(s => s.toLowerCase()
        //     .replaceAll(" ", "")
        //     .startsWith('=hyperlink('))
        //   .reduce((a,b) => a && b, true);

        let message = bCorrectLinks && this.bNonemptyData ? "PASS" : "FAIL";
        Logger.Log("\t\t" + message + " -- Check Hyperlinks Are Functions");
        return bCorrectLinks;
    },

    CheckValidDates: function () {
        // const valueFilter = (value) => value !== '';
        const isValidDate = (d) => {
            if (Object.prototype.toString.call(d) != "[object Date]") {
                return false;
            }
            else {
                return !isNaN(d.getTime());
            }
        }

        let bValidDates = this.sheet
            .getRange(2, 4, this.numRows, 1)
            .getValues()
            .flat()
            .filter(this.valueFilter)
            .map(isValidDate)
            .reduce((a, b) => a && b, true);

        let message = bValidDates && this.bNonemptyData ? "PASS" : "FAIL";
        Logger.Log("\t\t" + message + " -- Check All Dates Are Valid");
        return bValidDates;
    },

    CheckConsistentDateFormat: function () {
        // const valueFilter = (value) => value !== '';
        const onlyUnique = (val, index, self) => {
            return self.indexOf(val) === index;
        }

        let bSingleDateFormat = this.sheet
            .getRange(2, 4, this.numRows, 1)
            .getNumberFormats()
            .flat()
            .filter(this.valueFilter)
            .map(s => s.toLowerCase())
            .filter(onlyUnique)
            .length == 1;

        let message = bSingleDateFormat && this.bNonemptyData ? "PASS" : "FAIL";
        Logger.Log("\t\t" + message + " -- Check Date Formats Are Consistent");
        return bSingleDateFormat;
    },

    CheckUnitPricesFormattedAsCurrency: function () {
        // const valueFilter = (value) => value !== '';

        let bUnitPricesValidFormat = this.sheet
            .getRange(2, 5, this.numRows, 1)
            .getNumberFormats()
            .flat()
            .filter(this.valueFilter)
            .map(s => s === '"$"#,##0.00')
            .reduce((a, b) => a && b, true);

        let message = bUnitPricesValidFormat && this.bNonemptyData ? "PASS" : "FAIL";
        Logger.Log("\t\t" + message + " -- Check Unit Prices Written as Currency");
        return bUnitPricesValidFormat;
    },

    CheckRowSubtotalsFormattedAsCurrency: function () {
        // const valueFilter = (value) => value !== '';

        let bSubtotalsValidFormat = this.sheet
            .getRange(2, 7, this.numRows, 1)
            .getNumberFormats()
            .flat()
            .filter(this.valueFilter)
            .map(s => s === '"$"#,##0.00')
            .reduce((a, b) => a && b, true);

        let message = bSubtotalsValidFormat && this.bNonemptyData ? "PASS" : "FAIL";
        Logger.Log("\t\t" + message + " -- Check Subtotals Written as Currency");
        return bSubtotalsValidFormat;
    },

    CheckUnitPricesSortedHighLow: function () {
        // const valueFilter = (value) => value !== '';

        let sortedPrices = this.sheet
            .getRange(2, 5, this.numRows, 1)
            .getValues()
            .flat()
            .filter(this.valueFilter)
            .sort(function (a, b) { return b - a; });

        let unsortedPrices = this.sheet
            .getRange(2, 5, this.numRows, 1)
            .getValues()
            .flat()
            .filter(this.valueFilter);

        let finalResult = true;
        for (let i = 0; i < this.numRows; i++) {
            if (unsortedPrices[i] != sortedPrices[i]) {
                finalResult = false;
                break;
            }
        }

        let message = finalResult && this.bNonemptyData ? "PASS" : "FAIL";
        Logger.Log("\t\t" + message + " -- Check Unit Prices Are Sorted High to Low");
        return finalResult;
    },

    CheckDataNonempty: function () {
        return this.bNonemptyData;
    }
}
CellDataValidationTest =
{
    setup: function () {
        this.ss = SpreadsheetApp.getActive();
        this.sheet = this.ss.getActiveSheet();

        this.studentAnswerCell = this.sheet.getRange('N3')
        this.nameEntryCell = this.sheet.getRange('M3');

        return true;
    },

    CheckCellHasDataValidationActive: function () {
        let result = this.nameEntryCell.getCell(1, 1).getDataValidation() != null;
        let message = result ? "PASS" : "FAIL";
        Logger.Log("\t\t" + message + " -- Check Cell M3 Has Data Validation Active");
        return result;
    },

    CheckInvalidInput: function () {
        let result = false;

        try {
            this.nameEntryCell.setValue('invalidvalue');
            SpreadsheetApp.flush()
        }
        catch (error) {
            result = true;
        }
        finally {
            let message = result ? "PASS" : "FAIL";
            Logger.Log("\t\t" + message + " -- Check Invalid Value Throws Error Message");
            return result;
        }
    }
}
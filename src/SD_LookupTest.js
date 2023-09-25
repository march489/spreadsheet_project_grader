LookupTest =
{
    setup: function () {
        this.ss = SpreadsheetApp.getActive();
        this.sheet = this.ss.getActiveSheet();

        this.studentAnswerCell = this.sheet.getRange('N3')
        this.nameEntryCell = this.sheet.getRange('M3');

        this.arrStudentNames = this.sheet.getRange('A2:A31').getValues().flat();
        this.arrStudentScores = this.sheet.getRange('I2:I31').getValues().flat();

        return true;
    },

    CheckValidInputs: function () {
        for (const [index, name] of this.arrStudentNames.entries()) {
            try {
                this.nameEntryCell.setValue(name);

                if (this.studentAnswerCell.getValue() != this.arrStudentScores[index]) {
                    //console.log("for student [%s] expected [%s] got [%s]", name, this.arrStudentScores[index], this.studentAnswerCell.getValue());
                    Logger.Log("\t\tFAIL -- Check All Student Names Return Their Correct Test Scores")
                    return false;
                }
            }
            catch (error) {
                //console.log(error + " -- data validation rejected name [%s] as invalid", name);
                //console.log("Student [%s] entered data validation range manually & typoed", TestDriver.studentName);
            }

        }

        Logger.Log("\t\tPASS -- Check All Student Names Return Their Correct Test Scores")
        return true;
    },

    CheckInvalidInput: function () {
        let result = false;

        try {
            this.nameEntryCell.setValue('invalidvalue');
            SpreadsheetApp.flush()
            result = (this.studentAnswerCell.getValue().replaceAll(" ", "") == '#N/A');
        }
        catch (error) {
            result = true;
        }
        finally {
            let message = result ? "PASS" : "FAIL";
            Logger.Log("\t\t" + message + " -- Check Invalid Value Is Rejected");
            return result;
        }
    }
}
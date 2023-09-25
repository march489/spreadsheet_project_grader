SiblingTest =
{
    setup: function () {
        this.ss = SpreadsheetApp.getActive();
        this.sheet = this.ss.getActiveSheet();

        this.studentAnswerCell = this.sheet.getRange('M1')
        this.answerKeyCell = this.sheet.getRange('N1');

        this.studentFormula = this.studentAnswerCell.getFormula();
        this.answerKeyCell.setFormula('=SUMIF(C2:C31, "Math", D2:D31)');

        return true;
    },

    CheckNumberOfMathSiblings: function () {
        let studentAnswer = this.studentAnswerCell.getValue();
        let correctAnswer = this.answerKeyCell.getValue();

        let result = (studentAnswer == correctAnswer);
        let message = result ? "PASS" : "FAIL";
        Logger.Log("\t\t" + message + " -- Check Total Number of Math Siblings");
        return result;
    },

    CheckFormulaWorksForOtherMajors: function () {
        if (this.studentFormula == "") {
            Logger.Log("\t\tFAIL -- Check Formula Robust when \"Math\" Swapped with Other Majors");
            return false;
        }

        const arrOtherMajors = ['Art', 'English', 'Physics']
        for (major of arrOtherMajors) {
            // update their formula
            let newStudentFormula = this.studentFormula.toLowerCase().replaceAll("math", major);
            this.studentAnswerCell.setFormula(newStudentFormula);

            // update my formula
            this.answerKeyCell.setFormula('=SUMIF(C2:C31, "' + major + '", D2:D31)');

            let studentAnswer = this.studentAnswerCell.getValue();
            let correctAnswer = this.answerKeyCell.getValue();

            let result = (studentAnswer == correctAnswer);
            if (!result) {
                Logger.Log("\t\tFAIL -- Check Formula Robust when \"Math\" Swapped with Other Majors");
                return false;
            }

            // reset student formula
            this.studentAnswerCell.setFormula(this.studentFormula);
        }

        Logger.Log("\t\tPASS -- Check Formula Robust when \"Math\" Swapped with Other Majors");
        return true;
    }
}
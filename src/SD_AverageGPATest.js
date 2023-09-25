AverageGPATest =
{
    setup: function () {
        this.ss = SpreadsheetApp.getActive();
        this.sheet = this.ss.getActiveSheet();

        this.studentAnswerCell = this.sheet.getRange('M2')
        this.answerKeyCell = this.sheet.getRange('N2');

        this.studentFormula = this.studentAnswerCell.getFormula();
        this.answerKeyCell.setFormula('=AVERAGEIF(B2:B31, "Freshman", E2:E31)');

        return true;
    },

    CheckFreshmanAverageGPA: function () {
        let studentAnswer = this.studentAnswerCell.getValue();
        let correctAnswer = this.answerKeyCell.getValue();

        let result = (studentAnswer == correctAnswer);
        let message = result ? "PASS" : "FAIL";
        Logger.Log("\t\t" + message + " -- Check Average Freshman GPA");
        return result;
    },

    CheckFormulaWorksForOtherYears: function () {
        if (this.studentFormula == "") {
            Logger.Log("\t\tFAIL -- Check Formula Robust when \"Freshman\" Swapped with Other Years");
            return false;
        }

        const arrOtherYears = ['Sophomore', 'Junior', 'Senior']
        for (year of arrOtherYears) {
            // update their formula
            let newStudentFormula = this.studentFormula.toLowerCase().replaceAll("freshman", year);
            this.studentAnswerCell.setFormula(newStudentFormula);

            // update my formula
            this.answerKeyCell.setFormula('=AVERAGEIF(B2:B31, "' + year + '", E2:E31)');

            let studentAnswer = this.studentAnswerCell.getValue();
            let correctAnswer = this.answerKeyCell.getValue();

            let result = (studentAnswer == correctAnswer);
            if (!result) {
                Logger.Log("\t\tFAIL -- Check Formula Robust when \"Freshman\" Swapped with Other Years");
                return false;
            }

            // reset student formula
            this.studentAnswerCell.setFormula(this.studentFormula);
        }

        Logger.Log("\t\tPASS -- Check Formula Robust when \"Math\" Swapped with Other Majors");
        return true;
    }
}
PassChemistryTests =
{
    setup: function () {
        // useful
        this.ss = SpreadsheetApp.getActive();
        this.sheet = ss.getActiveSheet();

        // lambdas
        this.valueFilter = (value) => value !== '';
        this.zipTie = (a, b) => {
            let ret = new Array();
            for (let i = 0; i < a.length; i++) {
                ret.push([a[i], b[i]]);
            }
            return ret;
        }

        // wipe and set up column K
        this.testColumnRange = this.sheet.getRange('K2:K31');
        this.testColumnRange.clear();

        // set up initial values for testing
        let topCell = this.testColumnRange.getCell(1, 1).setFormula('=IF(H2 >= 75, "PASS", 75 - H2)');
        topCell.autoFill(this.testColumnRange, SpreadsheetApp.AutoFillSeries.DEFAULT_SERIES);

        // check that they've filled in the column themselves
        this.studentChemRange = this.sheet
            .getRange('J2:J31');

        return true;
    },

    CheckChemValuesCorrect: function () {
        let correctValues = this.testColumnRange.getValues().flat()
        let studentValues = this.studentChemRange.getValues().flat()

        if (studentValues.filter(this.valueFilter).length != 30) {
            Logger.Log("\t\tFAIL -- Check Passed Chemistry Values Are Correct");
        }

        for (let i = 0; i < 30; i++) {
            if (correctValues[i] != studentValues[i]) {
                Logger.Log("\t\tFAIL -- Check Passed Chemistry Values Are Correct");
                return false;
            }
        }

        Logger.Log("\t\tPASS -- Check Passed Chemistry Values Are Correct");
        return true;
    },

    CheckChemFormulasAreRobust: function () {
        let chemScoreRange = this.sheet.getRange('H2:H31');

        // change all the chem scores
        for (let i = 0; i < 30; i++) {
            let cell = chemScoreRange.getCell(i + 1, 1);
            cell.setValue(Math.trunc(Math.random() * 1000) / 10);
        }

        let correctValues = this.testColumnRange.getValues().flat()
        let studentValues = this.studentChemRange.getValues().flat()

        if (studentValues.filter(this.valueFilter).length != 30) {
            Logger.Log("\t\tFAIL -- Check Passed Chemistry Formulas Are Robust");
            return false;
        }

        for (let i = 0; i < 30; i++) {
            if (correctValues[i] != studentValues[i]) {
                Logger.Log("\t\tFAIL -- Check Passed Chemistry Formulas Are Robust");
                return false;
            }
        }

        Logger.Log("\t\t\PASS -- Check Passed Chemistry Formulas Are Robust");
        return true;
    },

    CheckChemFormulasAreAutoFilled: function () {
        let originalFormula = this.sheet.getRange('J2').getFormula();
        let k2 = this.testColumnRange.getCell(1, 1).setFormula(originalFormula);
        k2.autoFill(this.testColumnRange, SpreadsheetApp.AutoFillSeries.DEFAULT_SERIES);

        let studentFormulas = this.studentChemRange.getFormulas().flat();
        let autofilledFormulas = this.testColumnRange.getFormulas().flat();

        for (let i = 0; i < 30; i++) {
            if (studentFormulas[i] != autofilledFormulas[i]) {
                Logger.Log("\t\tFAIL -- Check Passed Chemistry Formulas Were AutoFilled/Dragged Down");
                return false;
            }
        }

        Logger.Log("\t\tPASS -- Check Passed Chemistry Formulas Were AutoFilled/Dragged Down");
        return true;
    }
}
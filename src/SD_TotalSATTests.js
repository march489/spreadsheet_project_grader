TotalSATTests =
{
    setup: function () {
        this.ss = SpreadsheetApp.getActive();
        this.sheet = ss.getActiveSheet();
        this.valueFilter = (value) => value !== '';

        return true;
    },

    CheckSumsCorrect: function () {
        let satVerbalScores = this.sheet.getRange('F2:F31')
            .getValues()
            .flat()
            .filter(this.valueFilter);

        let satMathScores = this.sheet.getRange('G2:G31')
            .getValues()
            .flat()
            .filter(this.valueFilter);

        let satTotalScores = this.sheet.getRange('I2:I31')
            .getValues()
            .flat()
            .filter(this.valueFilter);

        let bAllDataAccountedFor =
            (satVerbalScores.length == 30) &&
            (satMathScores.length == 30) &&
            (satTotalScores.length == 30);

        if (!bAllDataAccountedFor) {
            Logger.Log("\t\tFAIL -- Check Sums Are Correct");
            return false;
        }

        // all data is correct
        let arrComparisons = new Array();
        for (let i = 0; i < 30; i++) {
            arrComparisons.push(satTotalScores[i] == satVerbalScores[i] + satMathScores[i]);
        }

        let finalResult = arrComparisons.reduce((a, b) => a && b, true);
        let message = finalResult ? "PASS" : "FAIL";
        Logger.Log("\t\t" + message + " -- Check Total SAT Scores Are Correct");
        return finalResult;
    },

    CheckSumsUseFormulas: function () {
        let finalResult = this.sheet.getRange('I2:I31')
            .getFormulas()
            .flat()
            .filter(this.valueFilter)
            .length == 30;

        let message = finalResult ? "PASS" : "FAIL";
        Logger.Log("\t\t" + message + " -- Check Total SAT Scores Calculated with Formulas");
        return finalResult;
    },

    CheckSumsRobust: function () {
        const randomSATScore = () => {
            return Math.trunc(Math.random() * 100) * 10;
        }

        const sum = (a) => a.reduce((x, y) => x + y, 0);

        const zipTie = (a, b) => {
            // must be run on lists of equal length
            let ret = new Array();
            for (let i = 0; i < a.length; i++) {
                ret.push([a[i], b[i]]);
            }
            return ret;
        }

        let randomScores = new Array();
        for (let i = 0; i < 30; i++) {
            randomScores.push([randomSATScore(), randomSATScore()]);
        }

        //push random scores to student's table
        this.sheet.getRange('F2:G31')
            .setValues(randomScores);

        // get updated sums
        let totalScores = this.sheet.getRange('I2:I31')
            .getValues()
            .flat();

        let finalResult = zipTie(randomScores.map(x => sum(x)),
            totalScores)
            .map(xs => xs[0] == xs[1]);

        let message = finalResult ? "PASS" : "FAIL";
        Logger.Log("\t\t" + message + " -- Check Total SAT Score Formulas Are Robust");
        return finalResult;
    },

    CheckSumFormulasDraggedDown: function () {
        const zipTie = (a, b) => {
            // must be run on lists of equal length
            let ret = new Array();
            for (let i = 0; i < a.length; i++) {
                ret.push([a[i], b[i]]);
            }
            return ret;
        }

        let intialTotalFormula = this.sheet.getRange('I2').getFormula();
        let testColumn = this.sheet.getRange('K2:K31');
        let k2 = testColumn.getCell(1, 1).setFormula(intialTotalFormula);
        k2.autoFill(testColumn, SpreadsheetApp.AutoFillSeries.DEFAULT_SERIES);

        let finalResult = zipTie(
            this.sheet.getRange('I2:I31').getFormulas().flat(),
            testColumn.getFormulas().flat()
        )
            .map(xs => xs[0] === xs[1]);
        // .reduce((a,b) => a && b, true);

        let message = finalResult ? "PASS" : "FAIL";
        Logger.Log("\t\t" + message + " -- Check Sum Formula In I2 Was Dragged Down (Autofilled)");
        return finalResult;
    }
}
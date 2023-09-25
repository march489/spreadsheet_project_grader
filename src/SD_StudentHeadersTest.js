SDHeaderTests =
{
    setup: function () {
        this.ss = SpreadsheetApp.getActive();
        this.sheet = ss.getActiveSheet();
        this.range = this.sheet.getRange('A1:J1');
        return true;
    },

    CheckBackgroundColor: function () {
        let bBackgroundChanged = this.range
            .getBackgrounds()
            .flat()
            .map((color) => color !== '#ffffff')
            .reduce((a, b) => a && b, true);

        let message = bBackgroundChanged ? "PASS" : "FAIL";
        Logger.Log("\t\t" + message + " -- Check Background Color");
        return bBackgroundChanged;
    },

    CheckColumnHeadings: function () {
        const referenceHeadings = [
            'studentname',
            'year',
            'major',
            'numberofsiblings',
            'gpa',
            'satverbal',
            'satmath',
            'chemistrymidtermscore',
            'totalsatscore',
            'passedchemistry'];

        let titleRowHeadings = this.range
            .getValues()
            .flat()
            .map((s) => s.toLowerCase())
            .map(s => s.replaceAll(" ", ""));

        if (referenceHeadings.length != titleRowHeadings.length) {
            //console.log("length mismatch")
            Logger.Log("\t\tFAIL -- Check Column Headings");
            return false;
        }

        // else keep going
        for (let i = 0; i < referenceHeadings.length; i++) {
            if (referenceHeadings[i] !== titleRowHeadings[i]) {
                //console.log("heading mismatch, expected: %s, got: %s", referenceHeadings[i], titleRowHeadings[i]);
                Logger.Log("\t\tFAIL -- Check Column Headings");
                return false;
            }
        }

        // everything checks out
        Logger.Log("\t\tPASS -- Check Column Headings");
        return true;
    },

    CheckHeadersBolded: function () {
        let bAllBold = this.range
            .getFontWeights()
            .flat()
            .map((s) => s === 'bold')
            .reduce((a, b) => a && b, true);

        let message = bAllBold ? "PASS" : "FAIL";
        Logger.Log("\t\t" + message + " -- Check Headers are Bolded");
        return bAllBold;
    },

    CheckHeadersCentered: function () {
        let bAllCentered = this.range
            .getHorizontalAlignments()
            .flat()
            .map((s) => s === 'center')
            .reduce((a, b) => a && b, true);

        let message = bAllCentered ? "PASS" : "FAIL";
        Logger.Log("\t\t" + message + " -- Check Headers are Centered");
        return bAllCentered;
    }
}
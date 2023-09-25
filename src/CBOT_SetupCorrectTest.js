CBOTSetupCorrectTest =
{
    setup: function () {
        this.ss = SpreadsheetApp.getActive();
        this.sheet = ss.getActiveSheet();
        this.headerRange = this.sheet.getRange('A1:E1');
        this.summaryStatsRange = this.sheet.getRange('G1:G8');
        return true;
    },

    CheckBackgroundColor: function () {
        let backgroundColors = this.headerRange.getBackgrounds().flat();

        let i = 1;
        for (color of backgroundColors) {
            if (color == '#ffffff') {
                console.log("cell %s not colored", i);
                i++;
                Logger.Log("\t\tFAIL -- Check Column Headings Have Background Color");
                return false;
            }
        }

        Logger.Log("\t\tPASS -- Check Column Headings Have Background Color");
        return true;
    },

    CheckColumnHeadings: function () {
        const referenceHeadings = [
            'date',
            'balancebeforepayment',
            'payment',
            'balanceafterpayment',
            'totalpaidtodate'];

        let titleRowHeadings = this.headerRange
            .getValues()
            .flat()
            .map((s) => s.toLowerCase())
            .map(s => s.replaceAll(" ", ""));

        if (referenceHeadings.length != titleRowHeadings.length) {
            //console.log("length mismatch")
            Logger.Log("\t\tFAIL -- Check Column Headings Correctly Labeled");
            return false;
        }

        // else keep going
        for (let i = 0; i < referenceHeadings.length; i++) {
            if (referenceHeadings[i] !== titleRowHeadings[i]) {
                console.log("heading mismatch, expected: %s, got: %s", referenceHeadings[i], titleRowHeadings[i]);
                Logger.Log("\t\tFAIL -- Check Column Headings Correctly Labeled");
                return false;
            }
        }

        // everything checks out
        Logger.Log("\t\tPASS -- Check Column Headings Correctly Labeled");
        return true;
    },

    CheckHeadersBolded: function () {
        let fontWeights = this.headerRange.getFontWeights().flat();

        for (fw of fontWeights) {
            let i = 1;
            if (fw != 'bold' && !fw) {
                console.log("cell %s not bolded", i);
                i++;
                Logger.Log("\t\tFAIL -- Check Column Headings Are Bolded");
                return false;
            }
        }

        Logger.Log("\t\tPASS -- Check Column Headings Are Bolded");
        return true;
    },

    CheckHeadersCentered: function () {
        let alignments = this.headerRange.getHorizontalAlignments().flat();

        for (a of alignments) {
            let i = 1;
            if (a != 'center' && !a) {
                console.log("cell %s not centered", i);
                i++;
                Logger.Log("\t\tFAIL -- Check Column Headings Are Centered")
                return false;
            }
        }

        Logger.Log("\t\tPASS -- Check Column Headings Are Centered");
        return true;
    },

    CheckSummaryStatsCorrectlyLabeled: function () {
        const referenceHeadings = [
            'apr',
            'minimumpaymentpercentage',
            'minimummonthlypayment',
            '',
            'monthsspentinrepayment',
            'totalamountpaid',
            'totalinterestpaid',
            'effectiveinterestrate'];


        let summaryStatsHeadings = Monad.CbotData.summaryStatHeadersValues
            .map((s) => (s != '' && s != null) ? s.toString().toLowerCase() : s)
            .map((s) => (s != '' && s != null) ? s.toString().replaceAll(" ", "") : s);

        if (referenceHeadings.length != summaryStatsHeadings.length) {
            console.log("length mismatch")
            Logger.Log("\t\tFAIL -- Check Summary Stat Headings Correctly Labeled");
            return false;
        }

        // else keep going
        for (let i = 0; i < referenceHeadings.length; i++) {
            if (referenceHeadings[i] !== summaryStatsHeadings[i]) {
                console.log("heading mismatch, expected: %s, got: %s", referenceHeadings[i], summaryStatsHeadings[i]);
                Logger.Log("\t\tFAIL -- Check Summary Stat Headings Correctly Labeled");
                return false;
            }
        }

        // everything checks out
        Logger.Log("\t\tPASS -- Check Summary Stat Headings Correctly Labeled");
        return true;
    },

    CheckSummaryStatsHeadersBolded: function () {
        for (const [index, fw] of Object.entries(Monad.CbotData.summaryStatHeadersFontWeight)) {
            let = 1;
            if (fw != 'bold' && index != 3) {
                console.log("label %s not bolded", i);
                i++;
                Logger.Log("\t\tFAIL -- Check Summary Stat Headings Are Bolded");
                return false;
            }
        }

        Logger.Log("\t\tPASS -- Check Summary Stat Headings Are Bolded");
        return true;
    },

    CheckSummaryStatsHeadersCentered: function () {
        for (const [index, a] of Object.entries(Monad.CbotData.summaryStatHeadersAlignment)) {
            if (a != 'center' && index != 3) {
                console.log("label %s not centered", index);
                Logger.Log("\t\tFAIL -- Check Summary Stat Headings Are Centered")
                return false;
            }
        }

        Logger.Log("\t\tPASS -- Check Summary Stat Headings Are Centered");
        return true;
    }
}
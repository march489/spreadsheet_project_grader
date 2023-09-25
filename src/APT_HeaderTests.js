APTHeaderTests =
{
    setup: function () {
        this.ss = SpreadsheetApp.getActive();
        this.sheet = ss.getActiveSheet();
        this.range = this.sheet.getRange('A1:G1');
        return true;
    },

    CheckBackgroundColor: function () {
        let backgroundColors = this.range.getBackgrounds().flat();

        for (color of backgroundColors) {
            if (color == '#ffffff') {
                Logger.Log("\t\tFAIL -- Check Background Color");
                return false;
            }
        }

        Logger.Log("\t\tPASS -- Check Background Color");
        return true;
    },

    CheckColumnHeadings: function () {
        const referenceHeadings = [
            'itemname',
            'link',
            'department',
            'deliverydate',
            'unitprice',
            'quantity',
            'subtotal'];

        let titleRowHeadings = this.range
            .getValues()
            .flat()
            .map((s) => s.toLowerCase())
            .map(s => s.replaceAll(" ", ""));

        if (referenceHeadings.length != titleRowHeadings.length) {
            // ////////console.log("length mismatch")
            Logger.Log("\t\tFAIL -- Check Column Headings");
            return false;
        }

        // else keep going
        for (let i = 0; i < referenceHeadings.length; i++) {
            if (referenceHeadings[i] !== titleRowHeadings[i]) {
                // ////////console.log("heading mismatch, expected: %s, got: %s", referenceHeadings[i], titleRowHeadings[i]);
                Logger.Log("\t\tFAIL -- Check Column Headings");
                return false;
            }
        }

        // everything checks out
        Logger.Log("\t\tPASS -- Check Column Headings");
        return true;
    },

    CheckHeadersBolded: function () {
        let fontWeights = this.range.getFontWeights().flat();

        for (fw of fontWeights) {
            if (fw != 'bold') {
                Logger.Log("\t\tFAIL -- Check Headers Are Bolded");
                return false;
            }
        }

        Logger.Log("\t\tPASS -- Check Headers Are Bolded");
        return true;
    },

    CheckHeadersCentered: function () {
        let alignments = this.range.getHorizontalAlignments().flat();

        for (a of alignments) {
            if (a != 'center') {
                Logger.Log("\t\tFAIL -- Check Headers Are Centered")
                return false;
            }
        }

        Logger.Log("\t\tPASS -- Check Headers Are Centered");
        return true;
    }
}
SDDoubleSortTests =
{
    CheckNamesDoubleSorted: function () {
        const sortedNames = [
            'Becky',
            'Carl',
            'Fiona',
            'Lisa',
            'Nick',
            'Patrick',
            'Thomas',
            'Alexandra',
            'Anna',
            'Benjamin',
            'Carrie',
            'Edward',
            'Joseph',
            'Karen',
            'Robert',
            'Andrew',
            'Dorothy',
            'Dylan',
            'Jonathan',
            'Josephine',
            'Pamela',
            'Stacy',
            'Will',
            'Ellen',
            'John',
            'Kevin',
            'Mary',
            'Maureen',
            'Olivia',
            'Sean'];

        let studentSortedNames = SpreadsheetApp.getActiveSheet().getRange('A2:A31')
            .getValues()
            .flat();

        let bNamedDoubleSorted = true;

        if (studentSortedNames.length != 30) {
            // in case something got deleted or blocker A row still in place
            bNamedDoubleSorted = false;
        }
        else {
            // otherwise, continue testing as normal
            for (let i = 0; i < 30; i++) {
                if (studentSortedNames[i] !== sortedNames[i]) {
                    bNamedDoubleSorted = false;
                    break;
                }
            }
        }

        let message = bNamedDoubleSorted ? "PASS" : "FAIL";
        Logger.Log("\t\t" + message + " -- Check Names Sorted First By Major Then Alphabetically");
        return bNamedDoubleSorted;
    }
}
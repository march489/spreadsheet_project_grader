Monad =
{
    Utils:
    {
        valueFilter: function (value) { return value != ''; },
        isRowEmpty: function (row) { return row.filter(Monad.Utils.valueFilter).length != 0; }
    },

    CbotData:
    {
        ss: null,
        sheet: null,
        dataArray: null,
        dataRange: null,
        numRows: null,
        bNonemptyData: null,
        summaryStatHeadersRange: null,
        summaryStatHeadersFontWeight: null,
        summaryStatHeadersAlignment: null,
        summaryStatHeadersValues: null,
        summaryStatValuesRange: null,
        apr: null,
        exponentialFunctionFormulaCell: null,   // pCell holding compound interest formula
        balanceAfterPaymentsFormulaCell: null,  // pCell holding BAP formula
        totalPaidToDateFormulaCell: null,       // pCell holid TPTD formula
        minPaymentPercentage: null, // not set up yet
        minMonthlyPayment: null,     // not set up yet
        statementDateRange: null,
        statementDateArray: null
    }
}
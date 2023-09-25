Logger =
{
    buffFeedback: "",
    feedbackFileId: "",
    pFeedbackFile: null,

    // feedback folder details
    feedbackFolderId: "***feedbackFolderDriveID****",
    feedbackFolderName: "CC Project Feedback Files",
    feedbackFolderUrl: "https://drive.google.com/FEEDBACK_FOLDER_URL",

    Log: function (message) {
        Logger.buffFeedback += message + '\n';
    },

    ClearBuffer: function () {
        Logger.buffFeedback = "";
    },

    SetFeedbackFile: function () {
        let files = DriveApp.getFolderById(Logger.feedbackFolderId)
            .searchFiles(`title contains "${TestDriver.studentEmailId}"`);

        if (files.hasNext()) {
            Logger.pFeedbackFile = files.next();
        }
        else {
            Logger.CreateFeedbackFile();

            // set permissions
            Logger.pFeedbackFile.addViewer(TestDriver.studentEmail);
        }

        // Logger.StampFeedbackFileLink();
        Logger.feedbackFileId = Logger.pFeedbackFile.getId();
        Logger.ClearFeedbackFile();

        // add header to feedback file
        Logger.AddHeaderToFeedback();
    },

    StampFeedbackFileLink: function () {
        let url = Logger.pFeedbackFile.getUrl();
        TestDriver.pSpreadsheet.getSheetByName("Checklist")
            .getRange('G1')
            .setFontSize(11)
            .setFormula('=HYPERLINK("' + url + '", "see detailed feedback")');
    },

    AddHeaderToFeedback: function () {
        let currentdate = new Date();
        let datetime = currentdate.getFullYear() + "/"
            + ((currentdate.getMonth() + 1).toString().padStart(2, 0)) + "/"
            + currentdate.getDate().toString().padStart(2, 0) + " @ "
            + currentdate.getHours().toString().padStart(2, 0) + ":"
            + currentdate.getMinutes().toString().padStart(2, 0) + ":"
            + currentdate.getSeconds().toString().padStart(2, 0) + ' CST';
        let heading = `Credit Card Project 2023: Test run at ${datetime}`;
        let nameLine = `Name:  \t\t ${TestDriver.studentName}`;
        let emailLine = `Email: \t\t ${TestDriver.studentEmail}`;
        let projectUrlLine = `Spreadsheet URL: ${TestDriver.pProjectFile.getUrl()}`;
        Logger.Log(heading);
        Logger.Log(nameLine);
        Logger.Log(emailLine);
        Logger.Log(projectUrlLine + '\n');

        // add to grading sheet
        TestDriver.pProjectManager.getSheetByName("Scoring")
            .getRange(TestDriver.scoringRowNumber, 30)
            .setValue(datetime);
    },

    CreateFeedbackFile: function () {
        Logger.pFeedbackFile = DriveApp.getFolderById(Logger.feedbackFolderId).createFile(TestDriver.feedbackFileName, "");
    },

    ClearFeedbackFile: function () {
        DriveApp.getFileById(Logger.feedbackFileId).setContent("");
    },

    Flush: function () {
        DriveApp.getFileById(Logger.feedbackFileId).setContent(Logger.buffFeedback);
        Logger.buffFeedback = "";
    }
}
TestDriver =
{
    RunAllTests: function () {
        // this.tic = Date.now();

        TestDriver.pProjectManager = SpreadsheetApp.getActive();
        Object.values(TestDriver.folderIds).forEach(folderId => {
            let files = DriveApp.getFolderById(folderId)
                .getFiles();

            while (files.hasNext()) {
                TestDriver.pProjectFile = files.next();
                TestDriver.SetCurrentSpreadsheetFile();
                console.log("test start:");
                console.log("spreadsheet name: %s", TestDriver.pProjectFile.getName());
                console.log("owner: %s", TestDriver.pSpreadsheet.getOwner());
                let editors = TestDriver.pProjectFile.getEditors()
                    .map(editor => editor.getName());
                console.log("editors: " + editors);
                let viewers = TestDriver.pProjectFile.getViewers()
                    .map(viewer => viewer.getName());
                console.log("viewers: " + viewers);

                if (TestDriver.pProjectFile.getOwner().getEmail() == 'teacheremail@cps.edu') {
                    // the student DID hit Turn IN
                    const fileName = TestDriver.pProjectFile.getName();
                    const viewers = TestDriver.pProjectFile.getViewers();
                    for (const viewer of viewers) {
                        console.log("turned in -- looking at viewers");
                        if (fileName.includes(viewer.getName())) {
                            TestDriver.studentName = viewer.getName();
                            TestDriver.studentEmail = viewer.getEmail();
                            break;
                        }
                    }

                    // console.log("we have a problem on file name [%s]", TestDriver.pSpreadsheet.getName());
                }
                else {
                    // the student DID NOT hit Turn In
                    TestDriver.studentEmail = DriveApp.getFileById(TestDriver.pFileId).getOwner().getEmail();
                    TestDriver.studentName = DriveApp.getFileById(TestDriver.pFileId).getOwner().getName();
                }

                try {
                    TestDriver.pSpreadsheet.getSheetByName('Checklist').getRange('G1');
                }
                catch (e) {
                    console.log("bugged duplicate file? [%s]", TestDriver.studentName);
                    continue;
                }


                TestDriver.studentEmailId = TestDriver.studentEmail.match("[^@]+");
                TestDriver.feedbackFileName = `${TestDriver.studentEmailId}_feedback.txt`;
                TestDriver.scoringRowNumber = 4 + TestDriver.pProjectManager
                    .getSheetByName("Scoring")
                    .getRange('A4:A160')
                    .getValues()
                    .flat()
                    .indexOf(TestDriver.studentEmail);

                console.log("Current project -- Student name: %s, Student email: %s, feedbackFileName: %s",
                    TestDriver.studentName,
                    TestDriver.studentEmail,
                    TestDriver.feedbackFileName);


                // if (TestDriver.FileLastEditedByStudent()) // <---- only run tests if files have been updated by student
                {
                    // logging deltas
                    //console.log("%s has updated their file, running tests...", TestDriver.studentName) // <-- Turn off when everyone's being graded
                    TestDriver.diffStudetList.push(TestDriver.studentName);

                    // test procedure
                    Logger.SetFeedbackFile();
                    TestDriver.ClearPreviousChecklistScores();
                    TestDriver.TestCurrentProject();
                    Logger.Flush();
                }
            }

            SpreadsheetApp.flush();
            //console.log("current run time: %d seconds", (Date.now() - this.tic) / 1000);
        })

        TestDriver.CleanUp();
        TestDriver.DumpStats();
    },

    ClearPreviousChecklistScores: function () {
        TestDriver.pSpreadsheet
            .getSheetByName("Checklist")
            .getRange('C2:C')
            .clearContent();
    },

    DumpStats: function () {
        // dump stats
        //console.log("%d students made changes since the last run:", TestDriver.diffStudetList.length);
        TestDriver.diffStudetList.forEach((name) => { console.log(name); });
        //console.log("final run time: %d seconds", (Date.now() - this.tic) / 1000);
    },

    TestCurrentProject: function () {
        // let amazonTimerStart = Date.now();
        RunAmznPurchaseTest();
        //console.log("AmazonPurchaseTest run time: %s sec", (Date.now() - amazonTimerStart) / 1000); // <-- DELETE WHEN DONE DEBUGGING
        // let studentDataTimerStart = Date.now();
        RunStudentDataTest();
        //console.log("StudentDataTest run time: %s sec", (Date.now() - studentDataTimerStart) / 1000); // <-- DELETE WHEN DONE DEBUGGING
        // let cbotTimerStart = Date.now();
        RunCBOTTest();
        //console.log("CBOT_Test run time: %s sec", (Date.now() - cbotTimerStart) / 1000); // <-- DELETE WHEN DONE DEBUGGING
    },

    SetCurrentSpreadsheetFile: function () {
        if (TestDriver.pProjectFile == null) {
            throw new ReferenceError("pCurrentProject is null");
        }

        TestDriver.pFileId = TestDriver.pProjectFile.getMimeType() == 'application/vnd.google-apps.shortcut' ?
            TestDriver.pProjectFile.getTargetId() :
            TestDriver.pProjectFile.getId();

        TestDriver.pSpreadsheet = SpreadsheetApp.openById(TestDriver.pFileId);
        TestDriver.pProjectFile = DriveApp.getFileById(TestDriver.pFileId);
    },

    FileLastEditedByStudent: function () {
        try {
            const revisions = Drive.Revisions.list(TestDriver.pProjectFile.getId());
            if (!revisions.items || revisions.items.length === 0) {
                //console.log("ALARM: No revision history found for %s", TestDriver.studentName);
            }

            // checking if MD was the last to touch the file (i.e. grade it)
            return (("Teacher Name" !== revisions.items[revisions.items.length - 1].lastModifyingUserName) ||
                ("teacheremail@cps.edu" !== revisions.items[revisions.items.length - 1].lastModifyingUser.emailAddress));

        } catch (err) {
            //console.log('Failed with error %s on student [%s]', err.message, TestDriver.studentName);
            return true;
        }
    },

    CleanUp: function () {
        try {
            let testSheet = TestDriver.pProjectManager.getSheetByName("AmazonPurchases");
            TestDriver.pProjectManager.deleteSheet(testSheet);
        }
        catch (e) {
            // do nothing
        }

        try {
            let testSheet = TestDriver.pProjectManager.getSheetByName("StudentData");
            TestDriver.pProjectManager.deleteSheet(testSheet);
        }
        catch (e) {
            // do nothing
        }

        try {
            let testSheet = TestDriver.pProjectManager.getSheetByName("CBOT");
            TestDriver.pProjectManager.deleteSheet(testSheet);
        }
        catch (e) {
            // do nothing 
        }

        try {
            let testSheet = TestDriver.pProjectManager.getSheetByName("AmazonPurchasesTestSheet");
            TestDriver.pProjectManager.deleteSheet(testSheet);
        }
        catch (e) {
            // do nothing 
        }
    },

    // state variables
    pProjectManager: null,
    pProjectFile: null,
    pSpreadsheet: null,
    feedbackFileName: "",
    studentEmail: "",
    studentEmailId: "",
    studentName: "",
    scoringRowNumber: null,
    diffStudetList: new Array(),

    // constant link
    projectManagerSpreadsheetId: "******ManagerSpreadsheetId******",

    // map of folderIds
    folderIds:
    {
        dummy: "****dummyClassFolderId****",
        first: "****firstPerFolderId****",
        second: "****secondPerFolderId****",
        cperiod: "****cPerFolderId****",
        sixth: "****sixthPerFolderId****",
        eighth: "****eighthPerFolderId****"
    }

}
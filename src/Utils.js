/** @OnlyCurrentDoc */

// Grades one student
function GradeOneStudent() {
    TestDriver.pProjectManager = SpreadsheetApp.getActive();

    // SET THE STUDENT'S NAME BELOW
    // Diamond Turner <-- remember to grade separately
    TestDriver.studentName = "Student Name";
    let fileName = TestDriver.studentName + " - Credit Card & Spreadsheet Project 2023";

    let files = DriveApp.getFilesByName(fileName);

    if (files.hasNext()) {
        TestDriver.pProjectFile = files.next();
        TestDriver.SetCurrentSpreadsheetFile();

        if (TestDriver.pProjectFile.getOwner().getEmail() == 'teacherEmail@cps.edu') {
            // the student DID hit Turn IN
            const viewers = TestDriver.pProjectFile.getViewers();
            for (const viewer of viewers) {
                if (fileName.includes(viewer.getName())) {
                    // TestDriver.studentName = viewer.getName();
                    TestDriver.studentEmail = viewer.getEmail();
                }
            }
        }
        else {
            // the student DID NOT hit Turn In
            TestDriver.studentEmail = DriveApp.getFileById(TestDriver.pFileId).getOwner().getEmail();
            // TestDriver.studentName = DriveApp.getFileById(TestDriver.pFileId).getOwner().getName();
        }

        TestDriver.studentEmailId = TestDriver.studentEmail.match("[^@]+");
        TestDriver.feedbackFileName = `${TestDriver.studentEmailId}_feedback.txt`;
        TestDriver.scoringRowNumber = 4 + TestDriver.pProjectManager
            .getSheetByName("Scoring")
            .getRange('A4:A160')
            .getValues()
            .flat()
            .indexOf(TestDriver.studentEmail);


        //console.log("Current project -- Student name: %s, Student email: %s, feedbackFileName: %s", 
        // TestDriver.studentName, 
        // TestDriver.studentEmail,
        // TestDriver.feedbackFileName);

        // if (TestDriver.FileLastEditedByStudent()) // <---- only run tests if files have been updated by student
        {
            // logging deltas
            //console.log("%s has updated their file, running tests...", TestDriver.studentName) // <-- Turn off when everyone's being graded
            TestDriver.diffStudetList.push(TestDriver.studentName);

            // test procedure
            Logger.SetFeedbackFile();
            TestDriver.TestCurrentProject();
            Logger.Flush();
        }
    }
    else {
        console.log("Project not found -- check spelling.")
    }

    // TestDriver.CleanUp();
}

function PushNewSheetToSpecificStudent() {
    let newTemplateSheetName = "StudentDataBlank";     // <--- Update/duplicate for every sheet you want to push to students
    let newSheet = SpreadsheetApp.getActive()
        .getSheetByName(newTemplateSheetName);

    let studentName = "Student Name";         // <---- student's name
    let fileName = studentName + " - Credit Card & Spreadsheet Project 2023";

    try {
        let studentProjectId = DriveApp.getFilesByName(fileName).next().getId();
        let targetSpreadsheet = SpreadsheetApp.openById(studentProjectId);
        let oldSheet = targetSpreadsheet.getSheetByName("Copy of StudentData");

        if (oldSheet != null) {
            targetSpreadsheet.deleteSheet(oldSheet);
        }

        newSheet.copyTo(targetSpreadsheet)
            .setName("Copy of StudentData")
            .activate();

        // if (newTemplateSheetName != "Checklist")
        // {
        //   targetSpreadsheet.moveActiveSheet(targetSpreadsheet.getNumSheets() - 1);
        // }
    }
    catch
    {
        //console.log("ERROR: Check name for typo, project not found.")
    }
}

function PushNewSheetToStudentFiles() {
    let newTemplateSheetName = "StudentDataExemplar";   // <--- Update/duplicate for every sheet you want to push to students
    let newSheet = SpreadsheetApp.getActive()
        .getSheetByName(newTemplateSheetName);

    Object.values(TestDriver.folderIds).forEach((folderId) => {

        let files = DriveApp.getFolderById(folderId).getFiles();

        while (files.hasNext()) {
            let ss = SpreadsheetApp.openById(files.next().getId());
            let prevSheet = null;

            // check if SS already has this sheet and remove it
            // assign prevSheet to result of get() to delete it in the if-block
            if (prevSheet = ss.getSheetByName(newTemplateSheetName)) {
                ss.deleteSheet(prevSheet);
            }

            newSheet.copyTo(ss)
                .setName(newTemplateSheetName)
                .activate();
            ss.moveActiveSheet(ss.getNumSheets() - 1) // <---- Choose where you want it to land, default adds to the end
        }
    })
}

function ProtectSheet() {
    let sheetName = "StudentDataExemplar";   // <--- Update/duplicate for every sheet you want to push to students

    Object.values(TestDriver.folderIds).forEach((folderId) => {

        let files = DriveApp.getFolderById(folderId).getFiles();

        while (files.hasNext()) {
            let ss = SpreadsheetApp.openById(files.next().getId())
                .getSheetByName(sheetName)
                .showSheet()
                .protect();
        }
    })
}



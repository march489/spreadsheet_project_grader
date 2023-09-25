# Spreadsheet Project Grader

Students in my precalculus class complete a spreadsheet project during our unit on exponential functons. As a teacher, this project has three goals:

- Students will be able to model exponential functions, and in particular, model credit card debt and repayment over time.
- Students will acquire fundamental skills with spreadsheets, including (but not limited to) formating, calculating summary statistics, control flow, lookups, sorting, and basic error handling.

Proficiency with spreadsheets, much like many other mathematical and technical skill sets, can often be a barrier for students from underprivileged backgrounds. Employers often assume that potential employees have acquired such skills, even though they are not explicitly taught in any part of the standard high school curriculum in the United States. For a lone teacher, however, it is very burdensome to efficiently give students personalized feedback on their spreadsheets by hand. 

In order to solve this problem, I wrote a script on the Google App Script extension for Google Sheets. The script opens the Google Drive folders where students' assignments are housed, grades each student's assignment, and writes the feedback both into a page of the spreadsheet where a score is calculated and into a personalized .txt file describing in detail which tests their project currently passes and fails. 

The project has three components, which are reflected in the file structure:
1. **Amazon Purchases Test (APT)**. Students do a mock shopping spree, and collect a shopping cart of at least 10 items of their choosing from Amazon, and record their items on this page of the sheet. They are expected to correctly format the sheet, sort by unit price, calculate various summary stats, and use a `LOOKUP` function.
2. **Student Data Tests (SD)**. This page holds fake student data. Students use it to practice control flow with `IF`, `AVERAGEIF`, and `SUMIF`.
3. **Card Balance Over Time (CBOT)**. Using the total from APT part of the task, students model how long it would take to completely repay their credit card balance making only minimum payments. Students are assessed on the robustness of their formulas, e.g. do the formulas they write correctly autofill when extended down a column. Only formulas that correctly adjust cell references when autofilled will pass all of the tests. 

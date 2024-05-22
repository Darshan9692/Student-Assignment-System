const catchAsyncErrors = require('../services/catchAsyncErrors');
const db = require('../config/connection');

exports.submitTask = catchAsyncErrors(async (req, res, next) => {
    const { submission } = req.files;
    const { assignment_id } = req.params;
    try {
        const user = 'SELECT * FROM users WHERE user_id = ?';
        db.query(user, [req.user], function (err, userResult) {
            if (err) {
                console.log(err);
                return res.status(401).send({ error: "Unable to fetch user" });
            }

            if (userResult.length === 0) {
                return res.status(404).send({ error: "User not found" });
            }

            const userRole = userResult[0].role;

            if (userRole == "teacher") {
                res.status(403).send({ error: "You are not authorized to submit assignments" });
            }

            const assignment = 'SELECT * FROM assignments WHERE assignment_id = ?';
            db.query(assignment, [assignment_id], function (err, assignmentResult) {
                if (err) {
                    console.log(err);
                    return res.status(401).send({ error: "Unable to fetch assignment" });
                }

                if (assignmentResult.length === 0) {
                    return res.status(404).send({ error: "Assignment not found" });
                }
                const submitAssignment = 'INSERT INTO submissions (submission,submitted_by,submitted_for) VALUES (?,?,?)';
                db.query(submitAssignment, [submission, userResult[0].user_id, assignment_id], function (err, success) {
                    if (err) {
                        console.log(err);
                        return res.status(401).send({ error: "Unable to submit" });
                    }
                    res.status(200).send({
                        success: "Task is submitted successfully"
                    });
                })
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
})

exports.giveGrade = catchAsyncErrors(async (req, res, next) => {
    const { student_id, assignment_id } = req.params;
    const { grade } = req.body;
    try {
        //First check if logged in user is teacher
        const userQuery = 'SELECT * FROM users WHERE user_id = ?';
        db.query(userQuery, [req.user], function (err, userResult) {
            if (err) {
                console.log(err);
                return res.status(401).send({ error: "Unable to fetch user" });
            }

            if (userResult.length === 0) {
                return res.status(404).send({ error: "User not found" });
            }

            const userRole = userResult[0].role;

            if (userRole !== "teacher") {
                return res.status(403).send({ error: "You are not authorized to give grades to student assignments" });
            }
            //Then check is logged in teacher have assigned assignment
            const assignmentQuery = 'SELECT * FROM assignments WHERE assignment_id = ? AND assigned_by = ?';
            db.query(assignmentQuery, [assignment_id, req.user], function (err, assignmentResult) {
                if (err) {
                    console.log(err);
                    return res.status(401).send({ error: "Unable to fetch assignment" });
                }

                if (assignmentResult.length === 0) {
                    return res.status(404).send({ error: "Assignment not found or not assigned by you" });
                }
                //Check whether student_id followed by authenticated student
                const checkStudentQuery = 'SELECT * FROM users WHERE user_id = ?';
                db.query(checkStudentQuery, [student_id], function (err, student) {
                    if (err) {
                        console.log(err);
                        return res.status(401).send({ error: "Unable to fetch student" });
                    }

                    if (student.length === 0 || student[0].role !== "student") {
                        return res.status(404).send({ error: "No student found" });
                    }

                    // If all checks pass, the teacher can give the grade to the student assignment.

                    // Update the student's assignment with the grade in your database.
                    const updateGradeQuery = 'UPDATE submissions SET grade = ? WHERE submitted_for = ? AND submitted_by = ?';
                    db.query(updateGradeQuery, [grade, assignment_id, student_id], function (err, updateResult) {
                        if (err) {
                            console.log(err);
                            return res.status(500).send({ error: "Failed to update grade" });
                        }

                        // Successfully updated the grade.
                        return res.status(200).json({ message: "Grade updated successfully" });
                    });
                });
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
});


exports.getAllSubmissions = catchAsyncErrors(async (req, res, next) => {
    try {
        const submission = 'SELECT * FROM submissions';
        db.query(submission, function (err, result) {
            if (err) {
                console.log(err);
            }
            res.status(200).send({
                success: result
            })
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
})
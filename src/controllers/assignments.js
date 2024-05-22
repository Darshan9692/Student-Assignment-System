const catchAsyncErrors = require('../services/catchAsyncErrors');
const db = require('../config/connection');
const nodemailer = require('nodemailer');

exports.sendMail = async (to, subject, html) => {
    try {
        let transporter = await nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: 'Darshanpanchal9292@gmail.com', //mailId of teacher
                pass: 'tzyutbeyqlcurvzx' //in the same email id generate custom password 
            }
        });

        await transporter.sendMail({
            from: 'Darshanpanchal9292@gmail.com', //Same email id used before
            to: to,
            subject: subject,
            html: html,
        });

    } catch (error) {
        return res.status(401).json({ error: "Unable to send email" });
    }
};

exports.addAssignments = catchAsyncErrors(async (req, res, next) => {
    const { due_date } = req.body;
    const { assignment } = req.files;
    try {
        const user = 'SELECT * FROM users WHERE user_id = ?';
        db.query(user, [req.user], function (err, result) {
            if (err) {
                console.log(err);
                return res.status(401).json({ error: "Unable to catch user" });
            }

            // Check whether current user is teacher or student
            if (result[0].role != "teacher") {
                return res.status(401).json({ error: "You are not authorized to assign assignment" });
            }

            //Able to assign assignments
            const setData = 'INSERT INTO assignments (assignment,due_date,assigned_by) VALUES (?,?,?)';
            db.query(setData, [assignment, due_date, result[0].user_id], function (err, result) {
                if (err) {
                    console.log(err);
                    return res.status(401).json({ error: "Unable to assign task" });
                }

                res.status(200).send({
                    msg: "Task is assigned successfully",
                    data: result
                });

                const students = 'SELECT * FROM users WHERE role = "student"';
                db.query(students, async function (err, allstudents) {
                    if (err) {
                        return res.status(401).json({ error: "Unable to fetch students" });
                    }
                    //After successfull assign of assignment broadcast mails to all students using nodemailer
                    for (var i = 0; i < allstudents.length; i++) {
                        const to = allstudents[i].email;
                        const subject = 'Assignment';
                        const html = `<h1>Assigned an assignment,Please go through portal to access....</h1>`;
                        await exports.sendMail(to, subject, html);
                    }
                })

            })
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
})

exports.getAssignments = catchAsyncErrors(async (req, res, next) => {
    try {
        const Assignments = 'SELECT * FROM assignments';
        // Students and teachers can access all assignments
        db.query(Assignments, function (err, result) {
            if (err) {
                console.log(err);
                return res.status(401).json({ error: "Unable to get tasks" });
            }
            res.status(200).send({
                msg: "All Assignments!!!",
                data: result
            });
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
});


exports.updateAssignments = catchAsyncErrors(async (req, res, next) => {
    try {
        const user = 'SELECT * FROM users WHERE user_id = ?';
        //Find user to check his/her role
        db.query(user, [req.user], function (err, userResult) {
            if (err) {
                console.log(err);
                return res.status(401).json({ error: "Unable to fetch user" });
            }

            if (userResult.length === 0) {
                return res.status(404).json({ error: "User not found" });
            }

            const userRole = userResult[0].role;

            if (userRole !== "teacher") {
                return res.status(401).json({ error: "You are not authorized to assign assignments" });
            }

            // Check if the assignment exists and is assigned by the current teacher
            const assignment = 'SELECT * FROM assignments WHERE assignment_id = ? AND assigned_by = ?';
            db.query(assignment, [req.params.assignment_id, req.user], function (err, assignmentResult) {
                if (err) {
                    console.log(err);
                    return res.status(401).json({ error: "Unable to fetch assignment" });
                }

                //If assignment is not assigned by logged in teacher
                if (assignmentResult.length === 0) {
                    return res.status(404).json({ error: "Assignment not found or not assigned by you" });
                }

                // Update assignment data
                var updateData = 'UPDATE assignments SET';
                var updateValues = [];

                if (req.body && req.body.due_date) {
                    updateData += ' due_date = ?';
                    updateValues.push(req.body.due_date);
                }

                if (req.files && req.files.assignment) {
                    if (updateValues.length > 0) {
                        updateData += ',';
                    }
                    updateData += ' assignment = ?';
                    updateValues.push(req.files.assignment);
                }

                updateData += ' WHERE assignment_id = ?';
                updateValues.push(assignmentResult[0].assignment_id);

                //Update data in database
                db.query(updateData, updateValues, function (err, updateResult) {
                    if (err) {
                        console.log(err);
                        return res.status(401).json({ error: "Unable to update assignment" });
                    }
                    res.status(200).json({ success: "Data Updated Successfully" });
                });
            });
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
});


exports.deleteAssignments = catchAsyncErrors(async (req, res, next) => {
    try {
        const user = 'SELECT * FROM users WHERE user_id = ?';
        db.query(user, [req.user], function (err, userResult) {
            if (err) {
                console.log(err);
                return res.status(401).json({ error: "Unable to fetch user" });
            }

            if (userResult.length === 0) {
                return res.status(404).json({ error: "User not found" });
            }

            const userRole = userResult[0].role;

            if (userRole !== "teacher") {
                return res.status(403).json({ error: "You are not authorized to delete assignment" });
            }

            // Check if the assignment exists and is assigned by the current teacher
            const assignment = 'SELECT * FROM assignments WHERE assignment_id = ? AND assigned_by = ?';
            db.query(assignment, [req.params.assignment_id, req.user], function (err, assignmentResult) {
                if (err) {
                    console.log(err);
                    return res.status(401).json({ error: "Unable to fetch assignment" });
                }

                if (assignmentResult.length === 0) {
                    return res.status(404).json({ error: "Assignment not found or not assigned by you" });
                }


                const deleteData = 'DELETE FROM assignments WHERE assignment_id = ?';
                //If assignment is assigned by logged in teacher able to delete data
                db.query(deleteData, [req.params.assignment_id], function (err, updateResult) {
                    if (err) {
                        console.log(err);
                        return res.status(401).json({ error: "Unable to delete assignment" });
                    }
                    res.status(200).json({ success: "Data Deleted Successfully" });
                });
            });
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
})


const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');
const { isAuthenticatedUser } = require('../services/auth');
const { submitTask, giveGrade, getAllSubmissions } = require('../controllers/submissions');

router.route("/submit/:assignment_id").post(isAuthenticatedUser, upload.fields([{ name: 'submission', maxCount: 5 },]), submitTask);
router.route("/student/:student_id/assignment/:assignment_id").put(isAuthenticatedUser, giveGrade);
router.route("/get-submission").get(isAuthenticatedUser,getAllSubmissions);

module.exports = router;
const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');
const { addAssignments, getAssignments, updateAssignments, deleteAssignments } = require('../controllers/assignments');
const { isAuthenticatedUser } = require('../services/auth');

router.route("/add-assignment").post(isAuthenticatedUser, upload.fields([{ name: 'assignment', maxCount: 5 },]), addAssignments);
router.route("/get-assignment").get(isAuthenticatedUser, getAssignments);
router.route("/update-assignment/:assignment_id").put(isAuthenticatedUser, upload.fields([{ name: 'assignment', maxCount: 5 },]), updateAssignments);
router.route("/delete-assignment/:assignment_id").delete(isAuthenticatedUser, deleteAssignments);

module.exports = router;
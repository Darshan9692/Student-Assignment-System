const db = require('../config/connection.js');

const createSubmissionTable = () => {
    const sql = `
    CREATE TABLE IF NOT EXISTS submissions (
        submission_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        submission BLOB,
        submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        submitted_by INT,
        submitted_for INT UNSIGNED,
        grade VARCHAR(255) DEFAULT "NOT_GIVEN",
        FOREIGN KEY (submitted_for) REFERENCES assignments(assignment_id) ON UPDATE CASCADE,
        FOREIGN KEY (submitted_by) REFERENCES users(user_id) ON UPDATE CASCADE
    )
  `;

    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Submission table created successfully');
        }
    });
};

module.exports = createSubmissionTable;

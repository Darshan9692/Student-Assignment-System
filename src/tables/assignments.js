const db = require('../config/connection.js');

const createAssignmentsTable = () => {
    const sql = `
    CREATE TABLE IF NOT EXISTS assignments (
        assignment_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        assignment BLOB,
        due_date DATE,
        assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        assigned_by INT NOT NULL,
        FOREIGN KEY (assigned_by) REFERENCES users(user_id)
        ON UPDATE CASCADE
    )
  `;

  db.query(sql, (err, results) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Assignments table created successfully');
    }
});
};

module.exports = createAssignmentsTable;

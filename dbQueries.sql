-- used to create database
CREATE DATABASE University; 

-- use database 
USE University;

-- create table users if not exists
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    role VARCHAR(255) DEFAULT 'Student'
);

-- create table assignments if not exists
CREATE TABLE IF NOT EXISTS assignments (
    assignment_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    assignment BLOB,
    due_date DATE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by INT NOT NULL,
    FOREIGN KEY (assigned_by) REFERENCES users(user_id) ON UPDATE CASCADE
);

-- create table submissions if not exists
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
CREATE DATABASE IF NOT EXISTS weintern_week2;
USE weintern_week2;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  department VARCHAR(100) NOT NULL,
  role VARCHAR(100) NOT NULL,
  salary DECIMAL(12,2) NOT NULL,
  join_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO employees (name, department, role, salary, join_date)
VALUES
('Aarav Sharma', 'Engineering', 'Software Developer', 60000, '2025-06-10'),
('Priya Patil', 'HR', 'HR Executive', 45000, '2025-07-15'),
('Rahul Deshmukh', 'Sales', 'Sales Manager', 70000, '2025-08-01');

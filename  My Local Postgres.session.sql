-- Delete tables if they exist to ensure a clean setup
DROP TABLE IF EXISTS seats;
DROP TABLE IF EXISTS users;

-- Create seats table
CREATE TABLE seats (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    isbooked INT DEFAULT 0
);

-- Insert 20 initial available seats
INSERT INTO seats (isbooked)
SELECT 0 FROM generate_series(1, 20);

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Verification selects
SELECT * FROM seats;
SELECT * FROM users;
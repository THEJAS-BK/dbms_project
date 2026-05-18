-- update_schema.sql

-- Alter courses table to support dynamic frontend fields
ALTER TABLE courses
ADD COLUMN faculty VARCHAR(100) DEFAULT 'General',
ADD COLUMN max_seats INT DEFAULT 50,
ADD COLUMN instructor VARCHAR(100) DEFAULT 'TBD',
ADD COLUMN level VARCHAR(20) DEFAULT 'Undergraduate',
ADD COLUMN status VARCHAR(50) DEFAULT 'Open';

-- Alter student_details table to support dynamic frontend fields
ALTER TABLE student_details
ADD COLUMN program VARCHAR(100) DEFAULT 'Undeclared',
ADD COLUMN level VARCHAR(20) DEFAULT 'Year 1',
ADD COLUMN gpa DECIMAL(3,2) DEFAULT 0.00,
ADD COLUMN status VARCHAR(50) DEFAULT 'In Good Standing';

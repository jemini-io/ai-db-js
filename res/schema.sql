-- MySQL
-- Users Table
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL
);

-- Projects Table
CREATE TABLE Projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- Milestones Table
CREATE TABLE Milestones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    due_date DATE,
    FOREIGN KEY (project_id) REFERENCES Projects(id)
);

-- Initiatives Table
CREATE TABLE Initiatives (
    id INT AUTO_INCREMENT PRIMARY KEY,
    decision TEXT,
    date DATE,
    acceptance_status VARCHAR(255)
);

-- Project Initiatives Junction Table (Many-to-Many Relationship)
CREATE TABLE ProjectInitiatives (
    project_id INT NOT NULL,
    initiative_id INT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES Projects(id),
    FOREIGN KEY (initiative_id) REFERENCES Initiatives(id),
    PRIMARY KEY (project_id, initiative_id)
);
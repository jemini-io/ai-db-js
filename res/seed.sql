-- MySQL
-- Inserting Users
INSERT INTO Users (username, email) VALUES ('JohnDoe', 'john@example.com'), ('JaneSmith', 'jane@example.com');

-- Inserting Projects
INSERT INTO Projects (name, description, user_id) VALUES ('AI Research', 'Research project on AI', 1), ('Blockchain Development', 'Development of blockchain systems', 2);
INSERT INTO Projects (name, description, user_id) VALUES ('Research', 'Research project', 1)

-- Inserting Milestones
INSERT INTO Milestones (project_id, title, due_date) VALUES (1, 'Initial Study', '2024-06-01'), (1, 'Prototype Development', '2024-09-01');

-- Inserting Initiatives
INSERT INTO Initiatives (decision, date, acceptance_status) VALUES ('Approve AI Ethics Guidelines', '2024-05-01', 'Approved'), ('Review Blockchain Security Measures', '2024-05-15', 'Pending');

-- Inserting Project Initiatives
INSERT INTO ProjectInitiatives (project_id, initiative_id) VALUES (1, 1), (2, 2);

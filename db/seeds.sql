USE employees;

INSERT INTO departments 
    (name, department_id)
VALUES
    ('Marketing', 1),
    ('IT', 2),
    ('Engineering', 3),
    ('Legal', 4);

INSERT INTO roles
    (id, title, salary, department_id)
VALUES
    (1, 'Marketing Director', 70000, 1),
    (2, 'Marketing Associate', 55000, 1),
    (3, 'IT Director', 75000, 2),
    (4, 'Technical Support Lead', 60000, 2),
    (5, 'Desktop Support Technician', 50000, 2),
    (6, 'Engineering Director', 85000, 3),
    (7, 'Network Engineer', 65000, 3),
    (8, 'Systems Engineer', 65000, 3),
    (9, 'Legal Director', 80000, 4),
    (10, 'Paralegal', 62000, 4)

INSERT INTO employees
    (id, first_name, last_name, role_id, manager_id)
VALUES
    (1, 'Harper', 'Klotz', 2, 1),
    (2, 'Jacob', 'Lyon', 1, 1),
    (3, 'Susan', 'Dawn', 3, 1),
    (4, 'George', 'Seuss', 4, 1),
    (5, 'Rodney', 'Spallino', 6, 1),
    (6, 'Egbert', 'John', 5, 1),
    (7, 'Jenn', 'Kidd', 5, 1),
    (8, 'Jane', 'Dawson', 7, 1),
    (9, 'Ron', 'Camarreri', 8, 1),
    (10, 'Ryan', 'Thomas', 9, 1),
    (11, 'Lydia', 'Lucas', 10, 1)
USE corporateStructure_DB;

-- adding Departments to Deparment Table.

INSERT INTO department (name)
VALUES ("HR");

INSERT INTO department (name)
VALUES ("Creative");



-- creating roles, giving them salary and assigning them to departments. 

INSERT INTO role (title, salary, department_id)
VALUES ("HR", "75000", 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Designer", "80000", 2);

INSERT INTO role (title, salary, department_id)
VALUES ("Accountant", "95000", 2);

INSERT INTO role (title, salary, department_id)
VALUES ("Engineer", "85000", 2);

INSERT INTO role (title, salary, department_id)
VALUES ("Manager", "100000", 1);

-- creating managers and assiging them manager id number --

INSERT INTO employee (first_name, last_name, role_id, manager_id )
VALUES ("North", "Kai", 5, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("East", "Kai", 5, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("South", "Kai", 5, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("West", "Kai", 5, 4);

-- creating employees, assigning them roles and linkimg to them to manager via manager_id number --

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Majin", "Buu", 1, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Son", "Goku", 1, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Prince", "Vegeta", 2, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Lord", "Frieza", 2, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Piccolo", "Junior", 3, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Akira", "Toriyama", 3, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Tien", "Shinhan", 4, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Android", "Eighteen", 4, 4);
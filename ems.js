// employee management system javascript file

const inquirer = require ("inquirer");
const mysql = require("mysql");

// connecting to mysql database

let connection = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "Amran2020",
    database: "corporateStructure_DB"

});

connection.connect((err => {
    if (err) throw err;
    startApp(); 
}))

const startApp = () => {
    inquirer
        .prompt({
            type: "list",
            message: "Hi Z Fighter! What would you like to do?",
             name: "menu",
            choices: [
                "Show Employees",
                "Show Employees by Department",
                "Show Employees by Manager",
                "Add Employee",
                "Remove Employee",
                "Change Employee Role",
                "End App"
            ]
        })
        .then((answer) => {
            switch (answer.menu) {
                case "Show Employees":
                    viewAllEmployees();
                    break;

                case "Show Employees by Department":
                    viewByDeparment();
                    break;

                case "Show Employees by Manager":
                    viewByManager();
                    break;

                case "Add Employee":
                    addEmployee();
                    break;

                case "Remove Employee":
                    removeEmployee();
                    break;

                case "Change Employee Role":
                    editEmployeeRole();
                    break;
                
                case "End App":
                    console.log("See you later!");
                    connection.end();
            }
        })
}

const viewAllEmployees = () => {
    let sql = "SELECT * FROM employee;";
    connection.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        startApp()
    })
}

const viewByDeparment = () => {
    let query = "SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name AS department ";
    query += "FROM department INNER JOIN role ON role.department_id = department.id ";
    query += "INNER JOIN employee ON employee.role_id = role.id ";
    query += "ORDER by role.title";

    connection.query(query, (err,res) => {
        if (err) throw err;
        console.log("-------------------------");
        console.table(res);
        console.log("-------------------------")
        console.log("What's next?");
        startApp();
    })
}

const viewByManager = () => {
    let query = 'select emp.first_name, emp.last_name, role.title, `role`.salary, concat(mgr.first_name,"   ", mgr.last_name) AS manager from employee emp ';
    query += "left join `role` on emp.role_id = role.id left join employee mgr on emp.manager_id = mgr.id ";
    query += "order by role.title;";
    //query += "INNER JOIN manager ON manager.id = employee.manager_id ";
    //query += "ORDER BY employee.title ASC";

    connection.query(query, (err,res) => {
        if (err) throw err;
        console.log("-------------------------");
        console.table(res);
        console.log("-------------------------")
        console.log("What's next?");
        startApp();
    })
}

const editEmployeeRole = () => {
    let query = "SELECT employee.id, employee.first_name AS employeeFirst, employee.last_name AS employeeLast, employee.role_id, role.title FROM role INNER JOIN employee ON employee.role_id = role.id";

    
    
    connection.query(query, (err, res) => {
        if (err) throw err;

        connection.query("SELECT * FROM corporateStructure_DB.role; ", (error, response) => {
            if (err) throw err;
            inquirer.prompt([
                {
                name: "employeePick",
                type: "rawlist",
                message: "Which employee would you like to modify?",
                choices: () => {
                    let choiceArr = [];
                    for (let i = 0; i < res.length; i++) {
                        const items = res[i];
                        choiceArr.push(`${items.employeeFirst} ${items.employeeLast} | EmployeeID:${items.id}`)
                    }
                    return choiceArr;
                }
            },
            {
                name: "roleChange",
                type: "rawlist",
                message: "Which role are they changing to?",
                choices: () => {
                    let optionsArr = [];
                    for (let j = 0; j < response.length; j++) {
                        const roles = response[j];
                        optionsArr.push(`${roles.title} | Role Id:${roles.id}`)
                    }
                    return optionsArr;
                }     
            }
        ])
        .then((answer) => {

            const splitArr = answer.employeePick.split(":");
            const employeeID = splitArr[1];

            const splitRole = answer.roleChange.split(":");
            const roleID = parseInt(splitRole[1]);
            
            connection.query(
                `SELECT employee.id, employee.first_name AS employeeFirst, employee.last_name AS employeeLast, employee.role_id, role.title FROM employee INNER JOIN role ON role.id = employee.role_id WHERE employee.id = ${employeeID.toString()}; `, (err2,res2) => {
                if (err2) throw err2;

                let newRole;

                if (res2[0].role_id === roleID) {
                    console.log("They are already this role. Please choose another.");
                    editEmployeeRole();
                } else {
                    newRole = roleID;

                    connection.query("UPDATE corporateStructure_DB.employee SET ? WHERE ?",
                    [
                        {
                            role_id: newRole,
                        },
                        {
                            id: employeeID,
                        }
                    ],
                    (error) => {
                        if (error) throw error;
                        console.log("Employee's role has been updated!");
                        startApp();
                    })
                }
            })

        })
        })
    })
    
}

const addEmployee = () => {
    let roles = {
        id: [],
        title: [],
    };
    let sql = "SELECT * FROM role;";
    connection.query(sql, (err,res) => {
        if (err) throw err;
        for (value of res) {
            roles.id.push(value.id);
            roles.title.push(value.title);
        }
    });

    let employees = {
        id: [],
        name: [],
    }

    let sql2 = "SELECT * FROM employee;";
    connection.query(sql2, (err, res) =>{
        if (err) throw err;
        for (emp of res) {
            employees.name.push(emp.first_name + " " + emp.last_name);
            employees.id.push(emp.id);
        }
        employees.name.push("None");
        employees.id.push(0);
    });

    inquirer.prompt([
        {
            name: "EmpFirst",
            type: "input",
            message: "Enter their first name:"
        },
        {
            name: "EmpLast",
            type: "input",
            message: "Enter their last name:"
        }])
        .then((answer) => {
            let firstName = answer.EmpFirst;
            let lastName= answer.EmpLast;

            inquirer.prompt({
                name: "role",
                type: "list",
                message: "What's their role?",
                choices: roles.title,
            }).then((response) => {
                let index = roles.title.indexOf(response.role);
                let role_id = roles.id[index];

                inquirer.prompt({
                    name: "manager",
                    type: "list",
                    message: "Who do they report to?",
                    choices: employees.name
                })
                .then((ans) => {
                    let index = employees.name.indexOf(ans.manager);
                    let manager_id = employees.id[index];
                    let sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${firstName}", "${lastName}", "${role_id}", "${manager_id}");`;
                    if (index === employees.name.length ) {
                        sql = `INSERT INTO employee (role_id, first_name, last_name) VALUES ("${role_id}", "${firstName}", "${lastName}")`;
                    }
                    connection.query(sql, (err, res) => {
                        if (err) throw err;
                        console.log("Employee added!");
                        startApp();
                    })
                })
            })
        })

    
}

const removeEmployee = () => {
    let employees = {
        id: [],
        name: [],
    }   
    let sql = "SELECT * FROM employee";
    connection.query(sql, (err, res) => {
        if (err) throw err;
        for (emp of res) {
            employees.id.push(emp.id);
            employees.name.push(emp.first_name + " " + emp.last_name)
        }
        inquirer.prompt({
            name: "name",
            type: "list",
            message: "Who would you like to remove?",
            choices: employees.name
        })
        .then((response) => {
            let index = employees.name.indexOf(response.name);
            let id = employees.id[index];
            let sql = `DELETE FROM employee WHERE id=${id};`;
            connection.query(sql, (err) => {
                if (err) throw err;
                console.log("Employee has been deleted.")

                startApp();
            })
        })
    })
}
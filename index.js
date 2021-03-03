const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

// create the connection information for the sql database
const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Your password
  password: '',
  database: 'employee_trackerdb',
});

// function which prompts the user for what action they should take
  const menu = () => {
    inquirer
      .prompt({
        name: 'menu',
        type: 'list',
        message: 'What would you like to do?',
        choices: ['View Records', 'Add New Records', 'Update Records', 'Delete Records', 'Exit'],
      })
      .then((answer) => {
        // based on the answer, direct to the appropriate functions
        if (answer.menu === 'View Records') {
          viewInfo();
        } else if (answer.menu === 'Add New Records') {
          addInfo();
        } else if (answer.menu === 'Update Records') {
          updateInfo();
        } else if (answer.menu === 'Delete Records') {
          deleteInfo();
        } else {
          connection.end();
        }
      });
  };
  
  // function to allow users to view requested information
  const viewInfo = () => {
    inquirer
      .prompt([
        {
          name: 'viewoptions',
          type: 'list',
          message: 'What would you like to view?',
          choices: ['All Departments', 'Utilized Budget By Department', 'All Employees', 'Employees By Manager', 'All Roles', 'Combined Departments, Roles & Employees', 'Back'],
        }])
      .then((answer) => {
        if (answer.viewoptions === 'All Departments') {
          viewDepartments();
        } else if (answer.viewoptions === 'Utilized Budget By Department') {
          viewBudget();
        } else if (answer.viewoptions === 'All Employees') {
          viewEmployees();
        } else if (answer.viewoptions === 'Employees By Manager') {
          viewEmployeesByManager();
        } else if (answer.viewoptions === 'All Roles') {
          viewRoles();
        } else if (answer.viewoptions === 'Combined Departments, Roles & Employees') {
          viewCombined();
        } else {
          menu();
        }
        });
      };
// Viewing all departments
        
const viewDepartments = () => {
  console.log('Selecting all departments...\n');
  connection.query('SELECT * FROM department', (err, res) => {
      if (err) throw err;
    console.table(res);
    menu();
  });
};
// Viewing total utilized budget by department

const viewBudget = () => {
  console.log('view budget by department...\n');
  inquirer
    .prompt([
      {
        name: 'select',
        type: 'input',
        message: 'Enter department name',
      }
      ])
    .then((answer) => {
      const query = 
      `SELECT SUM (role.salary) 
      FROM ((role
        INNER JOIN department ON department.id=role.department_id)
        INNER JOIN employee ON employee.role_id=role.id)
      WHERE department.dep_name='${answer.select}'`;
      connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        menu();
      });
    });
  };

// Viewing all employees

const viewEmployees = () => {
  console.log('Selecting all employees...\n');
  const query = 
  `SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id, role.title, role.salary, department.dep_name 
  FROM ((role
    INNER JOIN department ON department.id=role.department_id)
    INNER JOIN employee ON employee.role_id=role.id)`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    menu();
  });
};

// Viewing all employees by manager

const viewEmployeesByManager = () => {
  console.log('Selecting all employees by manager...\n');
  inquirer
    .prompt([
      {
        name: 'select',
        type: 'input',
        message: 'Enter manager id',
      }
      ])
    .then((answer) => {
      const query = 
      `SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id, role.title, role.salary, department.dep_name 
      FROM ((role
        INNER JOIN department ON department.id=role.department_id)
        INNER JOIN employee ON employee.role_id=role.id)
      WHERE manager_id='${answer.select}'`;
      connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        menu();
      });
    });
  };
// Viewing all roles

const viewRoles = () => {
  console.log('Selecting all employees...\n');
  connection.query('SELECT * FROM role', (err, res) => {
    if (err) throw err;
    console.table(res);
    menu();
  });
};

// Viewing combined records

const viewCombined = () => {
  console.log('Selecting all departments, roles and employees...\n');
  const query = 
  `SELECT department.dep_name, employee.id, employee.first_name, employee.last_name, employee.role_id, role.title, role.salary 
  FROM ((role
  INNER JOIN department ON department.id=role.department_id)
  INNER JOIN employee ON employee.role_id=role.id)`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    menu();
  });
};


// Function to select type of addition to the tables
const addInfo = () => {
  inquirer
    .prompt([
      {
        name: 'addoptions',
        type: 'list',
        message: 'What would you like to add?',
        choices: ['New Department','New Employee', 'New Role', 'Back'],
      }])
    .then((answer) => {
        if (answer.addoptions === 'New Department') {
        addDepartment();
      } else if (answer.addoptions === 'New Employee') {
        addEmployee();
      } else if (answer.addoptions === 'New Role') {
        addRole();
      } else {
        menu();
      }
      });
    };

// Adding new department

const addDepartment = () => {
  inquirer
    .prompt([
      {
        name: 'add_department_name',
        type: 'input',
        message: 'Input name of department',
      }
      ])
    .then((answer) => {
     console.log('Adding new department...\n');
     connection.query('INSERT INTO department SET ?', 
     {
      dep_name: `${answer.add_department_name}`
     },
      (err, res) => {
        if (err) throw err;
      console.log('New department successfully added');
      viewDepartments(res);
      
    }
    )});
  };

// Adding new role

const addRole = () => {
  inquirer
    .prompt([
      {
        name: 'title',
        type: 'input',
        message: 'Input role title',
      },
      {
        name: 'salary',
        type: 'input',
        message: 'Input role salary',
      },
      {
        name: 'department',
        type: 'input',
        message: 'What department does the role belong to?',
      }
      ])
    .then((answer) => {
     console.log('Adding new role...\n');
     const query = `INSERT INTO role (title, salary, department_id) VALUES ('${answer.title}','${answer.salary}', (SELECT id FROM department WHERE dep_name='${answer.department}'))`;
     connection.query(query, (err, res) => {
        if (err) throw err;
      console.log('New role successfully added');
      viewRoles(res);
      
    }
    )});
  };

// Adding new employee

const addEmployee = () => {
  inquirer
    .prompt([
      {
        name: 'firstname',
        type: 'input',
        message: 'Input firstname of employee',
      },
      {
        name: 'lastname',
        type: 'input',
        message: 'Input lastname of employee',
      },
      {
        name: 'role',
        type: 'input',
        message: "Input the employee's role",
      },
      {
        name: 'manager_firstname',
        type: 'input',
        message: "Input the firstname of the employee's manager",
      },
      {
        name: 'manager_lastname',
        type: 'input',
        message: "Input the lastname of the employee's manager",
      }
      ])
    .then((answer) => {
      console.log('Adding new employee...\n');
      const query = 
      `INSERT INTO employee (first_name, last_name, role_id, manager_id) 
      VALUES ('${answer.firstname}','${answer.lastname}', (SELECT id FROM role WHERE title='${answer.role}'), (SELECT * FROM (SELECT id FROM employee WHERE first_name='${answer.manager_firstname}' AND last_name='${answer.manager_lastname}') AS X))`;
      
      connection.query(query, (err, res) => {
         if (err) throw err;
       console.log('New employee successfully added');
       viewEmployees(res);
       
    }
    )});
  };

// Function to select type of updates to the tables
const updateInfo = () => {
  inquirer
    .prompt([
      {
        name: 'updateoptions',
        type: 'list',
        message: 'What would you like to update?',
        choices: ['Employee Role', 'Employee Manager', 'Back'],
      }])
    .then((answer) => {
        if (answer.updateoptions === 'Employee Role') {
        updateEmployeeRole();
      } else if (answer.updateoptions === 'Employee Manager') {
        updateManager();
      } else {
        menu();
      }
      });
    };

// Function to update employee role

const updateEmployeeRole = () => {
  inquirer
    .prompt([
      {
        name: 'select',
        type: 'input',
        message: 'Enter id of employee to change role',
      },
      {
        name: 'update',
        type: 'input',
        message: "Enter employee's new role",
      }
      ])
    .then((answer) => {
     console.log('Updating role title...\n');
     const query = 
     `UPDATE employee
      SET role_id = (SELECT id FROM role WHERE title='${answer.update}')
      WHERE id = '${answer.select}'`;
     
     connection.query(query, (err, res) => {
        if (err) throw err;
      console.log('Employee role successfully updated');
      viewEmployees(res);
      
    }
    )});
  };

// Function to update employee's manager

const updateManager = () => {
  inquirer
    .prompt([
      {
        name: 'select',
        type: 'input',
        message: "Enter employee's id",
      },
      {
        name: 'update',
        type: 'input',
        message: "Enter employee id of the new manager",
      }
      ])
    .then((answer) => {
     console.log('Updating manager of employee...\n');
     const query = 
     `UPDATE employee
      SET manager_id = (SELECT * FROM (SELECT id FROM employee WHERE id='${answer.update}') AS X)
      WHERE id = '${answer.select}'`;
     
     connection.query(query, (err, res) => {
        if (err) throw err;
      console.log('Employee manager successfully updated');
      viewEmployees(res);
      
    }
    )});
  };  
// Function to select type of records to delete
const deleteInfo = () => {
  inquirer
    .prompt([
      {
        name: 'options',
        type: 'list',
        message: 'What would you like to delete?',
        choices: ['Department','Employee', 'Role', 'Back'],
      }])
    .then((answer) => {
        if (answer.options === 'Department') {
        deleteDepartment();
      } else if (answer.options === 'Employee') {
        deleteEmployee();
      } else if (answer.options === 'Role') {
        deleteRole();
      } else {
        menu();
      }
      });
    };

// Deleting department

const deleteDepartment = () => {
  inquirer
    .prompt([
      {
        name: 'delete',
        type: 'input',
        message: 'Input name of department to delete',
      }
      ])
    .then((answer) => {
     console.log('Deleting department...\n');
     const query = 
  `DELETE FROM department 
  WHERE dep_name='${answer.delete}'`;
  connection.query(query, (err, res) => {
        if (err) throw err;
      console.log('Department successfully deleted');
      viewDepartments(res);
      
    }
    )});
  };

// Deleting role

const deleteRole = () => {
  inquirer
    .prompt([
      {
        name: 'delete',
        type: 'input',
        message: 'Input title of role to delete',
      }
      ])
    .then((answer) => {
     console.log('Deleting role...\n');
     const query = 
  `DELETE FROM role 
  WHERE title='${answer.delete}'`;
  connection.query(query, (err, res) => {
        if (err) throw err;
      console.log('Role successfully deleted');
      viewRoles(res);
      
    }
    )});
  };


// Delete employee

const deleteEmployee = () => {
  inquirer
    .prompt([
      {
        name: 'delete',
        type: 'input',
        message: 'Input id of employee to delete',
      }
      ])
    .then((answer) => {
     console.log('Deleting employee...\n');
     const query = 
  `DELETE FROM employee 
  WHERE id='${answer.delete}'`;
  connection.query(query, (err, res) => {
        if (err) throw err;
      console.log('Employee successfully deleted');
      viewEmployees(res);
      
    }
    )});
  };


  // connect to the mysql server and sql database
  connection.connect((err) => {
    if (err) throw err;
    menu();
  });

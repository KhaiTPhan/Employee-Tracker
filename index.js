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
//const menu = () => {
//    inquirer
//      .prompt({
//        name: 'menu',
//        type: 'list',
//        message: 'What would you like to do?',
//        choices: ['View', 'Add', 'Update', 'Delete', 'Exit'],
//      })
//      .then((answer) => {
        // based on their answer, either call the bid or the post functions
//        if (answer.menu === 'View') {
//          viewInfo();
//        } else if (answer.menu === 'Add') {
//          addInfo();
//        } else if (answer.menu === 'Update') {
//          updateInfo();
//        } else if (answer.menu === 'Delete') {
//          deleteInfo();
//        } else {
//          connection.end();
//        }
//      });
//  };
  
  // function to handle posting new items up for auction
  const viewInfo = () => {
    // prompt for info about the item being put up for auction
    inquirer
      .prompt([
        {
          name: 'viewoptions',
          type: 'list',
          message: 'What would you like to view?',
          choices: ['All Departments','All Employees','Back'],
        }])
      .then((answer) => {
        // based on their answer, either call the bid or the post functions
        if (answer.viewoptions === 'All Departments') {
          viewDepartments();
        } else if (answer.viewoptions === 'All Employees') {
          viewEmployees();
        } else {
          viewInfo();
        }
        });
      };
// Viewing all departments
        
const viewDepartments = () => {
  console.log('Selecting all departments...\n');
  connection.query('SELECT * FROM department', (err, res) => {
      if (err) throw err;
    // Log all results of the SELECT statement
    console.table(res);
    connection.end();
  });
};
// Viewing all employees

const viewEmployees = () => {
  console.log('Selecting all employees...\n');
  connection.query('SELECT * FROM employee', (err, res) => {
    if (err) throw err;
    console.table(res);
    connection.end();
  });
};
  
  // connect to the mysql server and sql database
  connection.connect((err) => {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    viewInfo();
  });

// Import necessary packages
const inquirer = require('inquirer');
const mysql = require('mysql2');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Mapcomm6618!',
    database: 'challenge_12',
  });

// Connect to the database
connection.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      process.exit(1);
    }
    console.log('Connected to the database!');
    // Call the function to start the application
    startApp();
  });

// Function to start the application
function startApp() {
  // Prompt the user with options
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: ['View employees', 'Add employee', 'Update employee role', 'Exit'],
      },
    ])
    .then((answers) => {
      // Perform the selected action
      switch (answers.action) {
        case 'View employees':
          viewEmployees();
          break;
        case 'Add employee':
          addEmployee();
          break;
        case 'Update employee role':
          updateEmployeeRole();
          break;
        case 'Exit':
          connection.end();
          console.log('Goodbye!');
          break;
      }
    });
}

// Function to view all employees
function viewEmployees() {
  connection.query('SELECT * FROM employees', (err, results) => {
    if (err) throw err;
    console.table(results);
    startApp();
  });
}

// Function to add a new employee
function addEmployee() {
  // Prompt the user for employee details
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'firstName',
        message: "Enter the employee's first name:",
      },
      {
        type: 'input',
        name: 'lastName',
        message: "Enter the employee's last name:",
      },
      {
        type: 'input',
        name: 'role',
        message: "Enter the employee's role:",
      },
    ])
    .then((answers) => {
      // Insert the new employee into the database
      connection.query(
        'INSERT INTO employees (first_name, last_name, role) VALUES (?, ?, ?)',
        [answers.firstName, answers.lastName, answers.role],
        (err, results) => {
          if (err) throw err;
          console.log('Employee added successfully!');
          startApp();
        }
      );
    });
}

// Function to update an employee's role
function updateEmployeeRole() {
  // Prompt the user for employee and role details
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'employeeId',
        message: 'Enter the ID of the employee:',
      },
      {
        type: 'input',
        name: 'newRole',
        message: 'Enter the new role for the employee:',
      },
    ])
    .then((answers) => {
      // Update the employee's role in the database
      connection.query(
        'UPDATE employees SET role = ? WHERE id = ?',
        [answers.newRole, answers.employeeId],
        (err, results) => {
          if (err) throw err;
          console.log('Employee role updated successfully!');
          startApp();
        }
      );
    });
}

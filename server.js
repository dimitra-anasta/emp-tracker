// const mysql = require('mysql2');
// const inquirer = require('inquirer');
import mysql from 'mysql2';
import inquirer from 'inquirer';

let roles 

const addRole = () => {
    inquirer.prompt ([
        {
            type: 'input',
            message: 'What is the role?',
            name: 'addRole',
        }
    ]).then((answers) => {
        const sql = `INSERT INTO role (title) VALUES (?)`
        const params = [answers.addRole];
        db.query(sql, params, (err, result) => {
            if (err) throw err;
            console.table(result);
            viewAddedRoles();
        })
        console.log(answers);
    }) 
};

const viewAddedRoles = () => {
    db.query(`SELECT * FROM department222`, function (err, results){
        if (err) throw err;
        console.table(results);
        promptChoices(); 
    })
}

const addDep = () => {
    inquirer.prompt([
        {
           type: 'input',
           message: 'What is the name of the department?',
           name: 'addDep',
        },
    ]).then((answers) => {
        const sql = `INSERT INTO department (name) VALUES (?)`
        const params = [answers.addDep];
        db.query(sql, params, (err,result) => {
            if (err) throw err;
            console.table(result);
            viewAllDep();
        })
        console.log(answers);
    }) 
};

const viewAllDep = () => {
    db.query(`SELECT * FROM department`, function (err, results){
        if (err) throw err;
        console.table(results);
        promptChoices();
    })
}

const viewAllRoles = () => {
    return db.query(`SELECT role.id, role.title, role.salary,role.department_id FROM role LEFT JOIN department ON role.department_id = department.id`, function (err, results){
        if (err) throw err;
        console.table(results);
        promptChoices();
    })
}

const db = mysql.createConnection(
{
    host: 'localhost',
    user: 'root',
    password: 'password1',
    database: 'employees_db'
},
    console.log('Connected to the employees_db database.')
);
console.table('EMPLOYEE TRACKER');
const viewAllEmp = () => {
    // db query allows you to make requests from Javascript to sql server
    db.query(`SELECT * FROM employee`, function (err,results) {
        console.table(results);
        promptChoices(); 
    })
}

const addEmp = () => {

    inquirer.prompt([
         {
            type: 'input',
            message: 'What is the employee first name?',
            name: 'first_name',
         },
            {
            type: 'input',
            message: 'What is the employee last name?',
            name: 'last_name',
            },
           
            // {
            // type: 'list',
            // message: 'Who is the employee manager?',
            // name: 'emp_manager',
            // choices: ['']
            // },
    ]).then((answers) => {
        console.log(answers);
        let firstName = answers.first_name;
        console.log(firstName);
        let lastName = answers.last_name;
        console.log(lastName);
        let roleChoices = roles.map(({id, title}) => ({
            name: title,
            value: id,
        }))
        db.promise().query('SELECT role.title, role.salary, department.department_id FROM role LEFT JOIN department ON role.department_id = department.id')
        inquirer.prompt([
        {
            type: 'list',
            message: 'What is the employee role?',
            name: 'emp_role',
            choices: roleChoices
            },
        ]).then((answers) => {
            console.log(answers);
        
        })
    }) 
}

const promptChoices = () => {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'choices', 
            choices: ['View all employees', 'Add employee', 'Update employee role', 'View all roles', 'Add role', 'View all departments', 'Add department', 'Quit']
        }],
    )
     .then((res) => {
        console.log(res.choices);
        let userChoices = res.choices;
        if (userChoices === 'View all employees'){
          viewAllEmp()      
        } if (userChoices === 'Add employee'){
            addEmp()
        } if (userChoices === 'View all roles'){
            viewAllRoles()
        } if (userChoices === 'View all departments'){
            viewAllDep()
        } if (userChoices === 'Add department'){
            addDep()
        } if (userChoices === 'Add role'){
            addRole()
        }
} )};


promptChoices();


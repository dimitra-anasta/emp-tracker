// const mysql = require('mysql2');
// const inquirer = require('inquirer');
import mysql from 'mysql2';
import inquirer from 'inquirer';
// import asciiart-logo from 'asciiart-logo';

// const logo = require("asciiart-logo");
let roles 
let employees

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

const addRole = () => {
    inquirer.prompt ([
        {
            type: 'input',
            message: 'What is the role?',
            name: 'addRole',
        },
        {
            type: 'input',
            message: 'What is their salary?',
            name: 'addSalary',
        },
        {
            type: 'list',
            message: 'What is the department? Enter 1 for Sales, 3 for Engineering, 3 for Finance, 4 for Legal',
            name: 'addDepRole',
            choices: [1,2,3,4],
        }

    ]).then((answers) => {
        const sql = `INSERT INTO role (role.title, role.salary, role.department_id) VALUES (?,?,?);`
        const params = [answers.addRole, answers.addSalary, answers.addDepRole];
        db.query(sql, params, (err, result) => {
            if (err) throw err;
            console.table(result);
            viewAllRoles();
        })
        console.log(answers);
    }) 
};

// const viewAddedRoles = () => {
//     db.query(`SELECT * FROM role`, function (err, results){
//         if (err) throw err;
//         console.table(results);
//         promptChoices(); 
//     })
// }

const getAllRoles = () => {
    return db.promise().query(`SELECT role.id, role.title, role.salary, role.department_id FROM role JOIN department ON role.department_id = department.id`)
}
getAllRoles().then((results) => {
    roles = results[0];
    console.log(roles[0])
});

const getAllEmp = () => {
    return db.promise().query(`SELECT * FROM employee;`)
} 
getAllEmp().then((r) => {
    employees = r[0];
    // console.log(employees[0]);
})


const addDep = () => {
    inquirer.prompt([
        {
           type: 'input',
           message: 'What is the name of the department?',
           name: 'addDep',
        },
    ]).then((answers) => {
        const sql = `INSERT INTO department (name) VALUES (?);`
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
    return db.query(`SELECT role.id, role.title, role.salary, role.department_id FROM role JOIN department ON role.department_id = department.id`, function (err, results){
        if (err) throw err;
        console.table(results);
        promptChoices();
    })
}

const viewAllEmp = () => {
    // db query allows you to make requests from Javascript to sql server
    db.query(`SELECT * FROM employee`, function (err,results) {
        console.table(results);
        promptChoices(); 
    })
}
 
const updateEmpRole = () => {
    inquirer.prompt ([
        {
            type: 'input',
            message: 'What is the employee id #?',
            name: 'emp_id'
        },
        {
            type: 'input',
            message: 'What is the employee new role id #?',
            name: 'newEmp_id'
        }
    ]).then ((response) => {
        db.query(`UPDATE employee SET role_id = ${response.newEmp_id} WHERE id = ${response.emp_id}`, function (err,results){
            console.table(results);
            promptChoices();
        } )
    })
}

const addEmp = () => {
 let firstName 
 let lastName
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
    ]).then((answers) => {
        console.log(answers);
        firstName = answers.first_name;
        console.log(firstName);
        lastName = answers.last_name;
        console.log(lastName);
        let empManagerChoices = employees.map(({first_name, last_name, manager_id}) => ({
            name: `${first_name} ${last_name}`,
            value: manager_id, 
        }))
        let roleChoices = roles.map(({id, title}) => ({
            name: title,
            value: id,
        }))
        db.promise().query('SELECT role.title, role.salary, role.department_id FROM role LEFT JOIN department ON role.department_id = department.id')
        inquirer.prompt([
        {
            type: 'list',
            message: 'What is the employee role?',
            name: 'emp_role',
            choices: roleChoices
            },
        ]).then((answers) => {
            let roleId = answers.emp_role;
            console.log(answers.emp_role);
            inquirer.prompt([
               {
                type: 'list',
                message:'Who is their manager?',
                name: 'emp_manager',
                choices: empManagerChoices,
               },
            ]).then((answers) => {
    
                console.log(roleId, 'role id')
                console.log(answers.emp_manager)
               let employee = {first_name: firstName, last_name: lastName, manager_id: answers.emp_manager, role_id: roleId}
               const sql = `INSERT INTO employee SET ? ;`
                db.query(sql, employee, (err, results) => {
                    if (err) throw err;
                    console.table(results);
                    
                })
            }).then(()=> {
                console.log(`employee ${firstName} ${lastName} created.`)
            }) .then(() => {
                viewAllEmp();  
        })
        })
    }) 
}

const promptChoices = () => {
// const logoText = logo({ name: "Employee Manager" }).render();
//   console.log(logoText);
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
        } if (userChoices === 'Update employee role'){
            updateEmpRole()
        } 
} )};


promptChoices();


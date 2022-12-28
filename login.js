
const express = require('express');
const session = require('express-session');
const mysql = require('mysql');
const flash = require('connect-flash');
const path = require('path');
const http = require('http');
const fs =require('fs');
const url= require('url');
const ejs = require('ejs');
const nodeRouter = require('node-router');
const { Route } = require('router');
const { Router } = require('express');
var router =  express.Router();




const connection = mysql.createConnection({
	host     : 'bsdmzwr7n4o87molkl35-mysql.services.clever-cloud.com',
	user     : 'uqpkivoqm9rmjsmx',
	password : 'QuE7hpdFKmNDSuTixZWo',
	database : 'bsdmzwr7n4o87molkl35'
});

const app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use( express.static(path.join(__dirname, 'public')));
app.use( express.static(path.join(__dirname, 'views')));


app.use(flash());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use((request, response, next)=>{
	response.locals.success = request.flash('success');
	next()
	
	});
// http://localhost:3000/
app.get('/', function(request, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/views/login.html'));
});


// /*
//  app.get('/register', function(request, response) {
// // // 	Render sign up template
//  	response.sendFile(path.join(__dirname + '/views/register'));
//  }); 

// http://localhost:3000/auth
app.post('/auth', function(request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				request.session.loggedin = true;
				request.session.username = username;
				// Redirect to home page
				response.redirect('/register');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

// http://localhost:3000/signup
app.post('/register', function(request, response) {
	// Capture the input fields
	let name = request.body.exampleInputName;
	let email = request.body.exampleInputEmail;
	let password = request.body.exampleInputPassword;
	// Ensure the input fields exists and are not empty
	if (name && email && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('INSERT INTO accounts (username, password, email) VALUES (?,?,?)',[name, password, email], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			
			// If the account exists
			if (results) {
				
				request.flash('success', 'New user Created!')
				// Authenticate the user
				// Redirect to home page
				response.redirect('/register');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/register', function(request, response){
	// // // 	Render sign up template
	response.render('register', {title:'Node.js MySQL CRUD Application',
	action:'list',
	register:'data',
	message:request.flash('success')});
	 	//response.render('register.ejs');
	 }); 

// http://localhost:3000/home
app.get('/home', function(request, response) {
	// If the user is loggedin
	if (request.session.loggedin) {
		// Output username
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		// Not logged in
		response.send('Please login to view this page!');
	}
	response.end();
});

app.listen(3001);
module.exports = router;
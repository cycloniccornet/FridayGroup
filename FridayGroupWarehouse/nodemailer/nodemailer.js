const dotenv = require('dotenv');
const mongo = require('../Databases/MongoDB/UserLog/userlog.js');
dotenv.config({path: '../.env'});
const nodemailer = require('nodemailer');

async function getMongo() {
    try {
        let logdata = await mongo.getUserLog()
        for (let i = 0; i< logdata.length; i++){
            console.log(logdata[i].date + " " + logdata[i].userName + " " + logdata[i].action + "d product: " + logdata[i].productName + " - from Category: " + logdata[i].category + " - from location: " + logdata[i].location );
        }
    } catch (error) {
        console.log(error);
    }
}

async function statusMail(userEmail) {

    let logdata = await mongo.getUserLog();
    let tabledata;

    for (let i = 0; i< logdata.length; i++) {
        if (logdata[i].dateNow >= 1623171197600) { // 1623171197600 => last 8 days of logging files
            tempData =
                '<tr>' +
                '<th scope="row">' + logdata[i].date + '</th>' +
                '<td>' + logdata[i].userName + '</td>' +
                '<td>' + logdata[i].action + '</td>' +
                '<td>' + logdata[i].category + '</td>' +
                '<td>' + logdata[i].productName + '</td>' +
                '<td>' + logdata[i].location + '</td>' +
                '</tr>';
            let temp2 = tabledata + tempData;
            tabledata = temp2;
        }
        }
    let mailSubject;
    let mailContent;
    let mailOption = 'Weekly status';

    if (mailOption === 'Weekly status') {
        mailSubject = 'Ugentlig lager status.';
        mailContent =
            '<div class="logcontainer"> ' +
            '<table class="table"> ' +
            '<thead class="thead-dark">' +
            '<tr>' +
            '<th scope="col">Date</th>' +
            '<th scope="col">User</th>' +
            '<th scope="col">Action</th>' +
            '<th scope="col">Product Type</th>' +
        '<th scope="col">Product Name</th>' +
        '<th scope="col">Location</th>' +
            '</tr>' +
            '</thead>\n' +
            '<tbody class="tbody">\n' +
            tabledata +
            '</tbody>\n' +
            '</table>' +
            '</div>'
    }


// Transport module for nodemailer
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user:process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASSWORD,
        },
    });
    let mailOptions = {
        from: '"Lagerstyring" <patr180499@gmail.com>',
        to: 'n.m.tureczek@gmail.com', // Sæt mail på
        subject: mailSubject,
        html: mailContent
    };

    await transporter.sendMail(mailOptions, (error, info) => {
        if(error) {
            console.log(error);
        } else{
            console.log('Nodemailer: Email sent to user - ' + mailOption);
        }
    });
}

module.exports ={
    statusMail,
};
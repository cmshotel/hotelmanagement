'use strict';
const nodemailer = require('nodemailer');

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
// nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'sanghanijignesh25@gmail.com', // generated ethereal user
            pass: '74053696989925532694' // generated ethereal password
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Jignesh Sanghani 👻" <sanghanijignesh25@gmail.com>', // sender address
        to: 'utsavrmori@gmail.com', // list of receivers
        subject: 'Testing ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: '<h1>Hello world?</h1>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
    });
// });
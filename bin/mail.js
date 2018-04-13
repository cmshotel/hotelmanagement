'use strict';
const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sanghanijignesh25@gmail.com', //account.user, // generated ethereal user
        pass: '74053696989925532694' //account.pass // generated ethereal password
    }
});

var text = "<h1>hello world jignesh</h1>";

var mailOptions = {
    form: 'sanghanijignesh25@gmail.com',
    to: 'sanghanijignesh25@gmail.com',
    subject: 'Testing for Mail in Nodejs',
    text: text
};

transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
        console.log(err);
    } else {
        console.log(info);
    }
})









// // Generate test SMTP service account from ethereal.email
// // Only needed if you don't have a real mail account for testing
// nodemailer.createTestAccount((err, account) => {
//     // create reusable transporter object using the default SMTP transport
//     let transporter = nodemailer.createTransport({
//         host: 'smtp.gmail.com',
//         port: 587,
//         secure: false, // true for 465, false for other ports
//         auth: {
//             user: 'sanghanijignesh25@gmail.com', //account.user, // generated ethereal user
//             pass: '74053696989925532694' //account.pass // generated ethereal password
//         }
//     });

//     // setup email data with unicode symbols
//     let mailOptions = {
//         from: '"Jignesh Test" <sanghanijignesh25@gmail.com>', // sender address
//         to: 'sanghanijignesh25@gmail.com', // list of receivers
//         subject: 'Hello ✔', // Subject line
//         text: 'Hello world?', // plain text body
//         html: '<h1>Hello world?</h1>' // html body
//     };

//     // send mail with defined transport object
//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             return console.log(error);
//         }
//         console.log('Message sent: %s', info.messageId);
//         // Preview only available when sending through an Ethereal account
//         console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

//         // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
//         // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
//     });
// });
const nodemailer = require('nodemailer');
const functions = require('firebase-functions');
const getCode = require('./getCode')
const cors = require('cors')({ origin: true });
const user = '',
    pass = '';

//google account credentials used to send email
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: user,
        pass: pass
    }
});



/*
 * @desc: to return the the time for next {min} minutes
 * @return {format, ts}
 * */
const get_expiration_time = (min = 5) => {
    let ts = (new Date()).getTime() + (min * 60000),
        cdate = new Date();

    cdate.setTime(ts);

    return {
        format: [cdate.getMonth() + 1,
            '/',
        cdate.getDate(),
            '/',
        cdate.getFullYear(),
            ' ',
        cdate.getHours(),
            ':',
        cdate.getMinutes()].join(''),
        ts: cdate.getTime()
    };

}; //


const sendCodeVerifyEmail = functions.https.onRequest((req, res) => {
    cors(async (req, res) => {
        let the_name = req.body.name ?? "User",
            the_email = req.body.email,
            the_code = await getCode.getCode(the_email),
            exp_time = get_expiration_time(),
            code = the_code.code;
        const mailOptions = {
            from: user,
            to: the_email,
            subject: `Authorization Request for ${the_name}`,
            html: `
                        <h1>Hi ${the_name}</h1>
                        <p>Please use the following code to continue your login process.</p>
                        <h2>${code}</h2>
                        <br/>
                        <p>Staffs</p>
                    `
        };


        transporter.sendMail(mailOptions, (error, data) => {
            if(error){
                let res_email = null;
            res_email.status = false;
            res_email.error = "Failed to generate a code. Please try again";
            return res_email;
            }
            let res_email = null;
            res_email.data.code = the_code.the_id;
            res_email.exp_time = exp_time;
            res_email.status = true;
            res_email.email_status = data;
            return res_email;
        });
    })



})

module.exports.sendEmail = sendCodeVerifyEmail;
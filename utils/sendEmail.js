

// April O'Reilly
import nodemailer from 'nodemailer'





    const sendEmail = async function (email, subject, message) {

        // console.log("the cre is ", email + " " + subject + " " + message);

        const transporter = nodemailer.createTransport({
            // host:process.env.SMPT_HOST, 
            // port: process.env.SMPT_PORT,
            host: 'smtp.elasticemail.com',
            port: 587,
            secure: false,
            auth: {
                // user:process.env.SMPT_USERNAME ,
                user: process.env.MAIL_USER,
                // pass:process.env.SMPT_PASSWORD
                pass: process.env.MAILPASS
            }
        });

        await transporter.sendMail({
            // from: process.env.SMPT_FROM_HOST , 
            from: 'fakeacc6862@gmail.com',
            to: email,
            subject: subject,
            html: message,
        });

        // console.log("hello from send email");

    }

 
export default sendEmail;

// 53


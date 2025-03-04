require('dotenv').config();
const nodemailer = require("nodemailer");

let sendEmail = async (dataSend) => {
    console.log("check data send email",dataSend);

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Kaito Coder 👻" <nam.nguyenphan.cit20@eiu.edu.vn>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh", // Subject line
        text: "Hello world?", // plain text body
        html:
            getBodyHTML(dataSend)
        // html body
    });

    console.log("Message sent: %s", info.messageId);
}

let getBodyHTML = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result = `
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên Booking Care</p>
        <p>Thông tin đặt lịch khám bệnh</p>
        <p><b>Thời Gian: ${dataSend.time}</b></p>
        <p><b>Bác sĩ: ${dataSend.doctorName}</b></p>


        <p>Vui lòng kiểm tra lại thông tin.</p>
        <p>Bấm vào đường Link bên dưới để xác nhận đặt lịch khám bệnh.</p>
        <a href=${dataSend.redirectLink}>Click Here<a/>
        <p>Xin cảm ơn.</p>
    `
    }
    if (dataSend.language === 'en') {
        result = `
        <h3>Dear ${dataSend.patientName}!</h3>
        <p>You received this email because you booked an appointment online on Booking Care</p>
        <p>Appointment information</p>
        <p><b>Time: ${dataSend.time}</b></p>
        <p><b>Doctor: ${dataSend.doctorName}</b></p>
        
        <p>Please check the information again.</p>
        <p>Click on the link below to confirm your appointment.</p>
        <a href=${dataSend.redirectLink}>Click Here<a/>
        <p>Thank you.</p>
        `
    }
    return result
}
// Correctly export the sendEmail function
export default { sendEmail };
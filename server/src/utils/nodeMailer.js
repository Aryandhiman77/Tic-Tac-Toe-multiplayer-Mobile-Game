const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'jane.leuschke85@ethereal.email',
        pass: 'TMXQSNymPKYjvG8t8j'
    }
});
  module.exports = async function mailSender({from,to,subject,html}) {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from:from, // sender address
      to:to, // list of receivers
      subject:subject,
      html:html // html body
    });
    if(info){
      console.log("Message sent: %s", info.messageId);
      return true;
    }else{
      return false;
    }
  
    
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  }
  
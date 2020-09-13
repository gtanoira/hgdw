import nodemailer from 'nodemailer'; 
import { EMAIL_SERVER_SETTINGS } from '../settings/environment.settings'; 

class EmailService { 

  private _transporter = nodemailer.createTransport(
    EMAIL_SERVER_SETTINGS.SmtpServerConnectionString
  );
  /* nodemailer.createTransport({
    host: "smtp.example.com",
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: "username",
      pass: "password"
    }
  }); */
 
  public async sendMail(to: string, subject: string, content: string): Promise<string> { 

    const options = { 
      from: EMAIL_SERVER_SETTINGS.fromAddress, 
      to: to, 
      subject: subject, 
      text: content 
    }

    let rtnMessage = '';
    this._transporter.sendMail(options, (error, info) => { 
      if (error) { 
        console.log(`error: ${error}`); 
        rtnMessage = `Email error: ${error}`; 
      } 
      console.log(`Message Sent ${info.response}`); 
      rtnMessage = `Message Sent ${info.response}`; 
    });

    return rtnMessage;

  } 
}

export const emailService = new EmailService();
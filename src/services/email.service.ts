import * as nodemailer from 'nodemailer'; 
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
 
  public sendMail(to: string, subject: string, content: string): Promise<void> { 

    let options = { 
      from: EMAIL_SERVER_SETTINGS.fromAddress, 
      to: to, 
      subject: subject, 
      text: content 
    } 

    this._transporter.sendMail(options, (error, info) => { 
      if (error) { 
        return console.log(`error: ${error}`); 
      } 
      console.log(`Message Sent ${info.response}`); 
    });

    return;
  } 
}

export const emailService = new EmailService();
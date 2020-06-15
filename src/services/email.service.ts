import * as nodemailer from 'nodemailer'; 
import { EmailServerSettings } from '../settings/email_server.settings'; 

class EmailService { 

  private _transporter = nodemailer.createTransport(
    EmailServerSettings.SmtpServerConnectionString
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
      from: EmailServerSettings.fromAddress, 
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
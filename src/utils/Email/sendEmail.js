import nodemailer from "nodemailer";
import { EmailTamplate } from './EmailTamplate.js';


export async function SendEmail(data){


const transporter = nodemailer.createTransport({
    service:"gmail",
  auth: {
    user: "zeyad14112006@gmail.com",
    pass: "qqabfdxdxnoebibt",
  },
});





const info = await transporter.sendMail({
    from: ' "Ecommerce"', 
    to: data.email, 
    subject: "Ecommerce", 
    text: "Hello world111", 
    html: EmailTamplate(data.api,data.email), 
  });

}
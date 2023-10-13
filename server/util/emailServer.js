const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text');

module.exports = class EmailServer {
  constructor(error) {
    this.error = error;
    this.from = `Social Warlock <${process.env.EMAIL_FROM}>`;
    this.to = process.env.EMAIL_TO;
  }

  newTransport() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      error: this.error,
      subject,
    });

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html),
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendError() {
    await this.send('error', 'Master we have an error');
  }

  async sendFinished() {
    await this.send('finished', 'Instagram work done Master');
  }

  async sendFbError() {
    await this.send('fbError', 'We have a FACEBOOK error');
  }

  async sendFbFinished() {
    await this.send('fbFinished', 'FACEBOOK work done master');
  }
};

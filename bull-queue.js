const Queue = require("bull");
require("dotenv").config();
const nodemailer = require("nodemailer");
// 1. Initiating the Queue
const sendMailQueue = new Queue("sendMail", {
  redis: {
    host: "127.0.0.1",
    port: 6379,
    password: "root",
  },
});
const data = {
  email: "munsifalimisri2018@gmail.com",
};

const options = {
  delay: 60000, // 1 min in ms
  attempts: 2,
};
// 2. Adding a Job to the Queue
sendMailQueue.add(data, options);

// 3. Consumer
sendMailQueue.process(async (job) => {
  try {
    return await sendMail(job.data.email);
  } catch (error) {
    console.log(error);
  }
});
function sendMail(email) {
  try {
    return new Promise((resolve, reject) => {
      let mailOptions = {
        from: `${process.env.FROM}`,
        to: `${process.env.TO}`,
        subject: "Bull - npm",
        text: "This email is from bull job scheduler tutorial.",
      };
      let mailConfig = {
        service: "gmail",
        auth: {
          user: `${process.env.USER}`,
          pass: `${process.env.PASSWORD}`,
        },
      };
      nodemailer
        .createTransport(mailConfig)
        .sendMail(mailOptions, (err, info) => {
          if (err) {
            reject(err);
          } else {
            resolve(info);
          }
        });
    });
  } catch (error) {
    console.log(error);
  }
}

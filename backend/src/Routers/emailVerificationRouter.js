const { Router } = require("express");
const router = new Router();
const VerificationRepository = require("../repositories/Verification.js");
const nodemailer = require("nodemailer");

async function sendEmail(to, code) {
  let transporter = nodemailer.createTransport({
    service: "Gmail",

    auth: {
      user: "techartisancomputers",
      pass: "jqieqtbowbiyrjmw",
      //"6R_xeAcBe8"
    },
  });
  console.log(to);
  let info = await transporter.sendMail({
    from: '"TechArtisan" techartisancomputers@gmail.com',
    to: to,
    subject: "Email Verification",
    text: `Your verification code is ${code}`,
  });
  console.log("Message sent: %s", info.messageId);
}

// const twilio = require('twilio');
// const client = new twilio('ACCOUNT_SID', 'AUTH_TOKEN');

async function sendSMS(to, code) {
  //   await client.messages.create({
  //     body: `Your verification code is ${code}`,
  //     from: '+12345678901', // ваш номер Twilio
  //     to: to
  //   });
  console.log(to, code);
}

function generateVerificationCode() {
  // create code
  return Math.floor(1000 + Math.random() * 9000).toString();
}

router.post("/send", async (req, res) => {
  const { email } = req.body;
  const storedCode =
    await VerificationRepository.getStoredVerificationCode(email);
  if (storedCode) {
    await VerificationRepository.clearStoredVerificationCode(email);
  }
  const verificationCode = generateVerificationCode();
  try {
    //сохранение кода в бд
    await VerificationRepository.saveVerificationCodeToDB(
      email,
      verificationCode,
    );
    await sendEmail(email, verificationCode);
    res.status(200).send("Код был успешно выслан!");
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
});

router.post("/verify", async (req, res) => {
  const { email, code } = req.body;
  console.log(email, code);
  //получение кода с бд
  const storedCode =
    await VerificationRepository.getStoredVerificationCode(email);
  if (storedCode.code === code) {
    //очищение кода при верификации
    await VerificationRepository.clearStoredVerificationCode(email); //Очистка при успешном вводе
    res.status(200).send("Успешная верификация");
  } else {
    res.status(400).send("Неверный код");
  }
});

module.exports = router;

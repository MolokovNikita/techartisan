const { Router } = require("express");
const router = new Router();
const bcrypt = require("bcryptjs");

const VerificationRepository = require("../repositories/Verification.js");
const nodemailer = require("nodemailer");
const UserRepository = require("../repositories/User.js");

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
  return Math.floor(1000 + Math.random() * 9000).toString();
}

router.post("/send", async (req, res) => {
  const { phone_number } = req.body;

  try {
    const userData =
      await UserRepository.getUserDataByPhoneNumber(phone_number);

    if (!userData) {
      return res
        .status(400)
        .send(`("Неудалось найти пользователя с таким номером телефона!`);
    }
    const storedCode =
      await VerificationRepository.getStoredVerificationCode(phone_number);
    if (storedCode) {
      await VerificationRepository.clearStoredVerificationCode(phone_number);
    }
    const verificationCode = generateVerificationCode();
    const hashedCode = bcrypt.hashSync(verificationCode, 8);
    try {
      await VerificationRepository.saveVerificationCodeToDB(
        phone_number,
        hashedCode,
      );
      await sendSMS(phone_number, verificationCode);
      res.status(200).send("Код был успешно выслан!");
    } catch (error) {
      console.error(error);
      res.status(400).send(error);
    }
  } catch (e) {
    console.log(e);
  }
});

router.post("/verify", async (req, res) => {
  const { phone_number, code } = req.body;
  try {
    const storedCode =
      await VerificationRepository.getStoredVerificationCode(phone_number);
    if (!storedCode) {
      return res.status(400).send("Код не найден!");
    }
    const isCodeValid = bcrypt.compareSync(code, storedCode.code);
    if (isCodeValid) {
      res.status(200).send("Успешная верификация");
    } else {
      res.status(400).send("Неверный код");
    }
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;

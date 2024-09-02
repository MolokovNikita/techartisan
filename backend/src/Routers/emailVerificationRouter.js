const { Router } = require("express");
const router = new Router();
const bcrypt = require("bcryptjs");

const VerificationRepository = require("../repositories/verification.js");
const nodemailer = require("nodemailer");
const UserRepository = require("../repositories/user.js");

async function sendEmail(to, code) {
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "techartisancomputers",
      pass: "jqieqtbowbiyrjmw",
    },
  });
  let info = await transporter.sendMail({
    from: '"TechArtisan" techartisancomputers@gmail.com',
    to: to,
    subject: "Подтверждение почты",
    text: `Ваш код подтверждения - ${code}`,
  });
  console.log("Message sent: %s", info.messageId);
}

function generateVerificationCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

router.post("/send", async (req, res) => {
  const { email } = req.body;
  try {
    const userData = await UserRepository.getUserData(email);
    if (!userData) {
      return res
        .status(400)
        .send(`("Неудалось найти пользователя с таким email!`);
    }
    const storedCode =
      await VerificationRepository.getStoredVerificationCode(email);
    if (storedCode) {
      await VerificationRepository.clearStoredVerificationCode(email);
    }
    const verificationCode = generateVerificationCode();
    const hashedCode = bcrypt.hashSync(verificationCode, 8);
    try {
      //сохранение кода в бд
      await VerificationRepository.saveVerificationCodeToDB(email, hashedCode);
      await sendEmail(email, verificationCode);
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
  const { email, code } = req.body;
  try {
    const storedCode =
      await VerificationRepository.getStoredVerificationCode(email);
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

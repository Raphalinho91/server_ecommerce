const CodeForEmail = require("../models/codeForEmail");
const nodemailer = require("nodemailer");

async function sendVerificationEmail(email, code) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS,
    },
  });

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f4f4f4;
            color: #333;
        }
        .container {
            background-color: #fff;
            padding: 20px;
            margin: auto;
            max-width: 600px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #444;
        }
        .code {
            font-size: 24px;
            font-weight: bold;
            color: #007BFF;
        }
        p {
            font-size: 16px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Code de vérification</h1>
        <p>Bonjour,</p>
        <p>Merci d'utiliser Ollosa.shop. Veuillez utiliser le code ci-dessous pour vérifier et confirmer votre identité :</p>
        <p class="code">${code}</p>
        <p>Si vous n'avez pas demandé ce code, veuillez ignorer cet email.</p>
        <p>Merci,</p>
        <p>Ollosa.shop</p>
    </div>
</body>
</html>
`;

  await transporter.sendMail({
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Ollosa.shop",
    text: `Votre code de vérification est : ${code}`,
    html: htmlContent,
  });
}

async function createAndSaveCode(email, code) {
  const codeEntry = new CodeForEmail({
    email,
    code,
  });
  await codeEntry.save();
  return codeEntry;
}

async function verifyEmailCode(email, code) {
  const codeEntry = await CodeForEmail.findOne({
    email,
    code,
    expired: { $gt: new Date() },
  });

  if (!codeEntry) {
    throw new Error("Invalid or expired code.");
  }

  await CodeForEmail.deleteMany({ email: email });

  return true;
}

module.exports = {
  createAndSaveCode,
  sendVerificationEmail,
  verifyEmailCode,
};

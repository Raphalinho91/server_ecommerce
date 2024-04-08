const {
  createAndSaveCode,
  sendVerificationEmail,
} = require("../services/email");

async function sendVerificationCode(req, reply) {
  const { email } = req.body;

  const verificationCode = Math.random()
  .toString(36)
  .substring(2, 10) 
  .toUpperCase();

  await createAndSaveCode(email, verificationCode);

  await sendVerificationEmail(email, verificationCode);

  return "Verification code sent.";
}
module.exports = { sendVerificationCode };

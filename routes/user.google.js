const { getGoogleUserInfo } = require("../controllers/user.google");

function userGoogle(fastify, options, done) {
  fastify.get("/login/google/callback", getGoogleUserInfo);
  done();
}

module.exports = userGoogle;

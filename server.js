const fastify = require("fastify")({ logger: true });
const oauthPlugin = require("@fastify/oauth2");
const secureSession = require("@fastify/secure-session");
const connectDB = require("./config/database");
const userRoutes = require("./routes/user");
const userGoogle = require("./routes/user.google");

fastify.register(secureSession, {
  secret: process.env.SECURE_SESSION,
  salt: process.env.SALT_SESSION,
  cookie: {
    secure: false,
  },
});

fastify.register(oauthPlugin, {
  name: "googleOAuth2",
  scope: ["profile", "email"],
  credentials: {
    client: {
      id: process.env.CLIENT_ID,
      secret: process.env.CLIENT_SECRET,
    },
    auth: oauthPlugin.GOOGLE_CONFIGURATION,
  },
  startRedirectPath: "/login/google",
  callbackUri: `${process.env.URL}/login/google/callback`,
});

fastify.register(userGoogle);
fastify.register(userRoutes);

const start = async () => {
  try {
    await connectDB();
    await fastify.listen({ port: process.env.PORT });
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

const fastify = require("fastify")({ logger: true });
const cors = require("@fastify/cors");
const connectDB = require("./config/database");
const userRoutes = require("./routes/user");

fastify.register(cors, { origin: "*" });

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

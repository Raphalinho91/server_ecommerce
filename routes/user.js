const { sendVerificationCode } = require("../controllers/email");
const {
  getUserByEmail,
  postUser,
  getUser,
  updatePasswordUser,
  deleteUserByToken,
  deleteUserById,
  getAllUsers,
  getOneUser,
  postInfoUser,
  getUserGoogle,
} = require("../controllers/user");
const {
  UserHeaderSchema,
  UserBodySchema,
  UserResponseSchema,
  LoginBodySchema,
  LoginResponseSchema,
  SendVerificationCodeSchema,
  ResetPasswordBodySchema,
  ResetPasswordResponseSchema,
  deleteUserResponseSchema,
  UsersResponseSchema,
  UserHeaderResponseSchema,
  LoginGoogleBodySchema,
  LoginGoogleResponseSchema,
  getOneUserResponseSchema,
} = require("../schemas/user");

function userRoutes(fastify, options, done) {
  fastify.get(
    "/user",
    {
      schema: {
        headers: UserHeaderSchema,
        response: UserHeaderResponseSchema,
      },
    },
    getUserByEmail
  );

  fastify.post(
    "/user",
    {
      schema: {
        body: UserBodySchema,
        response: UserResponseSchema,
      },
    },
    postUser
  );

  fastify.post(
    "/login",
    {
      schema: {
        body: LoginBodySchema,
        response: LoginResponseSchema,
      },
    },
    getUser
  );

  fastify.post(
    "/login/google",
    {
      schema: {
        body: LoginGoogleBodySchema,
        response: LoginGoogleResponseSchema,
      },
    },
    getUserGoogle
  );

  fastify.post(
    "/send-verification-code",
    {
      schema: SendVerificationCodeSchema,
    },
    sendVerificationCode
  );

  fastify.post(
    "/reset-password",
    {
      schema: {
        body: ResetPasswordBodySchema,
        response: ResetPasswordResponseSchema,
      },
    },
    updatePasswordUser
  );

  fastify.delete(
    "/delete-user-by-token",
    { schema: { response: deleteUserResponseSchema } },
    deleteUserByToken
  );

  fastify.delete(
    "/delete-user-by-id",
    { schema: { response: deleteUserResponseSchema } },
    deleteUserById
  );

  fastify.get(
    "/users",
    {
      schema: {
        response: UsersResponseSchema,
      },
    },
    getAllUsers
  );

  fastify.get(
    "/one-user",
    {
      schema: {
        response: getOneUserResponseSchema,
      },
    },
    getOneUser
  );
  fastify.post("/one-user", postInfoUser);

  done();
}

module.exports = userRoutes;

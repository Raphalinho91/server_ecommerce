const { sendVerificationCode } = require("../controllers/email");
const {
  getUserByEmail,
  postUser,
  getUser,
  updatePasswordUser,
  deleteUserByToken,
  deleteUserById,
  getAllUsers,
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
  UserHeaderResponseSchema
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

  done();
}

module.exports = userRoutes;

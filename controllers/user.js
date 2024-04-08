const userService = require("../services/user");
const { sendVerificationCode } = require("./email");

function validateEmailFormat(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

async function getUserByEmail(req, reply) {
  try {
    const email = req.headers["email"];
    if (!email || !validateEmailFormat(email)) {
      return reply.status(400).send({
        message: "Un email valide est requis dans les en-têtes de la requête.",
      });
    }
    const user = await userService.findUserByEmail(email);
    if (user) {
      reply.status(404).send({ message: "User found. Connect now." });
    } else {
      const simulatedReq = { body: { email: email } };
      await sendVerificationCode(simulatedReq);
      reply
        .status(404)
        .send({ message: "User not found. Verification code sent to email." });
    }
  } catch (error) {
    reply.status(500).send(error);
  }
}

async function postUser(req, reply) {
  try {
    const user = await userService.createUser(req.body, req.body.code);
    reply.send(user);
  } catch (error) {
    reply.status(500).send(error);
  }
}

async function getUser(req, reply) {
  try {
    const { email, password } = req.body;
    const user = await userService.authenticateUser(email, password);
    const token = await userService.generateAndSaveToken(user);

    reply.send({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      token: token,
    });
  } catch (error) {
    reply.status(400).send(error.message);
  }
}

async function updatePasswordUser(req, reply) {
  try {
    const { email, newPassword, code } = req.body;
    await userService.resetPassword(email, newPassword, code);
    reply.send({ message: "Password reset successfully." });
  } catch (error) {
    reply.status(400).send({ error: error.message });
  }
}

const deleteUserByToken = async (request, reply) => {
  try {
    const token = request.headers.authorization.split(" ")[1];
    const userId = userService.decodeToken(token);
    if (!userId) {
      return reply.status(401).send({ message: "Token invalide ou expiré" });
    }
    const result = await userService.deleteUserById(userId);
    if (!result) {
      return reply.status(404).send({ message: "L'utilisateur n'existe pas." });
    }
    reply.status(200).send({
      userId: result._id.toString(),
      message: "User deleted successfully.",
    });
  } catch (error) {
    reply.status(500).send({ error: error.message });
  }
};

const deleteUserById = async (request, reply) => {
  try {
    const userId = request.headers["user-id"];
    if (!userId) {
      return reply.status(400).send({
        message:
          "L'ID de l'utilisateur est requis dans les en-têtes de la requête.",
      });
    }
    const result = await userService.deleteUserById(userId);
    if (!result) {
      return reply.status(404).send({ message: "L'utilisateur n'existe pas." });
    }
    reply.status(200).send({
      userId: result._id.toString(),
      message: "User deleted successfully.",
    });
  } catch (error) {
    reply.status(500).send({ error: error.message });
  }
};

async function getAllUsers(req, reply) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!(await userService.isAdminUser(token))) {
      return reply.status(403).send({ message: "Accès refusé. Admin requis." });
    }

    const users = await userService.getAllUsers();
    reply.send(users);
  } catch (error) {
    reply.status(500).send({ message: "Erreur serveur", error: error.message });
  }
}

module.exports = {
  getUserByEmail,
  postUser,
  getUser,
  updatePasswordUser,
  deleteUserByToken,
  deleteUserById,
  getAllUsers
};

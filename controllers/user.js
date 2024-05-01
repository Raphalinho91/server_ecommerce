const user = require("../models/user");
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
      if (user.accountGoogle) {
        return reply.status(403).send({
          error:
            "L'accès via l'authentification classique est interdit pour ce compte créé via Google.",
        });
      }
      reply
        .status(200)
        .send({ message: "Utilisateur existant. Connectez-vous !" });
    } else {
      const simulatedReq = { body: { email: email } };
      await sendVerificationCode(simulatedReq);
      reply.status(200).send({
        message:
          "Utilisateur introuvable. Code de verification envoyé par e-mail !",
      });
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

async function getUserGoogle(req, reply) {
  try {
    const { email, firstName, lastName } = req.body;
    const userExists = await userService.findUserByEmail(email);

    if (userExists && !userExists.accountGoogle) {
      return reply.status(403).send({
        error: "Vous avez déjà un compte avec cet adresse e-mail !",
      });
    }
    let newUser = userExists;
    if (!newUser) {
      newUser = await userService.createUserGoogle(email, firstName, lastName);
    }

    const token = await userService.generateAndSaveToken(newUser);

    reply.send({
      _id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
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
    reply.send({ message: "Mot de passe modifié avec succès !" });
  } catch (error) {
    reply.status(400).send({ error: error.message });
  }
}

const deleteUserByToken = async (request, reply) => {
  try {
    const token = request.headers.authorization.split(" ")[1];
    const userId = userService.decodeToken(token);
    if (!userId) {
      return reply.status(401).send({ message: "Session invalide ou expiré" });
    }
    const result = await userService.deleteUserById(userId);
    if (!result) {
      return reply.status(404).send({ message: "L'utilisateur n'existe pas." });
    }
    reply.status(200).send({
      userId: result._id.toString(),
      message: "Utilisateur supprimé avec succès !",
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
      message: "Utilisateur supprimé avec succès !",
    });
  } catch (error) {
    reply.status(500).send({ error: error.message });
  }
};

async function getAllUsers(request, reply) {
  try {
    const token = request.headers.authorization.split(" ")[1];
    if (!(await userService.isAdminUser(token))) {
      return reply.status(403).send({ message: "Accès refusé. Admin requis." });
    }

    const users = await userService.getAllUsers();
    reply.send(users);
  } catch (error) {
    reply.status(500).send({ message: "Erreur serveur", error: error.message });
  }
}

async function getOneUser(request, reply) {
  try {
    const token = request.headers.authorization;
    const validToken = await userService.isUser(token);
    if (!validToken) {
      return reply.status(400).send({ error: "Token expiré ou invalide !" });
    }
    const user = await userService.getJustOneUser(validToken._id.toString());
    if (!user) {
      return reply.status(404).send({ error: "Utilisateur introuvable !" });
    }

    reply.send({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      isAdmin: user.isAdmin,
      accountGoogle: user.accountGoogle,
      phoneNumber: user.phoneNumber,
      pays: user.pays,
      province: user.province,
      ville: user.ville,
      codePostale: user.codePostale,
      adresse: user.adresse,
      adresseComplement: user.adresseComplement,
    });
  } catch (error) {
    console.error("Erreur :", error);
    reply.status(500).send({ error: "Erreur serveur", error: error.message });
  }
}

async function postInfoUser(request, reply) {
  try {
    const token = request.headers.authorization;
    const validToken = await userService.isUser(token);
    if (!validToken) {
      return reply.status(400).send({ message: "Token expiré ou invalide !" });
    }
    const user = await userService.getJustOneUser(validToken._id.toString());
    if (!user) {
      return reply.status(404).send({ message: "Utilisateur introuvable !" });
    }

    const updatedUser = await userService.updateUser(user._id, request.body);
    console.log(updatedUser);

    reply.send({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      dateOfBirth: updatedUser.dateOfBirth,
      isAdmin: updatedUser.isAdmin,
      accountGoogle: updatedUser.accountGoogle,
      phoneNumber: updatedUser.phoneNumber,
      pays: updatedUser.pays,
      province: updatedUser.province,
      ville: updatedUser.ville,
      codePostale: updatedUser.codePostale,
      adresse: updatedUser.adresse,
      adresseComplement: updatedUser.adresseComplement,
    });
  } catch (error) {
    console.error("Erreur :", error);
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
  getAllUsers,
  getOneUser,
  postInfoUser,
  getUserGoogle,
};

const { google } = require("googleapis");
const userService = require("../services/user");
const User = require("../models/user");

async function getGoogleUserInfo(request, reply) {
  try {
    const token =
      await this.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: token.token.access_token });
    const people = google.people({ version: "v1", auth: oauth2Client });
    const me = await people.people.get({
      resourceName: "people/me",
      personFields: "names,emailAddresses,birthdays,addresses,phoneNumbers",
    });

    const birthday = me.data.birthdays?.find((b) => b.date);
    let dateOfBirth;
    if (birthday) {
      dateOfBirth = `${birthday.date.year}-${birthday.date.month}-${birthday.date.day}`;
    }

    const userInfoFromGoogle = {
      firstName: me.data.names?.[0]?.givenName,
      lastName: me.data.names?.[0]?.familyName,
      email: me.data.emailAddresses?.[0]?.value,
      ...(dateOfBirth && { dateOfBirth }),
    };

    let user = await User.findOne({ email: userInfoFromGoogle.email });
    if (!user) {
      user = new User({
        ...userInfoFromGoogle,
        password: "ClientGoogleWithPasswordNotDefined",
        accountGoogle: true,
        acceptTheTermsOfUse: true,
        emailIsValid: true,
      });
    } else {
      Object.assign(user, userInfoFromGoogle);
    }
    await user.save();
    const tokenUser = await userService.generateAndSaveToken(user);

    return reply.send(user, tokenUser);
  } catch (error) {
    reply.status(500).send({ message: "Erreur serveur", error: error.message });
  }
}

module.exports = { getGoogleUserInfo };

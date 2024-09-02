// const { COOKIE_SETTINGS } = require('../constants.js');

//const ErrorsUtils = require("../utils/Errors.js");
const AuthService = require("../services/auth.js");
const COOKIE_SETTINGS = {
  REFRESH_TOKEN: {
    httpOnly: true,
    maxAge: 6048e5, // 7 * 24 * 3600 * 1000 (7 дней)
  },
};
class AuthController {
  static async signIn(req, res) {
    const { email, pass } = req.body;
    const { fingerprint } = req;
    try {
      const {
        accessToken,
        refreshToken,
        accessTokenExpiration,
        id,
        f_name,
        l_name,
        created,
        deleted,
        phone_number,
      } = await AuthService.signIn({
        email,
        pass,
        fingerprint,
      });
      res.cookie("refreshToken", refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN);

      return res.status(200).json({
        accessToken,
        accessTokenExpiration,
        id,
        f_name,
        l_name,
        email,
        created,
        deleted,
        phone_number,
      });
    } catch (err) {
      return res.status(400).send(err.message);
    }
  }

  static async signUp(req, res) {
    const { f_name, email, pass } = req.body;
    const { fingerprint } = req;
    try {
      const { accessToken, refreshToken, accessTokenExpiration, id } =
        await AuthService.signUp({
          f_name,
          pass,
          email,
          fingerprint,
        });
      res.cookie("refreshToken", refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN);
      return res.status(200).json({ accessToken, accessTokenExpiration, id });
    } catch (err) {
      return res.status(400).send(err.message);
    }
  }

  static async logOut(req, res) {
    const refreshToken = req.cookies.refreshToken;
    try {
      await AuthService.logOut(refreshToken);
      res.clearCookie("refreshToken");
      return res.sendStatus(200);
    } catch (err) {
      return res.status(400).send(err.message);
    }
  }

  static async refresh(req, res) {
    const { fingerprint } = req;
    const currentRefreshToken = req.cookies.refreshToken;
    try {
      const {
        accessToken,
        refreshToken,
        accessTokenExpiration,
        id,
        f_name,
        l_name,
        email,
        created,
        deleted,
        phone_number,
      } = await AuthService.refresh({
        currentRefreshToken,
        fingerprint,
      });
      res.cookie("refreshToken", refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN);
      return res.status(200).json({
        accessToken,
        accessTokenExpiration,
        id,
        f_name,
        l_name,
        email,
        created,
        deleted,
        phone_number,
      });
    } catch (err) {
      return res.status(400).send(err.message);
    }
  }
}

module.exports = AuthController;

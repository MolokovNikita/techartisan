const Yup = require("yup");
const validateRequest = require("../utils/validateRequest.js");
module.exports = signInSchema = Yup.object({
  body: Yup.object({
    email: Yup.string()
      .required("Поле обязательно!")
      .max(45, "Максимальная длина - 45 символов"),
    pass: Yup.string()
      .required("Поле обязательно!")
      .min(3, "Пароль слишком короткий - минимум 3 символа")
      .max(50, "Максимальная длина - 50 символов"),
  }),
});

module.exports = signUpSchema = Yup.object({
  body: Yup.object({
    f_name: Yup.string()
      .required("Поле обязательно!")
      .max(45, "Максимальная длина - 45 символов"),
    email: Yup.string()
      .required("Поле обязательно!")
      .max(45, "Максимальная длина - 45 символов"),
    pass: Yup.string()
      .required("Поле обязательно!")
      .min(3, "Пароль слишком короткий - минимум 3 символа")
      .max(50, "Максимальная длина - 50 символов"),
  }),
});

module.exports = logoutSchema = Yup.object({
  cookies: Yup.object({
    refreshToken: Yup.string().required("Поле обязательно!"),
  }),
});

class AuthValidator {
  static async signIn(req, res, next) {
    return validateRequest(req, res, next, signInSchema);
  }

  static async signUp(req, res, next) {
    return validateRequest(req, res, next, signUpSchema);
  }

  static async logOut(req, res, next) {
    return validateRequest(req, res, next, logoutSchema);
  }

  static async refresh(req, res, next) {
    return validateRequest(req, res, next);
  }
}

module.exports = AuthValidator;

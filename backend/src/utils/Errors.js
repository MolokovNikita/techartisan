class WebError {
  constructor(status, error) {
    this.status = status;
    this.error = error;
  }
}

module.exports = class Unprocessable extends WebError {
  constructor(error) {
    super(422, error);
  }
};

module.exports = class Conflict extends WebError {
  constructor(error) {
    super(409, error);
  }
};

module.exports = class NotFound extends WebError {
  constructor(error) {
    super(404, error);
  }
};

module.exports = class Forbidden extends WebError {
  constructor(error) {
    super(403, error);
  }
};

module.exports = class Unauthorized extends WebError {
  constructor(error) {
    super(401, error);
  }
};

module.exports = class BadRequest extends WebError {
  constructor(error) {
    super(400, error);
  }
};

class ErrorUtils {
  static catchError(res, error) {
    console.log(error);
    return res.status(error.status || 500).json(error);
  }
}

module.exports = ErrorUtils;

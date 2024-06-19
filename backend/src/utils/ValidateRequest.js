module.exports = async (req, res, next, schema) => {
  try {
    if (schema) {
      await schema.validate(req);
    }
    return next();
  } catch (err) { 
  return res.status(400).send("Bad request - " + err.message);}
};
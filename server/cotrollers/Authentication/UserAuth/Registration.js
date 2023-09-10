const User = require("../../../models/user");

module.exports.register = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      country_code,
      phone_no,
      rescue_team_id,
    } = req.body;

    const contact = { country_code, phone_no };
    const user = new User({
      email,
      username,
      contact,
      rescue_team: rescue_team_id,
    });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
    });
    res.send({ user: req.user, message: "Registered successfully" });
  } catch (e) {
    res.status(409).send({ message: e.message });
  }
};

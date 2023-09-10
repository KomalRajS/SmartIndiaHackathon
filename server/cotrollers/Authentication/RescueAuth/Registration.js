const Rescuer = require("../../../models/rescue");

module.exports.register = async (req, res) => {
  try {
    const {
      email,
      username,
      address,
      description,
      password,
      country_code,
      phone_no,
      ...rest
    } = req.body;
    const contact = { country_code, phone_no };
    const rescuer = new Rescuer({
      email,
      username,
      address,
      description,
      rest,
      contact,
    });
    const registeredRescuer = await Rescuer.register(rescuer, password);

    req.login(registeredRescuer, (err) => {
      if (err) {
        return next(err);
      }
      res.send({ user: req.user, message: "Registered successfully" });
    });
  } catch (e) {
    console.log(e.message);
    res.status(409).send({ message: e.message });
  }
};

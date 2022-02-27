const Models = require("../../../models/index");
const bcrypt = require("bcrypt");

async function store(req, res) {
  const { userName, password, email, confirmPassword } = req.body;
  try {
    const user = {
      userName: userName,
      email: email,
      password: password,
    };
    if (password !== confirmPassword) {
      res.status(401).json({ message: "Password does not match" });
    } else {
      await bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          res.status(500).json({ message: err.message });
        } else {
          user.password = hash;
          Models.User.create(user);
          return res.status(201).json({ message: "User Created successfully" });
        }
      });
    }
  } catch (err) {
    return res.status(500).json({ message: `Error:${err.message}` });
  }
}

async function index(req, res) {
  try {
    const users = await Models.User.findAll();
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ message: `Error:${err.message}` });
  }
}

async function update(req, res) {
  const { userName, password, email, confirmPassword } = req.body;
  try {
    const userId = req.params.id;
    const user = await Models.User.findByPk(userId);

    const updatedUser = {
      userName: userName,
      email: email,
      password: password,
    };
    if (password !== confirmPassword) {
        res.status(401).json({ message: "Password does not match" });
      } else {
        await bcrypt.hash(password, 10, (err, hash) => {
          if (err) {
            res.status(500).json({ message: err.message });
          } else {
            updatedUser.password = hash;
            Models.User.update(updatedUser);
            return res.status(201).json({ message: "User Updated successfully"});
          }
        });
      }
  } catch (err) {
    return res.status(500).json({ message: `Error:${err.message}` });
  }
}

module.exports = {
  store,
  index,
  update,
};

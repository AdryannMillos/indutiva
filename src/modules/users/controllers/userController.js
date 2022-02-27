const Models = require("../../../models/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    } else {
      if (password !== confirmPassword) {
        res.status(401).json({ message: "Password does not match" });
      } else {
        bcrypt.hash(password, 10, (err, hash) => {
          if (err) {
            res.status(500).json({ message: err.message });
          } else {
            updatedUser.password = hash;
            console.log(updatedUser.password);
            Models.User.update(
              {
                userName: updatedUser.userName,
                email: updatedUser.email,
                password: updatedUser.password,
              },
              { where: { id: userId } }
            );
            return res
              .status(200)
              .json({ message: "User Updated successfully" });
          }
        });
      }
    }
  } catch (err) {
    return res.status(500).json({ message: `Error:${err.message}` });
  }
}

async function destroy(req, res) {
  try {
    const userId = req.params.id;
    const user = await Models.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    } else {
      await Models.User.destroy({ where: { id: userId } });
      return res.status(200).json({ message: "User Deleted successfully" });
    }
  } catch (err) {
    return res.status(500).json({ message: `Error:${err.message}` });
  }
}

const login = async (req, res) => {
  const { email, password } = req.body;
  const userWithEmail = await Models.User.findOne({ where: { email } });
  if (!userWithEmail) {
    return res.status(401).json({ message: "Email or password not found" });
  }
  if (!bcrypt.compareSync(password, userWithEmail.password)) {
    return res.status(401).json({ message: "Email or password not found" });
  }

  const jwtToken = jwt.sign(
    {
      id: userWithEmail.id,
      userName: userWithEmail.userName,
      email: userWithEmail.email,
    },
    process.env.JWT_SECRET || "somethingsecret",
    {
      expiresIn: "1h",
    }
  );

  res.status(200).send({ message: "Welcome Back!", token: jwtToken });
};

module.exports = {
  store,
  index,
  update,
  destroy,
  login,
};

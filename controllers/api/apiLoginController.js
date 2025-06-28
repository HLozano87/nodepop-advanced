import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import createError from "http-errors";

export async function signUp(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const existUser = await User.findOne({ email });

    if (!name || !email || !password) {
      return next(createError(400, "All fields are required"));
    }

    if (existUser) {
      return next(createError(409, "User already exists"));
    }

    const newUser = new User({
      name,
      email,
      password: await User.hashPassword(password),
    });
    await newUser.save();

    // const userData = newUser.toObject()
    // delete userData.password

    res.status(201).json({ result: newUser });
  } catch (error) {
    next(error);
  }
}

export async function loginAuthJWT(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user || !(await user.comparePassword(password))) {
      next(createError(401, "Invalid credentials"));
      return;
    }

    jwt.sign(
      { user_id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "5d",
      },
      (err, tokenJWT) => {
        if (err) {
          return next(err);
        }
        res.json({ tokenJWT });
      }
    );
  } catch (error) {
    next(error);
  }
}

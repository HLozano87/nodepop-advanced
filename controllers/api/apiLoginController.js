import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import createError from "http-errors";

export async function loginAuthJWT(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    
    if (!user || !(await user.comparePassword(password))) {
      next(createError(401, "Invalid credentials"));
      return
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

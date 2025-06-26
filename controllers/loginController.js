import User from "../models/User.js";
import { io } from "../webSocketServer.js";
import { promisify } from "util";

export const index = (req, res, next) => {
  res.locals.error = "";
  res.locals.name = "";
  res.locals.email = "";
  res.locals.newAccount = req.query.newAccount === "true";
  res.render("login");
};

export async function loginUser(req, res, next) {
  try {
    const { name, email, password, confirmPassword } = req.body;
    const redir = req.query.redir;
    const newAccount = req.query.newAccount === "true";

    if (!email || !password) {
      res.locals.error = "Email and password required.";
      res.locals.email = "";
      res.locals.newAccount = newAccount;
      return res.render("login");
    }

    if (newAccount) {
      const userId = req.session.userId;
      if (!confirmPassword || password !== confirmPassword) {
        res.locals.error = "Passwords not match.";
        res.locals.name = name;
        res.locals.email = email;
        res.locals.newAccount = true;
        return res.render("login");
      }
      const user = new User({
        name,
        email,
        password: await User.hashPassword(password),
        owner: userId,
      });
      await user.save();
      req.session.userId = user.id;
      user.sendEmail("Bienvenido", `Bienvenido a Nodepop ${user.name}.`);
      return res.redirect("/");
    }

    const user = await User.findOne({ email: email });

    if (!user || !(await user.comparePassword(password))) {
      res.locals.error = "Credentials not valid.";
      res.locals.email = email;
      res.locals.newAccount = false;
      return res.render("login");
    }
    req.session.userId = user.id;
    req.session.name = user.name;

    res.redirect(redir ? redir : "/");
  } catch (error) {
    next(error);
    return;
  }
}

export async function logout(req, res, next) {
  const oldSessionId = req.session.id;
  const userId = req.session.userId;
  try {
    const user = await User.findById(userId);
    const regenerate = promisify(req.session.regenerate).bind(req.session);
    await regenerate();

    io.to(oldSessionId).emit("close-session", `See yo soon ${user.name}!`);
    io.in(oldSessionId).disconnectSockets(true);

    setTimeout(() => {
      res.redirect("login");
    }, 1000);
  } catch (error) {
    next(error);
  }
}

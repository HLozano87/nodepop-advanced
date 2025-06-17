import User from "../models/User.js";

export const index = (req, res, next) => {
  res.locals.error = "";
  res.locals.email = "";
  res.locals.newAccount = req.query.newAccount === "true";
  res.render("login");
};

export async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;
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
      const user = new User({
        email,
        password: await User.hashPassword(password),
        owner: userId,
      });
      await user.save();
      req.session.userId = user.id;
      return res.redirect("/");
    }

    const user = await User.findOne({ email: email });

    if (!user || !(await user.comparePassword(password))) {
      res.locals.error = "Credentials not valid.";
      res.locals.email = email;
      res.locals.newAccount = newAccount;
      return res.render("login");
    }
    req.session.userId = user.id;

    // Prueba de envio un email al usuario al hacer login
    user.sendEmail("Bienvenido", `Bienvenido a Nodeapp ${user.name}.`);

    res.redirect(redir ? redir : "/");
  } catch (error) {
    next(error);
    return;
  }
}

export function logout(req, res, next) {
  req.session.regenerate((err) => {
    if (err) {
      next(err);
      return;
    }
    res.redirect("login");
  });
}

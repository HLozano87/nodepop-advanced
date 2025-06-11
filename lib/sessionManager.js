import session from "express-session";
import MongoStore from "connect-mongo";
import "dotenv/config";

export const sessionUser = session({
  name: "nodepop-sessionUsers",
  secret: process.env.SECRET_SESSION,
  saveUninitialized: true,
  resave: false,
  cookie: {
    maxAge: parseInt(process.env.TIME_LIFE_SESSION),
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
  }),
});

export function useSessionUsersInViews(req, res, next) {
  res.locals.session = req.session;
  next();
}

export function guard(req, res, next) {
  if (!req.session.userId) {
    res.redirect(`/login?redir=${req.url}`);
    return;
  }
  next();
}

import jwt from "jsonwebtoken";
import createHttpError from "http-errors";

export function jwtGuard(req, res, next) {
  const tokenJWT = req.get("Authorization") || req.query.jwt;

  if (!tokenJWT) {
    return next(createHttpError(401, "Token is required"));
  }

  jwt.verify(tokenJWT, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return next(createHttpError(401, "Invalid Token"));
    }

    req.userId = payload.user_id;

    next();
  });
}

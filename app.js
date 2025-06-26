/**
 * Import modules
 */
import path from "path";

import express from "express";
import createError from "http-errors";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import connectMongoose from "./lib/connectMongoose.js";

import * as homeController from "./controllers/homeController.js";
import * as productController from "./controllers/productController.js";
import * as loginController from "./controllers/loginController.js";
import * as sessionManager from "./lib/sessionManager.js";
import * as apiProductsController from "./controllers/api/apiProductsController.js";
import { loginAuthJWT } from "./controllers/api/apiLoginController.js";
import { jwtGuard } from "./lib/jwtAuthMiddleware.js";
import uploadFile from "./lib/uploadConfigure.js";
import i18n from "./lib/i18nConfigure.js";
import changeLang from "./controllers/langLocaleController.js";
import swaggerMiddleware from "./lib/swaggerMiddleware.js";
import { corsOptions } from "./lib/corsConfigure.js";

await connectMongoose();
console.log("Connected to MongoDB");
const app = express();

// view engine setup
app.set("views", "views");
app.set("view engine", "ejs");

// Locals variables
app.locals.titleApp = "Nodepop";

/**
 * Use middlewares
 */
app.use(cors(corsOptions));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(import.meta.dirname, "public")));

/**
 * API Routes
 */

app.post("/api/login", loginAuthJWT);
app.get("/api/products", jwtGuard, apiProductsController.listProducts);
app.get("/api/tags", jwtGuard, apiProductsController.getTags);
app.get("/api/products/:productId", jwtGuard, apiProductsController.getProduct);
app.post(
  "/api/products",
  jwtGuard,
  uploadFile.single("image"),
  apiProductsController.newProduct
);
app.put(
  "/api/products/:productId",
  jwtGuard,
  uploadFile.single("image"),
  apiProductsController.updateProduct
);
app.delete(
  "/api/products/:productId",
  jwtGuard,
  apiProductsController.deleteProduct
);

// Middlewares to sessionUsers
app.use(sessionManager.sessionUser);
app.use(sessionManager.useSessionUsersInViews);
app.use(i18n.init);
app.get("/lang-change/:locale", changeLang);

/**
 * Web Routes definitions
 */
app.get("/", homeController.index);

// Login
app.get("/login", loginController.index);
app.post("/login", loginController.loginUser);
app.get("/logout", loginController.logout);

// Products User Auth
app.get("/user/new", sessionManager.guard, productController.index);
app.post(
  "/user/new",
  sessionManager.guard,
  uploadFile.single("imagenFile"),
  productController.validateParams,
  productController.createProduct
);
app.post(
  "/user/delete/:productId",
  sessionManager.guard,
  productController.deleteProduct
);
app.use("/api-docs", swaggerMiddleware);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // Manage validation errors
  if (err.array) {
    err.message =
      "Invalid request: " +
      err
        .array()
        .map((e) => `${e.location} ${e.type} "${e.path}" ${e.msg}`)
        .join(", ");
    err.status = 422;
  }

  res.status(err.status || 500);

  // For API errors response must be JSON
  if (req.url.startsWith("/api/")) {
    res.json({ error: err.message });
    return;
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.NODEPOP_ENV === "development" ? err : {};

  // render the error page
  res.render("error");
});

export default app;

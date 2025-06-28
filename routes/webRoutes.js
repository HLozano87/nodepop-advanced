import express from "express";
import * as homeController from "../controllers/homeController.js";
import * as loginController from "../controllers/loginController.js";
import * as productController from "../controllers/productController.js";
import * as sessionManager from "../lib/sessionManager.js";
import uploadFile from "../lib/uploadConfigure.js";
import * as validator from "../lib/validator.js";

const router = express.Router();

router.get("/", homeController.index);

// Login
router.get("/login", loginController.index);
router.post("/login", loginController.loginUser);
router.get("/logout", loginController.logout);

// Products User Auth
router.get("/user/new", sessionManager.guard, productController.index);
router.post(
  "/user/new",
  sessionManager.guard,
  uploadFile.single("imagenFile"),
  validator.validateParams,
  productController.createProduct
);

router.get(
  "/user/detail-product/:productId",
  sessionManager.guard,
  validator.validateProductId,
  productController.getProductDetail
);

router
  .route("/user/update/:productId")
  .get(
    sessionManager.guard,
    validator.validateProductId,
    productController.updateProductForm
  )
  .post(
    sessionManager.guard,
    validator.validateProductId,
    uploadFile.single("imagenFile"),
    validator.validateParams,
    productController.updateProduct
  );

router.post(
  "/user/delete/:productId",
  sessionManager.guard,
  validator.validateProductId,
  productController.deleteProduct
);

export default router;

import express from "express";
import { signUp, loginAuthJWT } from "../controllers/api/apiLoginController.js";
import * as apiProductsController from "../controllers/api/apiProductsController.js";
import { jwtGuard } from "../lib/jwtAuthMiddleware.js";
import * as validator from "../lib/validator.js";
import uploadFile from "../lib/uploadConfigure.js";

const router = express.Router();

// Rutas de autenticación
router.post("/signup", signUp);
router.post("/login", loginAuthJWT);

// Rutas protegidas con JWT
router.get("/products", jwtGuard, apiProductsController.listProducts);
router.get("/tags", jwtGuard, apiProductsController.getTags);
router.get("/products/:productId", jwtGuard, validator.validateProductId, apiProductsController.getProduct);
router.post("/products", jwtGuard, validator.validateParams, uploadFile.single("image"), apiProductsController.newProduct);
router.put("/products/:productId", jwtGuard, validator.validateProductId, validator.validateParams, uploadFile.single("image"), apiProductsController.updateProduct);
router.delete("/products/:productId", jwtGuard, validator.validateProductId, apiProductsController.deleteProduct);

export default router;

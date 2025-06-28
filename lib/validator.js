import { body, param, validationResult } from "express-validator";
import mongoose from "mongoose";

export const validateParams = [
  body("name")
    .trim()
    .matches(/^[a-zA-Z0-9 áéíóúÁÉÍÓÚñÑ]+$/)
    .isString()
    .withMessage(
      "El nombre del producto es obligatorio, y debe ser valido. Ej: Producto 1 o Producto."
    ),
  body("price")
    .custom((value) => value > 0)
    .withMessage("El precio debe ser un número mayor a 0"),
  body("image").optional().isString(),
  body("tags")
    .customSanitizer((value) => {
      if (Array.isArray(value)) return value;
      if (typeof value === "string") return [value];
      return [];
    })
    .isArray({ min: 1 })
    .withMessage("Las etiquetas deben ser un arreglo"),
  body("tags.*").isString().withMessage("Cada etiqueta debe ser un string"),
  body("tags.*").isString().withMessage("Cada etiqueta debe ser un string"),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.file) {
        const image = req.file.filename;
        const imagePath = path.join(process.cwd(), "public", "uploads", image);
        try {
          await unlink(imagePath);
        } catch (error) {
          console.error("Remove image", error);
        }
      }
      return next(errors);
    }
    next();
  },
];

export const validateProductId = [
  param("productId")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("El ID de producto no tiene un formato válido"),

  (req, res, next) => {
    const errors = validationResult(req);
    const __ = res.__;
    if (!errors.isEmpty()) {
      return next(createHttpError(404, "error.notFound"));
    }
    next();
  },
];

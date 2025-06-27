import { body, validationResult } from "express-validator";
import Product from "../models/Product.js";
import User from "../models/User.js";
import path from "node:path";
import { unlink } from "node:fs/promises";

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
  body("tags").isArray().withMessage("Las etiquetas deben ser un arreglo"),
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

export const index = (req, res, next) => {
  res.render("new-product");
};

export const createProduct = async (req, res, next) => {
  try {
    const { name, price, tags } = req.body;
    const image = req.file?.filename;
    const userId = req.session.userId;

    const product = new Product({
      name,
      price,
      image,
      tags,
      owner: userId,
    });
    await product.save();

    //TODO TOAST

    res.redirect("/");
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    const user = await User.findById(userId);

    if (product.image) {
      const imagePath = path.join(
        process.cwd(),
        "public",
        "uploads",
        product.image
      );
      await unlink(imagePath);
    }

    await Product.deleteOne({ _id: productId, owner: userId });

    // TODO TOAST

    res.redirect("/");
  } catch (error) {
    next(error);
  }
};

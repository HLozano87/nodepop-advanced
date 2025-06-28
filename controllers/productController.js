import { body, validationResult } from "express-validator";
import Product from "../models/Product.js";
import User from "../models/User.js";
import path from "node:path";
import { unlink } from "node:fs/promises";
import { io } from "../webSocketServer.js";

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

export const index = (req, res, next) => {
  res.render("new-product");
};

export const updateProductForm = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const userId = req.session.userId;
    const uniqueTags = await Product.distinct("tags");

    const product = await Product.findOne({ _id: productId, owner: userId });
    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }

    res.render("update-product", { product, uniqueTags });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { name, price, tags } = req.body;
    const image = req.file?.filename;
    const userId = req.session.userId;
    const __ = res.__;

    const product = new Product({
      name,
      price,
      image,
      tags,
      owner: userId,
    });
    await product.save();

    setTimeout(() => {
      io.to(req.session.id).emit(
        "create-product",
        __("%s was create successfully", product.name)
      );
    }, 1500);

    res.redirect("/");
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const userId = req.session.userId;
    const __ = req.__;

    const productData = {
      name: req.body.name,
      price: req.body.price,
      tags: req.body.tags,
    };
    if (req.file) {
      productData.image = req.file?.filename;
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId, owner: userId },
      productData,
      { new: true }
    );

    setTimeout(() => {
      io.to(req.session.id).emit(
        "create-product",
        __("%s was update successfully", updatedProduct.name)
      );
    }, 1000);
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
    const __ = req.__;

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

    setTimeout(() => {
      io.to(req.session.id).emit(
        "delete-product",
        __("%s was delete successfully", product.name)
      );
    }, 1000);

    res.redirect("/");
  } catch (error) {
    next(error);
  }
};

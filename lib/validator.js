import { body, param, validationResult } from "express-validator";
import mongoose from "mongoose";
import path from "path";
import { unlink } from "fs/promises";
import createHttpError from "http-errors";
import Product from "../models/Product.js";

export const validateParams = [
  body("name")
    .trim()
    .isString()
    .withMessage("The product name must be a text")
    .matches(/^[a-zA-Z0-9 áéíóúÁÉÍÓÚñÑ]+$/)
    .withMessage("The product name contains invalid characters"),
  body("price")
    .custom((value) => value > 0)
    .withMessage("Price must be a number greater than 0"),
  body("image").optional().isString(),
  body("tags")
    .customSanitizer((value) => {
      if (Array.isArray(value)) return value;
      if (typeof value === "string") return [value];
      return [];
    })
    .isArray({ min: 1 })
    .withMessage("The tags must be an array"),
  body("tags.*").isString().withMessage("Each tag must be a string"),

  async (req, res, next) => {
    const errors = validationResult(req);
    const __ = res.__;

    if (req.file) {
      if (!req.file.mimetype.startsWith("image/")) {
        const imagePath = path.join(process.cwd(), "public", "uploads", req.file.filename);
        try {
          await unlink(imagePath);
        } catch (error) {
          console.error("Error deleting image:", error);
        }

        return res.status(422).render("new-product", {
          errors: {
            ...errors.mapped(), 
            image: { msg: "Only image files are allowed" },
          },
          oldInput: req.body,
          message: __("error.validation"),
          tags: Product.getTags(),
        });
      }
    }

    if (!errors.isEmpty()) {
      if (req.file && !req.mimetype.startsWith("image/")) {
        return res.status(422).render("new-product", {
          errors: errors.mapped(),
          oldInput: req.body,
          message: __("error.validation"),
          tags: Product.getTags(),
        });
      }
    }
    next();
  },
];

export const validateProductId = [
  param("productId")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Id is not valid"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createHttpError(404, "error.notFound"));
    }
    next();
  },
];

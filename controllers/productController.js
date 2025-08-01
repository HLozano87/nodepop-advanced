import Product from "../models/Product.js";
import path from "node:path";
import { unlink } from "node:fs/promises";
import { io } from "../webSocketServer.js";
import { createThumbnail } from "../lib/thumbnailConfigure.js";
import createHttpError from "http-errors";

export const index = (req, res, next) => {
  const tags = Product.getTags();
  res.render("new-product", {
    tags,
    oldInput: {},
    errors: {},
    message: "",
  });
};

export const getProductDetail = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const userId = req.session.userId;

    if (!productId) {
      return next();
    }

    const product = await Product.findOne({ _id: productId, owner: userId });

    if (!product) {
      return next();
    }

    product.imageUrl = product.image ? `/uploads/${product.image}` : null;

    res.render("detail-product", { product });
  } catch (error) {
    next(error);
  }
};

export const updateProductForm = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const userId = req.session.userId;
    const uniqueTags = await Product.distinct("tags");
    const __ = res.__;

    if (!productId) {
      return next(createHttpError(400, __("error.validation")));
    }

    const product = await Product.findOne({ _id: productId, owner: userId });

    if (!product) {
      return next(createHttpError(404, __("error.notFound")));
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

    let thumbnail = null;
    if (req.file) {
      thumbnail = await createThumbnail(req.file);
    }

    const product = new Product({
      name,
      price,
      image,
      thumbnail,
      tags,
      owner: userId,
    });
    await product.save();

    setTimeout(() => {
      io.to(req.session.id).emit(
        "create-product",
        __("{{name}} was create successfully", { name: product.name })
      );
    }, 1000);

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
        __("{{name}} was update successfully", { name: updatedProduct.name })
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
      const thumbnail = path.join(
        process.cwd(),
        "public",
        "uploads",
        product.thumbnail
      );
      await unlink(imagePath);
      await unlink(thumbnail);
    }

    await Product.deleteOne({ _id: productId, owner: userId });

    setTimeout(() => {
      io.to(req.session.id).emit(
        "delete-product",
        __("{{name}} was delete successfully", { name: product.name })
      );
    }, 1000);

    res.redirect("/");
  } catch (error) {
    next(error);
  }
};

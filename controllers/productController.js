import Product from "../models/Product.js";
import path from "node:path";
import { unlink } from "node:fs/promises";
import { io } from "../webSocketServer.js";

export const index = (req, res, next) => {
  const tags = Product.getTags()
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

    if (!productId) return next()

    const product = await Product.findOne({ _id: productId, owner: userId });
    
    if (!product) return next()


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

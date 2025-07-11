import createHttpError from "http-errors";
import Product from "../../models/Product.js";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { createThumbnail } from "../../lib/thumbnailConfigure.js";

export async function listProducts(req, res, next) {
  try {
    const userId = req.userId;
    const filter = { owner: userId };

    if (req.query.name) filter.name = req.query.name;
    if (req.query.price) filter.price = req.query.price;
    if (req.query.tags) filter.tags = { $in: req.query.tags.split(",") };

    // Filtro de rango para price
    if (req.query.priceMin || req.query.priceMax) {
      filter.price = {};
      if (req.query.priceMin) {
        filter.price.$gte = parseFloat(req.query.priceMin);
      }
      if (req.query.priceMax) {
        filter.price.$lte = parseFloat(req.query.priceMax);
      }
    }

    const limit = parseInt(req.query.limit || 10);
    const skip = (parseInt(req.query.page) - 1) * parseInt(req.query.limit);
    const sort = req.query.sort;
    const fields = req.query.fields;
    const withCount = req.query.count === "true";

    const products = await Product.list(filter, limit, skip, sort, fields);
    const result = { result: products };

    if (withCount) {
      result.count = await Product.countDocuments(filter);
    }

    return res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getProduct(req, res, next) {
  try {
    const { productId } = req.params;
    const userId = req.userId;

    const product = await Product.findOne({ _id: productId, owner: userId });

    if (!product) {
      return next(createHttpError(404, "Product not found"));
    }

    return res.json({ result: product });
  } catch (error) {
    next(error);
  }
}

export function getTags(req, res, next) {
  try {
    const tags = Product.getTags();
    return res.json({ result: tags });
  } catch (error) {
    next(error);
  }
}

export async function newProduct(req, res, next) {
  try {
    const userId = req.userId;

    const product = new Product({
      ...req.body,
      owner: userId,
    });

    if (req.file) {
      product.image = req.file.filename;
      product.thumbnail = await createThumbnail(req.file);
    }

    const saved = await product.save();
    return res.status(201).json({ result: saved });
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req, res, next) {
  // TODO REFACTOR
  try {
    const { productId } = req.params;
    const userId = req.userId;

    const product = await Product.findOne({ _id: productId, owner: userId });
    if (!product) {
      return next(createHttpError(404, "Product not found"));
    }
    
    const allowedFields = ["name", "description", "price", "tags"];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    if (req.file) {
      // Remove old image and thumbnail
      if (product.image) {
        await unlink(
          path.join(process.cwd(), "public", "uploads", product.image)
        ).catch(() => {});
      }
      if (product.thumbnail) {
        await unlink(
          path.join(process.cwd(), "public", "uploads", product.thumbnail)
        ).catch(() => {});
      }

      product.image = req.file?.filename;
      product.thumbnail = await createThumbnail(req.file);
    }

    const updated = await product.save();
    return res.json({ result: updated });
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const { productId } = req.params;
    const userId = req.userId;

    const product = await Product.findById(productId);

    if (!product) {
      return next(createHttpError(404, "Product not found"));
    }

    if (product.owner.toString() !== userId) {
      return next(createHttpError(401, "Unauthorized"));
    }

    if (product.image) {
      await unlink(
        path.join(process.cwd(), "public", "uploads", product.image)
      ).catch(() => {});
    }
    if (product.thumbnail) {
      await unlink(
        path.join(process.cwd(), "public", "uploads", product.thumbnail)
      ).catch(() => {});
    }

    await Product.deleteOne({ _id: productId, owner: userId });

    return res.status(200).json();
  } catch (error) {
    next(error);
  }
}

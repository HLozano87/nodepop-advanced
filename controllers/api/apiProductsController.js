import createHttpError from "http-errors";
import Product from "../../models/Product.js";
import { unlink } from "node:fs/promises";
import path from "node:path";

export async function listProducts(req, res, next) {
  try {
    //Filters
    const userId = req.userId;
    const filterName = req.query.name;
    const filterPrice = req.query.price;
    const filterTags = req.query.tags;

    // Pagination
    const limit = parseInt(req.query.limit || 10);
    const skip = parseInt(req.query.skip || 0);

    // Sort
    const sort = req.query.sort;

    // Field selections
    const fields = req.query.fields;

    // Total
    const withCount = req.query.count === "true";

    const filter = {
      owner: userId,
    };

    if (filterName) {
      filter.name = filterName;
    }
    if (filterPrice) {
      filter.price = filterPrice;
    }

    if (filterTags) {
      filter.tags = { $in: filterTags.split(",") };
    }

    const products = await Product.list(filter, limit, skip, sort, fields);
    const result = { result: products };

    if (withCount) {
      const count = await Product.countDocuments(filter);
      result.count = count;
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getProduct(req, res, next) {
  try {
    const productId = req.params.productId;
    const userId = req.userId;

    const product = await Product.findOne({ _id: productId, owner: userId });

    if(!product) {
      return res.status(404).json({ error: "Not found" })
    }

    res.json({ result: product });
  } catch (error) {
    next(error);
  }
}

export function getTags(req, res, next) {
  try {
    const tags = Product.getTags();

    res.json({ result: tags });
  } catch (error) {
    next(error);
  }
}

export async function newProduct(req, res, next) {
  try {
    const productData = req.body;

    const product = new Product(productData);
    product.image = req.file?.filename;
    product.owner = req.userId;

    const saveProduct = await product.save();

    res.status(201).json({ result: saveProduct });
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const productId = req.params.productId;
    const productData = req.body;
    const userId = req.userId;
    productData.image = req.file?.filename;

    const updatedProduct = await Product.findOneAndUpdate( 
      { _id: productId, owner: userId }, productData, { new: true }
    );

    res.json({ result: updatedProduct });
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const productId = req.params.productId;
    const userId = req.userId;

    const product = await Product.findById(productId);

    if (!product) {
      console.warn(
        `WARNING! user ${userId} is trying to delete non existing product`
      );
      return next(createHttpError(404));
    }

    if (product.owner.toString() !== userId) {
      console.warn(
        `WARNING! user ${userId} is trying to delete products of other users!`
      );
      return next(createHttpError(401));
    }

    if (product.image) {
      try {
        await unlink(path.join(process.cwd(), "public", "uploads", product.image));
      } catch (error) {
        console.warn(`WARNING! Could not delete image file: ${err.message}`);
      }
    }

    await Product.deleteOne({ _id: productId, owner: userId });

    res.status(201).end();
  } catch (error) {
    next(error);
  }
}

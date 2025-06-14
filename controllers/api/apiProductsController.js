import Product from "../../models/Product.js";

export async function listProducts(req, res, next) {
  try {
    //Filters
    const userId = req.userId;
    const filterName = req.query.name;
    const filterPrice = req.query.price;
    const filterTags = req.query.tags;

    // Pagination
    const limit = req.query.limit;
    const skip = req.query.sort;

    // Sort
    const sort = req.query.sort;

    // Field selections
    const fields = req.query.fields;

    // Total
    const withCount = req.query.count === "true";

    const filter = {
      // TODO API AUTHENTICATION
    };

    if (filterName) {
      filter.name = filterName;
    }
    if (filterPrice) {
      filter.price = filterPrice;
    }

    if (filterTags) {
      filter.tags = filterTags
    }

    const products = await Product.list(filter, limit, skip, sort, fields);
    const result = { result: products };

    if (withCount) {
      const count = await Product.countDocuments(filter);
      result.count = count;
    }

    res.json(result)
  } catch (error) {
    next(error);
  }

}

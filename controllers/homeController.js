import Product from "../models/Product.js";

/* GET home page. */
export const index = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const filterName = req.query.name;
    const filterPrice = req.query.price;
    const filterTags = req.query.tags;

    const limit = parseInt(req.query.limit);
    const skip = parseInt(req.query.skip);
    const sort = req.query.sort;

    const filter = {
      owner: userId,
    };

    if (filterName) {
      filter.name = filterName.trim().toLowerCase();
    }
    if (filterPrice) {
      filter.price = filterPrice;
    }

    if (filterTags) {
      filter.tags = filterTags;
    }

    const products = await Product.list(filter, limit, skip, sort);
    const uniqueTags = await Product.distinct("tags");

    res.locals.products = products;

    res.render("index", {
      products,
      filter: { name: filterName, price: filterPrice, tags: filterTags, sort },
      uniqueTags,
    });
  } catch (error) {
    next(error);
  }
};

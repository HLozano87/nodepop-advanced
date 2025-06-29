import Product from "../models/Product.js";

/* GET home page. */
export const index = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const filterName = req.query.name;
    const filterPrice = req.query.price;
    const filterTags = req.query.tags;
    const sort = req.query.sort;

    let page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

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
    
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    const products = await Product.list(filter, limit, skip, sort);
    const uniqueTags = await Product.distinct("tags");

    res.locals.products = products;

    res.render("index", {
      products,
      filter: { name: filterName, price: filterPrice, tags: filterTags, sort },
      uniqueTags,
      currentPage: page,
      totalPages,
      limit,
    });
  } catch (error) {
    next(error);
  }
};

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
    const fields = req.query.fields;
    
    const filter = {};
    
    if(userId){
      filter.owner = userId
    }

    if (filterName) {
      filter.name = filterName;
    }
    if (filterPrice) {
      filter.price = filterPrice;
    }

    if (filterTags) {
      filter.tags = filterTags;
    }

    const products = await Product.list(filter, limit, skip, sort, fields);
    const withCount = req.query.count === "true";
    const result = { products };

    if (withCount) {
      const count = await Product.countDocuments(filter);
      result.count = count;
      res.locals.count = count
    }
    
    res.locals.products = products
  
    res.render("index");
  } catch (error) {
    next(error);
  }
};

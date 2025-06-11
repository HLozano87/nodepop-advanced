import Product from "../models/Product.js";

/* GET home page. */
export const index = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const products = await Product.find({ owner: userId });
    res.locals.products = products;
    res.render("index");
  } catch (error) {
    next(error);
  }
};

import Product from "../models/Product.js";
import User from "../models/User.js";
import { io } from "../webSocketServer.js";

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
      filter.name = filterName;
    }
    if (filterPrice) {
      filter.price = filterPrice;
    }

    if (filterTags) {
      filter.tags = filterTags;
    }

    const user = await User.findById(userId);
    const products = await Product.list(filter, limit, skip, sort);
    res.locals.products = products;

    setTimeout(() => {
      if (userId) {
        io.to(req.session.id).emit(
          "welcome-user",
          `Welcome back ${user.name}!`
        );
        return;
      }
    }, 1000);
    res.render("index");
  } catch (error) {
    next(error);
  }
};

import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: String,
    owner: { index: true, ref: "User", type: mongoose.Schema.Types.ObjectId },
    price: Number,
    image: String,
    tags: [String],
  },
  {
    collection: "productos",
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;

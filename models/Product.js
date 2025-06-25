import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", index: true },
    price: { type: Number, min: 1, required: true },
    image: { type: String },
    tags: { type: [String], required: true },
  },
  {
    collection: "productos",
    timestamps: true,
  }
);
productSchema.statics.list = function (filter, limit, skip, sort, fields) {
  const query = Product.find(filter);
  query.limit(limit);
  query.skip(skip);
  query.sort(sort);
  query.select(fields);

  return query.exec();
};

const TAGS = ["lifestyle", "motor", "work", "mobile"];
productSchema.statics.getTags = function () {
  return TAGS;
};

const Product = mongoose.model("Product", productSchema);

export default Product;

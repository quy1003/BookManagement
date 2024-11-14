import mongoose from "mongoose";
import { Schema } from "mongoose";

const slug = require('mongoose-slug-generator');
mongoose.plugin(slug)

const CategorySchema = new Schema({
  name: { type: String, require: true },
  slug: {type: String, slug: 'name', unique: true}
});

const Category = mongoose.model("Category", CategorySchema, "categories");

module.exports = Category;

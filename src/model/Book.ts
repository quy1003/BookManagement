import mongoose, { Types } from "mongoose";
import { Schema } from "mongoose";

const slug = require('mongoose-slug-generator');
mongoose.plugin(slug)

interface TypeBook {
  name: string,
  categories: Types.ObjectId[],
  // cover?:string[],
  images?: string[],
  release?:Date,
  authors:Types.ObjectId[],
  description: string,
  slug: string

}
const BookSchema = new Schema<TypeBook>({
  name: { type: String, required: true },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  // cover: [{type:String}],
  images: [{type:String}],
  release: { type: Date },
  authors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Author" }],
  description: { type: String },
  slug: {type: String, slug: 'name', unique: true}
});

const Book = mongoose.model("Book", BookSchema, "books");

module.exports = Book;

import mongoose from "mongoose";
import { Schema } from "mongoose";

const slug = require('mongoose-slug-generator');
mongoose.plugin(slug)

interface TypeAuthor {
  name: string,
  avatar: string,
  slug: string

}
const AuthorSchema = new Schema<TypeAuthor>({
  name: { type: String, require: true },
  avatar: {type: String},
  slug: {type: String, slug: 'name', unique: true}
});

const Author = mongoose.model("Author", AuthorSchema, "authors");

module.exports = Author;

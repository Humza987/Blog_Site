import mongoose from 'mongoose';
const { Schema } = mongoose;

const postSchema = new Schema({
  title: String, // String is shorthand for {type: String}
  author: String,
  body: String,
}, { timestamps: true });

const posts = mongoose.model("post", postSchema);

export default posts;

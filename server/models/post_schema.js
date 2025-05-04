// import mongoose from 'mongoose';
// const { Schema } = mongoose;

// const postSchema = new Schema({
//   title: String, // String is shorthand for {type: String}
//   author: String,
//   summary: String,
//   content: String,
//   image: String,
// }, { timestamps: true });

// const posts = mongoose.model("post", postSchema);

// export default posts;



// post_schema.js
import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  image: {
    type: String, // Now storing the Cloudinary URL instead of just a filename
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('posts', postSchema);
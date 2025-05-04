// import express from 'express';
// const router = express.Router();
// import posts from '../models/post_schema.js';

// router.get("/", async (req, res) => {
//     try {
//         const blogs = await posts.find();
//         res.send(blogs);
//       } catch (err) {
//         console.error(err);
//         res.status(500).send('Server Error');
//       }
// }
// )

// // import multer from 'multer';

// // const storage = multer.diskStorage({
// //   destination: function (req, file, cb) {
// //     cb(null, "../src/images/");
// //   },
// //   filename: function (req, file, cb) {
// //     const uniqueSuffix = Date.now();
// //     cb(null, uniqueSuffix + file.originalname);
// //   },
// // });

// // const upload = multer({ storage: storage });

// // router.post("/", upload.single("image"), async (req, res) => {
  
// //   try {
// //     const newPost = new posts({
// //         title: req.body.title,
// //         author: req.body.author,
// //         summary: req.body.summary,
// //         content: req.body.content,
// //         image: req.body.image
// //     });
// //     const createdPost = await newPost.save();
// //     res.json(createdPost);
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).send('Server Error');
// //   }
// // }
// // )
// import multer from 'multer';

// import path from 'path'

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "../frontend/public/images/");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, uniqueSuffix + file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

// router.post("/", upload.single("image"), async (req, res) => {
//   try {
//     const { title, author, summary, content } = req.body;
//     let file; // Store image path for MongoDB

//     if (req.file) {
//       file = req.file.filename; // Get image path from Multer
//     }

//     const newPost = new posts({
//       title,
//       author,
//       summary,
//       content,
//       image: file, // Store path in MongoDB
//     });
//     const createdPost = await newPost.save();
//     res.json(createdPost);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server Error');
//   }
// });


// router.get("/:id", async (req, res) => {
//     // res.json({message: "Get A Single Blog Post"})
//     try {
//       const id = req.params.id;
//       const blog = await posts.findById(id);
//       res.json(blog);
//     } catch (err) {
//       console.error(err);
//       res.status(500).send('Server Error');
//     }
// }
// )


// router.delete("/:id", async (req, res) => {
//     const id =req.params.id
//     const post = await posts.findOneAndDelete({_id: id})
// }
// )

// router.patch("/:id", (req, res) => {
//     res.json({message: "Update A Blog Post"})
// }
// )



// export default router;



// posts.js - Your routes file

// posts.js - Your routes file
import express from 'express';
const router = express.Router();
import posts from '../models/post_schema.js';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'duxahieum',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Set up multer for handling file uploads temporarily in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// GET all posts
router.get("/", async (req, res) => {
  try {
    const blogs = await posts.find();
    res.send(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// POST a new blog post
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, author, summary, content } = req.body;
    let imageUrl = null;

    // If image is provided via form data
    if (req.file) {
      // Convert buffer to base64
      const base64String = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      
      // Upload to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(base64String, {
        folder: 'blog_images',
      });
      
      imageUrl = uploadResult.secure_url;
    }
    // If imageUrl is provided directly in the request (from front-end Cloudinary upload)
    else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    }

    // Create and save the post
    const newPost = new posts({
      title,
      author,
      summary,
      content,
      image: imageUrl, // Store Cloudinary URL instead of file path
    });

    const createdPost = await newPost.save();
    res.json(createdPost);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Alternative POST endpoint that accepts JSON with imageUrl
router.post("/json", async (req, res) => {
  try {
    const { title, author, summary, content, imageUrl } = req.body;

    // Create and save the post
    const newPost = new posts({
      title,
      author,
      summary,
      content,
      image: imageUrl, // Store Cloudinary URL
    });

    const createdPost = await newPost.save();
    res.json(createdPost);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// GET a single post by ID
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const blog = await posts.findById(id);
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// DELETE a post by ID
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    
    // First, get the post to find the image URL
    const post = await posts.findById(id);
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    // Optional: Delete the image from Cloudinary if it exists
    if (post.image && post.image.includes('cloudinary')) {
      // Extract public_id from the URL
      const publicId = post.image.split('/').pop().split('.')[0];
      
      try {
        await cloudinary.uploader.destroy(`blog_images/${publicId}`);
      } catch (cloudinaryErr) {
        console.error("Error deleting image from Cloudinary:", cloudinaryErr);
        // Continue with post deletion even if image deletion fails
      }
    }
    
    // Delete the post from the database
    await posts.findOneAndDelete({ _id: id });
    
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// UPDATE a post by ID
router.patch("/:id", upload.single("image"), async (req, res) => {
  try {
    const id = req.params.id;
    const { title, author, summary, content } = req.body;
    
    // Prepare update object
    const updateData = {};
    if (title) updateData.title = title;
    if (author) updateData.author = author;
    if (summary) updateData.summary = summary;
    if (content) updateData.content = content;
    
    // Handle image update
    if (req.file) {
      // Convert buffer to base64
      const base64String = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      
      // Upload to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(base64String, {
        folder: 'blog_images',
      });
      
      updateData.image = uploadResult.secure_url;
    } else if (req.body.imageUrl) {
      updateData.image = req.body.imageUrl;
    }
    
    // Update the post
    const updatedPost = await posts.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );
    
    res.json(updatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

export default router;
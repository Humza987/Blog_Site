import express from 'express';
const router = express.Router();
import posts from '../models/post_schema.js';

router.get("/", async (req, res) => {
    try {
        const blogs = await posts.find();
        res.send(blogs);
      } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
      }
}
)

router.get("/:id", (req, res) => {
    res.json({message: "Get A Single Blog Post"})
}
)

router.post("/", async (req, res) => {
  try {
    const newPost = new posts({
        title: req.body.title,
        author: req.body.author,
        body: req.body.body,
    });
    const createdPost = await newPost.save();
    res.json(createdPost);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}
)

router.get("/:id", (req, res) => {
    res.json({message: "Get A Single Blog Post"})
}
)


router.delete("/:id", async (req, res) => {
    const id =req.params.id
    const post = await posts.findOneAndDelete({_id: id})
}
)

router.patch("/:id", (req, res) => {
    res.json({message: "Update A Blog Post"})
}
)



export default router;
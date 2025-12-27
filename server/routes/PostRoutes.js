import express from "express";
import Post from "../models/Post.js";
import { authMiddleware } from "../middleware/auth.js";
import { uploadPostImage } from "../middleware/upload1.js";


const router = express.Router();


// GET FEED (ALL POSTS)

router.post("/",authMiddleware,uploadPostImage.single("image"),async (req, res) => {
    try {
      const post = await Post.create({
        ownerId: req.user._id,
        image: `/uploads/posts/${req.file.filename}`,
        caption: req.body.caption,
        hashtags: req.body.hashtags
          ? req.body.hashtags.split(",").map(t => t.trim())
          : [],
        links: req.body.links 
          ? req.body.links.split(",").map(l => l.trim())
          : []
      });

      res.status(201).json(post);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

  //  GET SINGLE POST
router.get("/", authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("ownerId", "name userId avatar caption hashtags")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("ownerId", "name userId avatar caption hashtags");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//   LIKE / UNLIKE POST
router.post("/:id/like", authMiddleware, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const alreadyLiked = post.likes.some(
      id => id.toString() === userId.toString()
    );

    const update = alreadyLiked
      ? { $pull: { likes: userId } }
      : { $addToSet: { likes: userId } };  

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      update,
      { new: true }
    ).populate("ownerId", "name userId avatar");

    res.json(updatedPost);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.put(
  "/:id",
  authMiddleware,
  uploadPostImage.single("image"),
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      if (post.ownerId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized" });
      }

      if (req.body.caption !== undefined) {
        post.caption = req.body.caption;
      }

      if (req.body.hashtags !== undefined) {
        post.hashtags = req.body.hashtags
          ? req.body.hashtags.split(",")
          : [];
      }

      if (req.file) {
        post.image = `/uploads/posts/${req.file.filename}`;
      }

      await post.save();
      res.json(post);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);



// GET COMMENTS
router.get("/:id/comments", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("ownerId", "name userId avatar")
      .populate("comments.userId", "role name userId avatar");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD COMMENT
router.post("/:id/comment", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({
      userId: req.user._id,
      text: text.trim()
    });

    await post.save();

    const updatedPost = await Post.findById(req.params.id)
      .populate("ownerId", "name userId avatar")
      .populate("comments.userId", "name userId avatar");

    res.json(updatedPost.comments);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// EDIT COMMENT
router.put("/:postId/comment/:commentId", authMiddleware, async (req, res) => {
  const { text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ message: "Comment cannot be empty" });
  }

  const post = await Post.findById(req.params.postId);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const comment = post.comments.id(req.params.commentId);
  if (!comment) return res.status(404).json({ message: "Comment not found" });

  if (
    comment.userId.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({ message: "Not authorized" });
  }

  comment.text = text.trim();
  await post.save();

  const updatedPost = await Post.findById(req.params.postId)
    .populate("comments.userId", "name avatar role");

  res.json(updatedPost.comments);
});



// DELETE COMMENT
router.delete("/:postId/comment/:commentId", authMiddleware, async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // admin OR comment owner
    if (
      comment.userId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    comment.deleteOne();
    await post.save();

    const updatedPost = await Post.findById(postId)
      .populate("comments.userId", "name userId avatar");

    res.json(updatedPost.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});





//   DELETE POST
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.ownerId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await post.deleteOne();

    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


export default router;
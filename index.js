require("dotenv").config();
const express = require("express");
const cors = require('cors');
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies
// Rate limiting
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: "Too many requests from this IP, please try again in an hour!",
});

// Apply security headers using helmet
app.use(helmet());

// Apply the rate limiter to all /api routes
app.use("/api", limiter);

app.post("/post", async (req, res) => {
    console.log(req.body);
  const { bnbAddress, mboysAmount, tonAddress } = req.body;

  if (!bnbAddress || !mboysAmount || !tonAddress) {
    return res
      .status(400)
      .json({ error: "Please provide all required fields" });
  }

  try {
    const existingPost = await prisma.post.findFirst({
      where: {
        bnbAddress,
      },
    });

    if (existingPost) {
      const updatedPost = await prisma.post.update({
        where: {
          id: existingPost.id,
        },
        data: {
          tonAddress,
          mboysAmount: mboysAmount,
          updatedAt: new Date(),
        },
      });

      return res.status(200).json({
        status: "success",
        message: "Post updated successfully",
        data: {
          post: updatedPost,
        },
      });
    }

    const newPost = await prisma.post.create({
      data: {
        bnbAddress,
        mboysAmount,
        tonAddress,
      },
    });

    res.status(201).json({
      status: "success",
      message: "Post created successfully",
      data: {
        post: newPost,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Something went wrong", error });
  }
});

// Default route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Handling uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

// Start the server
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});

// Handling unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! Shutting down...");
  console.error(err.name, err.message);
  server.close(() => process.exit(1));
});

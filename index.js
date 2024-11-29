require("dotenv").config();

const cron = require("node-cron");
const fs = require("fs");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const { BlogRouter } = require("./routes/blog.routes");
const { UserRouter } = require("./routes/user.routes");
const { ContactRouter } = require("./routes/contact.routes");
const { default: helmet } = require("helmet");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(helmet());
app.use(
  cors({
    credentials: true,
  })
);
app.use(cookieParser());
app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
  });

cron.schedule("0 * * * *", () => {
  // Runs every hour on the hour
  const uploadDir = path.join(__dirname, "./uploads");

  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      console.error("Error reading uploads folder:", err.message);
      return;
    }

    if (files.length > 0) {
      files.forEach((file) => {
        const filePath = path.join(uploadDir, file);

        // Delete the file
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error deleting file:", err.message);
          } else {
            console.log(`File deleted: ${file}`);
          }
        });
      });
    } else {
      console.log("No files to delete in the uploads folder.");
    }
  });
});

// Routes
app.use("/api/blogs", BlogRouter);
app.use("/api/users", UserRouter);
app.use("/api/contact", ContactRouter);

app.use((err, req, res, next) => {
  console.error("Error middleware:", err.message);
  res.status(500).json({ error: err.message });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});

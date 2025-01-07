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
const { listingRouter } = require("./routes/listings.routes");
const { BannerRouter } = require("./routes/banner.routes");
const { default: helmet } = require("helmet");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

const allowedOrigin = [
  "https://lddrealty.com",
  "http://localhost:3000",
  "http://127.0.0.1:5500", // Added new origin
  "http://127.0.0.1:5501", // Added new origin
  "http://127.0.0.1:5502", // Added new origin
  "http://127.0.0.1:5503", // Added new origin
  "https://sujalcodecraft.github.io", // Added new origin
];

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigin.includes(origin)) return callback(null, true);
      else callback(new Error("cors origin error " + origin));
    },
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
  const uploadDir = path.join(__dirname, "./tmp");

  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      console.error("Error reading tmp folder:", err.message);
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
      console.log("No files to delete in the tmp folder.");
    }
  });
});

// Routes
app.get("/", (req, res) => {
  return res.status(200).json({ message: "OK" });
});
app.use("/api/blogs", BlogRouter);
app.use("/api/users", UserRouter);
app.use("/api/contact", ContactRouter);
app.use("/api/listing", listingRouter);
app.use("/api/banners", BannerRouter);

app.use((err, req, res, next) => {
  console.error("Error middleware:", err.message);
  res.status(500).json({ error: err.message });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});

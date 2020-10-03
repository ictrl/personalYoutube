const express = require("express");
const cors = require("cors");
const multer = require("multer");
const app = express();

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    console.log(req.body);
    console.log(req.file);
    console.log({ file });
    cb(null, "IMAGE-" + Date.now() + ".mp4");
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
}).single("record");

app.post("/upload", upload, function (req, res, next) {
  console.log("file", req.file);
  console.log("body", req.body);
  res.sendStatus(200);
});

app.listen(8000, function () {
  console.log("app listening on port 8000!");
});

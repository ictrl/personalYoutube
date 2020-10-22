require("dotenv").config();
const express = require("express");
const { createReadStream, unlink } = require("fs");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const app = express();
const { saveRecord, getRecords, deleteRecord } = require("./models/record");

mongoose.connect(
  process.env.DATABASE,
  { useUnifiedTopology: true, useNewUrlParser: true },
  () => console.log("DB CONNECTED")
);

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    cb(null, file.originalname + ".mp4");
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
}).single("record");

app.post("/upload", upload, async function (req, res, next) {
  const { file, body } = req;
  let doc = await saveRecord(file, body);
  res.sendStatus(200);
});

app.get("/videos/:ip", async (req, res) => {
  let ip = req.params.ip;
  let records = await getRecords(ip);
  res.json(records);
  return;
});

app.get("/video/:fileName", async (req, res) => {
  const { fileName } = req.params;

  if (fileName != "null") {
    var readStream = createReadStream(`public/uploads/${fileName}`);
    readStream.on("data", (data) => {
      res.write(data);
    });
    readStream.on("end", (data) => {
      res.status(200).send();
    });
  }
});

app.get("/delete/:fileName", (req, res) => {
  console.log("RUN");
  const { fileName } = req.params;
  console.log({ fileName });
  const path = `./public/uploads/${fileName}`;

  unlink(path, (err) => {
    if (err) {
      console.error(err);
      res.json(err);
      return;
    }
    deleteRecord(fileName);
    res.json(fileName);
  });
});

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }

const PORT = process.env.PORT || 8000;

app.listen(PORT, function () {
  console.log(`app listening on port ${PORT}`);
});

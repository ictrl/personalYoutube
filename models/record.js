const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema(
  {
    fileName: String,
    ip: String,
    timestamp: String,
    image: String,
  }
  //   { timestamps: true }
);

const recordModel = new mongoose.model("record", recordSchema);

const saveRecord = async (file, body) => {
  let fileName = file.path.split("\\")[2];
  const { ip, image, timestamp } = body;
  // fileName = `${ip}-${fileName}`;
  // console.log(fileName);
  try {
    const record = new recordModel({
      fileName,
      ip: ip,
      timestamp: timestamp,
      image: image,
    });
    let doc = await record.save();
    console.log(doc.fileName);
    return doc;
  } catch (error) {
    console.error({ error });
    throw error;
  }
};

const getRecords = async (ip) => {
  try {
    let docs = await recordModel.find({ ip }, { ip: 0, _id: 0, __v: 0 });
    return docs;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  saveRecord,
  getRecords,
};

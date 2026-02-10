const mongoose = require('mongoose');
const initdata =  require("./data.js");
const Listing = require("../models/listing.js");

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Adi');

}

const initDB = async()=>{
  await Listing.deleteMany({});
   initdata.data=initdata.data.map((obj) => ({...obj,owner : "697b4dd5ddcee209940b6fb1"}));
  await Listing.insertMany(initdata.data);
  console.log("data was initialized");

}

initDB();
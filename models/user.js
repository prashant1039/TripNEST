const mongoose = require("mongoose");

let passportLocalMongoose = require("passport-local-mongoose");
passportLocalMongoose = passportLocalMongoose.default || passportLocalMongoose;

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
});


UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);

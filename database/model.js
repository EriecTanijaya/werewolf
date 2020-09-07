const mongoose = require("mongoose");
const connectionString = process.env.mongo_uri;
mongoose
  .connect(connectionString, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log("You are now connected to Mongo!"))
  .catch(err => console.error("Something went wrong", err));

const Schema = mongoose.Schema;

let users = new Schema({
  id: {
    type: String,
    unique: true
  },
  name: {
    type: String
  },
  win: {
    type: Number,
    default: 0
  },
  lose: {
    type: Number,
    default: 0
  },
  draw: {
    type: Number,
    default: 0
  }
});

const User = mongoose.model("users", users);

module.exports = User;

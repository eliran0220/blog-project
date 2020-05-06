const mongoose = require("mongoose");
const UserSchema = mongoose.Schema({
    post: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      },
      likes: {
        type: [],
        required: false
      },
      likesNum: {
        type: Number,
        bsonType: "int",
        required: false
      },
      id: {
        type: String,
        required: false
      },
      createdAt: {
        type: String,
        required: false
      }
    });

    module.exports = mongoose.model("userpost", UserSchema,'posts');
//FILENAME : User.js

const mongoose = require("mongoose");
const UserSchema = mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  posts :{
    type: [],
    required:false
  },
  following :{
    type: [],
    required:false
  },
  
  followers :{
    type: [],
    required:false
  },

gender: {
  type: String,
  required:false
},
createdAt: {
  type: String
}
});

// export model user with UserSchema
module.exports = mongoose.model("user", UserSchema,'users');
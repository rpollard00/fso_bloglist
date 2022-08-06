const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  username: { 
    type: String,
    minLength: 3,
    unique: true, // must be unique
    required: true
  },
  name: String,
  passwordHash: {
    type: String,
    required: true
  }
  // reference to blog Objects

})

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash // don't put the has in here
  }
})

module.exports = mongoose.model("User", userSchema)
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  firstName: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  lastName: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  email: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  },
  password: {
    type:  mongoose.Schema.Types.String,
    required: true,
  },
  // phoneNumber: {
  //   type: mongoose.Schema.Types.String,
  //   required: false,
  // },
  // role: {
  //   type: mongoose.Schema.Types.String,
  //   enum: ["user", "admin"],
  //   default: "user",
  // }      
}); 
const User = mongoose.model("User", UserSchema);
export { User };
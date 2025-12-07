import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phonenumber: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ["competitor", "admin"], default: "competitor" },
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
import { Schema, model } from "mongoose";
import  bcryptjs  from "bcryptjs";

const userSchema = new Schema(
  {
    userName: { type: String, require: true, min: 3, max: 20 },
    email: { type: String, unique: true, require: true, lowercase: true },
    password: { type: String, require: true },
    isConfirmed: { type: Boolean, default: false },
    gender: { type: String, enum: ["male", "female"] },
    phone: { type: String },
    role: { type: String, enum: ["user", "admin", "seller"], default: "user" },
    forgetCode: String,
    profileImage: {
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/dfs84qxjl/image/upload/v1706546252/ecommerce/userDefault/default_jx8p3s.webp",
      },
      id: { type: String, default: "ecommerce/userDefault/default_jx8p3s" },
    },
    coverTmge: [{ url: { type: String }, id: { type: String } }],
  },
  { timeseries: true }
);

userSchema.pre("save", function () {
  if (this.isModified("password")) {
    this.password = bcryptjs.hashSync(
      this.password,
      parseInt(process.env.SALT_ROUND)
    );
 }
});

export const User = model("User", userSchema);

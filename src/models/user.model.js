import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    provider: {
      type: String,
      enum: ["email", "google"],
      default: "email",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    isTester: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    tourCompleted: {
      taskTour: { type: Boolean, default: false },
      gastosTour: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.__v;
    delete returnedObject.password;
    delete returnedObject.googleId;
  },
});

export default mongoose.model("User", userSchema);

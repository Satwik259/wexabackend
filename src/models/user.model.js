// import mongoose, { Schema } from "mongoose";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";

// const userSchema = new Schema(
//   {
//     username: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//       index: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },
//     password: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     role: {
//       type: String,
//       enum: ["admin", "user"],
//       default: "user",
//     },
//     refreshToken: {
//       type: String,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });
// userSchema.methods.isPasswordMatched = async function (password) {
//   return await bcrypt.compare(password, this.password);
// };

// userSchema.methods.generateAccessToken = function () {
//   return jwt.sign(
//     { _id: this._id, username: this.username },
//     process.env.ACCESS_TOKEN_SECRET,
//     {
//       expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
//     }
//   );
// };

// userSchema.methods.generateRefreshToken = function () {
//   return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
//     expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
//   });
// };

// export const User = mongoose.model("User", userSchema);

import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Define the user schema
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Reference to other users
    lastLogin: { type: Date, default: Date.now },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash password if modified or new
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to check if passwords match
userSchema.methods.isPasswordMatched = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Method to generate an access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, username: this.username },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// Method to generate a refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

// Export the User model
export const User = mongoose.model("User", userSchema);



// import mongoose, { Schema } from "mongoose";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";

// // Define the user schema
// const userSchema = new Schema(
//   {
//     username: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//       index: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },
//     password: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     role: {
//       type: String,
//       enum: ["admin", "user"],
//       default: "user",
//     },
//     refreshToken: {
//       type: String,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Middleware to hash the password before saving
// userSchema.pre("save", async function (next) {
//   try {
//     if (!this.isModified("password")) return next();
//     // Log before hashing
//     console.log("Hashing password for:", this.username);
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
//   } catch (error) {
//     console.error("Error hashing password:", error); // Log the error
//     next(error); // Pass the error to the next middleware
//   }
// });

// // Method to check if the provided password matches the hashed password
// userSchema.methods.isPasswordMatched = async function (password) {
//   if (!password) {
//     throw new Error("Password is required for comparison");
//   }
//   return await bcrypt.compare(password, this.password);
// };

// // Method to generate an access token
// userSchema.methods.generateAccessToken = function () {
//   return jwt.sign(
//     { _id: this._id, username: this.username },
//     process.env.ACCESS_TOKEN_SECRET,
//     {
//       expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
//     }
//   );
// };

// // Method to generate a refresh token
// userSchema.methods.generateRefreshToken = function () {
//   return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
//     expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
//   });
// };

// // Export the User model
// export const User = mongoose.model("User", userSchema);

// import mongoose, { Schema } from "mongoose";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";

// // Define the user schema
// const userSchema = new Schema(
//   {
//     username: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//       index: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },
//     password: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     role: {
//       type: String,
//       enum: ["admin", "user"],
//       default: "user",
//     },
//     refreshToken: {
//       type: String,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Middleware to hash the password before saving
// userSchema.pre("save", async function (next) {
//   try {
//     if (!this.isModified("password")) return next();
//     // Log before hashing
//     console.log("Hashing password for:", this.username);
//     const saltRounds = 10; // You can make this configurable if needed
//     this.password = await bcrypt.hash(this.password, saltRounds);
//     next();
//   } catch (error) {
//     console.error("Error hashing password:", error);
//     next(error);
//   }
// });

// // Method to check if the provided password matches the hashed password
// userSchema.methods.isPasswordMatched = async function (password) {
//   if (!password) {
//     throw new Error("Password is required for comparison");
//   }
//   return await bcrypt.compare(password, this.password);
// };

// // Method to generate an access token with additional data
// userSchema.methods.generateAccessToken = function (additionalData = {}) {
//   const payload = {
//     _id: this._id,
//     username: this.username,
//     email: this.email,
//     role: this.role,
//     ...additionalData
//   };
//   return jwt.sign(
//     payload,
//     process.env.ACCESS_TOKEN_SECRET,
//     {
//       expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
//     }
//   );
// };

// // Method to generate a refresh token with additional data
// userSchema.methods.generateRefreshToken = function (additionalData = {}) {
//   const payload = {
//     _id: this._id,
//     ...additionalData
//   };
//   return jwt.sign(
//     payload,
//     process.env.REFRESH_TOKEN_SECRET,
//     {
//       expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
//     }
//   );
// };

// // Export the User model
// export const User = mongoose.model("User", userSchema);

// import mongoose, { Schema } from "mongoose";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";

// // Define the user schema
// const userSchema = new Schema(
//   {
//     username: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//       index: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },
//     password: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     role: {
//       type: String,
//       enum: ["admin", "user"],
//       default: "user",
//     },
//     refreshToken: {
//       type: String,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Middleware to hash the password before saving
// userSchema.pre("save", async function (next) {
//   try {
//     if (!this.isModified("password")) return next();
//     // Log before hashing
//     console.log("Hashing password for:", this.username);
//     const saltRounds = 10; // You can make this configurable if needed
//     this.password = await bcrypt.hash(this.password, saltRounds);
//     next();
//   } catch (error) {
//     console.error("Error hashing password:", error);
//     next(error);
//   }
// });

// // Method to check if the provided password matches the hashed password
// userSchema.methods.isPasswordMatched = async function (password) {
//   if (!password) {
//     throw new Error("Password is required for comparison");
//   }
//   return await bcrypt.compare(password, this.password);
// };

// // Method to generate an access token with additional data
// userSchema.methods.generateAccessToken = function (additionalData = {}) {
//   const payload = {
//     _id: this._id,
//     username: this.username,
//     email: this.email,
//     role: this.role,
//     ...additionalData
//   };
//   return jwt.sign(
//     payload,
//     process.env.ACCESS_TOKEN_SECRET,
//     {
//       expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
//     }
//   );
// };

// // Method to generate a refresh token with additional data
// userSchema.methods.generateRefreshToken = function (additionalData = {}) {
//   const payload = {
//     _id: this._id,
//     ...additionalData
//   };
//   return jwt.sign(
//     payload,
//     process.env.REFRESH_TOKEN_SECRET,
//     {
//       expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
//     }
//   );
// };

// // Export the User model
// export const User = mongoose.model("User", userSchema);
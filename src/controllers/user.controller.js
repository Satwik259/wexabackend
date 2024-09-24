import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;
  if ([username, email, password].some((field) => field?.trim() === "")) {
    return next(new ApiError(400, "All fields are required"));
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { username: username }],
  });
  if (existingUser) {
    return next(new ApiError(409, "User already exists"));
  }

  const user = await User.create({
    email,
    password,
    username: username.toLowerCase(),
  });

  const createUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createUser) {
    return next(new ApiError(500, "Failed to create user"));
  }
  return res
    .status(201)
    .json(new ApiResponse(201, "User created successfully", createUser));
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, username, password } = req.body;
  if (!email && !username) {
    return next(new ApiError(400, "Email and username are required"));
  }

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (!user) {
    return next(new ApiError(401, "Invalid user credentials"));
  }
  const isMatch = await user.isPasswordMatched(password);
  if (!isMatch) {
    return next(new ApiError(401, "Invalid user credentials"));
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  const LoggedUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: LoggedUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", "", options)
    .cookie("refreshToken", "", options)
    .json(new ApiResponse(200, "User logged out successfully", null));
});

const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    return next(new ApiError(401, "unauthorized request"));
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken._id);

    if (!user) {
      return next(new ApiError(401, "invalid refresh token"));
    }

    if (user.refreshToken !== incomingRefreshToken) {
      return next(new ApiError(401, "Refresh token is expired"));
    }
    const options = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );
    const loggedUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedUser,
            accessToken,
            refreshToken,
          },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

export { registerUser, loginUser, logoutUser, refreshAccessToken };

// import { ApiError } from "../utils/ApiError.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import { User } from "../models/user.model.js";
// import jwt from "jsonwebtoken";

// // Function to generate access and refresh tokens
// const generateAccessAndRefreshTokens = async (userId) => {
//   try {
//     const user = await User.findById(userId);
//     if (!user) throw new Error("User not found"); // Ensure user exists
//     const accessToken = user.generateAccessToken();
//     const refreshToken = user.generateRefreshToken();
//     user.refreshToken = refreshToken; // Set refresh token for the user
//     await user.save({ validateBeforeSave: false });
//     return { accessToken, refreshToken };
//   } catch (error) {
//     throw new ApiError(500, "Something went wrong while generating refresh and access token");
//   }
// };

// // User registration handler
// const registerUser = asyncHandler(async (req, res, next) => {
//   const { username, email, password } = req.body;
//   if ([username, email, password].some((field) => !field?.trim())) {
//     return next(new ApiError(400, "All fields are required"));
//   }

//   const existingUser = await User.findOne({
//     $or: [{ email }, { username: username.toLowerCase() }],
//   });
//   if (existingUser) {
//     return next(new ApiError(409, "User already exists"));
//   }

//   const user = await User.create({
//     email: email.toLowerCase(),
//     password,
//     username: username.toLowerCase(),
//   });

//   const createUser = await User.findById(user._id).select("-password -refreshToken");
//   if (!createUser) {
//     return next(new ApiError(500, "Failed to create user"));
//   }
//   return res.status(201).json(new ApiResponse(201, "User created successfully", createUser));
// });

// // User login handler
// const loginUser = asyncHandler(async (req, res, next) => {
//   const { email, username, password } = req.body;

//   if (!email && !username) {
//     return next(new ApiError(400, "Email or username is required"));
//   }

//   const user = await User.findOne({ $or: [{ email }, { username }] });
//   if (!user) {
//     return next(new ApiError(401, "Invalid user credentials"));
//   }

//   const isMatch = await user.isPasswordMatched(password);
//   if (!isMatch) {
//     return next(new ApiError(401, "Invalid user credentials"));
//   }

//   const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
//   const LoggedUser = await User.findById(user._id).select("-password -refreshToken");

//   const options = {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production", // Only secure in production
//     sameSite: "strict", // Add SameSite attribute for security
//   };

//   return res
//     .status(200)
//     .cookie("accessToken", accessToken, options)
//     .cookie("refreshToken", refreshToken, options)
//     .json(new ApiResponse(200, {
//       user: LoggedUser,
//       accessToken,
//       refreshToken,
//     }, "User logged in successfully"));
// });

// // User logout handler
// const logoutUser = asyncHandler(async (req, res) => {
//   await User.findByIdAndUpdate(req.user._id, {
//     $unset: { refreshToken: 1 },
//   }, { new: true });

//   const options = {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production", // Only secure in production
//     sameSite: "strict", // Add SameSite attribute for security
//   };

//   return res
//     .status(200)
//     .cookie("accessToken", "", { ...options, expires: new Date(0) })
//     .cookie("refreshToken", "", { ...options, expires: new Date(0) })
//     .json(new ApiResponse(200, "User logged out successfully", null));
// });

// // Refresh access token handler
// const refreshAccessToken = asyncHandler(async (req, res, next) => {
//   const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

//   if (!incomingRefreshToken) {
//     return next(new ApiError(401, "Unauthorized request"));
//   }

//   try {
//     const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
//     const user = await User.findById(decodedToken._id);

//     if (!user) {
//       return next(new ApiError(401, "Invalid refresh token"));
//     }

//     if (user.refreshToken !== incomingRefreshToken) {
//       return next(new ApiError(401, "Refresh token is expired"));
//     }

//     const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
//     const loggedUser = await User.findById(user._id).select("-password -refreshToken");

//     const options = {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production", // Only secure in production
//       sameSite: "strict", // Add SameSite attribute for security
//     };

//     return res
//       .status(200)
//       .cookie("accessToken", accessToken, options)
//       .cookie("refreshToken", refreshToken, options)
//       .json(new ApiResponse(200, {
//         user: loggedUser,
//         accessToken,
//         refreshToken,
//       }, "Access token refreshed"));
//   } catch (error) {
//     return next(new ApiError(401, error.message || "Invalid refresh token"));
//   }
// });

// export { registerUser, loginUser, logoutUser, refreshAccessToken };

import { User } from "../Models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessandRefreshToken = async(userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generaterefreshToken()
    user.refreshToken = refreshToken
    user.save({validateBeforeSave : false})
    return {accessToken, refreshToken}
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating access and refresh token")
  }
}
// const registerUser = asyncHandler(async (req, res) => {
//   // get user data from req.body
//   const { username, fullname, email, password } = req.body;
//   // check validation for no empty field
//   if (
//     [username, fullname, email,  password].some(
//       (field) => field?.trim() === ""
//     )
//   ) {
//     throw new ApiError(400, "All fields are required");
//   }
//   // check if already user exist
//   const existedUser =await User.findOne({
//     $or: [{ username }, { email }],
//   });
//   if (existedUser) {
//     throw new ApiError(409, "User already existed with email or username");
//   }
//   // check for images, check for avatar
//   // upload them to cloudinary, avatar
//   // create user object - create entry in db
//   // remove password and refresh token field from response
//   // check for user creation
//   // return res

//   const avatarLocalpath = req.files?.avatar[0].path;
//   console.log("avatar local path::::",avatarLocalpath);
//   if (!avatarLocalpath) {
//     throw new ApiError(409, "Avatar is required");
//   }
//   const avatar = await uploadOnCloudinary(avatarLocalpath);
//   console.log(avatar)

//   if (!avatar) {
//     throw new ApiError(500, "Avatar file is required");
//   }

//   const user = await User.create({
//     fullname,
//     email,
//     username,
//     password,
//     avatar: avatar.url,
//   });

//   const createdUser = await User.findById(user._id).select("-password -refreshToken");

//   if (!createdUser) {
//     throw new ApiError(500, "Something went wrong while register user");
//   }

//   return res
//     .status(201)
//     .json(new ApiResponse(200, createdUser, "User registered Successfully"));
// });



const registerUser = asyncHandler(async (req, res) => {
  const { username, fullname, email, password } = req.body;

  // 1. Validate fields
  if ([username, fullname, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  // 2. Check if user already exists
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User already exists with email or username");
  }

  // 3. Check avatar upload
  const avatarLocalpath = req.files?.avatar?.[0]?.path;
  if (!avatarLocalpath) {
    throw new ApiError(409, "Avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalpath);
  if (!avatar) {
    throw new ApiError(500, "Error while uploading avatar");
  }

  // 4. Create new user
  const user = await User.create({
    fullname,
    email,
    username,
    password,
    avatar: avatar.url,
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  // 5. Generate tokens
  const { accessToken, refreshToken } = await generateAccessandRefreshToken(user._id);

  // 6. Set cookies
  const options = {
    httpOnly: true,
    secure: true, // use true in production with HTTPS
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: createdUser, accessToken, refreshToken },
        "User registered successfully"
      )
    );
});

const loginUser = asyncHandler(async(req, res) => {
  //get email username and password from req.body
  const {email, username, password} = req.body;
  // check for username or email has been given by the user or not
  if(!username && !email){
    throw new ApiError(404, "Username or email is required");
  }
  // find user is registered or not
  const user =await User.findOne({
    $or : [
      {email},
      {username}
    ]
  })
  // check if not throw an error
  if(!user){
    throw new ApiError(404, "USer does not exist");
  }

  const ispasswordValid = user.isPasswordCorrect(password);

  if(!ispasswordValid){
    throw new ApiError(401, "The password is not correct");
  }

  const {accessToken, refreshToken} = await generateAccessandRefreshToken(user._id);

  const loggedInuser = await User.findById(user._id).select("-password -refreshToken")

  const options = {
    httpOnly : true,
    secur : true
  }

  return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
    new ApiResponse(
      200, 
      {
        user : loggedInuser, accessToken, refreshToken
      },
      "User loggedIn successfully"
    )
  )



})


const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});


const getCurrentUser = asyncHandler(async (req, res) => {
  // req.user is set by authMiddleware (decoded from accessToken)
  const user = await User.findById(req.user._id).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User profile fetched successfully"));
});



export {registerUser, loginUser, logoutUser, getCurrentUser};

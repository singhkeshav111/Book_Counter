import { User } from "../Models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
const registerUser = asyncHandler(async (req, res) => {
  // get user data from req.body
  const { username, fullname, email, password } = req.body;
  // check validation for no empty field
  if (
    [username, fullname, email,  password].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }
  // check if already user exist
  const existedUser =await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User already existed with email or username");
  }
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  const avatarLocalpath = req.files?.avatar[0].path;
  console.log("avatar local path::::",avatarLocalpath);
  if (!avatarLocalpath) {
    throw new ApiError(409, "Avatar is required");
  }
  const avatar = await uploadOnCloudinary(avatarLocalpath);
  console.log(avatar)

  if (!avatar) {
    throw new ApiError(500, "Avatar file is required");
  }

  const user = await User.create({
    fullname,
    email,
    username,
    password,
    avatar: avatar.url,
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while register user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

export default registerUser;

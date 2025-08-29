import jwt from "jsonwebtoken";
import {User} from "../Models/user.model.js";
import { ApiError } from "../utils/apiError.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    if (!token) {
      throw new ApiError(401, "Unauthorized: No token provided");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);

    const user = await User.findById(decoded._id).select("-password -refreshToken");
    if (!user) {
      throw new ApiError(401, "Unauthorized: User not found");
    }

    req.user = decoded; // ✅ so you can access req.user._id in logout
    next();
  } catch (error) {
    throw new ApiError(401, "Unauthorized: Invalid token");
  }
};

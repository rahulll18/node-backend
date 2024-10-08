import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/Apierror.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/Apiresponse.js";

const registerUser = asyncHandler(async (req, res) => {
  //get user details from the frontend
  const { fullName, username, email, password } = req.body;

  //validation  user details - not empty
  if (
    [fullName, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  //check if user already exists
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  //check for images and check for avtar
  const avatarLocalFilePath = req.files?.avtar[0]?.path;

  let coverImageLocalFilePath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalFilePath = req.files?.coverImage[0]?.path;
  }

  if (!avatarLocalFilePath) {
    throw new ApiError(400, "Avtar file is required");
  }

  const avtar = await uploadOnCloudinary(avatarLocalFilePath);
  const coverImage = await uploadOnCloudinary(coverImageLocalFilePath);

  if (!avtar) {
    throw new ApiError(400, "Avtar file is required");
  }

  //create user and entry in the db
  const user = await User.create({
    fullName,
    username: username.toLowerCase(),
    email,
    password,
    avtar: avtar.url,
    coverImage: coverImage?.url || "",
  });

  //remove password and refresh token from the createdUser by select method
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering ");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered Successfully "));
});

const loginUser = asyncHandler(async (req, res) => {
  // take data from the frontend
  const { email, username, password } = req.body;

  if (!email || !username) {
    throw new ApiError(400, "Username or Password is required");
  }

  //If email or password is there then find the user with that email and password
  const user = await User.findOne({ $or: [{ email }, { password }] });

  if (!user) {
    throw new ApiError(401, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid Password");
  }
});

export { registerUser };

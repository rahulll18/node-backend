import { asyncHandler } from "../utils/asyncHandler.js";
import { upload } from "../middlewares/multer.middlware.js";
import { ApiError } from "../utils/Apierror.js";
import { User } from "../models/user.model.js";

const registerUser = asyncHandler(async (req, res, next) => {
  try {
    //get user details from the frontend
    const { fullName, username, email, password } = req.body;

    //validation  user details - not empty
    if (
      [fullName, username, email, password].some(
        (field) => field?.trim() === ""
      )
    ) {
      throw new ApiError(400, "All fields are required");
    }

    //check if user already exists
    const existingUser = User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser)
      throw new ApiError(409, "User with email or username already exists");


    


  } catch (error) {}
});

export { registerUser };

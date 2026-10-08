import mongoose from "mongoose";
import {user_schema} from "../schemas/UsersSchema"

export const user = mongoose.model("user", user_schema)
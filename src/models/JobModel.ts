import mongoose from "mongoose";
import {job_schema} from "../schemas/JobSchema"

export const job_model = mongoose.model("job", job_schema)
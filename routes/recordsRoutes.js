import express from "express";
import checkAuth from "../middleware/checkAuth.js";
import { createRecord } from "../controllers/recordsController.js";

const router = express.Router();

router.post("/", checkAuth, createRecord);

export default router;

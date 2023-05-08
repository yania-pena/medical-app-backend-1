import express from "express";
import checkAuth from "../middleware/checkAuth.js";
import { createDate, getDatesByEspecialist, getDatesByPatient } from "../controllers/datesController.js";

const router = express.Router();

router.post("/", checkAuth, createDate);
router.get("/byEspecialist/:id", checkAuth, getDatesByEspecialist);
router.get("/byPatient/:id", checkAuth, getDatesByPatient);

export default router;

import express from "express";
import checkAuth from "../middleware/checkAuth.js";
import {
  createDate,
  getDatesByEspecialist,
  editDates,
  getDatesRecent,
  getDatesByPatient,
  deleteDate,
} from "../controllers/datesController.js";

const router = express.Router();

router.post("/", checkAuth, createDate);
router.get("/byEspecialist/:id", checkAuth, getDatesByEspecialist);
router.put("/:id", checkAuth, editDates);
router.get("/datesrecent", checkAuth, getDatesRecent);
router.get("/byPatient/:id", checkAuth, getDatesByPatient);
router.delete("/:id", checkAuth, deleteDate)

export default router;

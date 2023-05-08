import { emailDate } from "../helpers/emails.js";
import DateModel from "../models/Dates.js";
import User from "../models/Users.js";
import mongoose from "mongoose";

const createDate = async (req, res) => {
  const { idpatient, idespecialist } = req.body;

  try {
    const existPatient = await User.find({
      _id: idpatient,
      isPatient: true,
    });
    const existEspecialist = await User.find({
      _id: idespecialist,
      $or: [{ isPychologist: true }, { isNutri: true }, { isDoctor: true }],
    });

    if (!existPatient[0]) {
      const error = new Error("Paciente no registrado");
      return res.status(400).json({ msg: error.message, status: false });
    }

    if (!existEspecialist[0]) {
      const error = new Error("Especialista no registrado");
      return res.status(400).json({ msg: error.message, status: false });
    }

    const date = new DateModel(req.body);
    await date.save();

    existPatient[0].dates.push(date._id);
    await existPatient[0].save();

    existEspecialist[0].dates.push(date._id);
    existEspecialist[0].patients.push(idpatient);
    await existEspecialist[0].save();

    emailDate({
      firstname: existPatient[0].firstname,
      email: existPatient[0].email,
      especialistemail: existEspecialist[0].email,
    });

    res.status(200).json({ msg: "Cita agendada correctamente", status: true });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ msg: error.message, status: false });
  }
};

const getDatesByEspecialist = async (req, res) => {
  const { id } = req.params;
  try {
    const dates = await DateModel.find({
      idespecialist: new mongoose.Types.ObjectId(id),
    });
    res.status(200).json({ data: dates, status: true });
  } catch (error) {
    res.status(400).json({ msg: error.message, status: false });
  }
};



const getDatesByPatient = async (req, res) => {
    const { id } = req.params;
    try {
        const dates = await DateModel.find({
            idpatient: new mongoose.Types.ObjectId(id)
        });
        res.status(200).json({ data: dates, status: true });
    } catch (error) {
        res.status(400).json({ msg: error.message, status: false });
    }
}

export { createDate, getDatesByEspecialist, getDatesByPatient };

import DateModel from "../models/Dates.js";
import Record from "../models/MedicalRecords.js";
import User from "../models/Users.js";

const createRecord = async (req, res) => {
  const { idpatient, idespecialist, iddate } = req.body;

  try {
    const existPatient = await User.find({
      _id: idpatient,
      isPatient: true,
    });
    const existEspecialist = await User.find({
      _id: idespecialist,
      $or: [{ isPychologist: true }, { isNutri: true }],
    });

    if (!existPatient[0]) {
      const error = new Error("Paciente no registrado");
      return res.status(400).json({ msg: error.message, status: false });
    }

    if (!existEspecialist[0]) {
      const error = new Error("Especialista no registrado");
      return res.status(400).json({ msg: error.message, status: false });
    }

    const existDate = await DateModel.find({
      _id: iddate,
    });

    if (!existDate[0]) {
      const error = new Error("Cita no registrada");
      return res.status(400).json({ msg: error.message, status: false });
    }

    const record = new Record(req.body);
    await record.save();
    existDate[0].record = record._id;
    await existDate[0].save();

    res
      .status(200)
      .json({ msg: "Registro Medico creado Correctamente", status: true });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ msg: error.message, status: false });
  }
};

export { createRecord };

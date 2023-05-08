import createId from "../helpers/createId.js";
import createJWT from "../helpers/createJWT.js";
import { emailCredentials, emailForgetPassword } from "../helpers/emails.js";
import User from "../models/Users.js";

const registerPatients = async (req, res) => {
  const { email, isPychologist, isDoctor, isNutri, isPatient } = req.body;

  const UserExist = await User.findOne({ email: email });

  if (UserExist) {
    const error = new Error("Usuario ya registrado");
    return res.status(400).json({ msg: error.message, status: false });
  }

  try {
    if (isDoctor || isPychologist || isNutri || !isPatient) {
      const error = new Error("El usuario debe ser un Paciente");
      return res.status(400).json({ msg: error.message, status: false });
    } else {
      const user = new User(req.body);
      user.token = "";
      await user.save();

      emailCredentials({
        firstname: user.firstname,
        email: user.email,
      });
    }
    res.status(200).json({ msg: "Usuario creado Correctamente", status: true });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ msg: error.message, status: false });
  }
};

const registerDoctors = async (req, res) => {
  const { email, isPatient, isPychologist, isNutri, isDoctor } = req.body;

  const UserExist = await User.findOne({ email: email });

  if (UserExist) {
    const error = new Error("Usuario ya registrado");
    return res.status(400).json({ msg: error.message, status: false });
  }

  try {
    if (isPatient || isPychologist || isNutri || !isDoctor) {
      const error = new Error("El usuario debe ser un Doctor");
      return res.status(400).json({ msg: error.message, status: false });
    } else {
      const user = new User(req.body);
      user.token = "";
      await user.save();
    }
    res.status(200).json({ msg: "Usuario creado Correctamente", status: true });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ msg: error.message, status: false });
  }
};

const editUsers = async (req, res) => {
  const { id } = req.params;
  const { user } = req;
  try {
    const userExist = await User.findById(id);

    if (!userExist) {
      const error = new Error("Usuario no encontrado");
      return res.status(401).json({ msg: error.message });
    }
    if (!user.isDoctor) {
      const error = new Error("Usuario no autorizado para esta accion");
      return res.status(400).json({ msg: error.message, status: false });
    } else {
      userExist.firstname = req.body.firstname || userExist.firstname;
      userExist.lastname = req.body.lastname || userExist.lastname;
      const userstored = await userExist.save();
      res.status(200).json({ msg: userstored, status: true });
    }
  } catch (error) {
    res.status(404).json({ msg: "El id que ingresaste no es valido" });
  }
};

const editProfile = async (req, res) => {
  const { user } = req;
  try {
    const userExist = await User.findById(user._id);

    if (!userExist) {
      const error = new Error("Usuario no encontrado");
      return res.status(400).json({ msg: error.message, status: false });
    }

    if (user.isPatient) {
      const error = new Error("Usuario no autorizado para esta accion");
      return res.status(400).json({ msg: error.message, status: false });
    }

    userExist.firstname = req.body.firstname || userExist.firstname;
    userExist.lastname = req.body.lastname || userExist.lastname;
    const userstored = await userExist.save();
    res.status(200).json({ msg: userstored, status: true });
  } catch (error) {
    res.status(404).json({ msg: "El id que ingresaste no es valido" });
  }
};

const registerNutri = async (req, res) => {
  const { email, isPatient, isPychologist, isNutri, isDoctor } = req.body;

  const UserExist = await User.findOne({ email: email });

  if (UserExist) {
    const error = new Error("Usuario ya registrado");
    return res.status(400).json({ msg: error.message, status: false });
  }

  try {
    if (isPatient || isPychologist || !isNutri || isDoctor) {
      const error = new Error("El usuario debe ser un Nutriologo");
      return res.status(400).json({ msg: error.message, status: false });
    } else {
      const user = new User(req.body);
      user.token = "";
      await user.save();
    }
    res.status(200).json({ msg: "Usuario creado Correctamente", status: true });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ msg: error.message, status: false });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("El usuario no existe");
    return res.status(400).json({ msg: error.message });
  }

  if (await user.comprobarPassword(password)) {
    res.json({
      _id: user._id,
      token: createJWT(user._id),
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      isPatient: user.isPatient,
      isDoctor: user.isDoctor,
      dates: user.dates || [],
    });
  } else {
    const error = new Error("El password es incorrecto");
    return res.status(403).json({ msg: error.message });
  }
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("El usuario no existe");
    return res.status(400).json({ msg: error.message });
  }

  try {
    user.token = createId();
    await user.save();
    emailForgetPassword({
      email: user.email,
      firstname: user.firstname,
      token: user.token,
    });
    res.status(200).json({
      msg: "Hemos enviado un email a su correo con las istrucciones para recuperar su contraseña",
    });
  } catch (error) {
    console.log(error);
  }
};

const findoutToken = async (req, res) => {
  const { token } = req.params;
  const ValidToken = await User.findOne({ token });
  if (ValidToken) {
    res.status(200).json({ msg: "Token valido y el usuario existe" });
  } else {
    const error = new Error("Token no valido");
    return res.status(400).json({ msg: error.message });
  }
};

const NewPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({ token });
  if (user) {
    try {
      user.password = password;
      user.token = "";

      await user.save();
      res.json({ msg: "Contraseña Modificado Correctamente" });
    } catch (error) {
      console.log(error);
    }
  } else {
    const error = new Error("Token no valido");
    return res.status(400).json({ msg: error.message });
  }
};

const getPatients = async (req, res) => {
  const { user } = req;

  if (!user.isDoctor) {
    const error = new Error("Usuario no autorizado para esta accion");
    return res.status(400).json({ msg: error.message, status: false });
  }

  try {
    const patients = await User.find({ isPatient: true }).populate({
      path: "dates",
      populate: {
        path: "record",
      },
    });
    res.status(200).json({ data: patients, status: true });
    console.log(patients);
  } catch (error) {
    res.status(400).json({ msg: error.message, status: false });
  }
};

const getPatient = async (req, res) => {
  const { id } = req.params;
  const { user } = req;

  if (!user.isDoctor) {
    const error = new Error("Usuario no autorizado para esta accion");
    return res.status(400).json({ msg: error.message, status: false });
  }

  try {
    const patients = await User.find({ _id: id, isPatient: true }).populate({
      path: "dates",
      populate: {
        path: "record",
      },
    });

    if (!patients[0]) {
      const error = new Error("el usuario no es un paciente");
      return res.status(400).json({ msg: error.message, status: false });
    }

    res.status(200).json({ data: patients, status: true });
    console.log(patients);
  } catch (error) {
    res.status(400).json({ msg: error.message, status: false });
  }
};

const getDateSpecialists = async (req, res) => {
  const { user } = req;
  try {
    if (!user.dates || user.dates.length === 0) {
      const specialists = await User.find({ isDoctor: true });
      res.status(200).json({ data: specialists, status: true });
    } else if (user.dates.length > 0) {
      const specialists = await User.find({
        $or: [{ isDoctor: true }, { isNutri: true }, { isPychologist: true }],
      });
      res.status(200).json({ data: specialists, status: true });
    }
  } catch (error) {
    res.status(400).json({ msg: error.message, status: false });
  }
};

const getSpecialists = async (req, res) => {
  const { user } = req;

  try {
    const specialists = await User.find({
      $or: [{ isNutri: true }, { isPychologist: true }, { isDoctor: true }],
    })
      .populate({
        path: "dates",
        populate: {
          path: "record",
        },
      })
      .populate("patients");
    res.status(200).json({ data: specialists, status: true });
    console.log(specialists);
  } catch (error) {
    res.status(400).json({ msg: error.message, status: false });
  }
};

const getSpecialist = async (req, res) => {
  const { id } = req.params;
  const { user } = req;

  if (!user.isDoctor) {
    const error = new Error("Usuario no autorizado para esta accion");
    return res.status(400).json({ msg: error.message, status: false });
  }

  try {
    const specialist = await User.find({
      _id: id,
      $or: [{ isNutri: true }, { isPychologist: true }],
    })
      .populate({
        path: "dates",
        populate: {
          path: "record",
        },
      })
      .populate("patients");

    if (!specialist[0]) {
      const error = new Error("el usuario no es un especialista");
      return res.status(400).json({ msg: error.message, status: false });
    }

    res.status(200).json({ data: specialist, status: true });
    console.log(specialist);
  } catch (error) {
    res.status(400).json({ msg: error.message, status: false });
  }
};

const profile = async (req, res) => {
  const { user } = req;
  res.status(200).json({ data: user, status: true });
};

export {
  registerPatients,
  registerDoctors,
  login,
  forgetPassword,
  findoutToken,
  NewPassword,
  getPatients,
  getDateSpecialists,
  getSpecialists,
  registerNutri,
  profile,
  editUsers,
  editProfile,
  getPatient,
  getSpecialist,
};

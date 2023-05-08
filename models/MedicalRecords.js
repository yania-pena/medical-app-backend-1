import mongoose from "mongoose";

const RecordSchema = mongoose.Schema(
  {
    iddate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dates",
      required: true,
    },
    isMain: {
      type: Boolean,
      trim: true,
    },
    idpatient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuarios",
      required: true,
    },
    idespecialist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuarios",
      required: true,
    },
    generalInfo: {
      bornDate: {
        type: Date,
        // required: true,
        trim: true,
      },
      bornPlace: {
        type: String,
        required: true,
        trim: true,
      },
      ci: {
        type: String,
        required: true,
        trim: true,
      },
      civilState: {
        type: String,
        required: true,
        trim: true,
      },
    },

    contactInfo: {
      address: {
        type: String,
        required: true,

        //   validate: {
        //     validator: function () {
        //       return this.isPatient != true && this.address != null;
        //     },
        //     message: "Direccion requerida",
        //   },
        trim: true,
      },
      phone: {
        type: Number,
        required: true,
        trim: true,
      },
    },

    medicalInfo: {
      height: {
        type: Number,
        required: true,
        trim: true,
      },
      imc: {
        type: Number,
        required: true,
        trim: true,
      },
      weight: {
        type: Number,
        required: true,
        trim: true,
      },
    },
  },

  {
    timestamps: true,
  }
);

const Record = mongoose.model("Record", RecordSchema);

export default Record;

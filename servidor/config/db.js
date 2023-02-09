import mongoose from "mongoose";

require('dotenv').config({path: 'variables.env'});

const conectarDB = async () => {
  mongoose.set("strictQuery", false);
  try {
    await mongoose.connect(process.env.DB_MONGO, {

    })
    console.log('DB CONECTADA')
  } catch (error) {
    console.log('Hubo un error')
    console.log(error)
    process.exit(1);
  }
}

export default conectarDB;
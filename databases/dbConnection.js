import mongoose from "mongoose";


const dbConnection = () => {
    mongoose
      .connect(process.env.DB_CONNECTION)
      .then((conn) => console.log(`Database connected `))
      .catch((err) => console.log(` Database Error: ${err}`));
}


export default dbConnection
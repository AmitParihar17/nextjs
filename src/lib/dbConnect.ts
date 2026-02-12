import mongoose from "mongoose";
type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
    console.log(db, "DB");
 connection.isConnected = db.connections[0].readyState
 console.log(db.connection,"DB.connection");
 
 console.log("DB connected successfully");
 
  } catch (error) {
    if(error instanceof Error){
    console.log(error.message ,"DB connection failed");
    }
    process.exit(1)
  }
}


export default dbConnect
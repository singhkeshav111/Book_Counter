import mongoose from 'mongoose'

const URI = process.env.MONGODB_URI;

import { DB_NAME } from '../constant.js';

const ConnectedDB = async() => {
    try {
       const connectionInstance = await mongoose.connect(`${URI}/${DB_NAME}`) ;
       console.log("DB Connected Successfully!!" , connectionInstance.connection.host);
    } catch (error) {
        console.log("Error in connect to DB",error);
        process.exit(1);
    }
}

export default ConnectedDB; 
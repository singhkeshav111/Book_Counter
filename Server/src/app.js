import express from 'express';
import cookieparser from 'cookie-parser';
import cors from 'cors';


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: '16kb'}));
//json data enter at a limit


app.use(express.urlencoded({limit: '16kb'})); 
//upper line is params data which is  used to encrypted like url encrypted 

app.use(express.static("public"));
// it is used to keep the file in pyublic folder which will be uploaded


app.use(cookieparser())
// it is used to keep the cookie data to perform crud operatiion on user's browser



export default app;
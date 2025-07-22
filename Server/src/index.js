
import dotenv from 'dotenv';
import ConnectedDB from './DB/index.js';
import app from './app.js';


dotenv.config();



const PORT = process.env.PORT || 5000;


ConnectedDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`App is listening on PORT ${PORT}`)
    })
})
.catch((err) => {
    console.log("Database Connection Failed !!!", err)
})
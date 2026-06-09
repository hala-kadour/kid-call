import express from "express";
import dotenv from "dotenv";
import { protectedRoute } from "./middlewares/protected-route.js"
;
dotenv.config();

const app = express();


app.use(protectedRoute);

app.get('/mysecret', (req, res) => {
    res.send("This is my secret!!");
});



// Bearer ....
app.listen(process.env.LISTEN_PORT, () => console.log(`Listening at port ${process.env.LISTEN_PORT}`));
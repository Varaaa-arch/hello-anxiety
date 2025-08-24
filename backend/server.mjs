import express from "express";
import cors from "cors";
import qrisRouter from "./qris.mjs";
import antrianRouter from "./antrian.mjs";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/payment", qrisRouter);
app.use("/api/antrian", antrianRouter);

const PORT = 3000;
app.listen(PORT, ()=> {
    console.log(`${PORT}`);  
})
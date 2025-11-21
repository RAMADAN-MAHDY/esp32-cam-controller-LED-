import express from "express";
// import transcribeRouter from "./routes/transcribe.js";
import connectDB from './config/db.js';
import deviceRouter from "./routes/device.js";

const app = express();
const PORT = 3000;


// الاتصال بقاعدة البيانات
connectDB();    

app.use("/device", deviceRouter);
// استخدام الراوتر
// app.use("/transcribe", transcribeRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

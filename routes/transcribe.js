import express from "express";
import multer from "multer";
import fs from "fs";
import OpenAI from "openai";
import path from "path";
import dotenv from "dotenv";

// تحميل متغيرات البيئة من ملف .env
dotenv.config();

const router = express.Router();
const upload = multer({ dest: "uploads/" });

 const lemonfoxAi_API = process.env.lemonfoxAi_API;
// إعداد OpenAI مع LemonFox API

const openai = new OpenAI({
  apiKey: lemonfoxAi_API, // خليه في .env لاحقًا
  baseURL: "https://api.lemonfox.ai/v1",
});

// POST /transcribe
router.post("/", upload.single("audio"), async (req, res) => {
  const audioPath = req.file?.path;

  if (!audioPath) {
    return res.status(400).json({ error: "الملف غير موجود" });
  }

  try {
    const result = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: "whisper-1",
      response_format: "json",
    });

    // حذف الملف بعد الاستخدام
    fs.unlink(audioPath, () => {});

    res.json({ text: result.text });
  } catch (err) {
    res.status(500).json({ error: "فشل التحويل", details: err.message });
  }
});

export default router;



// import { createWriteStream } from "fs";
// import { Readable } from "stream";
// import { finished } from "stream/promises";

// const response = await fetch("https://api.lemonfox.ai/v1/audio/speech", {
//   method: "POST",
//   headers: {
//     "Authorization": "Bearer YOUR_API_KEY",
//   },
//   body: JSON.stringify({
//     input: "Artificial intelligence is the intelligence of machines or software.",
//     voice: "sarah",
//     response_format: "mp3"
//   })
// })
// const fileStream = createWriteStream("speech.mp3", { flags: "wx" });
// await finished(Readable.fromWeb(response.body).pipe(fileStream));
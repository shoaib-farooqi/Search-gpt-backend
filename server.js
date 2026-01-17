import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

app.use("/", chatRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});

app.get("/", (req, res) => {
  res.json({ message: "FINAL UPDATE: Backend is running" });
});


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected");
        }catch (error) {
            console.error("MongoDB connection error:", error);
        }      
    }




// app.post("/test", async (req, res) => {
//   const options = {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       contents: [
//         {
//           parts: [{ text: req.body.message }],
//         }
//       ]
//     }),
//   };

//   try {
//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       options
//     );

//     if (!response.ok) {
//       const errText = await response.text();
//       console.error("API Error:", errText); // log error details in terminal
//       return res.status(response.status).send({ error: errText });
//     }

//     const data = await response.json();

//     // ✅ safely extract model text
//     const text =
//       data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response text";

//     // 🖥️ log to terminal
//     console.log("Model reply:", text);

//     // send response back to client
//     res.json({ text });
//   } catch (error) {
//     console.error("Server Error:", error.message);
//     res.status(500).send({ error: error.message });
//   }
// });

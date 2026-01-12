import dotenv from "dotenv";

const getGeminiAPIResponse = async (message) => {
    const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: message }],
        }
      ]
    }),
  };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      options
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("API Error:", errText); // log error details in terminal
      // return res.status(response.status).send({ error: errText });
      throw new Error(errText);
    }

    const data = await response.json();

    // ✅ safely extract model text
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response text";

    // 🖥️ log to terminal
    // console.log("Model reply:", text);

    // send response back to client
    return text;
  } catch (error) {
    console.error("Server Error:", error.message);
    // res.status(500).send({ error: error.message });
    throw error;
  }
};

export default getGeminiAPIResponse;
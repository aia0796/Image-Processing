const express = require("express");
const multer = require("multer");
const axios = require("axios");
const path = require("path");

const app = express();
const upload = multer(); // keep file in memory

// 👉 HARD-CODED API KEY (for quick demo)
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY";

// Serve frontend files from /public
app.use(express.static("public"));

// Endpoint to handle upload + AI call
app.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    const imageBuffer = req.file.buffer.toString("base64");

    const payload = {
      contents: [
        {
          parts: [
            { text: "Describe this image in detail:" },
            {
              inline_data: {
                mime_type: req.file.mimetype,
                data: imageBuffer,
              },
            },
          ],
        },
      ],
    };

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${GEMINI_API_KEY}`,
      payload
    );

    const output = response.data.candidates[0].content.parts[0].text;
    res.json({ text: output });

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to analyze image." });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

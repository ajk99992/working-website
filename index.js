require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");

const app = express();
const PORT = process.env.PORT || 3000;


// Add CORS middleware before other middleware
app.use(cors());
app.use(express.json());   


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/api/chat", async (req, res) => {
  try {
    const userMsg = req.body.message;
    if (!userMsg) {
      return res.status(400).json({ error: "Message is required." });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant for The Techies company, focused on providing information about AI and automation services."
        },
        { role: "user", content: userMsg }
      ],
      max_tokens: 500,
      temperature: 0.7,
      presence_penalty: 0.6
    });

    const botReply = response.choices[0]?.message?.content;
    res.json({ reply: botReply });
  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({ 
      error: "Something went wrong.", 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined  
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});